<script>

	let content = "";

	let textTags = [
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"p",
		"b",
		"strong",
		"i",
		"em",
		"mark",
		"del",
		"ins",
		"sub",
		"sup",
	];
	let fonts = [
		"Arial",
		"Verdana",
		"Tahoma",
		"Trebuchet MS",
		"Times New Roman",
		"Georgia",
		"Garamond",
		"Courier New",
		"Brush Script MT",
	];

	let todos = ["add an element"];
	
	let bodyRed, bodyGreen, bodyBlue;

	let currText = "";

	console.logs = [];

	function add_background()
	{
		bodyRed = Math.floor(Math.random()*256);
		bodyGreen = Math.floor(Math.random()*256);
		bodyBlue = Math.floor(Math.random()*256);
	}

	function add_text(str, id=false)
	{
		let tag = textTags[Math.floor(Math.random()*textTags.length)];
		let fontSize = Math.floor(Math.random()*200);
		let r = Math.floor(Math.random()*256);
		let g = Math.floor(Math.random()*256);
		let b = Math.floor(Math.random()*256);
		let font = fonts[Math.floor(Math.random()*fonts.length)];
		let rotation = Math.random()*360;
		let newStr = "";
		newStr += "<" + tag + " style=\"" + "font-size: " + fontSize + "px; color: rgb(" + r + ", " + g + ", " + b + "); font-family: " + font + "; transform: rotate(" + rotation + "deg);\" "
		if (id !== false) {
			newStr += " onclick={console.logs.push("+id+");}";
		}
		newStr += ">" + str + "</" + tag + ">";
		return newStr;
	}

	function add_todo(str, id)
	{
		return add_text(str, id);
	}

	function add_button(str)
	{
		let rotation = Math.random()*360;

		return "<button style=\"transform: rotate(" + rotation + "deg);\">" + str + "</button>";
	}

	function add_text_area(str)
	{
		return "<span id=\"epictext\"></span>"
	}

	function set_web_content()
	{
		content = "";
		add_background();

		content += add_text("EPIC todo website");
		
		for (let i = 0; i < todos.length; i++) {
			let id = todos[i];
			content += add_todo(todos[i], i);
		}

		content += add_button("add todo element");

		content += add_text_area("epic todo");
	}

	function handleInput()
	{
		let newTodos = [...todos];
		for (let i = 0; i < console.logs.length; i++) {
			let id = todos[i];
			let index = todos.indexOf(id);
			if (index != -1) {
				newTodos.splice(newTodos.indexOf(id), 1);
			}
		}
		todos = [...newTodos];
		
		console.logs.length = 0;
		
		document.getElementById("epictext").textContent = currText;
	}
	
	import {onMount} from 'svelte';
	onMount(() => {
		set_web_content();

		document.addEventListener('keydown', function(event) {
			if (event.key == "Backspace") {
				currText.length -= 1;
			} else if (event.key == "Enter") {
				todos.push(currText);
				currText = "";
			} else { // TODO: lowercase and uppercase only
				currText += event.key;
			}
		});
		let s = setInterval(handleInput, 10);
		let t = setInterval(set_web_content, 100);
	});
</script>

<title>Click on todo to remove it</title>

<body style="background-color: rgb({bodyRed}, {bodyGreen}, {bodyBlue}); width: 100%; height: 100%; margin: 0; min-height: 100%; min-width: 100%; position: fixed; padding: none; top: 0; left: 0">
	{@html content}
</body>
