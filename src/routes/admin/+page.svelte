<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Admin Login | MindLenses</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="admin-login-page">
  <section class="admin-login-shell">
    <p class="eyebrow">Internal access</p>
    <h1>Admin Login</h1>

    {#if !data.configured}
      <section class="status error">
        <p>ADMIN_DASHBOARD_TOKEN is not configured in environment.</p>
      </section>
    {:else}
      {#if form?.message}
        <section class="status error">
          <p>{form.message}</p>
        </section>
      {/if}

      <form method="POST" action="?/login" class="login-form">
        <label for="token">Admin token</label>
        <input id="token" name="token" type="password" required autocomplete="off" />
        <button type="submit">Sign in</button>
      </form>
      <p class="hint">After login, you will be redirected to the ops queue.</p>
    {/if}
  </section>
</main>

<style>
  .admin-login-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 6rem 1rem 2rem;
  }

  .admin-login-shell {
    width: min(520px, 100%);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(10, 16, 24, 0.82);
    padding: 1.1rem;
    display: grid;
    gap: 0.75rem;
  }

  .eyebrow {
    display: inline-flex;
    width: fit-content;
    padding: 0.2rem 0.56rem;
    border-radius: 999px;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #d8c792;
    border: 1px solid rgba(201, 168, 76, 0.35);
    background: rgba(201, 168, 76, 0.11);
  }

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 4vw, 2rem);
  }

  .status {
    border-radius: 0.75rem;
    padding: 0.65rem 0.72rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
  }

  .status.error {
    border-color: rgba(212, 105, 105, 0.4);
    background: rgba(65, 24, 24, 0.5);
    color: #ffdcdc;
  }

  .status p {
    margin: 0;
    line-height: 1.5;
  }

  .login-form {
    display: grid;
    gap: 0.58rem;
  }

  label {
    font-size: 0.86rem;
    color: #d8e5f2;
    font-weight: 600;
  }

  input {
    width: 100%;
    border-radius: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(5, 10, 15, 0.66);
    color: #edf3f9;
    padding: 0.66rem 0.78rem;
    font: inherit;
  }

  button {
    min-height: 44px;
    border-radius: 999px;
    border: 0;
    padding: 0.64rem 0.9rem;
    font: inherit;
    font-weight: 800;
    color: #081019;
    background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold));
    cursor: pointer;
  }

  .hint {
    margin: 0;
    font-size: 0.82rem;
    color: #9fb4c8;
  }

  @media (min-width: 760px) {
    .admin-login-shell {
      padding: 1.5rem;
    }
  }
</style>
