<head>
	<title>chess but epic</title>
</head>
<script>
	// TODO: only snake case in functions
	import {onMount} from 'svelte';

	// (TODO: not used in chess engine)
	let boardArray;

	let gameInfo = {
		"color": 0, // color of the player, 0=nothing, 1=white, 2=black
		"turn": 0, // whose turn it is, 0 = no game or game ended, 1=white, 2=black
		"lastMove": -1, // for en passant
	};

	let cursorPosX = 0;
	let cursorPosY = 0;
	let cursorImg = "transparent.png";
	let cursorStyle = "top: 0px; left: 0px;";

	let square1Color = "#97b2c7";
	let square2Color = "#546f82";

	let plusImg = "plus-square.svg";
	let flagImg = "flag.svg"

	// if 0-63 then it is the piece the cursor selected
	let pieceSelected = -1;

	// from, to
	let animations = [];

	function convert_simple_to_engine_board()
	{
	}
	
	// color: (0=nothing, 1=white, 2=black), piece
	function setup_board(color)
	{
		// TODO: rook and king has moved entry
		if (color == 1) {
			boardArray = [
				[2, "rook"], [2, "knight"], [2, "bishop"], [2, "queen"], [2, "king"], [2, "bishop"], [2, "knight"], [2, "rook"],
				[2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"],
				[1, "rook"], [1, "knight"], [1, "bishop"], [1, "queen"], [1, "king"], [1, "bishop"], [1, "knight"], [1, "rook"],
			];
		} else {
			boardArray = [
				[1, "rook"], [1, "knight"], [1, "bishop"], [1, "king"], [1, "queen"], [1, "bishop"], [1, "knight"], [1, "rook"],
				[1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"], [1, "pawn"],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""], [0, ""],
				[2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"], [2, "pawn"],
				[2, "rook"], [2, "knight"], [2, "bishop"], [2, "king"], [2, "queen"], [2, "bishop"], [2, "knight"], [2, "rook"],
			];
		}
	}

	// returns true on success, false on fail
	function is_move_legal(color, from, to)
	{
		if (boardArray[from][0] != color
				|| boardArray[to][0] == color
				|| from == to) {
			return false;
		}

		let start, end;
		if (to > from) {
			start = from;
			end = to;
		} else {
			start = to;
			end = from;
		}
		let fromPos = [Math.floor(from%8), Math.floor(from/8)];
		let toPos = [Math.floor(to%8), Math.floor(to/8)];
		let distances = [toPos[0]-fromPos[0], toPos[1]-fromPos[1]];
		let absDistances = [Math.abs(distances[0]), Math.abs(distances[1])];
		let addition = Math.sign(distances[0])+Math.sign(distances[1])*8;
		switch (boardArray[from][1]) {
			case "pawn":
				if (distances[0] == 0) {
					if (distances[1] == -1 && boardArray[to][0] == 0) {
						return true;
					}
					if (distances[1] == -2
						&& (fromPos[1] == 1 || fromPos[1] == 6 )
						&& boardArray[to][0] == 0) {
						return true;
					}
				}
				if (absDistances[0] == 1) {
					if (distances[1] == -1 && boardArray[to][0] != 0) {
						return true;
					}
				}
				return false;
			case "rook":
				// is on same row?
				if (Math.floor(from/8) == Math.floor(to/8)) {
					for (let i = start+1; i < end; i+=1) {
						if (boardArray[i][0] != 0) {
							return false;
						}
					}
					return true;
				}
				// is on same column?
				if (Math.floor(from%8) == Math.floor(to%8)) {
					for (let i = start+8; i < end; i+=8) {
						if (boardArray[i][0] != 0) {
							return false;
						}
					}
					return true;
				}
				return false;
			case "bishop":
				// column, row
				if (absDistances[0] != absDistances[1]) {
					return false;
				}
				for (let i = from+addition; i != to; i+=addition) {
					if (boardArray[i][0] != 0) {
						return false;
					}
				}
				return true;
			case "queen":
				if (absDistances[0] != 0 && absDistances[1] != 0 && absDistances[0] != absDistances[1]) {
					return false;
				}
				for (let i = from+addition; i != to; i+=addition) {
					if (boardArray[i][0] != 0) {
						return false;
					}
				}
				return true;
			case "king":
				// TODO: check checks
				if (absDistances[0] < 2 && absDistances[1] < 2) {
					return true;
				} else {
					return false;
				}
			case "knight":
				if ((absDistances[0] == 1 && absDistances[1] == 2)
					|| (absDistances[0] == 2 && absDistances[1] == 1)) {
					return true;
				} else {
					return false;
				}
			default: // TODO: return false
				return true;
		}
	}

	// move = [from, to]
	function make_move(move, color)
	{
		let from = move[0];
		let to = move[1];
		boardArray[to] = boardArray[from];
		boardArray[from] = [0, ""];
		gameInfo.lastMove = [from, to];
		// TODO: if en passant, if castling
		// TODO: animations
		if (gameInfo.color != gameInfo.turn) {
			make_piece_animation(from, to);
		}

		// TODO: if checkmate -> end game
		// if stalemate -> end game
		gameInfo.turn = ((gameInfo.turn-1)^1)+1;

		// make ai move
		if (gameInfo.color != gameInfo.turn) {
			make_chess_engine_move(gameInfo.turn);
		}
	}

	// TODO: return "checkmate" or "stalemate"
	function generate_legal_moves(color)
	{
		let legalMoves = [];
		let enemyColor = ((color-1)^1)+1;

		// generate psuedo-legal moves
		for (let i = 0; i < 63; i++) {
			let col = i % 8;
			let row = Math.floor(i / 8);

			if (boardArray[i][0] != color) {
				continue;
			}
			switch (boardArray[i][1]) {
				case "pawn":
					if (boardArray[i+8][0] == 0) {
						legalMoves.push([i, i+8]);
					}
					if (boardArray[i+8][0] == 0 && boardArray[i+16][0] == 0 && row == 1) {
						legalMoves.push([i, i+16]);
					}
					if (col != 0 && boardArray[i+8-1][0] == enemyColor) {
						legalMoves.push([i, i+8-1]);
					}
					if (col != 7 && boardArray[i+8+1][0] == enemyColor) {
						legalMoves.push([i, i+8+1]);
					}
					// TODO: en passant
					break;
				case "king":
					for (let x = 0; x < 3; x++) {
						for (let y = 0; y < 3; y++) {
							if ((x == 1 && y == 1)
									|| (col == 0 && x == 0)
									|| (col == 7 && x == 2)) {
								continue;
							}
							let index = i-1-8+x+y*8;
							if (index >= 0 && index < 64
									&& boardArray[index][0] != color) {
								legalMoves.push([i, index]);
							}
						}
					}
					break;
				case "knight":
					if (col > 1 && row < 7 && boardArray[i+8-2][0] != color) {
						legalMoves.push([i, i+8-2]);
					}
					if (col < 6 && row < 7 && boardArray[i+8+2][0] != color) {
						legalMoves.push([i, i+8+2]);
					}
					if (col < 6 && row > 0 && boardArray[i-8+2][0] != color) {
						legalMoves.push([i, i-8+2]);
					}
					if (col > 1 && row > 7 && boardArray[i-8-2][0] != color) {
						legalMoves.push([i, i-8-2]);
					}
					if (col < 7 && row < 6 && boardArray[i+16+1][0] != color) {
						legalMoves.push([i, i+16+1]);
					}
					if (col > 0 && row < 6 && boardArray[i+16-1][0] != color) {
						legalMoves.push([i, i+16-1]);
					}
					if (col < 7 && row > 1 && boardArray[i-16+1][0] != color) {
						legalMoves.push([i, i-16+1]);
					}
					if (col > 0 && row > 1 && boardArray[i-16-1][0] != color) {
						legalMoves.push([i, i-16-1]);
					}
					break;
				case "bishop":
					for (let x = col+1, y=row+1; x<8 && y<8; x++,y++) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let x = col-1, y=row+1; x>-1 && y<8; x--,y++) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let x = col+1, y=row-1; x<8 && y>-1; x++,y--) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let x = col-1, y=row-1; x>-1 && y>-1; x--,y--) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					break;
				case "queen":
					for (let x = col+1, y=row+1; x<8 && y<8; x++,y++) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let x = col-1, y=row+1; x>-1 && y<8; x--,y++) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let x = col+1, y=row-1; x<8 && y>-1; x++,y--) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let x = col-1, y=row-1; x>-1 && y>-1; x--,y--) {
						let j = x+y*8;
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					// fallthrough
				case "rook":
					for (let j = col+1+row*8; j < 8+row*8; j+=1) {
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let j = col-1+row*8; j > row*8-1; j-=1) {
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let j = col+row*8+8; j < 7*8+1; j+=8) {
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					for (let j = col+row*8-8; j > -1; j-=8) {
						let val = boardArray[j][0];
						if (val != color) legalMoves.push([i, j]);
						if (val != 0) break;
					}
					break;
			}
		}
		// confirm if they are legal (king is not under attack)
		// TODO: also order: checks, captures, attacks, developing, pawn

		return legalMoves;
	}

	// the stupid chess engine
	function make_chess_engine_move(color)
	{
		console.log("attempting move");
		let legalMoves = generate_legal_moves(color);
		if (legalMoves.length > 0) {
			make_move(legalMoves[Math.floor(Math.random()
				* legalMoves.length)], color);
		} else {
			console.log("no legal moves");
		}
	}

	function new_game()
	{
		gameInfo.color = Math.floor(Math.random() * 2)+1;
		gameInfo.turn = 1;
		gameInfo.lastMove = -1;
		setup_board(gameInfo.color);
		showPieces();
		if (gameInfo.color == 2) {
			make_chess_engine_move(1);
		}
		showPieces();
	}

	function resign_game()
	{
		gameInfo.turn = 0;
	}

	function getPieceUrl(color, piece)
	{
		let url = "pieceset/b";
		if (color == 1) {
			url = "pieceset/w";
		}
		switch (piece) {
		default:
			url = 0;
			break;
		case "rook":
			url += "R.svg";
			break;
		case "knight":
			url += "N.svg";
			break;
		case "bishop":
			url += "B.svg";
			break;
		case "pawn":
			url += "P.svg";
			break;
		case "king":
			url += "K.svg";
			break;
		case "queen":
			url += "Q.svg";
			break;
		}
		return url;
	}

	function pieceOnClick(hit)
	{
		let num = parseInt(hit.target.id.slice(6, hit.target.id.length));
		if (boardArray[num][0] != 0 && boardArray[num][0] == gameInfo.color) {
			if (gameInfo.color != gameInfo.turn) {
				return;
			}
			pieceSelected = num;
			showPieces();
			cursorImg = getPieceUrl(boardArray[num][0], boardArray[num][1]);
		}
	}

	function onMouseUp(hit)
	{
		let elementId = hit.target.id;
		if (elementId.slice(0, 6) == "square"
				&& pieceSelected != -1
				&& gameInfo.color == gameInfo.turn) {
			let num = parseInt(elementId.slice(6, elementId.length));
			if (is_move_legal(gameInfo.color, pieceSelected, num)) {
				// TODO: is move legal?
				/*
				boardArray[num] = boardArray[pieceSelected];
				boardArray[pieceSelected] = [0, ""];
				*/
				make_move([pieceSelected, num], gameInfo.color);
			}
		}
		pieceSelected = -1;
		showPieces();
		cursorImg = "transparent.png";
	}

	function onMouseMove(event)
	{
		const wh = Math.min(
			Math.max(
				document.documentElement.clientWidth || 0,
				window.innerWidth || 0),
			Math.max(
				document.documentElement.clientHeight || 0,
				window.innerHeight || 0)
		);
		const pieceSize = wh/100.0*10;
		const halfPieceSize = pieceSize*0.5;
		cursorStyle = "top: "+(event.pageY-halfPieceSize)+"px; left: "+(event.pageX-halfPieceSize)+"px;";
	}

	function make_piece_animation(from, to)
	{
		let element = document.createElement("img");
		element.src = getPieceUrl(boardArray[to][0], boardArray[to][1]);
		element.style = 'width: 10vmin; height: 10vmin;'
			+ 'position: absolute; z-index: 1;'
			+ 'pointer-events: none; user-select: none;';
		// TODO: setInterval to remove object
			console.log("mainbody");
		document.getElementById("mainbody").appendChild(element);

		animations.push([from, to]);

		let timeAtStart = new Date().getTime();
		let time = 600;
		let delay = 5;
		let id = setInterval(function() {
			const wh = Math.min(
				Math.max(
					document.documentElement.clientWidth || 0,
					window.innerWidth || 0),
				Math.max(
					document.documentElement.clientHeight || 0,
					window.innerHeight || 0)
			);
			const pieceSize = wh/100.0*10;

			let t = (new Date().getTime()-timeAtStart)/time;

			let startCol = Math.floor(from%8);
			let startRow = Math.floor(from/8);
			let endCol = Math.floor(to%8);
			let endRow = Math.floor(to/8);

			let col = startCol + t*(endCol-startCol);
			let row = startRow + t*(endRow-startRow);

			console.log("board");
			let board = document.getElementById("chessboard");
			let posx = board.getBoundingClientRect().left + col*pieceSize;
			let posy = board.getBoundingClientRect().top + row*pieceSize;
			element.style.left = posx + "px";
			element.style.top = posy + "px";
			if (new Date().getTime() - timeAtStart > time) {
				clearInterval(id);
				element.remove();
				let index = animations.indexOf([from, to]);
				animations.splice(index, 1);
				showPieces();
			}
		}, delay);

	}

	function showPieces()
	{
		for (let i = 0; i < 64; i++) {
			let skip = false;
			for (let j = 0; j < animations.length; j++) {
				if (animations[j][1] == i) { // to == i
					skip = true;
				}
			}
			let piece = "square"+i;
			let url = getPieceUrl(boardArray[i][0], boardArray[i][1]);
			if (skip) {
				url = 0;
			}
			let squareColor = square1Color;
			let j = i;
			let row = Math.floor(j / 8);
			if (row % 2) {
				j += 1;
			}
			if (j % 2) {
				squareColor = square2Color;
			}
			if (url != 0 && pieceSelected != i) {
				console.log("piece");
				document.getElementById(piece).style =
					'background: url('+url+') no-repeat center/10vmin, ' + squareColor;
			} else {
				console.log("piece2");
				document.getElementById(piece).style = 'background-color: ' + squareColor;
			}
		}
	}

	onMount(() => {
		new_game();

		addEventListener('mouseup', (event) => {onMouseUp(event);});
		addEventListener('mousemove', (event) => {onMouseMove(event);});
	});
