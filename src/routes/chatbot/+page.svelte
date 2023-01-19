<title>Chat thing</title>
<main id="background">
	<h1>Chat thing with eliza bot</h1>
	<button id="resetButton" on:click={reset}>Reset chat</button>
	<section readonly id="messageArea">
		{#each messages as currentMessage}
			<article class={currentMessage.class}>
				<p>{currentMessage.text}</p>
			</article>
		{/each}
		<div id="padding">
		</div>
	</section>
	<textarea tabindex=1 id="inputArea" bind:value={textareaContent}></textarea>
</main>

<script>
	import "elizabot"
	import ElizaBot from "elizabot"
	import {onMount} from "svelte";
	import {writable} from "svelte/store"

	let textareaContent;

	let messages = [ ];

	let eliza;

	function reset()
	{
		messages = [];
		eliza.reset();
		sendMessage(eliza.getInitial(), "leftMessage");
	}

	function sendMessage(messageText, classType)
	{
		messages.push({
			text: messageText,
			class: classType
		});
		messages = [...messages];
		localStorage.setItem("messages", JSON.stringify(messages));
		
		console.log(localStorage.getItem("messageCount"));
	}

	onMount(() => {
		let html = document.getElementsByTagName("html")[0];
		html.style= "scroll-behavior: smooth;";

		eliza = new ElizaBot();
		const storedSession = localStorage.getItem("messages", messages);
		if (storedSession == undefined) {
			reset();
		} else {
			messages = [...JSON.parse(storedSession)];
		}

		addEventListener("keypress", (event) => {
			if (event.key == "Enter") {
				sendMessage(textareaContent, "rightMessage");
				let oldContent = textareaContent;
				textareaContent = "";
				event.preventDefault(); // prevent newline in textarea
				setTimeout(() => {
					let reply = eliza.transform(oldContent);
					sendMessage(reply, "leftMessage");
					setTimeout(() => {
						document.getElementById("messageArea").scroll({
							top: 1000000,
							right: 0,
							behaviour: "smooth"
						});
					}, 100);
				}, 1000);
			}
		});
	});
</script>

<style>
	#padding {
		height: 30vh;
	}
	p {
		z-index: 5;
	}
	#resetButton {
		position: fixed;
		font-size: 2em;
		right: 2em;
		top: 2em;
		background-color: #12151cb3;
		color: #707a8c;
		border: 0.5vw solid #707a8c;
	}
	#resetButton:hover {
		background-color: #707a8c;
		color: #12151cb3;
		border: 0.5vw solid #12151cb3;
	}
	.leftMessage {
		width: 25vw;
		margin-top: 1vw;
		margin-left: 1vw;
		padding-top: 0.5vh;
		padding-bottom: 0.5vh;
		background-color: #69758c1f;
		border-radius: 0.7vw;
		border-bottom-left-radius: 0;
		margin-bottom: 1vh;
	}
	article p {
		padding-left: 1vw;
		color: #fcfcfc;
	}
	.rightMessage {
		width: 25vw;
		margin-top: 1vh;
		margin-left: 34vw;
		padding-top: 0.5vh;
		padding-bottom: 0.5vh;
		background-color: #409fff40;
		border-radius: 0.7vw;
		border-bottom-right-radius: 0;
		margin-bottom: 1vh;
	}
	h1 {
		display: block;
		margin: auto;
		color: #97d96c;
		padding-top: 1vh;
		padding-bottom: 1vh;
		text-align: center;
	}
	#background {
		position: absolute;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background-color: #1f2430;
	}
	#messageArea {
		margin: auto;
		display: block;
		width: 60vw;
		height: 70vh;
		background-color: #1c212b;
		border-radius: 0.5vw;
		resize: both;
		overflow: auto;
	}
	#inputArea {
		border: 2px solid #242936;
		outline: 0;
		color: #fcfcfc;
		vertical-align: text-top;
		position: relative;
		top: 1vh;
		margin: auto;
		display: blocK;
		width: 20vw;
		height: 10vh;
		background-color: #1c212b;
		border-radius: 0.5vw;
	}
	#inputArea:focus {
		border: 2px solid #ff6666;
	}
</style>
