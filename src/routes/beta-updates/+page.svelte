<svelte:head>
  <title>Redirecting | MindLenses</title>
</svelte:head>

<main class="updates-page">
  <div class="updates-shell">
    <h1>Redirecting to Upcoming Personas ...</h1>
    <p>
      This page now points to the upcoming queue on the homepage.
      <a href="/#upcoming">Open Upcoming</a>
    </p>
  </div>
</main>

<style>
  .updates-page {
    min-height: 100vh;
    padding: 6rem 1rem 3rem;
  }

  .updates-shell {
    width: min(900px, 100%);
    margin: 0 auto;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(8, 14, 22, 0.82);
    padding: 1.2rem;
  }

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 4.2vw, 1.9rem);
  }

  p {
    margin: 0;
    color: #c4d1df;
    line-height: 1.6;
  }

  a {
    color: var(--color-gold-light);
  }

  @media (min-width: 768px) {
    .updates-shell {
      padding: 1.8rem;
    }
  }
</style>
