<script lang="ts">
  import { legal } from "$lib/legal";

  let { form } = $props();
  let activeStep = $state(1);

  const maxStep = 4;

  function nextStep() {
    activeStep = Math.min(maxStep, activeStep + 1);
  }

  function prevStep() {
    activeStep = Math.max(1, activeStep - 1);
  }
</script>

<svelte:head>
  <title>Express Intake | {legal.brandName}</title>
  <meta
    name="description"
    content="Request flow for Express Custom Persona: persona, materials, focus, package, and contact."
  />
</svelte:head>

<main class="request-page">
  <section class="request-shell">
    <a href="/" class="back-link">Back to home</a>

    <header class="request-header">
      <span class="eyebrow">Express intake</span>
      <h1>Tell us what to build first. Payment comes after review.</h1>
      <p>
        Intake first, then manual review. We send your payment link only after
        scope confirmation.
      </p>
    </header>

    <ol class="stepper" aria-label="Request steps">
      <li class:active={activeStep === 1} class:done={activeStep > 1}
        >1. Persona</li
      >
      <li class:active={activeStep === 2} class:done={activeStep > 2}
        >2. Materials + Focus</li
      >
      <li class:active={activeStep === 3} class:done={activeStep > 3}
        >3. Package</li
      >
      <li class:active={activeStep === 4}>4. Contact + Submit</li>
    </ol>

    {#if form?.message}
      <section class="status error" aria-live="polite">{form.message}</section>
    {/if}

    <form method="POST" class="request-form">
      <section class="step" hidden={activeStep !== 1}>
        <h2>Step 1: Persona (Who? Why?)</h2>
        <div class="field">
          <label for="personaName">Who should we build?</label>
          <input
            id="personaName"
            name="personaName"
            required
            minlength="2"
            placeholder="e.g. Jordan Peterson"
            value={form?.values?.personaName ?? ""}
          />
        </div>

        <div class="field">
          <label for="whyThisPersona">Why this persona now?</label>
          <textarea
            id="whyThisPersona"
            name="whyThisPersona"
            rows="4"
            required
            placeholder="What outcome do you need right now?"
          >{form?.values?.whyThisPersona ?? ""}</textarea>
        </div>
      </section>

      <section class="step" hidden={activeStep !== 2}>
        <h2>Step 2: Materials + Focus</h2>
        <div class="field">
          <label for="sourceMaterials">Links, sources, materials</label>
          <textarea
            id="sourceMaterials"
            name="sourceMaterials"
            rows="5"
            required
            placeholder="YouTube channels, podcast links, books, interviews ..."
          >{form?.values?.sourceMaterials ?? ""}</textarea>
        </div>

        <div class="field">
          <label for="focusAreas">What should the lens focus on?</label>
          <textarea
            id="focusAreas"
            name="focusAreas"
            rows="4"
            required
            placeholder="Decision-making, leadership, sales scripts, tone, boundaries ..."
          >{form?.values?.focusAreas ?? ""}</textarea>
        </div>
      </section>

      <section class="step" hidden={activeStep !== 3}>
        <h2>Step 3: Package</h2>
        <fieldset class="package-group">
          <legend>Choose package depth</legend>
          <label class="package-option">
            <input
              type="radio"
              name="packageType"
              value="mindcore"
              checked={(form?.values?.packageType ?? "mindcore") === "mindcore"}
            />
            <span>
              <strong>MindCore (EUR 29)</strong>
              <small>Conversation-ready persona layer.</small>
            </span>
          </label>

          <label class="package-option">
            <input
              type="radio"
              name="packageType"
              value="mindcore_mindbank"
              checked={form?.values?.packageType === "mindcore_mindbank"}
            />
            <span>
              <strong>MindCore + MindBank (EUR 79)</strong>
              <small>Persona layer + structured knowledge archive.</small>
            </span>
          </label>
        </fieldset>
      </section>

      <section class="step" hidden={activeStep !== 4}>
        <h2>Step 4: Contact + Submit</h2>
        <div class="field-grid two-col">
          <div class="field">
            <label for="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              required
              autocomplete="name"
              value={form?.values?.fullName ?? ""}
            />
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autocomplete="email"
              value={form?.values?.email ?? ""}
            />
          </div>
        </div>

        <div class="field">
          <label for="company">Company (optional)</label>
          <input
            id="company"
            name="company"
            autocomplete="organization"
            value={form?.values?.company ?? ""}
          />
        </div>

        <p class="submit-note">
          We manually review every request. You receive your payment link after
          scope check.
        </p>
      </section>

      <div class="controls">
        <button
          type="button"
          class="btn btn-ghost"
          onclick={prevStep}
          disabled={activeStep === 1}>Back</button
        >

        {#if activeStep < maxStep}
          <button type="button" class="btn btn-primary" onclick={nextStep}
            >Continue</button
          >
        {:else}
          <button type="submit" class="btn btn-primary">Submit Intake</button>
        {/if}
      </div>
    </form>

    <p class="fallback">
      Problems with the form?
      <a href={`mailto:${legal.email}?subject=MindLenses%20Express%20Intake`}
        >Send by email</a
      >
    </p>
  </section>
</main>

<style>
  .request-page {
    min-height: 100vh;
    padding: 5.8rem 1rem 3rem;
  }

  .request-shell {
    width: min(920px, 100%);
    margin: 0 auto;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.11);
    background: rgba(10, 16, 24, 0.82);
    padding: 1.1rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    text-decoration: none;
    color: var(--color-gold-light);
    font-weight: 600;
  }

  .eyebrow {
    display: inline-flex;
    margin-top: 0.2rem;
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
    margin: 0.66rem 0 0.5rem;
    font-family: var(--font-display);
    font-size: clamp(1.45rem, 5vw, 2.25rem);
    line-height: 1.15;
  }

  .request-header p {
    margin: 0;
    color: #c2d1e2;
    line-height: 1.6;
  }

  .stepper {
    margin: 0.95rem 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.45rem;
  }

  .stepper li {
    border-radius: 0.65rem;
    padding: 0.46rem 0.62rem;
    font-size: 0.82rem;
    color: #93a9bf;
    border: 1px solid rgba(255, 255, 255, 0.11);
    background: rgba(10, 16, 24, 0.56);
  }

  .stepper li.active {
    color: #e7f0fa;
    border-color: rgba(201, 168, 76, 0.42);
    background: rgba(201, 168, 76, 0.08);
  }

  .stepper li.done {
    color: #bad0e6;
  }

  .status.error {
    margin-top: 0.8rem;
    border-radius: 0.7rem;
    padding: 0.62rem 0.72rem;
    border: 1px solid rgba(212, 105, 105, 0.35);
    background: rgba(62, 28, 28, 0.5);
    color: #f7d5d5;
  }

  .request-form {
    margin-top: 0.9rem;
    display: grid;
    gap: 0.8rem;
  }

  .step {
    border-radius: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(7, 12, 19, 0.65);
    padding: 0.9rem;
    display: grid;
    gap: 0.72rem;
  }

  .step h2 {
    margin: 0;
    font-size: 1rem;
    color: #e2ecf7;
  }

  .field {
    display: grid;
    gap: 0.38rem;
  }

  .field-grid {
    display: grid;
    gap: 0.72rem;
  }

  label,
  legend {
    font-size: 0.85rem;
    color: #d5e0ec;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    border-radius: 0.68rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(5, 10, 15, 0.65);
    color: #edf3f9;
    padding: 0.68rem 0.78rem;
    font: inherit;
  }

  textarea {
    resize: vertical;
  }

  .package-group {
    margin: 0;
    padding: 0;
    border: 0;
    display: grid;
    gap: 0.65rem;
  }

  .package-option {
    display: flex;
    gap: 0.6rem;
    border-radius: 0.78rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(10, 17, 26, 0.64);
    padding: 0.66rem 0.72rem;
  }

  .package-option input {
    width: auto;
    margin-top: 0.2rem;
  }

  .package-option span {
    display: grid;
    gap: 0.2rem;
  }

  .package-option small {
    color: #a8bdd3;
    line-height: 1.45;
  }

  .submit-note {
    margin: 0;
    color: #afc1d6;
    font-size: 0.84rem;
    line-height: 1.55;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .btn {
    min-height: 44px;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 700;
    padding: 0.62rem 0.9rem;
    border: 0;
    cursor: pointer;
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

  .btn[disabled] {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .fallback {
    margin: 0.7rem 0 0;
    color: #9eb4ca;
    font-size: 0.83rem;
  }

  .fallback a {
    color: var(--color-gold-light);
  }

  @media (min-width: 860px) {
    .request-shell {
      padding: 1.45rem;
    }

    .two-col {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .stepper {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
