<script lang="ts">
  import { legal } from "$lib/legal";
</script>

<svelte:head>
  <title>Withdrawal Information | {legal.brandName}</title>
  <meta
    name="description"
    content="Consumer withdrawal information for digital services offered by MindLenses."
  />
</svelte:head>

<main class="legal-page">
  <div class="legal-shell">
    <a href="/" class="back-link">Back to home</a>
    <h1>Withdrawal Information (Consumers)</h1>

    <section>
      <h2>Right of Withdrawal</h2>
      <p>
        Consumers generally have a 14-day withdrawal right for distance
        contracts, unless a legal exception applies.
      </p>
    </section>

    <section>
      <h2>Digital Services Started Immediately</h2>
      <p>
        If performance of a digital service starts before the withdrawal period
        ends, withdrawal rights may expire once the consumer has expressly
        agreed to immediate performance and acknowledged this consequence,
        subject to applicable law.
      </p>
    </section>

    <section>
      <h2>How to Exercise Withdrawal</h2>
      <p>
        To exercise withdrawal rights, send a clear statement to
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>
    </section>

    <section>
      <h2>Model Notice</h2>
      <p>
        Subject: Withdrawal declaration
        <br />I hereby withdraw from the contract concluded for the purchase of
        the following digital service(s):
        <br />Ordered on:
        <br />Name:
        <br />Address:
      </p>
    </section>

    <p class="note">
      This page provides general information and does not replace individual
      legal advice.
    </p>
  </div>
</main>

<style>
  .legal-page {
    min-height: 100vh;
    padding: 6rem 1rem 3rem;
  }

  .legal-shell {
    width: min(860px, 100%);
    margin: 0 auto;
    background: rgba(10, 16, 24, 0.82);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.3rem;
  }

  .back-link {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    color: var(--color-gold-light);
    text-decoration: none;
    margin-bottom: 0.6rem;
  }

  h1 {
    margin: 0 0 1rem;
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 4.8vw, 2.2rem);
  }

  h2 {
    margin: 1.1rem 0 0.42rem;
    font-size: 1.01rem;
    color: var(--color-gold-light);
  }

  p {
    margin: 0;
    line-height: 1.62;
    color: #d4dfeb;
  }

  .note {
    margin-top: 1.2rem;
    color: #9fb3c7;
    font-size: 0.84rem;
  }

  a {
    color: var(--color-gold-light);
  }

  @media (min-width: 768px) {
    .legal-shell {
      padding: 2rem;
    }
  }
</style>
