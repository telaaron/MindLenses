<script lang="ts">
	interface Props {
		name: string;
		category: string;
		why: string;
		delay?: number;
		rank?: number;
		tier: number;
	}

	let { name, category, why, delay = 0, rank = 0, tier }: Props = $props();
</script>

<div
	class="upcoming-card fade-in-delay-{delay} tier-{tier}"
>
	<div class="card-inner">
		<div class="card-top">
			{#if tier === 1}
				<span class="status-pill status-hot">Next Up</span>
			{:else if tier === 2}
				<span class="status-pill status-dev">Later</span>
			{:else}
				<span class="status-pill status-idea">Backlog</span>
			{/if}
			{#if rank > 0}
				<span class="queue-rank">#{rank}</span>
			{/if}
		</div>
		<h3 class="persona-name">{name}</h3>
		<div class="persona-meta">
			<span class="persona-category">{category}</span>
			<span class="meta-dot" aria-hidden="true"></span>
			<p class="persona-why">{why}</p>
		</div>
	</div>
</div>

<style>
	.upcoming-card {
		position: relative;
		background: var(--color-glass);
		backdrop-filter: blur(20px) saturate(130%);
		-webkit-backdrop-filter: blur(20px) saturate(130%);
		border: 1px solid var(--color-glass-border);
		border-radius: 1rem;
		padding: 0.95rem;
		transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
		overflow: hidden;
		height: auto;
		min-height: 0;
		display: flex;
	}

	.card-inner {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.5rem;
	}

	.upcoming-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		opacity: 0;
		transition: opacity 0.35s ease;
		background: radial-gradient(
			ellipse at 30% 0%,
			rgba(201, 168, 76, 0.04) 0%,
			transparent 60%
		);
	}

	.upcoming-card:hover {
		border-color: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
		box-shadow: 0 14px 32px -16px rgba(0, 0, 0, 0.62);
	}

	.upcoming-card:hover::before {
		opacity: 1;
	}

	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.45rem;
		margin-bottom: 0.12rem;
	}

	.status-pill {
		font-size: 0.54rem;
		font-weight: 800;
		text-transform: uppercase;
		padding: 0.17rem 0.58rem;
		border-radius: 999px;
		letter-spacing: 0.08em;
	}

	.queue-rank {
		font-size: 0.68rem;
		font-weight: 700;
		color: #8da2b9;
		letter-spacing: 0.04em;
	}

	.status-hot {
		background: rgba(239, 68, 68, 0.08);
		color: #f87171;
		border: 1px solid rgba(239, 68, 68, 0.15);
	}

	.status-dev {
		background: rgba(56, 189, 248, 0.08);
		color: #38bdf8;
		border: 1px solid rgba(56, 189, 248, 0.15);
	}

	.status-idea {
		background: rgba(148, 163, 184, 0.08);
		color: #94a3b8;
		border: 1px solid rgba(148, 163, 184, 0.1);
	}

	.persona-name {
		font-size: 0.99rem;
		font-weight: 800;
		color: var(--color-text-primary);
		margin: 0;
		line-height: 1.25;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 0;
	}

	.persona-meta {
		display: flex;
		align-items: center;
		gap: 0.42rem;
		min-width: 0;
	}

	.persona-category {
		font-size: 0.74rem;
		font-weight: 600;
		color: #c4d2e3;
		padding: 0.18rem 0.44rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		max-width: 46%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.meta-dot {
		width: 0.22rem;
		height: 0.22rem;
		border-radius: 999px;
		background: rgba(152, 168, 187, 0.65);
		flex: 0 0 auto;
	}

	.persona-why {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		line-height: 1.45;
		margin: 0;
		display: -webkit-box;
		line-clamp: 1;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Tier 1: gold top border */
	.tier-1 {
		border-top: 2px solid rgba(201, 168, 76, 0.35);
	}

	.tier-1:hover {
		border-top-color: var(--color-gold);
	}

	@media (min-width: 980px) {
		.upcoming-card {
			padding: 1rem 1.02rem;
		}

		.persona-name {
			font-size: 1.03rem;
		}
	}

	@media (max-width: 430px) {
		.upcoming-card {
			padding: 0.82rem 0.8rem;
			border-radius: 0.9rem;
		}

		.card-inner {
			gap: 0.42rem;
		}

		.status-pill {
			font-size: 0.5rem;
			padding: 0.15rem 0.5rem;
		}

		.queue-rank {
			font-size: 0.62rem;
		}

		.persona-name {
			font-size: 0.92rem;
			line-height: 1.2;
		}

		.persona-category {
			font-size: 0.68rem;
			max-width: 52%;
		}

		.persona-why {
			font-size: 0.75rem;
		}
	}
</style>
