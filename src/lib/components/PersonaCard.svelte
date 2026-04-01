<script lang="ts">
	import Icon from './Icon.svelte';
	import { fadeIn } from '$lib/actions/fadeIn';

	interface FileInfo {
		name: string;
		sizeKB: number;
		downloadName: string;
		updatedAt?: string;
	}

	interface Props {
		id: string;
		name: string;
		tagline: string;
		expertise: string[];
		category: string;
		avatar: string;
		fileInfo: Record<string, FileInfo>;
		latestUpdatedAt?: string | null;
		delay?: number;
	}

	let { id, name, tagline, expertise, category, avatar, fileInfo, latestUpdatedAt = null, delay = 0 }: Props = $props();

	function getLensName(type: string): string {
		if (type === 'core') return 'MindCore';
		if (type === 'bank') return 'MindBank';
		if (type === 'combined' || type === 'bank+core') return 'MindCore + MindBank';
		return type;
	}

	function getLensMeta(type: string): string {
		if (type === 'core') return 'Identity profile';
		if (type === 'bank') return 'Framework archive';
		if (type === 'combined' || type === 'bank+core') return 'Combined lens';
		return 'Lens file';
	}

	function getFreshnessInfo(updatedAt?: string | null): { label: string; isNew: boolean } {
		if (!updatedAt) return { label: 'Update unknown', isNew: false };

		const updatedDate = new Date(updatedAt);
		if (Number.isNaN(updatedDate.getTime())) return { label: 'Update unknown', isNew: false };

		const now = new Date();
		const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const startUpdated = new Date(
			updatedDate.getFullYear(),
			updatedDate.getMonth(),
			updatedDate.getDate()
		);
		const diffDays = Math.floor((startToday.getTime() - startUpdated.getTime()) / 86400000);
		const isNew = diffDays <= 2;

		if (diffDays <= 0) return { label: 'Updated today', isNew };
		if (diffDays === 1) return { label: 'Updated yesterday', isNew };
		if (diffDays < 7) return { label: `Updated ${diffDays} days ago`, isNew };

		const includeYear = updatedDate.getFullYear() !== now.getFullYear();
		return {
			label: `Updated on ${updatedDate.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			...(includeYear ? { year: 'numeric' } : {})
			})}`,
			isNew
		};
	}

	const freshness = $derived(getFreshnessInfo(latestUpdatedAt));
</script>

<article
	use:fadeIn
	class="persona-card fade-in-delay-{delay}"
	id="persona-{id}"