</script>
<body id="mainbody">
	<div class="flexthing">
		<div class="leftmenu">
			<h1>Chess 2</h1>
		</div>
		<div class="chessboard" id="chessboard">
			<div class="rank">
				<span id="square0"  on:mousedown={pieceOnClick}></span>
				<span id="square1"  on:mousedown={pieceOnClick}></span>
				<span id="square2"  on:mousedown={pieceOnClick}></span>
				<span id="square3"  on:mousedown={pieceOnClick}></span>
				<span id="square4"  on:mousedown={pieceOnClick}></span>
				<span id="square5"  on:mousedown={pieceOnClick}></span>
				<span id="square6"  on:mousedown={pieceOnClick}></span>
				<span id="square7"  on:mousedown={pieceOnClick}></span>
			</div>
			<div class="rank">
				<span id="square8"  on:mousedown={pieceOnClick}></span>
				<span id="square9"  on:mousedown={pieceOnClick}></span>
				<span id="square10" on:mousedown={pieceOnClick}></span>
				<span id="square11" on:mousedown={pieceOnClick}></span>
				<span id="square12" on:mousedown={pieceOnClick}></span>
				<span id="square13" on:mousedown={pieceOnClick}></span>
				<span id="square14" on:mousedown={pieceOnClick}></span>
				<span id="square15" on:mousedown={pieceOnClick}></span>
			</div>
			<div class="rank">
				<span id="square16" on:mousedown={pieceOnClick}></span>
				<span id="square17" on:mousedown={pieceOnClick}></span>
				<span id="square18" on:mousedown={pieceOnClick}></span>
				<span id="square19" on:mousedown={pieceOnClick}></span>
				<span id="square20" on:mousedown={pieceOnClick}></span>
				<span id="square21" on:mousedown={pieceOnClick}></span>
				<span id="square22" on:mousedown={pieceOnClick}></span>
				<span id="square23" on:mousedown={pieceOnClick}></span>
			</div>
			<div class="rank">
				<span id="square24" on:mousedown={pieceOnClick}></span>
				<span id="square25" on:mousedown={pieceOnClick}></span>
				<span id="square26" on:mousedown={pieceOnClick}></span>
				<span id="square27" on:mousedown={pieceOnClick}></span>
				<span id="square28" on:mousedown={pieceOnClick}></span>
				<span id="square29" on:mousedown={pieceOnClick}></span>
				<span id="square30" on:mousedown={pieceOnClick}></span>
				<span id="square31" on:mousedown={pieceOnClick}></span>
			</div>
			<div class="rank">
				<span id="square32" on:mousedown={pieceOnClick}></span>
				<span id="square33" on:mousedown={pieceOnClick}></span>
				<span id="square34" on:mousedown={pieceOnClick}></span>
				<span id="square35" on:mousedown={pieceOnClick}></span>
				<span id="square36" on:mousedown={pieceOnClick}></span>
				<span id="square37" on:mousedown={pieceOnClick}></span>
				<span id="square38" on:mousedown={pieceOnClick}></span>
				<span id="square39" on:mousedown={pieceOnClick}></span>
			</div>
			<div class="rank">
				<span id="square40" on:mousedown={pieceOnClick}></span>
				<span id="square41" on:mousedown={pieceOnClick}></span>
				<span id="square42" on:mousedown={pieceOnClick}></span>
				<span id="square43" on:mousedown={pieceOnClick}></span>
				<span id="square44" on:mousedown={pieceOnClick}></span>
				<span id="square45" on:mousedown={pieceOnClick}></span>
				<span id="square46" on:mousedown={pieceOnClick}></span>
				<span id="square47" on:mousedown={pieceOnClick}></span>
			</div>
			<div class="rank">
				<span id="square48" on:mousedown={pieceOnClick}></span>
				<span id="square49" on:mousedown={pieceOnClick}></span>
				<span id="square50" on:mousedown={pieceOnClick}></span>
				<span id="square51" on:mousedown={pieceOnClick}></span>
				<span id="square52" on:mousedown={pieceOnClick}></span>
				<span id="square53" on:mousedown={pieceOnClick}></span>
				<span id="square54" on:mousedown={pieceOnClick}></span>
				<span id="square55" on:mousedown={pieceOnClick}></span>
			</div>
			<div class="rank">
				<span id="square56" on:mousedown={pieceOnClick}></span>
				<span id="square57" on:mousedown={pieceOnClick}></span>
				<span id="square58" on:mousedown={pieceOnClick}></span>
				<span id="square59" on:mousedown={pieceOnClick}></span>
				<span id="square60" on:mousedown={pieceOnClick}></span>
				<span id="square61" on:mousedown={pieceOnClick}></span>
				<span id="square62" on:mousedown={pieceOnClick}></span>
				<span id="square63" on:mousedown={pieceOnClick}></span>
			</div>
		</div>
		<div class="rightmenu">
			<h2>game</h2>
			<div class="newGameButton" on:click={new_game}></div>
			<div class="resignButton" on:click={resign_game}></div>
			<h2>clock</h2>
		</div>
	</div>
