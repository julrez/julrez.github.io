<div id="background"></div>
{#if isArticle}
<div id="articleMain">
	<div id="top">
		<div id="headerContainer">
			<a id="headerA" href="/blog" onclick="window.location=window.location.pathname"><h1 id="header" class="pls">BLOG!</h1></a><h2 class="pls" id="header2">or something idk</h2>
		</div>
		<div id="long-hr" />
	</div>
	<h1 id="articleHeader">{title}</h1>
	<div id="hr">
	</div>
	<div id="infoContainer">
		<p id="date">{date}</p>
	</div>

	<div id="postPostContainer">
		<div id="postContainer">
			<svelte:component this={articleComponent} />
		</div>
	</div>
</div>
{:else}
<main>
	<div id="top">
		<div id="headerContainer">
			<a id="headerA" href="/blog" onclick="window.location=window.location.pathname"><h1 id="header" class="pls">BLOG!</h1></a><h2 class="pls" id="header2">or something idk</h2>
		</div>
		<div id="long-hr" />
	</div>

	<div id="container">
		<div id="left">
			<p id="centertext">Ordered by: date</p>
			<p id="centertext">Sorted by: TODO</p>
		</div>
		<div id="right">
			<ul>
			{#each posts as post}
				<li>
					<a class="title" on:click={on_click(post)}>{post.title}</a>
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
{/if}

<style>
	#background {
		background-color: #0b0e14;
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: -10;

	}
	#headerA {
		text-decoration: none;
	}
	#headerContainer {
		margin-top: 1em;
		margin-bottom: 1em;
	}
	.pls {
		display: inline;
	}
	#centertext {
		text-align: center;
	}
	#container {
		margin-top: 0;
		display: grid;
		grid-template-columns: 15% auto;
		flex: 1 1 auto;
	}
	#left {
		border-right: 1rem solid #131721;
		background-color: #0b0e14;
		height: 100%;
		padding-bottom: 0.4rem;
	}
	#right {
		background-color: #0b0e14;
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
		display: inline;
	}
	#header2 {
		color: #6c7380e6;
		font-style: italic;
		display: inline;
		margin-left: calc(1ch * 0.5);
	}
	#long-hr {
		width: 100%;
		border-bottom: 1rem solid #131721;
	}
	#short-hr {
		position: absolute;
		display: inline;
		left: 0;
		width: 100%;
		border-bottom: 1rem solid #131721;
		margin-top: 0.5em;
	}
	main {
		display: flex;
		flex-flow: column;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
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
		margin-top: 2rem;
	}
	ul {
		position: relative;
	}
	#articleMain {
		background-color: #0b0e14;
		position: absolute;
		top: 0;
		left: 0;
	}
	#postPostContainer {
		width: 100vw;
		overflow-x: hidden;
	}
	#postContainer {
		width: 50%;
		margin: auto;
		padding-bottom: 5rem;
	}
	#date {
		text-align: center;
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
	#articleHeader {
		color: #95e6cb;
		text-align: center;
	}
</style>

<script>
	import {onMount} from 'svelte';
	export let data;

	function on_click(post) {
		window.location.href += "?article="+post.filename.split('/').pop();
	}

	let title = "", date = "";

	let articleComponent = undefined;

	let newPosts = [];
	let posts = [];

	let urlParams = new URLSearchParams(window.location.search);
	let articleParam = urlParams.get("article");
	let isArticle = articleParam != null;
	console.log(articleParam);

	let selectedPost = undefined;
	for (let i = 0; i < data.postFilenames.length; i++) {
		if (data.postFilenames[i].endsWith(articleParam)) {
			selectedPost = data.posts[i];
		}
	}
	if (selectedPost == undefined) {
		isArticle = false;
	}

	if (!isArticle) {
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
	} else {
		articleComponent = selectedPost.default;

		title = selectedPost.metadata.title;
		date = new Date(selectedPost.metadata.date)
	}

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
