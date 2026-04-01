<script lang="ts">
	interface Props {
		name: 'download' | 'arrow-down' | 'file' | 'sparkles' | 'chat' | 'brain' | 'chevron-right' | 'github' | 'rocket' | 'clock' | 'menu' | 'close';
		size?: number;
		class?: string;
	}
	let { name, size = 20, class: className = '' }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	aria-hidden="true"
>
	{#if name === 'download'}
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7 10 12 15 17 10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	{:else if name === 'arrow-down'}
		<line x1="12" y1="5" x2="12" y2="19" />
		<polyline points="19 12 12 19 5 12" />
	{:else if name === 'file'}
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14 2 14 8 20 8" />
	{:else if name === 'sparkles'}
		<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
	{:else if name === 'chat'}
		<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
	{:else if name === 'brain'}
		<path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.657.905 3.102 2.248 3.87A3.5 3.5 0 0 0 8 13.5 3.5 3.5 0 0 0 11.5 17H12" />
		<path d="M12 2a4.5 4.5 0 0 1 4.5 4.5c0 1.657-.905 3.102-2.248 3.87A3.5 3.5 0 0 1 16 13.5a3.5 3.5 0 0 1-3.5 3.5H12" />
		<line x1="12" y1="17" x2="12" y2="22" />
	{:else if name === 'chevron-right'}
		<polyline points="9 18 15 12 9 6" />
	{:else if name === 'github'}
		<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
	{:else if name === 'rocket'}
		<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3m5.5 2L17 11.5M11 13l3.47 3.47a2.51 2.51 0 0 0 3.53 0l3.53-3.53a2.51 2.51 0 0 0 0-3.53L18 6l-4.5-4.5h-5l-5 5L8 11l3 3z" />
	{:else if name === 'clock'}
		<circle cx="12" cy="12" r="10" />
		<polyline points="12 6 12 12 16 14" />
	{:else if name === 'menu'}
		<line x1="4" y1="7" x2="20" y2="7" />
		<line x1="4" y1="12" x2="20" y2="12" />
		<line x1="4" y1="17" x2="20" y2="17" />
	{:else if name === 'close'}
		<line x1="6" y1="6" x2="18" y2="18" />
		<line x1="18" y1="6" x2="6" y2="18" />
	{/if}
</svg>
