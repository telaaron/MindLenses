<script lang="ts">
  import { page } from "$app/stores";

  const requestId = $derived($page.url.searchParams.get("id") || "");
</script>

<svelte:head>
  <title>Request Received | MindLenses</title>
  <meta
    name="description"
    content="Request confirmation page for MindLenses Express intake."
  />
</svelte:head>

<main class="confirm-page">
  <section class="confirm-shell">
    <span class="eyebrow">Request received</span>
    <h1>We'll review and send your payment link within 24h.</h1>
    <p>
      Thanks for your intake. We will manually review fit and scope before
      checkout.
    </p>
    {#if requestId}
      <p class="request-id">Reference ID: {requestId}</p>
    {/if}
    <div class="actions">
      <a href="/" class="btn btn-primary">Back to home</a>
      <a href="/request" class="btn btn-ghost">Submit another request</a>
    </div>
  </section>
</main>

<style>
  .confirm-page {
    min-height: 100vh;
    padding: 6rem 1rem 3rem;
    display: grid;
    place-items: center;
  }

  .confirm-shell {
    width: min(820px, 100%);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.11);
    background: rgba(9, 14, 22, 0.84);
    padding: 1.3rem;
    text-align: center;
  }

  .eyebrow {
    display: inline-flex;
    padding: 0.2rem 0.58rem;
    border-radius: 999px;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #d8c792;
    border: 1px solid rgba(201, 168, 76, 0.35);
    background: rgba(201, 168, 76, 0.11);
  }

  h1 {
    margin: 0.68rem 0 0;
    font-family: var(--font-display);
    font-size: clamp(1.35rem, 4.8vw, 2.2rem);
    line-height: 1.2;
  }

  p {
    margin: 0.7rem 0 0;
    color: #c5d3e3;
    line-height: 1.6;
  }

  .request-id {
    margin-top: 0.55rem;
    color: #e4cf93;
    font-size: 0.84rem;
    font-weight: 700;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.6rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 700;
    padding: 0.64rem 0.95rem;
  }

  .btn-primary {
    color: #081019;
    background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold));
  }

  .btn-ghost {
    color: #dbe7f4;
    background: rgba(11, 19, 29, 0.62);
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  @media (min-width: 768px) {
    .confirm-shell {
      padding: 2rem;
    }
  }
</style>
