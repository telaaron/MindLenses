<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const message = $derived(page.error?.message ?? 'Something went wrong while loading this page.');
</script>

<svelte:head>
	<title>{status} - MindLenses</title>
	<meta name="description" content="MindLenses error page" />
</svelte:head>

<main class="error-shell">
	<div class="noise" aria-hidden="true"></div>
	<div class="halo halo-left" aria-hidden="true"></div>
	<div class="halo halo-right" aria-hidden="true"></div>

	<section class="error-card">
		<img src="/logo.png" alt="MindLenses" class="brand" width="84" height="84" />
		<p class="eyebrow">Signal Interrupted</p>
		<h1>{status}</h1>
		<p class="lead">{message}</p>
		<p class="sub">The lens is still intact. Let's route you back to clarity.</p>

		<div class="actions">
			<a href="/" class="btn btn-primary">Back Home</a>
			<a href="/#library" class="btn btn-ghost">Open Library</a>
			<button type="button" class="btn btn-ghost" onclick={() => location.reload()}>Retry</button>
		</div>
	</section>
</main>

<style>
	.error-shell {
		position: relative;
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: 1.25rem;
		overflow: hidden;
		background:
			radial-gradient(circle at 22% 10%, rgba(201, 168, 76, 0.28), transparent 32%),
			radial-gradient(circle at 84% 5%, rgba(56, 189, 248, 0.16), transparent 28%),
			linear-gradient(180deg, #04090f 0%, #050c14 45%, #040910 100%);
	}

	.noise {
		position: absolute;
		inset: 0;
		opacity: 0.08;
		background-image:
			repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0, rgba(255, 255, 255, 0.035) 1px, transparent 1px, transparent 2px),
			repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0, rgba(255, 255, 255, 0.025) 1px, transparent 1px, transparent 3px);
		pointer-events: none;
	}

	.halo {
		position: absolute;
		width: 32rem;
		height: 32rem;
		border-radius: 50%;
		filter: blur(45px);
		opacity: 0.22;
		pointer-events: none;
	}

	.halo-left {
		left: -9rem;
		top: -7rem;
		background: #c9a84c;
	}

	.halo-right {
		right: -10rem;
		bottom: -8rem;
		background: #38bdf8;
	}

	.error-card {
		position: relative;
		z-index: 1;
		width: min(40rem, 100%);
		padding: 2rem 1.25rem;
		text-align: center;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(180deg, rgba(8, 14, 22, 0.78) 0%, rgba(6, 12, 20, 0.82) 100%);
		backdrop-filter: blur(16px) saturate(140%);
		-webkit-backdrop-filter: blur(16px) saturate(140%);
		box-shadow:
			0 28px 56px -28px rgba(0, 0, 0, 0.85),
			0 0 0 1px rgba(201, 168, 76, 0.1) inset;
	}

	.brand {
		width: 4.5rem;
		height: 4.5rem;
		margin: 0 auto 0.95rem;
		filter: drop-shadow(0 10px 24px rgba(201, 168, 76, 0.32));
	}

	.eyebrow {
		margin: 0;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: #d9bc6b;
		font-weight: 700;
	}

	h1 {
		margin: 0.55rem 0 0.65rem;
		font-family: var(--font-display);
		font-size: clamp(3rem, 14vw, 5rem);
		line-height: 1;
		letter-spacing: -0.05em;
		color: #f5f8fc;
		text-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
	}

	.lead {
		margin: 0 auto;
		max-width: 32ch;
		font-size: clamp(1rem, 3.8vw, 1.25rem);
		line-height: 1.55;
		color: #dbe5ef;
	}

	.sub {
		margin: 0.75rem auto 1.5rem;
		max-width: 36ch;
		font-size: 0.95rem;
		line-height: 1.5;
		color: #a8b8cb;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.btn {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		min-height: 44px;
		padding: 0.72rem 1rem;
		border-radius: 999px;
		text-decoration: none;
		font-size: 0.94rem;
		font-weight: 700;
		border: 1px solid transparent;
		cursor: pointer;
		transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease;
	}

	.btn:hover,
	.btn:focus-visible {
		transform: translateY(-1px);
	}

	.btn-primary {
		background: linear-gradient(140deg, #e0c872, #c9a84c);
		color: #081019;
		box-shadow: 0 12px 26px -14px rgba(201, 168, 76, 0.65);
	}

	.btn-ghost {
		color: #d7e2ee;
		border-color: rgba(255, 255, 255, 0.22);
		background: rgba(8, 14, 22, 0.65);
	}

	.btn-ghost:hover,
	.btn-ghost:focus-visible {
		background: rgba(201, 168, 76, 0.12);
		border-color: rgba(201, 168, 76, 0.5);
	}

	@media (min-width: 640px) {
		.error-card {
			padding: 2.4rem 2rem;
		}

		.actions {
			flex-direction: row;
			justify-content: center;
		}

		.btn {
			min-width: 10.5rem;
		}
	}
</style>
