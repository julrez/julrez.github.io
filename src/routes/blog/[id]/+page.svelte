<main>
	<h1 id="header">{title}</h1>
	<div id="hr">
	</div>
	<div id="infoContainer">
		<p id="date">{date}</p>
	</div>

	<svelte:component this={post.default} />
</main>

<script>
	import {page} from '$app/stores';

	let title = "", date = "";
	let post = {};

	let url = '/'+$page.url.pathname.replace('/blog/|', '').replaceAll('|', '/');

	async function pls()
	{
		let name = url.replace('/src/lib/posts/', '').replace('.md', '');
		let temp = await import(`../../../lib/posts/${name}.md`);
		post = temp;
		title = post.metadata.title;
		date = new Date(post.metadata.date)
	}
	pls();
</script>

<style>
	p {
		text-align: center;
		color: #bfbdb6;
	}
	#date {
		color: #acb6bf8c;
	}
	#infoContainer {
		margin-bottom: 5rem;
	}
	#infoContainer p {
		margin: 0;
		margin-top: 0.2rem;
		margin-bottom: 0.2rem;
	}
	#hr {
		width: 50%;
		margin: auto;
		border-bottom: 0.5rem solid #131721;
	}
	#header {
		color: #95e6cb;
		text-align: center;
	}
	main {
		background-color: #0b0e14;
		position: absolute;
		top: 0;
		left: 0;

		min-width: 100vw;
		min-height: 100vh;
	}
</style>
