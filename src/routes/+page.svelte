<title>julrez webistes</title>

<main>
	<div id="navbackground">
		<nav>
			<h2 id="name">julrez.github.io</h2>
			<a href="#clicker">clicker</a>
			<a href="#todo">todo</a>
			<a href="#telltale">telltale</a>
			<a href="#chess">chess</a>
			<a href="#memory">memory</a>
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
	article p {
		color: #cccac2;
	}

	section a {
		color: #80bfff;
		font-size: 2em;
		text-decoration: none;
		scroll-behavior: smooth;
	}
	section a:hover {
		background-color: #80bfff;
		color: #171b24;
	}
	section hr {
		width: 40%;
		margin-left: 0;
		color: #8a919959;
	}

	nav a {
		color: #cccac2;
		margin: auto;
		text-decoration: none;
		font-size: 1.1em;
	}
	nav a:hover {
		color: #1f2430;
		background-color: #cccac2;
	}
	nav h2 {
		color: #ff6666;
		align-self: flex-start;
		margin-top: auto;
	}
	nav {
		display: block;
		display: flex;
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

</style>
