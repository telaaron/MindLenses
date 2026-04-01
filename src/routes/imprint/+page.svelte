<script lang="ts">
  import { legal } from "$lib/legal";
</script>

<svelte:head>
  <title>Legal Notice | {legal.brandName}</title>
  <meta
    name="description"
    content="Legal notice and company information for {legal.brandName}."
  />
</svelte:head>

<main class="legal-page">
  <div class="legal-shell">
    <a href="/" class="back-link">Back to home</a>
    <h1>Legal Notice</h1>

    <section>
      <h2>Company Details</h2>
      <p>
        <strong>{legal.operator}</strong><br />
        Legal form: {legal.legalForm}<br />
        Country of registration: {legal.country}<br />
        Registration date: {legal.incorporationDate}
      </p>
    </section>

    <section>
      <h2>Registry & Tax</h2>
      <p>
        Registry authority: {legal.registry.authority}<br />
        Registry code: {legal.registry.code}<br />
        VAT number: {legal.vatId}
      </p>
    </section>

    <section>
      <h2>Banking Information</h2>
      <p>
        Bank: {legal.bank.name}<br />
        IBAN: {legal.bank.iban}<br />
        SWIFT/BIC: {legal.bank.swift}<br />
        Bank address: {legal.bank.address}
      </p>
    </section>

    <section>
      <h2>Business Activity</h2>
      <p>{legal.businessActivity}</p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${legal.email}`}>{legal.email}</a>
      </p>
    </section>

    <section>
      <h2>Liability for Content</h2>
      <p>
        The content of this website is created with reasonable care. However,
        we do not guarantee completeness, correctness, or continuous
        availability.
      </p>
    </section>

    <section>
      <h2>Liability for External Links</h2>
      <p>
        This website may contain links to third-party websites. We are not
        responsible for third-party content.
      </p>
    </section>

    <section>
      <h2>Copyright</h2>
      <p>
        Unless stated otherwise, content and structure on this website are
        protected by applicable intellectual property laws.
      </p>
    </section>
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
    background: rgba(10, 16, 24, 0.8);
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
    margin: 0 0 1.2rem;
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 4.8vw, 2.2rem);
  }

  h2 {
    margin: 1.15rem 0 0.45rem;
    font-size: 1.02rem;
    color: var(--color-gold-light);
  }

  p {
    margin: 0;
    line-height: 1.65;
    color: #d6dfeb;
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
