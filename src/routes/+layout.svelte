<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';

	let { children } = $props();
	let scrolled = $state(false);
	let navProgress = $state(0);
	let mobileMenuOpen = $state(false);
	let mobileViewport = $state(false);
	let scrollRafId: number | null = null;
	let navProgressTarget = 0;

	const navLinks = [
		{ anchor: '#library', label: 'Library' },
		{ anchor: '#upcoming', label: 'Upcoming' },
		{ anchor: '#how-it-works', label: 'How it works' }
	];

	function getNavHref(anchor: string) {
		return $page.url.pathname === '/' ? anchor : `/${anchor}`;
	}

	function updateViewportMode() {
		mobileViewport = window.matchMedia('(max-width: 719px)').matches;
	}

	function computeScrollState() {
		const y = window.scrollY;
		const NAV_BLEND_DISTANCE = mobileViewport ? 110 : 140;
		navProgressTarget = Math.max(0, Math.min(1, y / NAV_BLEND_DISTANCE));

		// Smooth interpolation keeps mobile motion fluid without hard cuts.
		const factor = mobileViewport ? 0.26 : 0.2;
		navProgress += (navProgressTarget - navProgress) * factor;
		if (Math.abs(navProgressTarget - navProgress) < 0.002) {
			navProgress = navProgressTarget;
		}

		scrolled = navProgress > 0.55;
	}

	function onScroll() {
		if (scrollRafId !== null) return;
		const tick = () => {
			computeScrollState();
			if (Math.abs(navProgressTarget - navProgress) > 0.002) {
				scrollRafId = requestAnimationFrame(tick);
			} else {
				scrollRafId = null;
			}
		};
		scrollRafId = requestAnimationFrame(tick);
	}

	function onViewportResize() {
		updateViewportMode();
		computeScrollState();
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}

	$effect(() => {
		document.body.classList.toggle('menu-open', mobileMenuOpen);
		return () => document.body.classList.remove('menu-open');
	});

	$effect(() => {
		if (typeof window === 'undefined') return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && mobileMenuOpen) closeMenu();
		};

		updateViewportMode();
		computeScrollState();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onViewportResize, { passive: true });
		window.addEventListener('keydown', onKeyDown);

		return () => {
			if (scrollRafId !== null) {
				cancelAnimationFrame(scrollRafId);
				scrollRafId = null;
			}
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onViewportResize);
			window.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="MindLenses" />
	<meta
		property="og:title"
		content="MindLenses - Don't ask the Internet. Ask the Expert."
	/>
	<meta
		property="og:description"
		content="Every mentor. Distilled into one file. Works with any AI."
	/>
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:image" content={`${$page.url.origin}/hero.png`} />
	<meta property="og:image:alt" content="MindLenses hero visual" />
	<meta name="twitter:title" content="MindLenses - Ask the Expert" />
	<meta
		name="twitter:description"
		content="Every mentor. Distilled into one file. Works with any AI."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={`${$page.url.origin}/hero.png`} />
	<meta name="twitter:image:alt" content="MindLenses hero visual" />
</svelte:head>