>
	<!-- Top glow accent -->
	<div class="card-glow" aria-hidden="true"></div>

	<div class="card-content">
		<div class="card-header">
			<div class="avatar-wrapper">
				<img
					src="/avatars/{id}.png"
					alt="{name} portrait"
					class="avatar"
					loading="lazy"
					width="80"
					height="80"
				/>
				<div class="avatar-ring" aria-hidden="true"></div>
			</div>
			<div class="card-meta">
				<span class="category-badge">{category}</span>
				<h3 class="persona-name">{name}</h3>
				<p class="persona-tagline">{tagline}</p>
			</div>
		</div>

		<div class="expertise-tags">
			{#each expertise as tag}
				<span class="tag">{tag}</span>
			{/each}
		</div>

		<div class="card-update-strip" aria-label="Update status">
			<span class="update-label">{freshness.label}</span>
			{#if freshness.isNew}
				<span class="new-badge">New</span>
			{/if}
			<a href="/persona/{id}" class="details-link">Profile & Sources</a>
		</div>

		{#if Object.keys(fileInfo ?? {}).length > 0}
			<div class="download-section">
				{#each Object.entries(fileInfo ?? {}) as [type, file]}
					<a
						href="/personas/{file.downloadName}"
						download={file.downloadName}
						class="download-btn"
						id="download-{id}-{type}"
					>
						<span class="download-main">
							<span class="download-icon-wrap" aria-hidden="true">
								<span class="download-icon">
								<Icon name="download" size={15} />
								</span>
							</span>
							<span class="download-copy">
								<span class="download-label">{getLensName(type)}</span>
								<span class="download-meta">{getLensMeta(type)}</span>
							</span>
						</span>
						<span class="download-size-badge" aria-label="File size {file.sizeKB} kilobytes">
							<span class="download-size">{file.sizeKB}</span>
							<span class="download-size-unit">KB</span>
						</span>
					</a>
				{/each}
			</div>
		{:else}
			<p class="download-missing">Files are currently being prepared.</p>
		{/if}
	</div>
</article>

<style>
	.persona-card {
		position: relative;
		background: var(--color-glass);
		backdrop-filter: blur(24px) saturate(140%);
		-webkit-backdrop-filter: blur(24px) saturate(140%);
		border: 1px solid var(--color-glass-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
	}

	.persona-card:hover {
		border-color: var(--color-gold-border);
		transform: translateY(-6px);
		box-shadow: 
			0 20px 60px -15px rgba(0, 0, 0, 0.6),
			0 0 0 1px var(--color-gold-border),
			0 0 40px -10px var(--color-gold-glow);
	}

	.card-glow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-gold-border) 20%,
			var(--color-gold) 50%,
			var(--color-gold-border) 80%,
			transparent
		);
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.persona-card:hover .card-glow {
		opacity: 1;
	}

	.card-content {
		padding: 1.75rem;
	}

	.card-header {
		display: flex;
		gap: 1.125rem;
		align-items: flex-start;
		margin-bottom: 1.25rem;
	}

	.avatar-wrapper {
		flex-shrink: 0;
		position: relative;
	}

	.avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-glass-border);
		transition: border-color 0.3s ease;
	}

	.avatar-ring {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 1px solid transparent;
		transition: border-color 0.4s ease;
	}

	.persona-card:hover .avatar {
		border-color: var(--color-gold-border);
	}

	.persona-card:hover .avatar-ring {
		border-color: var(--color-gold-dim);
	}

	.card-meta {
		flex: 1;
		min-width: 0;
	}

	.category-badge {
		display: inline-block;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-gold);
		margin-bottom: 0.375rem;
	}

	.persona-name {
		font-size: 1.125rem;
		font-weight: 800;
		color: var(--color-text-primary);
		margin: 0;
		line-height: 1.25;
	}

	.persona-tagline {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin: 0.25rem 0 0;
		line-height: 1.45;
	}

	.expertise-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-bottom: 1.5rem;
	}

	.tag {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		padding: 0.25rem 0.75rem;
		letter-spacing: 0.02em;
	}

	.card-update-strip {
		display: flex;
		align-items: center;
		gap: 0.48rem;
		padding: 0.44rem 0.6rem;
		margin-bottom: 0.9rem;
		border-radius: 0.7rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.update-label {
		font-size: 0.63rem;
		line-height: 1;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #aebfd2;
		white-space: nowrap;
	}

	.new-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.16rem 0.34rem;
		border-radius: 999px;
		font-size: 0.54rem;
		line-height: 1;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #f3d27b;
		background: rgba(201, 168, 76, 0.16);
		border: 1px solid rgba(201, 168, 76, 0.28);
	}

	.details-link {
		margin-left: auto;
		font-size: 0.67rem;
		font-weight: 600;
		line-height: 1;
		text-decoration: none;
		color: #c9d7e7;
		border-bottom: 1px solid transparent;
		transition:
			color 180ms ease,
			border-color 180ms ease;
		white-space: nowrap;
	}

	.details-link:hover,
	.details-link:focus-visible {
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.56);
	}

	.download-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.download-btn {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		padding: 0.76rem 0.95rem;
		background: rgba(201, 168, 76, 0.06);
		border: 1px solid var(--color-gold-border);
		border-radius: var(--radius-md);
		color: var(--color-gold);
		text-decoration: none;
		font-size: 0.8125rem;
		font-weight: 600;
		transition: all 0.25s ease;
		cursor: pointer;
	}

	.download-main {
		display: inline-flex;
		align-items: center;
		gap: 0.58rem;
		min-width: 0;
	}

	.download-icon-wrap {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.85rem;
		height: 1.85rem;
		border-radius: 0.6rem;
		background: rgba(201, 168, 76, 0.13);
		border: 1px solid rgba(201, 168, 76, 0.3);
		flex-shrink: 0;
	}

	.download-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.download-copy {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.download-btn:hover {
		background: var(--color-gold);
		color: #050a0f;
		border-color: var(--color-gold);
		box-shadow: 0 4px 20px -4px rgba(201, 168, 76, 0.3);
	}

	.download-btn:focus-visible {
		background: var(--color-gold);
		color: #050a0f;
		border-color: var(--color-gold-light);
	}

	.download-label {
		font-size: 0.77rem;
		line-height: 1.08;
		letter-spacing: -0.005em;
		white-space: nowrap;
	}

	.download-meta {
		font-size: 0.63rem;
		line-height: 1.1;
		opacity: 0.72;
		white-space: nowrap;
	}

	.download-size-badge {
		display: inline-flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.18rem;
		padding: 0.34rem 0.48rem;
		border-radius: 0.6rem;
		background: rgba(201, 168, 76, 0.12);
		border: 1px solid rgba(201, 168, 76, 0.26);
		flex-shrink: 0;
	}

	.download-size {
		font-size: 0.78rem;
		color: inherit;
		opacity: 0.9;
		font-weight: 700;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
		min-width: 1.8ch;
		text-align: right;
		line-height: 1;
	}

	.download-size-unit {
		font-size: 0.62rem;
		line-height: 1;
		opacity: 0.8;
		letter-spacing: 0.05em;
	}

	.download-btn:hover .download-size-badge,
	.download-btn:focus-visible .download-size-badge {
		background: rgba(5, 10, 15, 0.15);
		border-color: rgba(5, 10, 15, 0.22);
	}

	.download-missing {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	@media (min-width: 640px) {
		.card-content {
			padding: 2rem;
		}

		.avatar {
			width: 68px;
			height: 68px;
		}
	}
</style>
