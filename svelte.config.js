import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';
import {mdsvex} from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({assets:'docs',pages:'docs'}),
		prerender: {
			entries: [
				'*',
				'/blog/[id]',
			],
		},
	},
	extensions: ['.svelte', '.md'],
  	preprocess: [
		sveltePreprocess(),
		mdsvex({
			extensions: ['.md']
		})
	]
};

export default config;
