<script lang="ts">
  import { legal } from "$lib/legal";
</script>

<svelte:head>
  <title>Paid Terms (Beta) | {legal.brandName}</title>
  <meta
    name="description"
    content="Paid Terms (Beta) for optional MindLenses services like Express Custom Persona, Corporate Lens, and bundles."
  />
</svelte:head>

<main class="legal-page">
  <div class="legal-shell">
    <a href="/" class="back-link">Back to home</a>
    <h1>Paid Terms (Beta)</h1>
    <p class="intro">
      These Paid Terms apply to optional paid services by {legal.brandName}.
      Free public lenses remain free and publicly accessible.
    </p>

    <section>
      <h2>1. Provider</h2>
      <p>
        Provider is <strong>{legal.operator}</strong>. Contact:
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>
    </section>

    <section>
      <h2>2. Scope</h2>
      <p>
        These terms govern optional paid services such as Express Custom Persona,
        Corporate Lens, and themed bundles. General website usage remains
        governed by the standard Terms of Use.
      </p>
    </section>

    <section>
      <h2>3. Services</h2>
      <p>
        Paid services may include creation and delivery of a Lens file (for
        example MindCore or MindCore + MindBank), curation work, or service
        bundles.
      </p>
      <p>
        For custom personas, we owe the creation and delivery of the Lens file,
        not a specific economic or content success outcome for the customer.
      </p>
    </section>

    <section>
      <h2>4. Pricing and Payment</h2>
      <p>
        Prices are shown on the website or in checkout. Payment is due according
        to the selected payment method (for example Stripe hosted checkout).
      </p>
    </section>

    <section>
      <h2>5. Delivery / Provisioning</h2>
      <p>
        Delivery windows are target times, not guaranteed fixed deadlines,
        unless explicitly confirmed in writing.
      </p>
    </section>

    <section>
      <h2>6. Customer Obligations</h2>
      <p>
        Customers must provide complete and lawful input data. Customer-provided
        materials may only be used if the customer has the required rights.
      </p>
    </section>

    <section>
      <h2>7. Beta Notice</h2>
      <blockquote>
        The paid offerings of MindLenses are fully or partially in beta phase.
        The scope of services may evolve. Temporary changes, adjustments to
        implementation, or isolated limitations do not constitute a defect as
        long as the essential contractual services are provided.
      </blockquote>
    </section>

    <section>
      <h2>8. Rights of Use</h2>
      <p>
        Unless otherwise agreed, customers receive a non-exclusive right to use
        delivered files for their internal or personal purposes. Redistribution
        or resale of individual paid deliverables requires explicit approval.
      </p>
    </section>

    <section>
      <h2>9. Prohibited Use</h2>
      <p>
        Use for unlawful purposes, rights infringements, deceptive impersonation,
        or misuse of third-party personal data is prohibited.
      </p>
    </section>

    <section>
      <h2>10. Warranty and Liability</h2>
      <p>
        We do not guarantee that generated or distilled content is legally,
        professionally, or medically suitable for individual situations.
      </p>
      <p>
        Liability is unlimited for intent and gross negligence. In cases of
        slight negligence, liability is limited to typical foreseeable damages,
        except where mandatory law provides otherwise.
      </p>
    </section>

    <section>
      <h2>11. Withdrawal for Digital Services</h2>
      <p>
        For digital services started immediately after purchase, consumers may
        be asked during checkout to expressly consent to performance before the
        withdrawal period ends and acknowledge potential loss of withdrawal
        rights according to applicable law.
      </p>
      <p>
        See also: <a href="/withdrawal">Withdrawal Information</a>.
      </p>
    </section>

    <section>
      <h2>12. Final Provisions</h2>
      <p>
        If individual clauses are invalid, the remaining clauses remain in
        effect. Mandatory consumer protection provisions remain unaffected.
      </p>
    </section>

    <p class="note">
      This document is a lean beta terms framework and not individual legal
      advice.
    </p>
  </div>
</main>

<style>
  .legal-page {
    min-height: 100vh;
    padding: 6rem 1rem 3rem;
  }

  .legal-shell {
    width: min(900px, 100%);
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
    margin-bottom: 0.5rem;
  }

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(1.7rem, 5vw, 2.3rem);
  }

  .intro {
    margin: 0.8rem 0 0;
    color: #ccd8e4;
    line-height: 1.62;
  }

  h2 {
    margin: 1.2rem 0 0.42rem;
    font-size: 1.02rem;
    color: var(--color-gold-light);
  }

  p {
    margin: 0;
    line-height: 1.62;
    color: #d3dfeb;
  }

  p + p {
    margin-top: 0.45rem;
  }

  blockquote {
    margin: 0;
    border-left: 3px solid rgba(201, 168, 76, 0.42);
    padding: 0.25rem 0 0.25rem 0.8rem;
    color: #dbe6f2;
    line-height: 1.62;
    background: rgba(201, 168, 76, 0.08);
    border-radius: 0.2rem;
  }

  .note {
    margin-top: 1.4rem;
    color: #9fb3c8;
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
