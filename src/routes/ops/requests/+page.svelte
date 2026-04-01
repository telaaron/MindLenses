<script lang="ts">
  let { data, form } = $props();

  function formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }

  function hoursLeft(slaDueAt: string): number {
    const diff = Date.parse(slaDueAt) - Date.now();
    return Math.round(diff / (1000 * 60 * 60));
  }

  function slaClass(slaDueAt: string): "overdue" | "soon" | "ok" {
    const left = hoursLeft(slaDueAt);
    if (left < 0) return "overdue";
    if (left <= 6) return "soon";
    return "ok";
  }
</script>

<svelte:head>
  <title>Request Ops Queue | MindLenses</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="ops-page">
  <section class="ops-shell">
    <header class="ops-header">
      <p class="eyebrow">Internal ops</p>
      <h1>Request Queue</h1>
      <p>Unified pipeline for Express and Corporate requests.</p>
    </header>

    {#if !data.configured}
      <section class="status-card error">
        <h2>Admin token missing</h2>
        <p>Set ADMIN_DASHBOARD_TOKEN in your environment to unlock this page.</p>
      </section>
    {:else if !data.authorized}
      <section class="status-card error">
        <h2>Unauthorized</h2>
        <p>{data.reason}</p>
        <p><a href="/admin">Open admin login</a> to access this page.</p>
      </section>
    {:else}
      <form method="POST" action="?/logout" class="logout-row">
        <button type="submit">Log out</button>
      </form>

      <section class="stats-grid">
        <article>
          <p>Total</p>
          <strong>{data.stats.total}</strong>
        </article>
        <article>
          <p>Open</p>
          <strong>{data.stats.open}</strong>
        </article>
        <article>
          <p>Overdue</p>
          <strong>{data.stats.overdue}</strong>
        </article>
      </section>

      {#if form?.message}
        <section class="status-card" class:error={!form?.success} class:success={form?.success}>
          <p>{form.message}</p>
        </section>
      {/if}

      <div class="request-list">
        {#if data.requests.length === 0}
          <section class="empty-state">No requests yet.</section>
        {:else}
          {#each data.requests as request}
            <article class="request-card">
              <div class="request-head">
                <div>
                  <p class="request-id">{request.id}</p>
                  <h2>{request.title}</h2>
                  <p class="request-meta">
                    {request.type.toUpperCase()} · {request.requester.name} · {request.requester.email}
                  </p>
                  {#if request.requester.company}
                    <p class="request-meta">{request.requester.company}</p>
                  {/if}
                </div>
                <div class="sla" data-state={slaClass(request.slaDueAt)}>
                  <p>SLA</p>
                  <strong>{hoursLeft(request.slaDueAt)}h</strong>
                </div>
              </div>

              <p class="summary">{request.summary}</p>

              <details>
                <summary>Show details</summary>
                <dl>
                  {#each Object.entries(request.details) as [label, value]}
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  {/each}
                </dl>
              </details>

              <form method="POST" action="?/update" class="admin-form">
                <input type="hidden" name="token" value={data.token} />
                <input type="hidden" name="id" value={request.id} />

                <label>
                  Status
                  <select name="status" value={request.status}>
                    {#each data.statuses as status}
                      <option value={status}>{status}</option>
                    {/each}
                  </select>
                </label>

                <label>
                  Payment state
                  <select name="paymentState" value={request.paymentState}>
                    {#each data.paymentStates as paymentState}
                      <option value={paymentState}>{paymentState}</option>
                    {/each}
                  </select>
                </label>

                <label>
                  Payment link
                  <input
                    name="paymentLink"
                    type="url"
                    value={request.paymentLink ?? ""}
                    placeholder="https://buy.stripe.com/..."
                  />
                </label>

                <label>
                  Notes
                  <textarea name="notes" rows="3">{request.notes}</textarea>
                </label>

                <button type="submit">Save</button>
              </form>

              <p class="timestamps">
                Created: {formatDate(request.createdAt)} · Updated: {formatDate(request.updatedAt)}
              </p>
            </article>
          {/each}
        {/if}
      </div>
    {/if}
  </section>
</main>

<style>
  .ops-page {
    min-height: 100vh;
    padding: 6rem 1rem 2rem;
  }

  .ops-shell {
    width: min(1080px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 0.9rem;
  }

  .ops-header h1 {
    margin: 0.4rem 0 0.2rem;
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 3.8vw, 2rem);
  }

  .ops-header p {
    margin: 0;
    color: #c5d3e3;
  }

  .eyebrow {
    display: inline-flex;
    padding: 0.2rem 0.56rem;
    border-radius: 999px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #d8c792;
    border: 1px solid rgba(201, 168, 76, 0.35);
    background: rgba(201, 168, 76, 0.11);
  }

  .status-card {
    border-radius: 0.8rem;
    padding: 0.7rem 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(10, 16, 24, 0.8);
  }

  .status-card.error {
    border-color: rgba(212, 105, 105, 0.4);
    background: rgba(65, 24, 24, 0.5);
  }

  .status-card.success {
    border-color: rgba(75, 198, 129, 0.4);
    background: rgba(22, 61, 45, 0.46);
  }

  .status-card a {
    color: var(--color-gold-light);
  }

  .logout-row {
    display: flex;
    justify-content: flex-end;
  }

  .logout-row button {
    min-height: 44px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(8, 14, 21, 0.72);
    color: #e9f1fa;
    padding: 0.5rem 0.9rem;
    font: inherit;
    cursor: pointer;
  }

  .stats-grid {
    display: grid;
    gap: 0.65rem;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .stats-grid article {
    border-radius: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.13);
    padding: 0.72rem;
    background: rgba(10, 16, 24, 0.75);
  }

  .stats-grid p {
    margin: 0;
    font-size: 0.78rem;
    color: #9cb2c8;
  }

  .stats-grid strong {
    font-size: 1.28rem;
    font-weight: 800;
    color: #eaf2fb;
  }

  .request-list {
    display: grid;
    gap: 0.7rem;
  }

  .request-card {
    border-radius: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    padding: 0.9rem;
    background: rgba(10, 16, 24, 0.78);
    display: grid;
    gap: 0.7rem;
  }

  .request-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .request-id {
    margin: 0;
    font-size: 0.75rem;
    color: #9fb5cb;
  }

  .request-head h2 {
    margin: 0.15rem 0;
    font-size: 1.1rem;
  }

  .request-meta {
    margin: 0;
    color: #c5d3e3;
    font-size: 0.84rem;
    line-height: 1.4;
  }

  .summary {
    margin: 0;
    color: #d9e6f4;
    line-height: 1.55;
  }

  .sla {
    min-width: 72px;
    border-radius: 0.8rem;
    padding: 0.42rem 0.58rem;
    border: 1px solid rgba(255, 255, 255, 0.13);
    text-align: right;
  }

  .sla p {
    margin: 0;
    font-size: 0.7rem;
    color: #a8bccf;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .sla strong {
    font-size: 1rem;
  }

  .sla[data-state="overdue"] {
    border-color: rgba(212, 105, 105, 0.5);
    background: rgba(72, 28, 28, 0.45);
    color: #ffd9d9;
  }

  .sla[data-state="soon"] {
    border-color: rgba(201, 168, 76, 0.5);
    background: rgba(60, 45, 16, 0.42);
    color: #f7e7be;
  }

  .sla[data-state="ok"] {
    border-color: rgba(75, 198, 129, 0.42);
    background: rgba(24, 57, 42, 0.38);
    color: #d7f7e6;
  }

  details {
    border-radius: 0.72rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.55rem 0.62rem;
    background: rgba(8, 13, 20, 0.65);
  }

  summary {
    cursor: pointer;
    font-weight: 700;
  }

  dl {
    margin: 0.5rem 0 0;
    display: grid;
    gap: 0.3rem;
  }

  dt {
    color: #96acc3;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  dd {
    margin: 0;
    color: #e2ebf5;
    line-height: 1.45;
    white-space: pre-wrap;
  }

  .admin-form {
    display: grid;
    gap: 0.58rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  label {
    display: grid;
    gap: 0.34rem;
    font-size: 0.8rem;
    color: #d4e0ed;
    font-weight: 600;
  }

  select,
  input,
  textarea,
  button {
    font: inherit;
  }

  select,
  input,
  textarea {
    border-radius: 0.65rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(5, 10, 15, 0.66);
    color: #edf3f9;
    padding: 0.56rem 0.68rem;
  }

  button {
    border-radius: 999px;
    border: 0;
    min-height: 44px;
    padding: 0.64rem 0.92rem;
    font-weight: 800;
    color: #081019;
    background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold));
    cursor: pointer;
  }

  .timestamps {
    margin: 0;
    color: #9ab0c7;
    font-size: 0.78rem;
  }

  .empty-state {
    border-radius: 0.9rem;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    padding: 1rem;
    text-align: center;
    color: #bdd0e2;
  }
</style>
