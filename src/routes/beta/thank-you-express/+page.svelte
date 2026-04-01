<svelte:head>
  <title>Express Order Received | MindLenses</title>
  <meta
    name="description"
    content="Confirmation page for Express Custom Persona beta orders."
  />
</svelte:head>

<main class="thank-you-page">
  <div class="thank-you-shell">
    <span class="eyebrow">Express beta</span>
    <h1>Express order received.</h1>
    <p>
      We will manually review scope and source quality, then confirm delivery
      timing by email.
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

  .eyebrow {
    display: inline-flex;
    padding: 0.2rem 0.56rem;
    border-radius: 999px;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #d8c792;
    border: 1px solid rgba(201, 168, 76, 0.34);
    background: rgba(201, 168, 76, 0.11);
  }

  h1 {
    margin: 0.7rem 0 0;
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 5vw, 2.2rem);
  }

  p {
    margin: 0.7rem 0 0;
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
