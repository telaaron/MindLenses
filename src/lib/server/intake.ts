import { randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/private";

export const INTAKE_STATUSES = [
  "new",
  "approved",
  "in_progress",
  "waiting_customer",
  "completed",
  "rejected",
] as const;

export const PAYMENT_STATES = [
  "none",
  "pending_after_approval",
  "link_sent",
  "paid",
] as const;

export type IntakeType = "express" | "corporate";
export type IntakeStatus = (typeof INTAKE_STATUSES)[number];
export type PaymentState = (typeof PAYMENT_STATES)[number];

type IntakeStore = {
  requests: IntakeRecord[];
};

export type IntakeRecord = {
  id: string;
  type: IntakeType;
  status: IntakeStatus;
  priority: "normal" | "high";
  paymentState: PaymentState;
  paymentLink: string | null;
  slaDueAt: string;
  createdAt: string;
  updatedAt: string;
  source: "website";
  requester: {
    name: string;
    email: string;
    company: string;
  };
  title: string;
  summary: string;
  details: Record<string, string>;
  notes: string;
};

export type CreateIntakeInput = {
  type: IntakeType;
  requester: {
    name: string;
    email: string;
    company?: string;
  };
  title: string;
  summary: string;
  details: Record<string, string>;
  priority?: "normal" | "high";
};

export type UpdateIntakeInput = {
  id: string;
  status: IntakeStatus;
  notes?: string;
  paymentState?: PaymentState;
  paymentLink?: string | null;
};

type IntakeRow = {
  id: string;
  type: IntakeType;
  status: IntakeStatus;
  priority: "normal" | "high";
  payment_state: PaymentState;
  payment_link: string | null;
  sla_due_at: string;
  created_at: string;
  updated_at: string;
  source: "website";
  requester_name: string;
  requester_email: string;
  requester_company: string;
  title: string;
  summary: string;
  details: Record<string, string>;
  notes: string;
};

const STORE_DIR = path.resolve(".data");
const STORE_PATH = path.join(STORE_DIR, "intake-requests.json");
const SUPABASE_TABLE = env.SUPABASE_INTAKE_TABLE?.trim() || "intake_requests";

let writeQueue: Promise<unknown> = Promise.resolve();

function getSupabaseClient() {
  const url = env.SUPABASE_URL?.trim();
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function rowToRecord(row: IntakeRow): IntakeRecord {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    priority: row.priority,
    paymentState: row.payment_state,
    paymentLink: row.payment_link,
    slaDueAt: row.sla_due_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: row.source,
    requester: {
      name: row.requester_name,
      email: row.requester_email,
      company: row.requester_company,
    },
    title: row.title,
    summary: row.summary,
    details: row.details ?? {},
    notes: row.notes,
  };
}

function recordToRow(record: IntakeRecord): IntakeRow {
  return {
    id: record.id,
    type: record.type,
    status: record.status,
    priority: record.priority,
    payment_state: record.paymentState,
    payment_link: record.paymentLink,
    sla_due_at: record.slaDueAt,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    source: record.source,
    requester_name: record.requester.name,
    requester_email: record.requester.email,
    requester_company: record.requester.company,
    title: record.title,
    summary: record.summary,
    details: record.details,
    notes: record.notes,
  };
}

function normalizeStore(raw: unknown): IntakeStore {
  if (!raw || typeof raw !== "object") {
    return { requests: [] };
  }

  const requests = Array.isArray((raw as IntakeStore).requests)
    ? (raw as IntakeStore).requests
    : [];

  return { requests };
}

async function ensureStoreFile(): Promise<void> {
  await mkdir(STORE_DIR, { recursive: true });

  try {
    await readFile(STORE_PATH, "utf-8");
  } catch {
    const initial: IntakeStore = { requests: [] };
    await writeFile(STORE_PATH, `${JSON.stringify(initial, null, 2)}\n`, "utf-8");
  }
}

async function readStore(): Promise<IntakeStore> {
  await ensureStoreFile();
  const content = await readFile(STORE_PATH, "utf-8");

  try {
    return normalizeStore(JSON.parse(content));
  } catch {
    return { requests: [] };
  }
}

async function writeStore(store: IntakeStore): Promise<void> {
  await ensureStoreFile();
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf-8");
}

function withWriteLock<T>(work: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(work, work);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export function computeSlaDueAt(type: IntakeType, from = new Date()): string {
  const hours = type === "express" ? 24 : 72;
  return new Date(from.getTime() + hours * 60 * 60 * 1000).toISOString();
}

export async function createIntakeRequest(input: CreateIntakeInput): Promise<IntakeRecord> {
  const now = new Date().toISOString();

  const request: IntakeRecord = {
    id: `rq_${randomUUID().slice(0, 8)}`,
    type: input.type,
    status: "new",
    priority: input.priority ?? "normal",
    paymentState: input.type === "express" ? "pending_after_approval" : "none",
    paymentLink: null,
    slaDueAt: computeSlaDueAt(input.type),
    createdAt: now,
    updatedAt: now,
    source: "website",
    requester: {
      name: input.requester.name,
      email: input.requester.email,
      company: input.requester.company?.trim() || "",
    },
    title: input.title,
    summary: input.summary,
    details: input.details,
    notes: "",
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const payload = recordToRow(request);
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .insert(payload)
      .select("*")
      .single<IntakeRow>();

    if (error || !data) {
      throw new Error(`Supabase createIntakeRequest failed: ${error?.message || "unknown"}`);
    }

    return rowToRecord(data);
  }

  return withWriteLock(async () => {
    const store = await readStore();
    store.requests.unshift(request);
    await writeStore(store);
    return request;
  });
}

export async function listIntakeRequests(): Promise<IntakeRecord[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .returns<IntakeRow[]>();

    if (error) {
      throw new Error(`Supabase listIntakeRequests failed: ${error.message}`);
    }

    return (data || []).map(rowToRecord);
  }

  const store = await readStore();

  return [...store.requests].sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });
}

