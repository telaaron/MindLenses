import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import personaManifest from '$lib/personas.json';
import fs from 'fs';
import path from 'path';

export const prerender = false;

type FileInfo = { name: string; sizeKB: number; downloadName: string; updatedAt: string };
type PersonaMeta = { lens?: { lastFetchAt?: string | null } };

function loadPersonaMeta(personaId: string): PersonaMeta | null {
	const metadataPaths = [
		path.resolve('..', 'personas', 'meta', `${personaId}.json`),
		path.resolve('personas', 'meta', `${personaId}.json`),
		path.resolve('static', 'personas', 'meta', `${personaId}.json`)
	];

	for (const metaPath of metadataPaths) {
		try {
			if (fs.existsSync(metaPath)) {
				return JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as PersonaMeta;
			}
		} catch {
			// Ignore invalid metadata and continue fallback flow.
		}
	}

	return null;
}

function resolveFileInfo(filename: string, directories: string[]): FileInfo | null {
	let newestStat: fs.Stats | null = null;

	for (const dir of directories) {
		const fullPath = path.join(dir, filename);
		try {
			const stats = fs.statSync(fullPath);
			if (!newestStat || stats.mtime > newestStat.mtime) {
				newestStat = stats;
			}
		} catch {
			// File not found in this directory.
		}
	}

	if (!newestStat) return null;

	return {
		name: filename,
		sizeKB: Math.round(newestStat.size / 1024),
		downloadName: filename,
		updatedAt: newestStat.mtime.toISOString()
	};
}

export const load: PageServerLoad = async ({ params }) => {
	const persona = personaManifest.personas.find((p) => p.id === params.id && p.status === 'ready');
	if (!persona) {
		throw error(404, 'Persona not found');
	}

	const possibleDirs = [path.resolve('static', 'personas'), path.resolve('..', 'personas')];
	const existingDirs = possibleDirs.filter((d) => fs.existsSync(d));
	const sourceDirs = existingDirs.length > 0 ? existingDirs : possibleDirs;
	const meta = loadPersonaMeta(persona.id.replace('-', '_'));

	const files: Record<string, FileInfo> = {};
	let latestUpdatedAt: string | null = null;

	for (const [key, filename] of Object.entries(persona.files)) {
		const info = resolveFileInfo(filename, sourceDirs);
		if (info) {
			files[key] = info;
			if (!latestUpdatedAt || info.updatedAt > latestUpdatedAt) {
				latestUpdatedAt = info.updatedAt;
			}
		}
	}

	const fetchedAt = meta?.lens?.lastFetchAt ?? null;
	if (fetchedAt && (!latestUpdatedAt || fetchedAt > latestUpdatedAt)) {
		latestUpdatedAt = fetchedAt;
	}

	return {
		persona: {
			...persona,
			fileInfo: files,
			latestUpdatedAt,
			meta
		}
	};
};
