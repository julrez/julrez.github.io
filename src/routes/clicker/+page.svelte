<title> gaim gaming certified </title>
<link rel="icon" href="pack.png">

<script>
	let number = 0;
	let motivational, gaimuppgift, svarinput, inputbutoutput;
	let displaytype = "none";

	let upTwo = "²";
	let upThree = "³";

	let correctSvar;
	

	function setMotivational(text)
	{
		motivational.textContent = text;
	}

	function onSubmitSvar()
	{
		let input = svarinput.value;
		if ((Math.round(input*100)/100) == (Math.round(correctSvar*100)/100)) {
			setMotivational("Rätt svar! Så ska det se ut! Du får 50 gaim poäng");
			number += 50;
		} else {
			setMotivational("Fel svar! -50 gaim poäng");
			number -= 50;
		}
		console.log(input);
		console.log("korrekta svaret var: " + correctSvar);
		displaytype = "none";
	}

	function generateLinear()
	{
		let question = [];
		let k1, k2;
		do {
			k1 = Math.floor(Math.random() * 30)-15;
		} while (k1 == 0);
		do {
			k2 = Math.floor(Math.random() * 30)-15;
		} while(k2 == 0);
		if (k2 == k1) {
			k2 += 1;
		}

		let m1 = Math.floor(Math.random() * 30)-15;
		let m2 = Math.floor(Math.random() * 30)-15;

		question.push(`Det är dags för matte problem med linjära ekvationssystem! I vilken x koordinat korsas linjen y=${k1}x+${m1} med y=${k2}x+${m2}?`);

		let x = (m2-m1)/(k1-k2);
		question.push(x);

		return question;
	}

	function generateEquation()
	{
		let question = [];
		let answer = Math.floor(Math.random() * 100);
		/* in the form of ax^2+bx+c=right */
		let a, b, c;
		a = Math.floor((Math.random() * 8)-4);
		b = Math.floor((Math.random() * 30)-15);
		c = Math.floor((Math.random() * 30)-15);
		if ((b|a) == 0) {
			b = 1;
		}
		let right = a*answer*answer+b*answer+c;
		question.push(`Dags för ännu en matteuppgift! Lös ut x. x >= 0. ${a}x²+${b}x+${c}=${right}`);
		question.push(answer);
		return question;
	}

	function generateLinjeVinkelrät()
	{
		let question = [];

		/* y=ax+m*/
		let a = Math.floor((Math.random() * 40) - 20);
		if (a == 0) {
			a += 1;
		}
		let m = Math.floor((Math.random() * 40) - 20);

		let answer = -1/a;

		question.push(`Vilket k värde behövs för att skapa en vinkelrät linje mot denna linje? y=${a}x+${m}`);
		question.push(answer);
		return question;
	}

	function askQuestion()
	{
		let question;
		switch(Math.floor(Math.random() * 4)) {
		case 0: default:
			question = generateEquation();
			break;
		case 1:
			question = generateLinear();
			break;
		case 2:
			question = generateLinjeVinkelrät();
			break;
		}
		gaimuppgift.textContent = question[0];
		displaytype = "block";

		correctSvar = question[1];
	}

	let currentGaimProgress = 0;
	function addToNumber()
	{
		number += 1;
		currentGaimProgress += 1;
		
		switch (number % 150) {
		case 30:
			setMotivational("Du klara det!");
			break;
		case 75:
			setMotivational("ge aldrig upp");
			break;
		case 100:
			setMotivational("nästan där");
			break;
		default:
		break;
		}

		if (currentGaimProgress > 20) {
			askQuestion();
			currentGaimProgress = 0;
		}
	}

	let currentCalcStoredValue = 0;
	let currentCalcState = 0; /* just cleared */

	let currentCalcNumber = "";
	function onCalculatorButton(button)
	{
		let id = button.explicitOriginalTarget.id;
		console.log(id);
		switch (id) {
			case "0": case "1": case "2": case "3": case "4":
			case "5": case "6": case "7": case "8": case "9":
			case ".":
			currentCalcNumber += id;
			inputbutoutput.value = currentCalcNumber;
			break;
		case "+":
			currentCalcStoredValue = inputbutoutput.value;
			currentCalcState = 1;
			currentCalcNumber = "";
			inputbutoutput.value = "+";
			break;
		case "-":
			currentCalcStoredValue = inputbutoutput.value;
			currentCalcState = 2;
			currentCalcNumber = "";
			inputbutoutput.value = "-";
			break;
		case "*":
			currentCalcStoredValue = inputbutoutput.value;
			currentCalcState = 3;
			currentCalcNumber = "";
			inputbutoutput.value = "*";
			break;
		case "/":
			currentCalcStoredValue = inputbutoutput.value;
			currentCalcState = 4;
			currentCalcNumber = "";
			inputbutoutput.value = "/";
			break;
		case "ENTER":
			// calculate state
			if (currentCalcState == 0) {
				break;
			} else if (currentCalcState == 1) {
				currentCalcStoredValue = parseFloat(currentCalcStoredValue) + parseFloat(currentCalcNumber);
			} else if (currentCalcState == 2) {
				currentCalcStoredValue = parseFloat(currentCalcStoredValue) - parseFloat(currentCalcNumber);
			} else if (currentCalcState == 3) {
				currentCalcStoredValue = parseFloat(currentCalcStoredValue) * parseFloat(currentCalcNumber);
			} else if (currentCalcState == 4) {
				currentCalcStoredValue = parseFloat(currentCalcStoredValue) / parseFloat(currentCalcNumber);
			}
			inputbutoutput.value = currentCalcStoredValue.toString();
			currentCalcStoredValue = 0;
			currentCalcState = 0;
			currentCalcNumber = "";
			break;
		case "CLEAR":
			inputbutoutput.value = 0;
			currentCalcStoredValue = 0;
			currentCalcState = 0;
			currentCalcNumber = "";
			break;
		case "√":
			console.log(inputbutoutput.value);
			currentCalcNumber = Math.sqrt(parseFloat(inputbutoutput.value)).toString();
			inputbutoutput.value = currentCalcNumber;
			break;
		case "(-)":
			currentCalcNumber = "-" + currentCalcNumber;
			inputbutoutput.value = currentCalcNumber;
			break;
		}
	}
