<script lang="ts">
  import { legal } from "$lib/legal";
</script>

<svelte:head>
  <title>Privacy Policy | {legal.brandName}</title>
  <meta
    name="description"
    content="Privacy Policy for {legal.brandName}."
  />
</svelte:head>

<main class="legal-page">
  <div class="legal-shell">
    <a href="/" class="back-link">Back to home</a>
    <h1>Privacy Policy</h1>

    <section>
      <h2>1. Data Controller</h2>
      <p>
        The data controller for this website is:<br />
        <strong>{legal.operator}</strong><br />
        Email: <a href={`mailto:${legal.email}`}>{legal.email}</a>
      </p>
    </section>

    <section>
      <h2>2. Purposes and Legal Bases</h2>
      <p>
        We process personal data only where necessary to provide the website,
        maintain security, and respond to inquiries.
      </p>
      <p>
        Legal bases may include Article 6(1)(b), (c), and (f) GDPR, depending
        on the processing activity.
      </p>
    </section>

    <section>
      <h2>3. Server Log Data</h2>
      <p>
        When visiting this website, technical data may be processed by the
        hosting provider (e.g., IP address, timestamp, requested resources,
        user agent) for operational security and stability.
      </p>
    </section>

    <section>
      <h2>4. Contact by Email</h2>
      <p>
        If you contact us by email, we process your information to handle your
        request. Data is deleted once no longer needed, unless legal retention
        requirements apply.
      </p>
    </section>

    <section>
      <h2>5. Processors and International Transfers</h2>
      <p>
        We may use service providers (e.g., hosting, email infrastructure)
        under appropriate data processing terms. If data is transferred outside
        the EEA, we use suitable safeguards where required.
      </p>
    </section>

    <section>
      <h2>6. Retention</h2>
      <p>
        We retain personal data only as long as necessary for the relevant
        purpose or as required by law.
      </p>
    </section>

    <section>
      <h2>7. Your Rights</h2>
      <p>
        You may have rights of access, rectification, erasure, restriction,
        portability, and objection under applicable data protection law.
      </p>
      <p>
        You also have the right to lodge a complaint with a competent data
        protection authority.
      </p>
    </section>

    <section>
      <h2>8. Cookies and Tracking</h2>
      <p>
        This website currently does not use consent-based marketing cookies. If
        such technologies are added, a proper consent mechanism will be
        implemented first.
      </p>
    </section>

    <section>
      <h2>9. Updates to this Policy</h2>
      <p>
        We may update this Privacy Policy to reflect legal or operational
        changes.
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
