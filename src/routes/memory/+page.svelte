<script>
	let score = 0;
	let images = [
		"pieceset/bB.svg", "pieceset/bQ.svg", "pieceset/bK.svg", "pieceset/bN.svg",
		"pieceset/bP.svg", "pieceset/bR.svg", "pieceset/wB.svg", "pieceset/wQ.svg",
		"pieceset/wK.svg", "pieceset/wN.svg", "pieceset/wP.svg", "pieceset/wR.svg",
	];
	let cards = [];
	function insert_card(cardId, availablePlaces)
	{
		let placeIndex = Math.floor(Math.random()*availablePlaces.length);
		let place = availablePlaces[placeIndex];
		cards[place] = {
			id: cardId,
			img: images[cardId],
			flipped: false,
			completed: false,
		};
		availablePlaces.splice(placeIndex, 1);
	}
	function generate_cards()
	{
		cards = [];
		let availablePlaces = [];
		for (let i = 0; i < 16; i++) {
			cards.push(-1);
			availablePlaces.push(i);
		}
		for (let index = 0; index < 8; index++) {
			let cardId = Math.floor(Math.random()*images.length);
			insert_card(cardId, availablePlaces);
			insert_card(cardId, availablePlaces);
		}
	}
	generate_cards();

	let flipcount = 0;
	let oldCard = -1;
	let isWaiting = false;
	function flip(card)
	{
		if (isWaiting) {
			return;
		}
		if (!card.flipped && flipcount < 2) {
			card.flipped = true;
			flipcount += 1;

			if (flipcount == 2) {
				if (oldCard && oldCard.id == card.id) {
					flipcount = 0;
					card.completed = true;
					oldCard.completed = true;
				} else {
					isWaiting = true;
					setTimeout(() => {
						cards.forEach((card) => {
							card.flipped = card.completed;
						});
						cards = cards;
						isWaiting = false;
					}, 1000);
				}
				flipcount = 0;
			}
			oldCard = card;
			cards = cards;
		}
		let completeCount = 0;
		for (let i = 0; i < 16; i++) {
			if (cards[i].completed) {
				completeCount += 1;
			}
		}
		if (completeCount == 16) {
			score += 1;
			flipcount = 0;
			oldCard = -1;
			isWaiting = true;
			setTimeout(() => {
				cards.forEach((card) => {
					card.completed = false;
					card.flipped = false;
				});
				cards = cards;
			}, 1000);
			setTimeout(() => {
				generate_cards();
				isWaiting = false;
			}, 2000);
		}
	}
</script>

<head>
	<title>Memory thing</title>
</head>

<h1>Memory</h1>
<div id="mainDiv">
	<div id="paddingDiv">
	</div>
	<main>
		<div class="row">
			{#each cards as card, i}
			<div
				on:click={() => {flip(card);}}
				on:keypress={() => { flip(card); }}
				class:flipped={card.flipped}
				class="card"
			>
				<img class="front" src={card.img} alt="" />
				<img class="back" src="front.webp" alt="" />
			</div>
			{/each}
		</div>
	</main>
	<div id="scoreDiv">
		<p>Score: {score}</p>
	</div>
</div>

<style>
	#mainDiv {
		display: flex;
		justify-content: center;
	}
	#scoreDiv {
		margin: auto;
		margin-top: 0;
		flex: 1;
	}
	#scoreDiv p {
		text-align: center;
		font-size: 2em;
	}
	#paddingDiv {
		margin: auto;
		flex: 1;
	}
	h1 {
		text-align: center;
	}
	main {
		flex: 1;
		margin: auto;
		margin-top: 50px;
		display: flex;
		place-content: center;
		place-items: center;
	}

	.row {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(4, 100px);
		grid-template-rows: repeat(4, 100px);
	}

	.card {
		border: 1px solid black;
		cursor: pointer;
		transition: transform 1s;
		transform-style: preserve-3d;
		width: 100%;
		height: 100%;
	}

	.card.flipped {
		transform: rotateY(180deg);
	}

	.card .back {
		transform: rotateY(0deg);
	}

	.card .front {
		transform: rotateY(180deg);
	}

	.card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		position: absolute;
		pointer-events: none;
		user-select: none;
	}
</style>