</script>
<style>
	.gaim {
		user-select: none;
		border: none;
	}
	.flex-main {
		display: flex;
	}
	.flex {
		flex: 1;
	}
	.flex:first-child {
		margin-right: 20px;
	}
	.flex:not(:first-child) {
		display: var(--set-display-type);
	}
	.mid {
		margin: auto;
	}
	/*
	body {
		background-image: url('pack.png');
		background-size: 100% 100%;
	}
	span {
		background-color: #ffffffff
	}
	*/
</style>

<body>
<h1>gaim clicker</h1>

<section class="flex-main" style="--set-display-type: {displaytype}">
	<section class="flex first">
		<button on:click={addToNumber} class="gaim"><img src="pack.png"></button>

		<h3>{number} gaim gaming points</h3>

		<span bind:this={motivational}></span>
	</section>
	<section class="flex second">
		<h2>gaiming</h2>
		<span bind:this={gaimuppgift}></span>
		<br> <br>
		<p>Skriv det korrekta svaret här:</p>
		<input type="text" id="svaret" name="svaret" bind:this={svarinput}>
		<button on:click={onSubmitSvar}>skicka svaret</button>
	</section>
	<section class="flex fourth">
		<h2 class="mid">gaimteckningar</h2>
		<textarea></textarea>
	</section>
	<section class="flex third">
		<h2 class="mid">gaimculator</h2>
		<button on:click={onCalculatorButton} id="1" >1</button>
		<button on:click={onCalculatorButton} id="2" >2</button>
		<button on:click={onCalculatorButton} id="3" >3</button>
		<button on:click={onCalculatorButton} id="+" >+</button><br>
		<button on:click={onCalculatorButton} id="4" >4</button>
		<button on:click={onCalculatorButton} id="5" >5</button>
		<button on:click={onCalculatorButton} id="6" >6</button>
		<button on:click={onCalculatorButton} id="-" >-</button><br>
		<button on:click={onCalculatorButton} id="7" >7</button>
		<button on:click={onCalculatorButton} id="8" >8</button>
		<button on:click={onCalculatorButton} id="9" >9</button>
		<button on:click={onCalculatorButton} id="*" >*</button><br>
		<button on:click={onCalculatorButton} id="0" >0</button>
		<button on:click={onCalculatorButton} id="." >.</button>
		<button on:click={onCalculatorButton} id="(-)" >(-)</button>
		<button on:click={onCalculatorButton} id="/" >/</button><br>
		<button on:click={onCalculatorButton} id="ENTER" >ENTER</button>
		<button on:click={onCalculatorButton} id="√" >√</button><br>
		<button on:click={onCalculatorButton} id="CLEAR" >CLEAR</button><br>
		<input type="input" value=0 readonly bind:this={inputbutoutput}>
	</section>
</section>
</body>
