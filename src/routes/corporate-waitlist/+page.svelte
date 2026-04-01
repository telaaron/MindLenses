<script lang="ts">
  import { legal } from "$lib/legal";

  let { form } = $props();

  const useCaseOptions = [
    "CEO / founder knowledge transfer",
    "Sales onboarding",
    "Customer support knowledge base",
    "Internal training",
    "Thought leadership archive",
    "Other",
  ];

  const teamSizeOptions = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "500+",
  ];
</script>

<svelte:head>
  <title>Corporate Waitlist | {legal.brandName}</title>
  <meta
    name="description"
    content="Join the Corporate Waitlist to create a private MindLens for onboarding, mentoring, and internal knowledge transfer."
  />
</svelte:head>

<main class="waitlist-page">
  <div class="waitlist-shell">
    <a href="/" class="back-link">Back to home</a>

    <header class="waitlist-header">
      <span class="eyebrow">Corporate beta</span>
      <h1>Turn internal expertise into an AI-ready Lens</h1>
      <p>
        Preserve the thinking of your CEO, founder, sales leader, or domain
        expert in a private MindLens for onboarding, mentoring, and internal
        knowledge transfer.
      </p>
    </header>

    {#if form?.success}
      <section class="status-card success" aria-live="polite">
        <h2>Application received</h2>
        <p>
          You’re on the list. We’ll reach out with next steps, scope, and beta
          availability. A confirmation email was sent to your work address.
        </p>
        {#if form?.submissionId}
          <p class="meta">Reference: {form.submissionId}</p>
        {/if}
      </section>
    {/if}

    {#if form?.message && !form?.success}
      <section class="status-card error" aria-live="polite">
        <h2>Could not submit</h2>
        <p>{form.message}</p>
      </section>
    {/if}

    <form method="POST" action="?/join" class="waitlist-form">
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
          <label for="workEmail">Work email</label>
          <input
            id="workEmail"
            name="workEmail"
            type="email"
            required
            autocomplete="email"
            value={form?.values?.workEmail ?? ""}
          />
        </div>
      </div>

      <div class="field-grid two-col">
        <div class="field">
          <label for="company">Company</label>
          <input
            id="company"
            name="company"
            required
            autocomplete="organization"
            value={form?.values?.company ?? ""}
          />
        </div>

        <div class="field">
          <label for="teamSize">Team size</label>
          <select id="teamSize" name="teamSize" required>
            <option value="" selected={!form?.values?.teamSize}>Select...</option>
            {#each teamSizeOptions as option}
              <option value={option} selected={form?.values?.teamSize === option}
                >{option}</option
              >
            {/each}
          </select>
        </div>
      </div>

      <div class="field">
        <label for="useCase">Use case</label>
        <select id="useCase" name="useCase" required>
          <option value="" selected={!form?.values?.useCase}>Select...</option>
          {#each useCaseOptions as option}
            <option value={option} selected={form?.values?.useCase === option}
              >{option}</option
            >
          {/each}
        </select>
      </div>

      <div class="field">
        <label for="firstLensCandidate"
          >Who should become the first internal Lens?</label
        >
        <textarea
          id="firstLensCandidate"
          name="firstLensCandidate"
          rows="4"
          required
        >{form?.values?.firstLensCandidate ?? ""}</textarea>
      </div>

      <div class="field">
        <label for="websiteOrLinkedin">Optional: website / LinkedIn</label>
        <input
          id="websiteOrLinkedin"
          name="websiteOrLinkedin"
          type="url"
          placeholder="https://..."
          value={form?.values?.websiteOrLinkedin ?? ""}
        />
      </div>

      <button type="submit" class="submit-btn">Join Corporate Waitlist</button>

      <div class="microcopy" aria-label="Waitlist details">
        <p>Private beta, limited onboarding slots.</p>
        <p>We’ll review fit manually and reply personally.</p>
        <p>No spam, no public listing.</p>
      </div>

      <p class="help-text">
        Prefer direct contact?
        <a href={`mailto:${legal.email}?subject=Corporate%20Lens%20Waitlist`}
          >Email us</a
        >
      </p>
    </form>
  </div>
</main>

<style>
  .waitlist-page {
    min-height: 100vh;
    padding: 6rem 1rem 3rem;
  }

  .waitlist-shell {
    width: min(920px, 100%);
    margin: 0 auto;
    border-radius: 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(8, 14, 22, 0.82);
    padding: 1.2rem;
  }

  .back-link {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    color: var(--color-gold-light);
    text-decoration: none;
  }

  .waitlist-header {
    margin-top: 0.35rem;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 0.24rem 0.6rem;
    border-radius: 999px;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #d8c792;
    border: 1px solid rgba(201, 168, 76, 0.32);
    background: rgba(201, 168, 76, 0.12);
  }

  h1 {
    margin: 0.72rem 0 0.66rem;
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 5vw, 2.5rem);
    line-height: 1.12;
    letter-spacing: -0.02em;
  }

  .waitlist-header p {
    margin: 0;
    color: #c5d3e2;
    line-height: 1.62;
    max-width: 72ch;
  }

  .status-card {
    margin-top: 1rem;
    border-radius: 0.9rem;
    padding: 0.9rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
  }

  .status-card h2 {
    margin: 0 0 0.45rem;
    font-size: 1.02rem;
  }

  .status-card p {
    margin: 0;
    line-height: 1.55;
  }

  .status-card.success {
    border-color: rgba(75, 198, 129, 0.34);
    background: rgba(24, 53, 41, 0.55);
  }

  .status-card.error {
    border-color: rgba(212, 105, 105, 0.34);
    background: rgba(62, 28, 28, 0.5);
  }

  .meta {
    margin-top: 0.45rem;
    color: #9fb0c2;
    font-size: 0.82rem;
  }

  .waitlist-form {
    margin-top: 1rem;
    display: grid;
    gap: 0.85rem;
  }

  .field-grid {
    display: grid;
    gap: 0.75rem;
  }

  .field {
    display: grid;
    gap: 0.38rem;
  }

  label {
    color: #d8e4f2;
    font-size: 0.86rem;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    width: 100%;
    border-radius: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(4, 9, 14, 0.64);
    color: #edf3f9;
    padding: 0.68rem 0.78rem;
    font: inherit;
  }

  textarea {
    resize: vertical;
  }

  .submit-btn {
    min-height: 44px;
    border-radius: 999px;
    border: 0;
    padding: 0.72rem 1rem;
    font: inherit;
    font-weight: 800;
    color: #081019;
    background: linear-gradient(
      135deg,
      var(--color-gold-light),
      var(--color-gold)
    );
    cursor: pointer;
  }

  .microcopy {
    display: grid;
    gap: 0.24rem;
    color: #a7bbcf;
    font-size: 0.84rem;
    line-height: 1.55;
  }

  .microcopy p {
    margin: 0;
  }

  .help-text {
    margin: 0;
    color: #9fb2c8;
    font-size: 0.82rem;
  }

  .help-text a {
    color: var(--color-gold-light);
  }

  @media (min-width: 780px) {
    .waitlist-shell {
      padding: 1.6rem;
    }

    .two-col {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