<nav class="nav" class:scrolled style={`--nav-progress:${navProgress};`}>
	<div class="nav-shell stage-in">
		<a href="/" class="nav-logo" aria-label="MindLenses home" onclick={closeMenu}>
			<img src="/logo.png" alt="MindLenses logo" class="logo-img" width="34" height="34" />
			<span class="nav-wordmark">MindLenses</span>
		</a>

		<div class="nav-links-desktop">
			{#each navLinks as link}
				<a href={getNavHref(link.anchor)} class="nav-link">{link.label}</a>
			{/each}
			<a
				href="https://github.com/telaaron/mindlenses-public"
				target="_blank"
				rel="noopener"
				class="nav-link nav-github"
				aria-label="GitHub repository"
			>
				<Icon name="github" size={17} />
			</a>
		</div>

		<button
			type="button"
			class="nav-menu-btn"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-expanded={mobileMenuOpen}
			aria-controls="mobile-nav-panel"
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
		>
			<Icon name={mobileMenuOpen ? 'close' : 'menu'} size={20} />
		</button>
	</div>

	<div id="mobile-nav-panel" class="nav-mobile-panel" class:open={mobileMenuOpen}>
		<div class="nav-mobile-links">
			{#each navLinks as link}
				<a href={getNavHref(link.anchor)} class="nav-mobile-link" onclick={closeMenu}>{link.label}</a>
			{/each}
			<a
				href="https://github.com/telaaron/mindlenses-public"
				target="_blank"
				rel="noopener"
				class="nav-mobile-link"
				onclick={closeMenu}
			>
				GitHub
				<Icon name="github" size={16} />
			</a>
		</div>
	</div>
</nav>

{#if mobileMenuOpen}
	<button class="nav-scrim" type="button" aria-label="Close menu" onclick={closeMenu}></button>
{/if}

{@render children()}

<style>
	:global(body.menu-open) {
		overflow: hidden;
	}

	.nav {
		position: fixed;
		top: calc(0.75rem * var(--nav-progress, 0));
		left: 0;
		right: 0;
		z-index: 120;
		padding-inline: calc(0.75rem * var(--nav-progress, 0));
		will-change: transform;
		transition:
			transform 220ms ease,
			opacity 220ms ease;
	}

	.nav-shell {
		max-width: 100%;
		margin: 0 auto;
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 3.5rem;
		padding: 0.7rem 0.9rem;
		border-radius: 0 0 1rem 1rem;
		background: linear-gradient(
			180deg,
			rgba(2, 8, 14, 0.9) 0%,
			rgba(3, 9, 16, 0.78) 58%,
			rgba(4, 11, 18, 0.64) 100%
		);
		border: 1px solid rgba(196, 214, 236, calc(0.09 + (0.07 * var(--nav-progress, 0))));
		border-top: 0;
		backdrop-filter: blur(16px) saturate(152%);
		-webkit-backdrop-filter: blur(16px) saturate(152%);
		box-shadow: 0 calc(2px + (12px * var(--nav-progress, 0)))
			calc(16px + (28px * var(--nav-progress, 0)))
			rgba(0, 0, 0, calc(0.18 + (0.52 * var(--nav-progress, 0))));
		transition:
			max-width 300ms cubic-bezier(0.22, 1, 0.36, 1),
			border-radius 300ms cubic-bezier(0.22, 1, 0.36, 1),
			padding 300ms cubic-bezier(0.22, 1, 0.36, 1),
			background 260ms ease,
			border-color 260ms ease,
			box-shadow 260ms ease;
		overflow: hidden;
	}

	.nav-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		opacity: calc(0.22 + (0.42 * var(--nav-progress, 0)));
		background:
			radial-gradient(
				120% 110% at 18% 0%,
				rgba(201, 168, 76, 0.2) 0%,
				rgba(201, 168, 76, 0.04) 34%,
				transparent 58%
			),
			linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.06) 0%,
				rgba(255, 255, 255, 0.01) 32%,
				rgba(4, 10, 16, 0.12) 100%
			);
		will-change: opacity;
		transition: opacity 260ms ease;
	}

	.nav-shell::before {
		content: '';
		position: absolute;
		left: 1rem;
		right: 1rem;
		top: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(233, 242, 255, 0.26) 28%,
			rgba(233, 242, 255, 0.26) 72%,
			rgba(255, 255, 255, 0) 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	.nav-shell > * {
		position: relative;
		z-index: 1;
	}

	.nav-shell.stage-in {
		animation: stage-up 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.nav.scrolled .nav-shell {
		max-width: 72rem;
		padding: 0.6rem 0.75rem;
		border-radius: 999px;
		background: rgba(4, 10, 17, 0.64);
		border: 1px solid rgba(215, 229, 247, 0.14);
		box-shadow:
			0 16px 46px rgba(0, 0, 0, 0.6),
			inset 0 0 0 1px rgba(255, 255, 255, 0.02);
	}

	.nav.scrolled .nav-wordmark {
		color: #ffffff;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
	}

	.nav.scrolled .nav-link {
		color: #eef4ff;
	}

	.nav.scrolled .nav-link:hover,
	.nav.scrolled .nav-link:focus-visible {
		color: #ffffff;
	}

	.nav.scrolled .nav-github {
		color: #f2f7ff;
	}

	.nav.scrolled .logo-img {
		filter: brightness(1.2) saturate(1.15) contrast(1.08);
	}

	.nav-logo {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		text-decoration: none;
		min-height: 44px;
	}

	.logo-img {
		width: 34px;
		height: 34px;
	}

	.nav-wordmark {
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: var(--color-text-primary);
	}

	.nav-links-desktop {
		display: none;
		align-items: center;
		gap: 1.4rem;
		padding-right: 0.6rem;
	}

	.nav-link {
		font-size: 0.87rem;
		font-weight: 500;
		color: #d3dfec;
		text-decoration: none;
		line-height: 1;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		transition:
			color 180ms ease,
			opacity 180ms ease;
		opacity: 0.9;
	}

	.nav-link:hover,
	.nav-link:focus-visible {
		color: #ffffff;
		opacity: 1;
	}

	.nav-github {
		color: #8ea0b6;
	}

	.nav-menu-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 999px;
		border: 1px solid rgba(218, 230, 246, 0.28);
		background: rgba(8, 14, 22, 0.76);
		color: var(--color-text-primary);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
		transition:
			border-color 180ms ease,
			background 180ms ease,
			color 180ms ease;
	}

	.nav-menu-btn:hover,
	.nav-menu-btn:focus-visible {
		border-color: rgba(240, 221, 163, 0.5);
		background: rgba(9, 16, 25, 0.88);
		color: #ffffff;
	}

	.nav-mobile-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0.75rem;
		right: 0.75rem;
		padding: 0.5rem;
		border-radius: 1rem;
		background: rgba(5, 12, 20, 0.9);
		border: 1px solid rgba(215, 228, 246, 0.16);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.48);
		transform: translateY(-8px);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 180ms ease,
			transform 180ms ease;
	}

	.nav-mobile-panel.open {
		transform: translateY(0);
		opacity: 1;
		pointer-events: auto;
	}

	.nav-mobile-links {
		display: grid;
		gap: 0.35rem;
	}

	.nav-mobile-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 44px;
		padding: 0.6rem 0.75rem;
		text-decoration: none;
		color: #e1eaf5;
		font-size: 0.96rem;
		font-weight: 500;
		border-radius: 0.7rem;
		transition:
			background 180ms ease,
			color 180ms ease;
	}

	.nav-mobile-link:hover,
	.nav-mobile-link:focus-visible {
		background: rgba(201, 168, 76, 0.2);
		color: #fff;
	}

	.nav-scrim {
		position: fixed;
		inset: 0;
		z-index: 110;
		background: rgba(1, 6, 11, 0.5);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		border: 0;
		padding: 0;
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

	@media (min-width: 720px) {
		.nav {
			top: calc(1rem * var(--nav-progress, 0));
			padding-inline: calc(1rem * var(--nav-progress, 0));
		}

		.nav-shell {
			backdrop-filter: blur(18px) saturate(155%);
			-webkit-backdrop-filter: blur(18px) saturate(155%);
		}

		.nav-shell {
			padding-inline: 1rem;
		}

		.nav-menu-btn,
		.nav-mobile-panel {
			display: none;
		}

		.nav-links-desktop {
			display: flex;
		}
	}

	@media (min-width: 980px) {
		.nav-shell {
			padding: 0.72rem 1.2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-shell.stage-in {
			animation: none;
		}
	}
</style>
