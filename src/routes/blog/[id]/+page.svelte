<svelte:component this={post.default} />

<script>
	import {page} from '$app/stores';

	let post = {};

	let url = '/'+$page.url.pathname.replace('/blog/|', '').replaceAll('|', '/');

	async function pls()
	{
		let name = url.replace('/src/lib/posts/', '').replace('.md', '');
		let temp = await import(`../../../lib/posts/${name}.md`);
		post = temp;
	}
	pls();

</script>
