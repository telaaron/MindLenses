<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();
	const persona = $derived(data.persona);

	function getLensName(type: string): string {
		if (type === 'core') return 'MindCore';
		if (type === 'bank') return 'MindBank';
		if (type === 'combined' || type === 'bank+core') return 'MindCore + MindBank';
		return type;
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

	function formatExactDate(updatedAt?: string | null): string {
		if (!updatedAt) return 'Unknown';
		const date = new Date(updatedAt);
		if (Number.isNaN(date.getTime())) return 'Unknown';
		return date.toLocaleString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const freshness = $derived(getFreshnessInfo(persona.latestUpdatedAt));
</script>

<svelte:head>
	<title>{persona.name} - Profile & Sources | MindLenses</title>
	<meta
		name="description"
		content="Profile, source basis and freshness details for {persona.name} as a MindLens."
	/>
</svelte:head>

<main class="persona-page">
	<section class="persona-shell">
		<a href="/#library" class="back-link">Back to library</a>

		<header class="persona-hero">
			<div class="persona-head-main">
				<div class="avatar-wrap">
					<img
						src="/avatars/{persona.id}.png"
						alt="{persona.name} portrait"
						width="84"
						height="84"
						loading="eager"
					/>
				</div>
				<div>
					<span class="category">{persona.category}</span>
					<h1>{persona.name}</h1>
					<p>{persona.tagline}</p>
				</div>
			</div>

			<aside class="update-panel" aria-label="Freshness of this persona">
				<span class="update-kicker">Freshness</span>
				<div class="update-row">
					<strong>{freshness.label}</strong>
					{#if freshness.isNew}
						<span class="new-badge">New</span>
					{/if}
				</div>
				<p>Last fetch: {formatExactDate(persona.latestUpdatedAt)}</p>
			</aside>
		</header>

		<section class="info-grid">
			<article class="info-card">
				<h2>Who is this persona?</h2>
				<p>
					This MindLens represents <strong>{persona.name}</strong> in the context of
					<strong>{persona.category}</strong>, focused on the core domains below.
				</p>
				<div class="expertise">
					{#each persona.expertise as area}
						<span>{area}</span>
					{/each}
				</div>
			</article>

			<article class="info-card">
				<h2>Lens source basis</h2>
				<ul>
					<li>Curated, publicly available content and transcript sources</li>
					<li>Distillation into MindCore and/or MindBank structures</li>
					<li>Recurring rebuilds when new relevant sources become available</li>
				</ul>
			</article>
		</section>

		<section class="downloads">
			<h2>Download files</h2>
			<div class="download-list">
				{#each Object.entries(persona.fileInfo ?? {}) as [type, file]}
					<a href="/personas/{file.downloadName}" download={file.downloadName} class="download-item">
						<div>
							<div class="download-title">{getLensName(type)}</div>
							<div class="download-sub">{file.downloadName}</div>
						</div>
						<div class="download-meta">
							<span>{file.sizeKB} KB</span>
							<span>{formatExactDate(file.updatedAt)}</span>
							<Icon name="download" size={15} />
						</div>
					</a>
				{/each}
			</div>
		</section>
	</section>
</main>

<style>
	.persona-page {
		min-height: 100vh;
		padding: 6.7rem 1rem 3rem;
		background:
			radial-gradient(1100px 540px at 8% -5%, rgba(201, 168, 76, 0.16), transparent 62%),
			radial-gradient(920px 580px at 95% 20%, rgba(26, 118, 255, 0.18), transparent 70%),
			#040b13;
	}

	.persona-shell {
		width: min(980px, 100%);
		margin: 0 auto;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-decoration: none;
		color: #9fb2c7;
		margin-bottom: 1rem;
	}

	.back-link:hover,
	.back-link:focus-visible {
		color: #ffffff;
	}

	.persona-hero {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.9rem;
		padding: 1rem;
		border-radius: 1rem;
		background: rgba(8, 16, 25, 0.78);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	.persona-head-main {
		display: flex;
		gap: 0.9rem;
		align-items: center;
	}

	.avatar-wrap img {
		width: 64px;
		height: 64px;
		border-radius: 999px;
		border: 2px solid rgba(201, 168, 76, 0.34);
		object-fit: cover;
	}

	.category {
		display: inline-flex;
		font-size: 0.64rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 700;
		color: #e2c46f;
	}

	h1 {
		margin: 0.28rem 0 0;
		font-size: clamp(1.3rem, 3vw, 2rem);
		line-height: 1.12;
		color: #f4f8fc;
	}

	.persona-hero p {
		margin: 0.3rem 0 0;
		font-size: 0.9rem;
		line-height: 1.55;
		color: #b9c9db;
	}

	.update-panel {
		padding: 0.78rem 0.9rem;
		border-radius: 0.85rem;
		background: rgba(255, 255, 255, 0.035);
		border: 1px solid rgba(255, 255, 255, 0.09);
	}

	.update-kicker {
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #9db0c5;
	}

	.update-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin-top: 0.34rem;
	}

	.update-row strong {
		font-size: 0.86rem;
		color: #eef4fb;
	}

	.new-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.18rem 0.4rem;
		border-radius: 999px;
		font-size: 0.58rem;
		line-height: 1;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #f3d27b;
		background: rgba(201, 168, 76, 0.17);
		border: 1px solid rgba(201, 168, 76, 0.28);
	}

	.info-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.85rem;
		margin-top: 0.95rem;
	}

	.info-card,
	.downloads {
		padding: 1rem;
		border-radius: 1rem;
		background: rgba(8, 16, 25, 0.78);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	h2 {
		margin: 0;
		font-size: 1rem;
		line-height: 1.2;
		color: #f4f8fc;
	}

	.info-card p {
		margin: 0.55rem 0 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: #becdde;
	}

	.info-card ul {
		margin: 0.6rem 0 0;
		padding-left: 1.1rem;
		display: grid;
		gap: 0.35rem;
		color: #c8d4e2;
		font-size: 0.88rem;
		line-height: 1.55;
	}

	.expertise {
		display: flex;
		flex-wrap: wrap;
		gap: 0.42rem;
		margin-top: 0.7rem;
	}

	.expertise span {
		font-size: 0.68rem;
		line-height: 1;
		font-weight: 600;
		padding: 0.3rem 0.58rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: #d2ddea;
	}

	.downloads {
		margin-top: 0.95rem;
	}

	.download-list {
		display: grid;
		gap: 0.55rem;
		margin-top: 0.7rem;
	}

	.download-item {
		display: flex;
		justify-content: space-between;
		gap: 0.8rem;
		align-items: center;
		padding: 0.85rem;
		border-radius: 0.8rem;
		background: rgba(201, 168, 76, 0.07);
		border: 1px solid rgba(201, 168, 76, 0.22);
		text-decoration: none;
		color: #f1f6fc;
	}

	.download-item:hover,
	.download-item:focus-visible {
		background: rgba(201, 168, 76, 0.12);
		border-color: rgba(201, 168, 76, 0.34);
	}

	.download-title {
		font-size: 0.84rem;
		font-weight: 700;
	}

	.download-sub {
		font-size: 0.72rem;
		line-height: 1.3;
		color: #a8bbce;
		margin-top: 0.18rem;
	}

	.download-meta {
		display: grid;
		justify-items: end;
		gap: 0.12rem;
		font-size: 0.66rem;
		line-height: 1.25;
		color: #cfd9e6;
		font-variant-numeric: tabular-nums;
	}

	@media (min-width: 860px) {
		.persona-hero {
			grid-template-columns: 1fr auto;
			align-items: center;
		}

		.info-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
