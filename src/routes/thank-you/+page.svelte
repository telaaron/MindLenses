<svelte:head>
  <title>Thank You | MindLenses</title>
  <meta
    name="description"
    content="Thank you page after checkout for MindLenses paid beta offers."
  />
</svelte:head>

<main class="thank-you-page">
  <div class="thank-you-shell">
    <h1>Thank you for your order.</h1>
    <p>
      Your payment was received. We will review your request and contact you
      with next steps.
    </p>
    <a href="/" class="home-link">Back to home</a>
  </div>
</main>

<style>
  .thank-you-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 6rem 1rem 3rem;
  }

  .thank-you-shell {
    width: min(720px, 100%);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(8, 14, 22, 0.82);
    padding: 1.4rem;
    text-align: center;
  }

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 5vw, 2.2rem);
  }

  p {
    margin: 0.75rem 0 0;
    color: #c2d1df;
    line-height: 1.6;
  }

  .home-link {
    margin-top: 1rem;
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 0.65rem 0.95rem;
    text-decoration: none;
    font-weight: 700;
    color: #081019;
    background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold));
  }
</style>