</body>
<img src={cursorImg} class="cursor" style={cursorStyle}>

<style>
	.newGameButton {
		width: 4vmin;
		height: 4vmin;
		background: url("plus-square.svg") center/4vmin no-repeat;
		display: inline-block;
	}
	.newGameButton:hover {
		background: url("plus-square2.svg") center/4vmin no-repeat;
	}
	.resignButton {
		width: 4vmin;
		height: 4vmin;
		background: url("flag.svg") center/4vmin no-repeat;
		display: inline-block;
	}
	.resignButton:hover {
		background: url("flag2.svg") center/4vmin no-repeat;
	}
	.cursor {
		width: 10vmin;
		height: 10vmin;
		position: absolute;
		pointer-events: none;
		user-select: none;
		z-index: 1;
	}
	h2 {
		color: #f9f9f9;
	}
	h1 {
		color: #f9f9f9;
	}
	p {
		color: #f9f9f9;
	}
	body {
		background-color: #161512;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;
		padding: none;
		margin: 0;
	}
	.flexthing {
		display: flex;
		justify-content: center;
		max-width: 100vw;
		max-height: 100vh;
	}
	.chessboard {
		user-select: none;
		margin: auto;
		padding: 0;
	}
	.leftmenu {
		margin: auto;
		padding: 0;
		text-align: center;
	}
	.rightmenu {
		margin: auto;
		padding: 0;
		text-align: center;
	}
	.rank {
		user-select: none;
		display: flex;
	}
	.rank span {
		user-select: none;
		display: block;
		width: 10vmin;
		height: 10vmin;
		white-space: nowrap;
		padding: 0;
		margin: 0;
	}
	@keyframe testthing {
		0% {left: 0px}
		100% {left: 800px}
	}
</style>