export async function updateIntakeRequest(input: UpdateIntakeInput): Promise<IntakeRecord | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const updates: Partial<IntakeRow> = {
      status: input.status,
    };

    if (typeof input.paymentState === "string") {
      updates.payment_state = input.paymentState;
    }
    if (typeof input.paymentLink !== "undefined") {
      updates.payment_link = input.paymentLink ? input.paymentLink.trim() : null;
    }
    if (typeof input.notes === "string") {
      updates.notes = input.notes.trim();
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .update(updates)
      .eq("id", input.id)
      .select("*")
      .single<IntakeRow>();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Supabase updateIntakeRequest failed: ${error.message}`);
    }

    if (!data) return null;
    return rowToRecord(data);
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const request = store.requests.find((item) => item.id === input.id);

    if (!request) {
      return null;
    }

    request.status = input.status;
    if (typeof input.paymentState === "string") {
      request.paymentState = input.paymentState;
    }
    if (typeof input.paymentLink !== "undefined") {
      request.paymentLink = input.paymentLink ? input.paymentLink.trim() : null;
    }
    if (typeof input.notes === "string") {
      request.notes = input.notes.trim();
    }
    request.updatedAt = new Date().toISOString();

    await writeStore(store);
    return request;
  });
}

function safeCompare(secret: string, candidate: string): boolean {
  const secretBuffer = Buffer.from(secret);
  const candidateBuffer = Buffer.from(candidate);

  if (secretBuffer.length !== candidateBuffer.length) {
    return false;
  }

  return timingSafeEqual(secretBuffer, candidateBuffer);
}

export function isAdminTokenValid(candidate: string | null | undefined): boolean {
  const configuredToken = env.ADMIN_DASHBOARD_TOKEN?.trim();
  if (!configuredToken || !candidate) {
    return false;
  }

  return safeCompare(configuredToken, candidate.trim());
}

function serializeDetails(details: Record<string, string>): string {
  return Object.entries(details)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

export async function sendIntakeEmails(request: IntakeRecord): Promise<{
  configured: boolean;
  internalSent: boolean;
  confirmationSent: boolean;
}> {
  const resendKey = env.RESEND_API_KEY?.trim();
  const fromEmail = env.RESEND_FROM_EMAIL?.trim();
  const internalTo = (env.REQUEST_INTAKE_TO_EMAIL || "aaron@must-seen.com").trim();

  if (!resendKey || !fromEmail) {
    return { configured: false, internalSent: false, confirmationSent: false };
  }

  const resend = new Resend(resendKey);

  const internalSubject = `[MindLenses ${request.type.toUpperCase()}] ${request.title} (${request.id})`;
  const internalText = [
    `Request ID: ${request.id}`,
    `Type: ${request.type}`,
    `Status: ${request.status}`,
    `SLA Due: ${request.slaDueAt}`,
    "",
    `Requester: ${request.requester.name}`,
    `Email: ${request.requester.email}`,
    `Company: ${request.requester.company || "(not provided)"}`,
    "",
    `Summary: ${request.summary}`,
    "",
    "Details:",
    serializeDetails(request.details),
    "",
    `Created At: ${request.createdAt}`,
  ].join("\n");

  const confirmationSubject =
    request.type === "express"
      ? "MindLenses: Intake received (review in <= 24h)"
      : "MindLenses: Corporate waitlist received";

  const confirmationText = [
    `Hi ${request.requester.name},`,
    "",
    "thanks for your request.",
    `Your reference ID: ${request.id}`,
    "",
    request.type === "express"
      ? "We review fit and scope manually and send payment details only after approval."
      : "We review your corporate request manually and contact you with next steps.",
    "",
    "You can reply to this email if you want to add context.",
    "",
    "Best,",
    "MindLenses",
  ].join("\n");

  let internalSent = false;
  let confirmationSent = false;

  try {
    const internalResult = await resend.emails.send({
      from: fromEmail,
      to: [internalTo],
      replyTo: request.requester.email,
      subject: internalSubject,
      text: internalText,
    });

    internalSent = !internalResult.error;
  } catch {
    internalSent = false;
  }

  try {
    const confirmationResult = await resend.emails.send({
      from: fromEmail,
      to: [request.requester.email],
      replyTo: internalTo,
      subject: confirmationSubject,
      text: confirmationText,
    });

    confirmationSent = !confirmationResult.error;
  } catch {
    confirmationSent = false;
  }

  return { configured: true, internalSent, confirmationSent };
}
