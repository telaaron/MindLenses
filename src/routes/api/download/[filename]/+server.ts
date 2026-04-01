import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import personaManifest from '$lib/personas.json';

export const prerender = true;

// Generate entries for all valid persona files
export function entries() {
	const filenames: { filename: string }[] = [];
	for (const persona of personaManifest.personas) {
		if (persona.status !== 'ready') continue;
		for (const file of Object.values(persona.files)) {
			filenames.push({ filename: file });
		}
	}
	return filenames;
}

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;
	
	// Validate that this filename exists in our manifest
	const validFiles = personaManifest.personas
		.filter(p => p.status === 'ready')
		.flatMap(p => Object.values(p.files));
	
	if (!validFiles.includes(filename)) {
		throw error(404, 'File not found');
	}
	
	// Redirect to the static file — Vercel serves these from /personas/
	throw redirect(302, `/personas/${filename}`);
};
