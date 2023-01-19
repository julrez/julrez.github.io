<title>julrez.github.io</title>

<main>
	<div id="navbackground">
		<nav>
			<div id="navMainDiv">
				<h2 id="name">julrez.github.io</h2>
				<a href="#clicker">clicker</a>
				<a href="#todo">todo</a>
				<a href="#telltale">telltale</a>
				<a href="#chess">chess</a>
				<a href="#memory">memory</a>
				<a href="#chatbot">chatbot</a>
			</div>
			<div id="aboutDiv">
				<a href="#footer" id="aboutButton">about</a>
			</div>
		</nav>
	</div>
	<section id="clicker">
		<a href="/clicker">Clicker</a>
		<hr>
		<article>
			<p>math but epic</p>
		</article>
	</section>
	<section id="todo">
		<a href="/todo">Todo</a>
		<hr>
		<article>
			<p>Write your TODO with keys and press ENTER to spawn it. Click on a TODO to remove it</p>
		</article>
	</section>
	<section id="telltale">
		<a href="/telltale">Telltale</a>
		<hr>
		<article>
			<p>free robux</p>
		</article>
	</section>
	<section id="chess">
		<a href="/chess">Chess</a>
		<hr>
		<article>
			<p>Chess but really bad and without a lot of the rules + you can not win. Good luck against Math.random</p>
		</article>
	</section>
	<section id="memory">
		<a href="/memory">Memory</a>
		<hr>
		<article>
			<p>Thing</p>
		</article>
	</section>
	<section id="chatbot">
		<a href="/chatbot">Chatbot</a>
		<hr>
		<article>
			<p>Chat with the bad npm eliza bot</p>
		</article>
	</section>
	<footer id="footer">
		<h2>About this website</h2>
		<hr>
		<article>
			<p>This website shows a collection of websites I have done in school. All of the code can be found in the <a href="https://github.com/julrez/julrez.github.io">github repository</a>. BTW you can click on the headers.</p>
		</article>
	</footer>
</main>

<style>
	/*
	 * using the theme ayu mirage
	 * https://github.com/ayu-theme/ayu-colors
	 */

	main {
		top: 0;
		left: 0;
		display: block;
		width: 100%;
		background-color: #1f2430;
		position: absolute;
	}
	section {
		padding-left: 5em;
		padding-top: 4em;
		padding-bottom: 2em;
	}
	article {
		padding-left: 2em;
		width: 40%;
	}
	article a {
		color: #87d96c
	}
	article p {
		color: #cccac2;
	}
	footer {
		padding-top: 4em;
		padding-left: 5em;
		padding-bottom: 2em;
	}
	footer p {
		color: #cccac2;
	}
	footer h2 {
		color: #ffcc66;
		font-size: 2em;
		text-decoration: none;
		padding: 0;
		margin: 0;
	}

	section a {
		color: #80bfff;
		font-size: 2em;
		text-decoration: none;
	}
	section a:hover {
		background-color: #80bfff;
		color: #171b24;
	}

	section hr, footer hr {
		width: 40%;
		margin-left: 0;
		color: #8a919959;
	}

	#navMainDiv > a {
		color: #cccac2;
		text-decoration: none;
		font-size: 1.1em;
		margin: auto;
	}
	#navMainDiv > a:hover {
		color: #1f2430;
		background-color: #cccac2;
	}
	#navMainDiv > h2 {
		color: #ff6666;
		align-self: flex-start;
		margin-top: auto;
	}
	#navMainDiv {
		display: inline-flex;
		width: 40%;
		height: 2em;
		justify-content: space-evenly;
	}
	#navbackground {
		width: 100%;
		background-color: #171b24;
		position: fixed;
		top: 0;
		left: 0;
	}

	#aboutDiv {
		margin-left: auto;
		margin-top: auto;
		margin-bottom: auto;
		padding-right: 1em;
	}
	#aboutButton {
		color: #ffcc66;
		text-decoration: none;
		font-size: 1.1em;
	}
	#aboutButton:hover {
		background-color: #ffcc66;
		color: #1f2430;
	}
	nav {
		display: flex;
	}

</style>

<script>
	import {onMount} from 'svelte';

	onMount(() => {
		let html = document.getElementsByTagName("html")[0];
		html.style= "scroll-behavior: smooth;";
	});
	
</script>
