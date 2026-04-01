/**
 * Svelte action: Intersection Observer-based fade-in.
 * Usage: <div use:fadeIn>content</div>
 */
export function fadeIn(node: HTMLElement) {
	node.classList.add('fade-in');

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
