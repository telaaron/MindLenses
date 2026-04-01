<script lang="ts">
  import { legal } from "$lib/legal";
</script>

<svelte:head>
  <title>Terms of Use | {legal.brandName}</title>
  <meta
    name="description"
    content="Terms of Use for the website and content of {legal.brandName}."
  />
</svelte:head>

<main class="legal-page">
  <div class="legal-shell">
    <a href="/" class="back-link">Back to home</a>
    <h1>Terms of Use</h1>

    <section>
      <h2>Paid Services (Beta)</h2>
      <p>
        Optional paid services (for example Express Custom Persona, Corporate
        Lens, and bundles) are governed by separate
        <a href="/terms/paid">Paid Terms (Beta)</a>.
      </p>
    </section>

    <section>
      <h2>1. Scope</h2>
      <p>
        These terms govern the use of this website and content provided by
        {legal.brandName}, operated by {legal.operator}.
      </p>
    </section>

    <section>
      <h2>2. Content and Availability</h2>
      <p>
        Content is provided for general informational purposes. We strive for
        availability and accuracy but do not guarantee uninterrupted service.
      </p>
    </section>

    <section>
      <h2>3. Intellectual Property</h2>
      <p>
        Unless stated otherwise, content, text, structure, and design elements
        are protected by applicable intellectual property laws.
      </p>
    </section>

    <section>
      <h2>4. Acceptable Use</h2>
      <p>
        Users must not misuse the website, bypass security measures, or submit
        unlawful content.
      </p>
    </section>

    <section>
      <h2>5. Limitation of Liability</h2>
      <p>
        Liability is limited to the maximum extent permitted by applicable law.
      </p>
    </section>

    <section>
      <h2>6. External Links</h2>
      <p>
        This website may contain links to external websites. Third-party
        operators are solely responsible for their content.
      </p>
    </section>

    <section>
      <h2>7. Changes to Terms</h2>
      <p>
        We may update these terms for valid reasons. The current version
        published on this page applies.
      </p>
    </section>

    <section>
      <h2>8. Governing Law</h2>
      <p>
        These terms are governed by applicable law at the operator's registered
        seat, without prejudice to mandatory consumer protections.
      </p>
    </section>

    <section>
      <h2>9. Contact</h2>
      <p>
        For questions about these terms, contact us at
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
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
    margin: 0 0 0.6rem;
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
