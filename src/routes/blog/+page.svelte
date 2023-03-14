<main>
	<div id="top">
		<h1 id="header">BLOG!</h1>
		<div id="long-hr" />
	</div>

	<div id="container">
		<div id="left">
			<p>Ordered by: date</p>
		</div>
		<div id="right">
			<ul>
			{#each posts as post}
				<li>
					<a class="title" href="/blog/{post.filename.replaceAll('/', '|')}">{post.title}</a>
					<p>Published: {post.date}</p>
					<p class="no-nl">Tags:</p>
					<span>
						{#each post.tags as tag}
							<a class="tag" id={tag} on:click={tagOnClick}>{tag}</a><p class="no-nl separator">, </p>
						{/each}
					</span>
				</li>
				<div id="short-hr" />
			{/each}
			</ul>
		</div>
	</div>
</main>

<style>
	#container {
		margin-top: 0;
		display: grid;
		grid-template-columns: 15% auto;
		flex: 1 1 auto;
	}
	#left {
		height: 100%;
		border-right: 2px solid #acb6bf8c;
	}
	.tag {
		color: #59c2ff;
		text-decoration: none;
	}
	.tag:hover {
		color: #ff8f40;
		text-decoration: underline;
		cursor: pointer;
	}
	.separator {
		color: #bfbdb6;
		text-decoration: none;
	}
	.separator:last-child {
		display: none;
	}
	.no-nl {
		display: inline;
	}
	#header {
		color: #ff8f40;
		margin-left: 1em;
	}
	#long-hr {
		width: 100%;
		border-bottom: 2px solid #acb6bf8c;
	}
	#short-hr {
		position: absolute;
		display: inline;
		left: 0;
		width: 30%;
		border-bottom: 2px solid #acb6bf8c;
		margin-left: 1em;
		margin-top: 0.5em;
	}
	main {
		display: flex;
		flex-flow: column;
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #0b0e14;
	}

	h1, p {
		color: #bfbdb6;
	}
	li::before {
		content: ' ';

		position: absolute;
		transform: translate(-150%, 100%);

		display: inline-block;
		min-width: 0.75em;
		min-height: 0.75em;
		background-color: #ff8f40;
	}
	.title {
		display: inline-block;

		color: #bfbdb6;
		font-size: 2em;
		text-decoration: none;
	}
	.title:hover {
		color: #ff8f40;
		text-decoration: underline;
		cursor: pointer;
	}
	li {
		margin-top: 1em;
	}
	ul {
		position: relative;
	}
</style>

<script>
	import {onMount} from 'svelte';
	export let data;

	let newPosts = [];
	let posts = [];
	onMount(async() => {
		newPosts.length = data.posts.length;
		let finishedCount = 0;
		for (let i = 0; i < data.posts.length; i++) {
			const {title, date, tags} = data.posts[i].metadata;
			newPosts[i] = {
				"title": title,
				"date": new Date(date),
				"tags": tags.split(' '),
				"filename": data.postFilenames[i],
				"component": data.posts[i].default,
			};
		}
		posts = sort_posts_by_date(newPosts);
	});

	function tagOnClick()
	{
	}

	function sort_posts_by_date(list)
	{
		let sortedPosts = [];
		let dates = [];
		for (let i = 0; i < list.length; i++) {
			dates[i] = Date.parse(list[i].date);
		}
		let sortedDates = [...dates].sort();
		for (let i = 0; i < sortedDates.length; i++) {
			for (let j = 0; j < dates.length; j++) {
				if (sortedDates[i] == dates[j]) {
					sortedPosts.unshift(list[j]);
				}
			}
		}
		return sortedPosts;
	}
</script>
