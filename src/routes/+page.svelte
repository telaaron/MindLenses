<script lang="ts">
  import PersonaCard from "$lib/components/PersonaCard.svelte";
  import UpcomingCard from "$lib/components/UpcomingCard.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import { legal } from "$lib/legal";
  import { fadeIn } from "$lib/actions/fadeIn";
  import { onMount } from "svelte";

  let { data } = $props();

  let activeMasterTier = $state(0);
  let allLoaded = $state(false);
  let pageReady = $state(false);
  let upcomingGrids = $state<(HTMLDivElement | undefined)[]>([]);

  const TOTAL_FRAMES = 192;
  const INITIAL_READY_FRAMES = 12;

  let heroSection = $state<HTMLElement>();
  let canvas = $state<HTMLCanvasElement>();
  let loaderEl = $state<HTMLElement>();
  let loaderBar = $state<HTMLElement>();
  let heroTextEl = $state<HTMLElement>();
  let scrollHintEl = $state<HTMLElement>();

  let frames: HTMLImageElement[] = [];
  let loadedFrameFlags: boolean[] = [];
  let currentFrameIndex = -1;
  let currentFrameValue = -1;
  let targetFrameIndex = 0;
  let frameLerpHandle: number | null = null;
  let framePreloadStarted = false;

  function registerUpcomingGrid(node: HTMLDivElement, index: number) {
    upcomingGrids[index] = node;

    if (index === activeMasterTier) {
      requestAnimationFrame(() => {
        node.scrollLeft = 0;
      });
    }

    return {
      destroy() {
        if (upcomingGrids[index] === node) {
          upcomingGrids[index] = undefined;
        }
      },
    };
  }

  function setActiveMasterTier(index: number) {
    activeMasterTier = index;

    requestAnimationFrame(() => {
      const grid = upcomingGrids[index];
      if (grid) grid.scrollLeft = 0;
    });
  }

  function hideHeroLoader() {
    if (!loaderEl || loaderEl.style.display === "none") return;
    loaderEl.style.opacity = "0";
    setTimeout(() => {
      if (loaderEl) loaderEl.style.display = "none";
    }, 220);
  }

  onMount(() => {
    requestAnimationFrame(() => {
      const initialGrid = upcomingGrids[activeMasterTier];
      if (initialGrid) initialGrid.scrollLeft = 0;
    });
  });

  const personaRequestIssueUrl =
    "https://github.com/telaaron/mindlenses-public/issues/new/choose";

  const upcomingTiers = [
    {
      title: "Next",
      label: "NEXT",
      description: "Currently in build queue.",
      personas: [
        {
          name: "Public lens slot",
          category: "General",
          why: "Queued now.",
        },
        {
          name: "Curated business lens",
          category: "General",
          why: "Queued now.",
        },
        {
          name: "Public health lens",
          category: "General",
          why: "Queued now.",
        },
        {
          name: "Leadership lens",
          category: "General",
          why: "Queued now.",
        },
        {
          name: "Innovation lens",
          category: "General",
          why: "Queued now.",
        },
      ],
    },
    {
      title: "After That",
      label: "LATER",
      description: "Research complete, scheduled later.",
      personas: [
        {
          name: "Wisdom lens",
          category: "General",
          why: "In research set.",
        },
        {
          name: "Psychology lens",
          category: "General",
          why: "In research set.",
        },
        {
          name: "Neuroscience lens",
          category: "General",
          why: "In research set.",
        },
        {
          name: "Leadership lens",
          category: "General",
          why: "In research set.",
        },
        {
          name: "Coaching lens",
          category: "General",
          why: "In research set.",
        },
      ],
    },
    {
      title: "Backlog",
      label: "BACKLOG",
      description: "Good fit, lower current priority.",
      personas: [
        {
          name: "Stoic lens bundle",
          category: "General",
          why: "Planned.",
        },
        {
          name: "Ethics lens",
          category: "General",
          why: "Planned.",
        },
        {
          name: "Mental models lens",
          category: "General",
          why: "Planned.",
        },
        {
          name: "Consciousness lens",
          category: "General",
          why: "Planned.",
        },
        {
          name: "Interview lens",
          category: "General",
          why: "Planned.",
        },
        {
          name: "Philosophy lens",
          category: "General",
          why: "Planned.",
        },
      ],
    },
  ];

  function padNumber(n: number, width: number): string {
    return String(n).padStart(width, "0");
  }

  function preloadFrames() {
    if (framePreloadStarted) return;
    framePreloadStarted = true;
    let loadedCount = 0;
    let settledCount = 0;
    frames = new Array(TOTAL_FRAMES);
    loadedFrameFlags = new Array(TOTAL_FRAMES).fill(false);
    const initialReadyThreshold =
      window.matchMedia("(max-width: 719px)").matches ? 24 : INITIAL_READY_FRAMES;

    const getContiguousLoadedCount = () => {
      let count = 0;
      while (count < TOTAL_FRAMES && loadedFrameFlags[count]) count += 1;
      return count;
    };

    const tryEnableHeroPlayback = () => {
      const firstFrameReady = Boolean(frames[0]?.complete && frames[0]?.naturalWidth > 0);
      const contiguousLoaded = getContiguousLoadedCount();
      if (!allLoaded && firstFrameReady && contiguousLoaded >= initialReadyThreshold) {
        allLoaded = true;
        if (currentFrameIndex < 0) {
          currentFrameIndex = 0;
          currentFrameValue = 0;
          targetFrameIndex = 0;
          drawFrame(0);
        }
        hideHeroLoader();
        onScroll();
      }
    };

    const onFrameSettled = () => {
      settledCount += 1;
      if (loaderBar) {
        loaderBar.style.width = `${(settledCount / TOTAL_FRAMES) * 100}%`;
      }
      if (settledCount === TOTAL_FRAMES && loaderBar) {
        loaderBar.style.width = "100%";
      }
      tryEnableHeroPlayback();
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/video/frames/frame_${padNumber(i + 1, 4)}.webp`;
      img.onload = () => {
        loadedFrameFlags[i] = true;
        loadedCount += 1;
        onFrameSettled();
      };
      img.onerror = onFrameSettled;
      frames[i] = img;
    }
  }

  function drawFrame(index: number) {
    if (!canvas || !frames.length) return;

    let img = frames[index];
    if (!img?.complete || !img.naturalWidth) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = frames[index - offset];
        if (prev?.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = frames[index + offset];
        if (next?.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img?.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    const ox = (cw - sw) / 2;
    const oy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, ox, oy, sw, sh);
  }

  function updateHeroTextByFrame(frameIndex: number) {
    if (!heroTextEl) return;
    if (frameIndex < 8) {
      heroTextEl.style.opacity = "1";
      return;
    }
    if (frameIndex > 25) {
      heroTextEl.style.opacity = "0";
      return;
    }
    const fade = 1 - (frameIndex - 8) / (25 - 8);
    heroTextEl.style.opacity = String(Math.max(0, Math.min(1, fade)));
  }

  function tickFrameLerp() {
    if (!allLoaded) {
      frameLerpHandle = null;
      return;
    }

    if (currentFrameValue < 0) currentFrameValue = targetFrameIndex;
    const delta = targetFrameIndex - currentFrameValue;
    if (Math.abs(delta) < 0.08) {
      currentFrameValue = targetFrameIndex;
    } else {
      currentFrameValue += delta * 0.2;
    }

    const nextIndex = Math.max(
      0,
      Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameValue)),
    );

    if (nextIndex !== currentFrameIndex) {
      currentFrameIndex = nextIndex;
      drawFrame(nextIndex);
    }

    updateHeroTextByFrame(nextIndex);

    if (Math.abs(targetFrameIndex - currentFrameValue) > 0.08) {
      frameLerpHandle = requestAnimationFrame(tickFrameLerp);
    } else {
      frameLerpHandle = null;
    }
  }

  function queueFrameLerp() {
    if (frameLerpHandle !== null) return;
    frameLerpHandle = requestAnimationFrame(tickFrameLerp);
  }

  function onScroll() {
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const sectionHeight = heroSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollable = Math.max(1, sectionHeight - viewportHeight);
    let progress = -rect.top / scrollable;
    progress = Math.max(0, Math.min(1, progress));

    if (scrollHintEl) {
      scrollHintEl.style.opacity = progress > 0.04 ? "0" : "1";
    }

    if (!allLoaded) return;
    const frameIndex = Math.min(
      Math.floor(progress * TOTAL_FRAMES),
      TOTAL_FRAMES - 1,
    );
    targetFrameIndex = frameIndex;
    queueFrameLerp();
  }

  function onResize() {
    if (currentFrameIndex >= 0) {
      drawFrame(currentFrameIndex);
    }
  }

  onMount(() => {
    preloadFrames();
    onScroll();
    requestAnimationFrame(() => {
      pageReady = true;
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frameLerpHandle !== null) cancelAnimationFrame(frameLerpHandle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  });
</script>

<svelte:head>
  <title>MindLenses - Don't ask the Internet. Ask the Expert.</title>
  <meta
    name="description"
    content="Every mentor. Distilled into one file. Works with any AI. Download expert knowledge lenses for ChatGPT, Claude, Gemini and more."
  />
</svelte:head>

<section class="hero-scroll" bind:this={heroSection}>
  <div class="hero-sticky">
    <canvas id="hero-canvas" bind:this={canvas}></canvas>
    <div class="hero-loader" bind:this={loaderEl}>
      <div class="loader-inner">
        <span class="loader-label">Loading visual assets</span>
        <div class="loader-track">
          <div class="loader-bar" bind:this={loaderBar}></div>
        </div>
      </div>
    </div>

    <div class="hero-vignette"></div>
    <div class="hero-grain"></div>

    <div class="hero-text" class:stage-in={pageReady} bind:this={heroTextEl}>
      <h1 class="hero-title">
        Don't ask the Internet.<br />
        <span class="hero-accent">Ask the Expert.</span>
      </h1>
      <p class="hero-sub">
        Every mentor. Distilled into one file. Works with any AI.
      </p>
      <div class="hero-actions">
        <a href="#library" class="cta-btn">
          Explore lenses
          <Icon name="arrow-down" size={16} />
        </a>
        <a href="#how-it-works" class="cta-secondary"
          >How it works</a
        >
      </div>
      <p class="hero-note">Free and open source - no login required</p>
    </div>

    <div class="scroll-hint" bind:this={scrollHintEl}>
      <span class="scroll-hint-arrow">↓</span>
      <span class="scroll-hint-text">Scroll</span>
    </div>
  </div>
</section>

<section class="stats-bar" use:fadeIn>
  <div class="container stats-inner">
    <div class="stat">
      <span class="stat-number">{data.personas.length}</span>
      <span class="stat-label">Expert lenses</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <span class="stat-number">17+</span>
      <span class="stat-label">In pipeline</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <span class="stat-number">∞</span>
      <span class="stat-label">AI compatible</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <span class="stat-number">0€</span>
      <span class="stat-label">Forever free</span>
    </div>
  </div>
</section>

<section class="section" id="how-it-works">
  <div class="container">
    <div class="section-header" use:fadeIn>
      <span class="section-label">How it works</span>
      <h2 class="section-title">
        Three steps.<br /><span class="text-gold">Sixty seconds.</span>
      </h2>
      <p class="section-subtitle">
        A cleaner way to access high-quality thinking.
      </p>
    </div>

    <div class="bento-grid">
      <div class="bento-card fade-in-delay-1" use:fadeIn>
        <div class="bento-number">01</div>
        <div class="bento-icon"><Icon name="download" size={30} /></div>
        <h3 class="bento-title">Download</h3>
        <p class="bento-desc">
          Pick a lens from the library. Each one is a single <code>.md</code> file
          that stays private and portable.
        </p>
        <div class="bento-meta" aria-label="Download details">
          <span class="bento-pill">MindCore + MindBank</span>
          <span class="bento-pill">Open format</span>
        </div>
      </div>
      <div class="bento-card fade-in-delay-2" use:fadeIn>
        <div class="bento-number">02</div>
        <div class="bento-icon"><Icon name="sparkles" size={30} /></div>
        <h3 class="bento-title">Drop into your AI</h3>
        <p class="bento-desc">
          Use it in ChatGPT, Claude, Gemini or your local model.
        </p>
        <div class="bento-meta" aria-label="Compatibility details">
          <span class="bento-pill">Works in seconds</span>
          <span class="bento-pill">No setup</span>
        </div>
      </div>
      <div class="bento-card fade-in-delay-3" use:fadeIn>
        <div class="bento-number">03</div>
        <div class="bento-icon"><Icon name="chat" size={30} /></div>
        <h3 class="bento-title">Ask anything</h3>
        <p class="bento-desc">
          Get answers in that person's voice and reasoning style.
        </p>
        <div class="bento-meta" aria-label="Result details">
          <span class="bento-pill">Authentic tone</span>
          <span class="bento-pill">Practical frameworks</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="library">
  <div class="container">
    <div class="section-header" use:fadeIn>
      <span class="section-label">Lens library</span>
      <h2 class="section-title">
        {data.personas.length} experts.<br /><span class="text-gold"
          >Growing weekly.</span
        >
      </h2>
    </div>

    <div class="persona-grid">
      {#each data.personas as persona, i}
        <PersonaCard {...persona} delay={Math.min(i + 1, 4)} />
      {/each}
    </div>
  </div>
</section>

<section class="section choice-section" id="request-persona">
  <div class="container">
    <div class="section-header" use:fadeIn>
      <span class="section-label">Request or Express</span>
      <h2 class="section-title">
        Two ways to bring a <span class="text-gold">MindLens</span> to life.
      </h2>
      <p class="section-subtitle">
        Whether you want to contribute a voice or commission one - both matter.
      </p>
    </div>

    <div class="choice-grid">
      <article class="choice-card express-card" use:fadeIn>
        <div class="choice-head">
          <h3>Express Custom Persona</h3>
          <span class="beta-badge">Most popular</span>
        </div>
        <p class="choice-price">From EUR 29 · Built for you</p>
        <p class="choice-copy">
          You name them. You define the focus. We build a private MindLens
          within 48 hours.
        </p>
        <p class="choice-copy">
          Choose depth: MindCore (conversation-ready) or MindCore + MindBank
          (structured knowledge archive).
        </p>
        <a
          class="choice-btn choice-btn-primary"
          href="/request"
          >Order Express Persona</a
        >
        <p class="choice-microcopy">
          Beta pricing. Manual review included. Delivered as a .mindlens file.
        </p>
        <p class="choice-sub-links">
          <span>MindCore EUR 29</span>
          <span>·</span>
          <span>MindCore + MindBank EUR 79</span>
        </p>
      </article>

      <article class="choice-card request-card" use:fadeIn>
        <div class="choice-head">
          <h3>Request a Persona</h3>
        </div>
        <p class="choice-price">Free · Community-driven</p>
        <p class="choice-copy">
          Someone's thinking shaped how you see the world. Submit them. We
          build. The community benefits.
        </p>
        <p class="choice-copy">
          Your request helps us prioritize who gets added next - and your name
          goes in the acknowledgments.
        </p>
        <a class="choice-btn choice-btn-ghost" href="/request"
          >Submit a Request</a
        >
        <p class="choice-microcopy">
          No account required. No delivery guarantee. All requests reviewed
          manually.
        </p>
        <p class="choice-helper">
          Want it faster, private, or tailored to your use case?
          <a href="/request"
            >See Express</a
          >
        </p>
      </article>
    </div>

    <div class="choice-bridge" use:fadeIn>
      With Request, you suggest. With Express, you specify - persona, focus, and
      depth.
    </div>

    <p class="choice-legal" use:fadeIn>
      Paid beta terms and consumer information:
      <a href="/terms/paid">Paid Terms (Beta)</a>.
    </p>

    <div class="beta-offers" use:fadeIn>
      <p class="beta-offers-title">Also available in beta</p>
      <div class="beta-offers-grid">
        <article class="beta-offer-card">
          <h3>Private Corporate Lens</h3>
          <p>EUR 299-999 · Scope call required</p>
          <a href="/corporate-waitlist">Join Corporate Waitlist</a>
        </article>

        <article class="beta-offer-card">
          <h3>Private Lens API Access</h3>
          <p>EUR 19 / month - EUR 79 / month · Beta waitlist</p>
          <a href="/corporate-waitlist">Request API beta</a>
        </article>

        <article class="beta-offer-card">
          <h3>Themed Bundles</h3>
          <p>EUR 9 · Curated prompt + lens packs</p>
          <a href="/request">Join Bundle beta</a>
        </article>

        <article class="beta-offer-card">
          <h3>Affiliate & Sponsorship</h3>
          <p>Context-based · Persona-fit only</p>
          <a href="mailto:aaron@must-seen.com?subject=MindLenses%20Partner%20Inquiry"
            >Partner inquiry</a
          >
        </article>
      </div>
    </div>
  </div>
</section>

<section class="section" id="upcoming">
  <div class="container">
    <div class="section-header" use:fadeIn>
      <span class="section-label">Upcoming Personas</span>
      <h2 class="section-title">Who is <span class="text-gold">next?</span></h2>
      <p class="section-subtitle">Short answer: this is the current queue.</p>
    </div>

    <div class="masterlist-switcher" role="tablist" aria-label="Masterlist tiers">
      {#each upcomingTiers as tier, i}
        <button
          type="button"
          role="tab"
          class="masterlist-switch"
          class:active={activeMasterTier === i}
          aria-selected={activeMasterTier === i}
          onclick={() => setActiveMasterTier(i)}
        >
          {tier.label}
        </button>
      {/each}
    </div>

    <div class="tiers-stack">
      {#each upcomingTiers as tier, i}
        <div class="tier-group" class:mobile-active={activeMasterTier === i}>
          <div class="tier-header" use:fadeIn>
            <div class="tier-info">
              <h3 class="tier-title">{tier.title}</h3>
              <p class="tier-desc">{tier.description}</p>
            </div>
          </div>
          <div class="upcoming-carousel-shell">
            <div class="upcoming-grid" use:registerUpcomingGrid={i}>
              {#each tier.personas as persona, j}
                <UpcomingCard
                  {...persona}
                  tier={i + 1}
                  rank={j + 1}
                  delay={Math.min(j + 1, 4)}
                />
              {/each}
            </div>
            <p class="carousel-cue">Swipe to explore</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="section" id="what-is-a-lens">
  <div class="container">
    <div class="explainer-bento" use:fadeIn>
      <div class="explainer-main">
        <span class="section-label">What is a MindLens?</span>
        <h2 class="explainer-headline">
          A person's entire expertise,<br /><span class="text-gold"
            >compressed into one file.</span
          >
        </h2>
        <p class="explainer-text">
          Drop it into any AI and the model adopts that person's perspective,
          vocabulary, and decision-making logic. Not a chatbot - a cognitive
          fingerprint.
        </p>
      </div>
      <div class="lens-cards">
        <div class="lens-card">
          <div class="lens-card-icon"><Icon name="brain" size={24} /></div>
          <strong>MindCore</strong>
          <span>Identity, beliefs, and cognitive fingerprint.</span>
        </div>
        <div class="lens-card">
          <div class="lens-card-icon"><Icon name="file" size={24} /></div>
          <strong>MindBank</strong>
          <span>Deep knowledge, frameworks, and decision systems.</span>
        </div>
      </div>
    </div>
  </div>
</section>

<footer class="footer" id="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <h3 class="footer-wordmark">MindLenses</h3>
      <p class="footer-tagline">Expert knowledge for everyone.</p>
      <p class="footer-company">Operated by {legal.operator}</p>
    </div>
    <div class="footer-links">
      <a
        href="https://github.com/telaaron/mindlenses"
        target="_blank"
        rel="noopener"
        class="footer-link"
      >
        <Icon name="github" size={15} />
        GitHub
      </a>
      <a
        href={personaRequestIssueUrl}
        target="_blank"
        rel="noopener"
        class="footer-link">Request Persona</a
      >
      <a href="/request" class="footer-link">Guided Request</a>
      <a href="/corporate-waitlist" class="footer-link">Corporate Waitlist</a>
      <a href="/imprint" class="footer-link">Legal Notice</a>
      <a href="/privacy" class="footer-link">Privacy</a>
      <a href="/terms" class="footer-link">Terms</a>
      <a href="/terms/paid" class="footer-link">Paid Terms</a>
      <a href="/withdrawal" class="footer-link">Withdrawal</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>
      © {new Date().getFullYear()} MindLenses. Open source under MIT License.
    </p>
  </div>
</footer>

<style>
  .hero-scroll {
    position: relative;
    height: 220vh;
    width: 100%;
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  #hero-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .hero-loader {
    position: absolute;
    inset: 0;
    z-index: 8;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #050a0f;
    transition: opacity 220ms ease;
  }

  .loader-inner {
    width: min(260px, 82vw);
    text-align: center;
  }

  .loader-label {
    display: block;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    color: #8091a7;
    margin-bottom: 0.8rem;
  }

  .loader-track {
    height: 3px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .loader-bar {
    height: 100%;
    width: 0;
    background: linear-gradient(
      90deg,
      var(--color-gold),
      var(--color-gold-light)
    );
  }

  .hero-vignette {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
    background: radial-gradient(
      circle at center,
      transparent 26%,
      rgba(2, 7, 12, 0.72) 70%,
      #02060b 100%
    );
  }

  .hero-grain {
    position: absolute;
    inset: 0;
    z-index: 5;
    opacity: 0.08;
    pointer-events: none;
    background-image: repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.04) 0,
        rgba(255, 255, 255, 0.04) 1px,
        transparent 1px,
        transparent 2px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.02) 0,
        rgba(255, 255, 255, 0.02) 1px,
        transparent 1px,
        transparent 3px
      );
  }

  .hero-text {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 6;
    text-align: center;
    position: relative;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 0 1.1rem calc(5.25rem + env(safe-area-inset-bottom, 0px));
    background: transparent;
    transition: opacity 220ms ease;
  }

  .hero-text::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1.4rem;
    width: 100%;
    height: min(72vh, 560px);
    pointer-events: none;
    background: radial-gradient(
        circle at 50% 76%,
        rgba(2, 7, 12, 0.82) 0%,
        rgba(2, 7, 12, 0.62) 36%,
        rgba(2, 7, 12, 0.36) 58%,
        transparent 80%
      ),
      linear-gradient(
        to top,
        rgba(2, 6, 10, 0.9) 0%,
        rgba(2, 6, 10, 0.62) 38%,
        rgba(2, 6, 10, 0.18) 76%,
        transparent 100%
      );
    filter: blur(14px);
  }

  .hero-text > * {
    position: relative;
    z-index: 1;
  }

  .hero-text.stage-in {
    animation: stage-up 680ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(1.9rem, 9vw, 4rem);
    font-weight: 700;
    line-height: 1.06;
    letter-spacing: -0.03em;
    margin: 0;
    text-wrap: balance;
    text-shadow:
      0 2px 14px rgba(0, 0, 0, 0.86),
      0 14px 38px rgba(0, 0, 0, 0.66);
  }

  .hero-accent {
    color: var(--color-gold);
  }

  .hero-sub {
    font-size: clamp(0.95rem, 4.2vw, 1.15rem);
    line-height: 1.56;
    color: #e0e8f1;
    max-width: 34ch;
    margin: 1rem auto 1.6rem;
    text-shadow: 0 6px 22px rgba(0, 0, 0, 0.76);
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
  }

  .cta-btn,
  .cta-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.72rem 1.2rem;
    border-radius: 999px;
    font-size: 0.92rem;
    font-weight: 700;
    text-decoration: none;
  }

  .cta-btn {
    gap: 0.45rem;
    color: #081019;
    background: linear-gradient(
      135deg,
      var(--color-gold-light),
      var(--color-gold)
    );
    box-shadow: 0 12px 30px -16px rgba(201, 168, 76, 0.7);
  }

  .cta-btn:hover,
  .cta-btn:focus-visible {
    filter: brightness(1.07);
    transform: translateY(-1px);
  }

  .cta-secondary {
    color: #d3deea;
    padding-inline: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(8, 14, 22, 0.55);
  }

  .cta-secondary:hover,
  .cta-secondary:focus-visible {
    background: rgba(201, 168, 76, 0.16);
  }

  .hero-note {
    margin: 0.95rem 0 0;
    font-size: 0.77rem;
    color: #b7c4d3;
    text-shadow: 0 4px 14px rgba(0, 0, 0, 0.72);
  }

  .scroll-hint {
    position: absolute;
    left: 50%;
    bottom: 1rem;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    z-index: 7;
    transition: opacity 180ms ease;
  }

  .scroll-hint-arrow {
    font-size: 1.18rem;
    color: var(--color-gold);
    animation: bounce-down 1.5s ease-in-out infinite;
  }

  .scroll-hint-text {
    font-size: 0.61rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #8ea0b3;
  }

  @keyframes bounce-down {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(5px);
    }
  }

  @keyframes stage-up {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stats-bar {
    background: rgba(7, 13, 21, 0.9);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1.8rem 1rem;
  }

  .container {
    width: min(1120px, 100%);
    margin: 0 auto;
  }

  .stats-inner {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem 0.55rem;
  }

  .stat {
    text-align: center;
    padding: 0.45rem;
  }

  .stat-number {
    display: block;
    font-size: 1.45rem;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--color-gold);
  }

  .stat-label {
    display: block;
    font-size: 0.67rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8ea2b8;
    margin-top: 0.36rem;
  }

  .stat-divider {
    display: none;
  }

  .section {
    position: relative;
    padding: 4.3rem 1rem;
    scroll-margin-top: 5.7rem;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2.6rem;
  }

  .section-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    padding: 0.22rem 0.75rem;
    border-radius: 999px;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-gold);
    background: rgba(201, 168, 76, 0.12);
    border: 1px solid rgba(201, 168, 76, 0.22);
  }

  .section-title {
    margin: 0.8rem 0 0.75rem;
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 8vw, 2.8rem);
    line-height: 1.1;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .text-gold {
    color: var(--color-gold);
  }

  .section-subtitle {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    color: #bccadb;
  }

  .bento-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .bento-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 1.15rem;
    padding: 1.45rem 1.2rem;
    background: rgba(12, 20, 31, 0.64);
    border: 1px solid rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    transition:
      transform 220ms ease,
      border-color 220ms ease;
  }

  .bento-card:hover {
    transform: translateY(-2px);
    border-color: rgba(201, 168, 76, 0.34);
  }

  .bento-number {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    font-weight: 700;
    color: #8ca1b6;
    margin-bottom: 1rem;
  }

  .bento-icon {
    color: var(--color-gold);
    margin-bottom: 0.8rem;
  }

  .bento-title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
  }

  .bento-desc {
    margin: 0.6rem 0 0;
    font-size: 0.95rem;
    line-height: 1.63;
    color: #c1cfdf;
  }

  .bento-meta {
    margin-top: auto;
    padding-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .bento-pill {
    font-size: 0.7rem;
    line-height: 1;
    padding: 0.42rem 0.58rem;
    border-radius: 999px;
    color: #d7e1ec;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .bento-desc code {
    padding: 0.08rem 0.35rem;
    border-radius: 0.32rem;
    background: rgba(201, 168, 76, 0.14);
    color: var(--color-gold-light);
  }

  .persona-grid,
  .upcoming-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .choice-section {
    padding-top: 1.2rem;
  }

  .choice-grid {
    margin-top: 0.9rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .choice-card {
    border-radius: 1rem;
    padding: 1.05rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(11, 18, 28, 0.76);
  }

  .express-card {
    border-color: rgba(201, 168, 76, 0.34);
    background: linear-gradient(
      155deg,
      rgba(34, 34, 30, 0.78),
      rgba(20, 24, 29, 0.78)
    );
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.2);
  }

  .choice-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.65rem;
  }

  .choice-head h3 {
    margin: 0;
    font-size: 1rem;
    color: #e6eef7;
  }

  .beta-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.24rem 0.56rem;
    border-radius: 999px;
    font-size: 0.68rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #b6c0ca;
    background: rgba(124, 136, 150, 0.15);
    border: 1px solid rgba(137, 149, 162, 0.28);
    white-space: nowrap;
  }

  .express-card .beta-badge {
    color: #d8c792;
    background: rgba(150, 130, 66, 0.18);
    border-color: rgba(201, 168, 76, 0.36);
  }

  .choice-price {
    margin: 0.62rem 0 0;
    color: #cfd8e1;
    font-size: 0.86rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .choice-copy {
    margin: 0.52rem 0 0;
    color: #c0cedd;
    font-size: 0.9rem;
    line-height: 1.58;
  }

  .choice-btn {
    margin-top: 0.76rem;
    min-height: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 0.62rem 0.9rem;
    text-decoration: none;
    font-size: 0.86rem;
    font-weight: 700;
    transition:
      transform 180ms ease,
      filter 180ms ease;
    width: fit-content;
  }

  .choice-btn-primary {
    color: #081019;
    background: linear-gradient(
      135deg,
      var(--color-gold-light),
      var(--color-gold)
    );
    border: 1px solid rgba(201, 168, 76, 0.58);
  }

  .choice-btn-ghost {
    color: #dbe7f4;
    background: rgba(12, 20, 31, 0.62);
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  .choice-btn:hover,
  .choice-btn:focus-visible {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  .choice-microcopy {
    margin: 0.5rem 0 0;
    color: #9fb1c6;
    font-size: 0.8rem;
    line-height: 1.52;
  }

  .choice-sub-links {
    margin: 0.42rem 0 0;
    display: flex;
    align-items: center;
    gap: 0.38rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: #a9bdcf;
  }

  .choice-helper {
    margin: 0.42rem 0 0;
    color: #9db1c6;
    font-size: 0.8rem;
    line-height: 1.52;
  }

  .choice-helper a {
    color: var(--color-gold-light);
  }

  .choice-bridge {
    margin-top: 0.9rem;
    padding: 0.85rem 1rem;
    border-radius: 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    background: rgba(9, 14, 22, 0.62);
    color: #c6d3e2;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .choice-legal {
    margin: 0.45rem 0 0;
    color: #9fb2c6;
    font-size: 0.8rem;
  }

  .choice-legal a {
    color: var(--color-gold-light);
  }

  .beta-offers {
    margin-top: 0.85rem;
    border-radius: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    background: rgba(9, 14, 22, 0.48);
    padding: 0.85rem;
  }

  .beta-offers-title {
    margin: 0;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #a6bacf;
  }

  .beta-offers-grid {
    margin-top: 0.58rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }

  .beta-offer-card {
    border-radius: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(10, 17, 26, 0.62);
    padding: 0.65rem 0.72rem;
  }

  .beta-offer-card h3 {
    margin: 0;
    font-size: 0.9rem;
    color: #dbe7f4;
  }

  .beta-offer-card p {
    margin: 0.22rem 0 0;
    font-size: 0.79rem;
    color: #9db2c8;
    line-height: 1.5;
  }

  .beta-offer-card a {
    margin-top: 0.34rem;
    display: inline-flex;
    min-height: 36px;
    align-items: center;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-gold-light);
  }

  .tiers-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .masterlist-switcher {
    display: none;
  }

  .tier-header {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 0.78rem;
  }

  .tier-group {
    border-radius: 1rem;
    padding: 1rem;
    background: linear-gradient(
      165deg,
      rgba(9, 16, 26, 0.62),
      rgba(7, 13, 22, 0.48)
    );
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .tier-title {
    margin: 0;
    font-size: 1.02rem;
    font-weight: 700;
  }

  .tier-desc {
    margin: 0.14rem 0 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: #9db0c4;
  }

  .upcoming-carousel-shell {
    position: relative;
  }

  .upcoming-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.55rem;
    overflow-anchor: none;
  }

  .carousel-cue {
    display: none;
  }

  .explainer-bento {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.6rem;
    border-radius: 1.2rem;
    padding: 1.25rem;
    background: linear-gradient(
      160deg,
      rgba(12, 21, 33, 0.9),
      rgba(7, 14, 23, 0.85)
    );
    border: 1px solid rgba(255, 255, 255, 0.09);
  }

  .explainer-headline {
    font-family: var(--font-display);
    font-size: clamp(1.35rem, 7vw, 2.1rem);
    line-height: 1.15;
    margin: 0.8rem 0 0.9rem;
  }

  .explainer-text {
    margin: 0;
    font-size: 0.98rem;
    line-height: 1.67;
    color: #c1cedd;
  }

  .lens-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .lens-card {
    padding: 1rem;
    border-radius: 0.9rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .lens-card-icon {
    color: var(--color-gold);
    margin-bottom: 0.3rem;
  }

  .lens-card strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }

  .lens-card span {
    font-size: 0.88rem;
    line-height: 1.5;
    color: #b5c4d5;
  }

  .footer {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(6, 12, 18, 0.85);
    padding: 2.2rem 1rem 1.25rem;
  }

  .footer-inner {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.2rem;
  }

  .footer-wordmark {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.15rem;
    letter-spacing: -0.02em;
    color: #f2f5f9;
  }

  .footer-tagline,
  .footer-bottom p {
    margin: 0;
    font-size: 0.8rem;
    color: #8da1b6;
  }

  .footer-company {
    margin: 0.25rem 0 0;
    font-size: 0.78rem;
    color: #9cb0c6;
  }

  .footer-links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 44px;
    text-decoration: none;
    font-size: 0.88rem;
    color: #c2d0de;
  }

  .footer-link:hover,
  .footer-link:focus-visible {
    color: #fff;
  }

  .footer-bottom {
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 430px) {
    .hero-text {
      padding: 0 0.9rem calc(6.9rem + env(safe-area-inset-bottom, 0px));
    }

    .hero-text::before {
      width: min(760px, 155vw);
      height: min(62vh, 450px);
      bottom: -1.2rem;
    }

    .hero-title {
      font-size: clamp(1.72rem, 8.8vw, 2.3rem);
    }

    .hero-sub {
      font-size: 1rem;
      max-width: 30ch;
    }

    .cta-btn,
    .cta-secondary {
      width: min(320px, 90vw);
    }

    .stats-bar {
      padding: 1.45rem 0.75rem;
    }

    .section {
      scroll-margin-top: 4.85rem;
    }

    .masterlist-switcher {
      display: flex;
      gap: 0.42rem;
      overflow-x: auto;
      padding: 0.1rem 0 0.7rem;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .masterlist-switcher::-webkit-scrollbar {
      display: none;
    }

    .masterlist-switch {
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(9, 16, 25, 0.72);
      color: #b3c1d1;
      min-height: 44px;
      padding: 0.38rem 0.68rem;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
      flex: 0 0 auto;
    }

    .masterlist-switch.active {
      color: #f2d687;
      border-color: rgba(201, 168, 76, 0.42);
      background: rgba(201, 168, 76, 0.14);
    }

    .tiers-stack {
      gap: 0.8rem;
    }

    .tier-group {
      display: none;
      padding: 0.82rem;
    }

    .tier-group.mobile-active {
      display: block;
    }

    .tier-header {
      margin-bottom: 0.58rem;
      align-items: flex-start;
    }

    .upcoming-carousel-shell {
      margin-inline: -0.82rem;
    }

    .upcoming-carousel-shell::before,
    .upcoming-carousel-shell::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 1.7rem;
      width: 0.9rem;
      pointer-events: none;
      z-index: 2;
    }

    .upcoming-carousel-shell::before {
      left: 0;
      background: linear-gradient(to right, rgba(5, 10, 16, 0.95), transparent);
    }

    .upcoming-carousel-shell::after {
      right: 0;
      background: linear-gradient(to left, rgba(5, 10, 16, 0.95), transparent);
    }

    .upcoming-grid {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(224px, 74vw);
      gap: 0.54rem;
      overflow-x: auto;
      padding: 0.04rem 0.82rem 0.22rem;
      scroll-padding-inline: 0.82rem;
      scroll-snap-type: x proximity;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .upcoming-grid::-webkit-scrollbar {
      display: none;
    }

    .upcoming-grid :global(.upcoming-card) {
      min-width: auto;
      width: 100%;
      min-height: 0;
      scroll-snap-align: start;
      margin: 0;
      transform: none;
    }

    .tier-title {
      font-size: 0.94rem;
    }

    .tier-desc {
      font-size: 0.77rem;
      line-height: 1.45;
    }

    .carousel-cue {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.35rem 0 0;
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #8ea2b7;
    }
  }

  @media (max-width: 393px) {
    .hero-title {
      font-size: clamp(1.58rem, 8.6vw, 2.08rem);
    }

    .hero-text {
      padding-bottom: calc(6.4rem + env(safe-area-inset-bottom, 0px));
    }

    .hero-text::before {
      height: min(56vh, 380px);
      bottom: -0.9rem;
    }

    .scroll-hint {
      bottom: 0.72rem;
    }

    .section {
      padding: 3.9rem 0.85rem;
    }
  }

  @media (max-width: 375px) {
    .hero-sub {
      font-size: 0.95rem;
    }

    .cta-btn,
    .cta-secondary {
      font-size: 0.87rem;
    }
  }

  @media (min-width: 720px) {
    .hero-scroll {
      height: 240vh;
    }

    .hero-text {
      padding: 0 2rem 6.25rem;
    }

    .hero-actions {
      flex-direction: row;
      justify-content: center;
    }

    .stats-inner {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.25rem;
    }

    .stat-divider {
      display: block;
      width: 1px;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
    }

    .section {
      padding: 5.2rem 1.4rem;
      scroll-margin-top: 6.3rem;
    }

    .persona-grid,
    .upcoming-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.72rem;
    }

    .choice-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
    }

    .beta-offers-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .express-card {
      transform: translateY(-6px);
    }
  }

  @media (min-width: 980px) {
    .section {
      padding: 6.8rem 1.9rem;
      scroll-margin-top: 6.7rem;
    }

    .hero-text {
      padding-bottom: 6.6rem;
    }

    .bento-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .persona-grid,
    .upcoming-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.78rem;
    }

    .explainer-bento {
      grid-template-columns: 1.15fr 1fr;
      gap: 2.2rem;
      padding: 1.8rem;
    }

    .footer-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  @media (min-width: 1280px) {
    .upcoming-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.82rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-hint-arrow {
      animation: none;
    }

    .hero-text.stage-in {
      animation: none;
    }
  }
</style>
