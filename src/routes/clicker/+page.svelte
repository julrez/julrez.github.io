<canvas id="webglCanvas"></canvas>
<title>real engin</title>
<div id="crosshairLine1" class="crosshair">
</div>
<div id="crosshairLine2" class="crosshair">
</div>
<h1 id="header" class={headerClassName}>LINUS CLICKER</h1>
<h2 id="score" class="{scoreClassName}">{scoreText}</h2>
<div id="barcontainer">
	<img src="doomthing.png" id="bar">
	<img src={joepicture} id="joe">
	<h2 id="ammotext">YES</h2>
	<h2 id="healthtext">{health}</h2>
</div>
<img src="texture.png" id="jumpscare" style={jumpscareStyle}>

<style>
	#jumpscare {
		z-index: 500000000;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute;
	}
	#ammotext {
		position: absolute;
		left: 18%;
		bottom: 1vw;
		margin: 0;
		padding: 0;
		transform: translate(-50%, -50%);
		color: red;
		font-size: 5vw;
		z-index: 2;
	}
	#healthtext {
		position: absolute;
		left: 30%;
		bottom: 1vw;
		margin: 0;
		padding: 0;
		transform: translate(-50%, -50%);
		color: red;
		font-size: 5vw;
		z-index: 2;
	}
	#bar {
		width: 100%;
		margin: 0;
		padding: 0;
		left: 0;
		bottom: 0;
		position: absolute;
		z-index: 1;
	}
	#joe {
		z-index: 2;
		position: absolute;
		width: 8%;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 0);
		margin: 0;
		padding: 0;
	}
	.headerAnimationClass {
		animation: 10s ease-in headerAnimation;
	}
	#header {
		z-index: 3;

		width: 100%;
		position: absolute;
		top: 30%;
		left: 50%;

		opacity: 0;
		font-size: 10em;
		/*color: red;*/
		background: -webkit-linear-gradient(0deg, red, orange);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;

		margin: auto;
		text-align: center;
		transform: translate(-50%, -50%);
	}
	@keyframes headerAnimation {
		0% {
			opacity: 0;
		}
		25% {
			opacity: 100;
		}
		75% {
			opacity: 0;
		}
	}
	#score {
		z-index: 1;

		opacity: 0;
		width: 100%;
		position: absolute;
		top: 0%;
		left: 0%;

		font-size: 2em;
		color: gold;

		margin: 0;
		padding: 0;
	}
	@keyframes scoreAnimation {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.scoreAnimationClass {
		animation-duration: 10s;
		animation-timing-function: ease-in;
		animation-name: scoreAnimation;
		animation-fill-mode: forwards;
		animation-iteration-count: 1;
	}
	.crosshair {
		position: absolute;
		margin: auto;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		background-color: red;
	}
	#crosshairLine1 {
		width: 8px;
		height: 2px;
	}
	#crosshairLine2 {
		width: 2px;
		height: 8px;
	}
	canvas {
		position: fixed;
		top: 0;
		left: 0;
	}
</style>

<script>
	import {onMount} from 'svelte';
	import {glMatrix} from 'gl-matrix';
	import * as mat4 from 'gl-matrix/mat4';

	let headerClassName = "";
	let scoreClassName = "";
	let scoreText = "score: 0";
	let score = 0;
	let health = 3;
	let jumpscareStyle = "opacity: 0";
	let joepicture = "joe.jpg"

	let canvas, gl;

	let vertexShaderSource = `#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inUV;

uniform mat4 inModelMatrix;
uniform mat4 inViewMatrix;
uniform mat4 inProjectionMatrix;

out vec2 UV;


void main()
{
	gl_Position = inProjectionMatrix * inViewMatrix * inModelMatrix * vec4(inPosition, 1);
	UV = inUV.xy;
}
	`;
	let fragmentShaderSource = `#version 300 es
precision lowp float;

in vec2 UV;

uniform sampler2D albedo;

uniform float enableGreenscreen;

out vec4 outColor;

void main()
{
	//outColor = texture(albedo, vec2(gl_FragCoord.x/1920.0, gl_FragCoord.y/1080.0));
	vec4 color = texture(albedo, vec2(UV.x, UV.y));

#define threshold 0.55
#define padding 0.05
	if (enableGreenscreen > 0.5) {
		vec4 greenScreen = vec4(0, 1, 0, 1);
		vec3 diff = color.xyz - greenScreen.xyz;
		float fac = smoothstep(threshold-padding, threshold+padding, dot(diff,diff));
		color = mix(color, vec4(0, 0, 0, 1), 1.0-fac);
		if (fac < 0.1) {
			discard;
		}
	}
	
	outColor = color;
}
	`;
	
	let mousePitch = 0, mouseYaw = 270;
	let cameraPos = [0, 0, 5];
	let cameraAxis = [0, 0, -1];
	let keyIsPressed = {};
	//let playerVelocity = [0, 0, 0];
	let enemyAxis = [0, 0, -1];

	// bullet: [posX, posY, posZ, dirX, dirY, dirZ]
	let bullets = [];
	let enemies = [];

	// list of assets
	let effects = [];

	function create_shader(type, source)
	{
		let shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			return shader;
		} else {
			console.log("epic fail #2");
			console.log(gl.getShaderInfoLog(shader));
		}
	}

	function create_program(vertexShader, fragmentShader)
	{
		let program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
			return program;
		} else {
			console.log("epic fail #3");
			console.log(gl.getProgramInfoLog(program));
		}
	}

	function parse_float(file)
	{
		let float = parseFloat(file.str.slice(file.i));
		while (file.i < file.length) {
			switch (file.str[file.i]) {
				case '0': case '1': case '2': case '3': case '4':
				case '5': case '6': case '7': case '8': case '9':
				case '.': case '-':
					file.i++;
					break;
				default:
					return float;
			}
		}
		return float;
	}

	function parse_whitespace(file)
	{
		while (file.i < file.length &&
				(file.str[file.i] == ' ' || file.str[file.i] == '\t')) {
			file.i++;
		}
	}

	function parse_skip_newline(file)
	{
		while (file.i < file.length) {
			if (file.str[file.i++] == '\n') {
				break;
			}
		}
	}

	// returns [vao, texture]
	function load_asset(assetName, settings)
	{
		let asset = {};

		let metaFile;
		let metaConnection = new XMLHttpRequest();
		metaConnection.open("GET", "assetstore/"+assetName+"/meta.txt", false);
		metaConnection.send();
		if (metaConnection.status != 200) {
			console.log("???");
		}
		metaFile = metaConnection.responseText;

		let objName = metaFile.substring(9).split('\n')[0];

		let objFile;
		let objConnection = new XMLHttpRequest();
		objConnection.open("GET", "assetstore/"+assetName+"/"+objName, false);
		objConnection.send();
		if (objConnection.status != 200) {
			console.log("???");
		}
		objFile = objConnection.responseText;

		let preVertices = [];
		let indices = [];
		let textureCoords = [];

		// parse .obj file (NOTE: only tested on blender .obj files!)
		let file = {
			str: objFile,
			length: objFile.length,
			i: 0,
		};
		while (file.i < file.length) {
			if (file.str[file.i] == 'v' && file.str[file.i+1] == 't') {
				file.i+=2;
				parse_whitespace(file);
				let u = parse_float(file);
				parse_whitespace(file);
				let v = -parse_float(file);
				textureCoords.push([u, v]);
			} else if (file.str[file.i] == 'v' && file.str[file.i+1] == 'p') {
				parse_skip_newline(file);
			} else if (file.str[file.i] == 'v' && file.str[file.i+1] == 'n') {
				parse_skip_newline(file);
			} else if (file.str[file.i] == 'v') {
				file.i++;
				parse_whitespace(file);
				let x = parse_float(file);
				parse_whitespace(file);
				let y = parse_float(file);
				parse_whitespace(file);
				let z = parse_float(file);
				preVertices.push([x, y, z]);
			} else if (file.str[file.i] == 'f') {
				file.i++;
				parse_whitespace(file);
				let v1 = parse_float(file);
				file.i++; // NOTE: OPTIONAL!
				let t1 = parse_float(file);
				file.i++;
				parse_float(file);
				parse_whitespace(file);
				
				let v2 = parse_float(file);
				file.i++; // NOTE: OPTIONAL!
				let t2 = parse_float(file);
				file.i++;
				parse_float(file);
				parse_whitespace(file);

				let v3 = parse_float(file);
				file.i++; // NOTE: OPTIONAL!
				let t3 = parse_float(file);
				file.i++;
				parse_float(file);
				parse_whitespace(file);

				parse_skip_newline(file);
				indices.push([v1-1, t1-1]);
				indices.push([v2-1, t2-1]);
				indices.push([v3-1, t3-1]);
			} else { // '#'
				parse_skip_newline(file);
			}
		}
		let postVertices = [];
		for (let i = 0; i < indices.length; i++) {
			let vertexIndex = indices[i][0];
			postVertices.push(preVertices[vertexIndex][0]);
			postVertices.push(preVertices[vertexIndex][1]);
			postVertices.push(preVertices[vertexIndex][2]);
			let textureIndex = indices[i][1];
			postVertices.push(textureCoords[textureIndex][0]);
			postVertices.push(textureCoords[textureIndex][1]);
		}

		let vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		
		let vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(postVertices), gl.STATIC_DRAW);
		
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5*4, 0);
		
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5*4, 3*4);

		// texture
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// placeholder
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixels = new Uint8Array([
			0, 0, 255, 255,
		]);
		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			width,
			height,
			border,
			srcFormat,
			srcType,
			pixels
		);

		let imgType = metaFile.split('\n')[1].split(' ')[0];
		let imgName = metaFile.split('\n')[1].split(' ')[1];

		asset.textureType = imgType;
		
		if (imgType == "image") {
			const image = new Image();
			image.onload = () => {
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(
					gl.TEXTURE_2D,
					level,
					internalFormat,
					srcFormat,
					srcType,
					image
				);
				// generate mipmap
			}
			image.src = "assetstore/"+assetName+"/"+imgName;
		} else if (imgType == "video") {
			const video = document.createElement("video");

			let playing = false;
			let timeupdate = false;

			video.playsInline = true;
			video.muted = false;
			video.loop = false;

			video.addEventListener("playing", () => {
				playing = true;
				checkReady();
			}, true);

			video.addEventListener("timeupdate", () => {
				timeupdate = true;
				checkReady();
			}, true);

			video.src = "assetstore/"+assetName+"/"+imgName;
			video.play();
			
			if (settings.destroyAfterVideoEnd === true) {
				asset.destroyTime = window.performance.now()+1000000;
			}

			asset.needsVideoUpdate = false;
			function checkReady() {
				if (playing && timeupdate) {
					if (asset.needsVideoUpdate == false) {
						asset.destroyTime = window.performance.now()+video.duration*1000;
					}
					asset.needsVideoUpdate = true;
				}
			}
			asset.video = video;
		}
		
		asset.enableGreenscreen = metaFile.split('\n')[2].split(' ')[1].replace(/\W/g, '') == "true";
		asset.enableLazycull = metaFile.split('\n')[3].split(' ')[1].replace(/\W/g, '') == "true";
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		asset.vao = vao;
		asset.texture = texture;
		asset.triangleCount = indices.length;
		asset.buffer = vertexBuffer;
		return asset;
	}
	
	function update_asset(asset)
	{
		const level = 0;
		const internalFormat = gl.RGBA;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		gl.bindTexture(gl.TEXTURE_2D, asset.texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			srcFormat,
			srcType,
			asset.video
		);
	}

	function destroy_asset(asset)
	{
		if (asset.textureType = "video") {
			asset.video.remove();
		}
		gl.deleteBuffer(asset.buffer);
		gl.deleteTexture(asset.texture);
		gl.deleteVertexArray(asset.vao);
	}

	function draw_asset(asset)
	{
		if (asset.enableGreenscreen) {
			gl.uniform1f(enableGreenscreenLocation, 1.0);
		}
		if (asset.enableLazycull) {
			gl.disable(gl.CULL_FACE);
		} else {
			gl.enable(gl.CULL_FACE);
		}
		gl.uniformMatrix4fv(inModelMatrixLocation, false, new Float32Array(asset.matrix));
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, asset.texture);
		gl.uniform1i(albedoLocation, 0);
		gl.bindVertexArray(asset.vao);
		gl.drawArrays(gl.TRIANGLES, 0, asset.triangleCount);
	}

	function lock_cursor(element)
	{
		if (!(element === document.pointerLockElement)) {
			element.requestPointerLock();
		}
	}

	function normalize_vec3(input)
	{
		let lengthINV = 1/Math.sqrt(input[0]*input[0]+input[1]*input[1]+input[2]*input[2]);
		return [input[0]*lengthINV, input[1]*lengthINV, input[2]*lengthINV];
	}

	function cross_vec3(a, b)
	{
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0]
		];
	}

	// aabb: [centerX, centerY, centerZ, halfWidthX, halfWidthY, halfWidthZ]
	function aabb_aabb_intersection_test(aabb1, aabb2)
	{
		if (Math.abs(aabb1[0]-aabb2[0]) > (aabb1[3] + aabb2[3])) return false;
		if (Math.abs(aabb1[1]-aabb2[1]) > (aabb1[4] + aabb2[4])) return false;
		if (Math.abs(aabb1[2]-aabb2[2]) > (aabb1[5] + aabb2[5])) return false;
		return true;
	}

	function shoot_bullet()
	{
		if (!weaponEquipped) {
			return;
		}
		let offset = 0.5;
		let spawnPosition = [
			cameraPos[0]+offset*cameraAxis[0],
			cameraPos[1]+offset*cameraAxis[1],
			cameraPos[2]+offset*cameraAxis[2]
		];
		bullets.push([...spawnPosition, ...cameraAxis]);
	}

	function bullet_physics(timestamp, deltaTime)
	{
		let speed = 8.0 * deltaTime;
		let maxDistance = 100*100;
		let bulletSpliceList = [];
		let enemySpliceList = [];
		for (let i = 0; i < bullets.length; i++) {
			bullets[i][0] += bullets[i][3]*speed;
			bullets[i][1] += bullets[i][4]*speed;
			bullets[i][2] += bullets[i][5]*speed;
			
			let magnitude2 =
				bullets[i][0]*bullets[i][0]
				+ bullets[i][1]*bullets[i][1]
				+ bullets[i][2]*bullets[i][2];
			if (magnitude2 > maxDistance) {
				bulletSpliceList.push(i);
				continue;
			}
			
			let bulletAABB = [
				bullets[i][0],
				bullets[i][1],
				bullets[i][2],
				0.1,
				0.1,
				0.1,
			];
			let floorAABB = [0, -5, 0, 50, 3, 50];
			if (aabb_aabb_intersection_test(bulletAABB, floorAABB)) {
				let effectMatrix = [];
				effectMatrix.length = 16;

				let lift = 0.5;
				mat4.targetTo(
					effectMatrix,
					[
						bullets[i][0],
						bullets[i][1]+lift,
						bullets[i][2]
					],
					[
						bullets[i][0]+bullets[i][3],
						bullets[i][1]+bullets[i][4]+lift,
						bullets[i][2]+bullets[i][5]
					],
					[0, 1, 0]
				);
				// TODO: only load texture or cache vao
				let missAssetCount = 7;

				let name = "miss" + Math.floor(Math.random()*missAssetCount);
				let asset = load_asset(name, {
					"destroyAfterVideoEnd": true
				});
				asset.matrix = effectMatrix;
				effects.push(asset);
				bulletSpliceList.push(i);
				continue;
			}
			for (let j = 0; j < enemies.length; j++) {
				let enemyAABB = [...enemies[j], 1, 1, 1];
				if (aabb_aabb_intersection_test(bulletAABB, enemyAABB)) {
					let effectMatrix = [];
					effectMatrix.length = 16;
					mat4.targetTo(
						effectMatrix,
						[
							bullets[i][0],
							bullets[i][1],
							bullets[i][2]
						],
						[
							bullets[i][0]+bullets[i][3],
							bullets[i][1]+bullets[i][4],
							bullets[i][2]+bullets[i][5]
						],
						[0, 1, 0]
					);
					// TODO: only load texture or cache vao
					let hitAssetCount = 2;
					let name = "hit" + Math.floor(Math.random()*hitAssetCount);
					let asset = load_asset(name, {
						"destroyAfterVideoEnd": true
					});
					asset.matrix = effectMatrix;
					effects.push(asset);

					bulletSpliceList.push(i);
					enemySpliceList.push(j);

					score += 1;
				}
			}
		}
		for (let i = 0; i < bulletSpliceList.length; i++) {
			bullets.splice(bulletSpliceList[i], 1);
		}
		for (let i = 0; i < enemySpliceList.length; i++) {
			enemies.splice(enemySpliceList[i], 1);
		}
	}

	function player_movement(deltaTime)
	{
		let floorAABB = [0, -5, 0, 50, 3, 50];
		const up = [0, 1, 0];
		
		// "movement"
		let speed = 2*deltaTime;
		let forwardDir = normalize_vec3([cameraAxis[0], 0, cameraAxis[2]]);
		let length = Math.sqrt(
			forwardDir[0]*forwardDir[0]
			+ forwardDir[1]*forwardDir[1]
			+ forwardDir[2]*forwardDir[2]
		);
		let sideDir = cross_vec3(up, forwardDir);
		//sideDir = normalize_vec3();
		if (keyIsPressed["KeyW"]) {
			let newPos = [
				cameraPos[0] + forwardDir[0]*speed,
				cameraPos[1] + forwardDir[1]*speed,
				cameraPos[2] + forwardDir[2]*speed
			];
			let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
			if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
				cameraPos = [...newPos];
			}
		}
		if (keyIsPressed["KeyS"]) {
			let newPos = [
				cameraPos[0] - forwardDir[0]*speed,
				cameraPos[1] - forwardDir[1]*speed,
				cameraPos[2] - forwardDir[2]*speed
			];
			let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
			if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
				cameraPos = [...newPos];
			}
		}
		if (keyIsPressed["KeyA"]) {
			let newPos = [
				cameraPos[0] + sideDir[0]*speed,
				cameraPos[1] + sideDir[1]*speed,
				cameraPos[2] + sideDir[2]*speed
			];
			let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
			if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
				cameraPos = [...newPos];
			}
		}
		if (keyIsPressed["KeyD"]) {
			let newPos = [
				cameraPos[0] - sideDir[0]*speed,
				cameraPos[1] - sideDir[1]*speed,
				cameraPos[2] - sideDir[2]*speed
			];
			let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
			if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
				cameraPos = [...newPos];
			}
		}
		/*
		if (keyIsPressed["Space"]) {
			let newPos = [
				cameraPos[0],
				cameraPos[1] + up[1]*speed,
				cameraPos[2]
			];
			let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
			if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
				cameraPos = [...newPos];
			}
		}
		*/
		//if (keyIsPressed["ShiftLeft"]) {
		if (true) {
			let newPos = [
				cameraPos[0],
				cameraPos[1] - up[1]*speed,
				cameraPos[2]
			];
			let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
			if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
				cameraPos = [...newPos];
			}
		}
	}

	function enemy_movement(deltaTime)
	{
		let floorAABB = [0, -5, 0, 50, 3, 50];
		const up = [0, 1, 0];

		let killList = [];
		
		let speed = (currentWave/2)*deltaTime;
		for (let i = 0; i < enemies.length; i++) {
			let dir = normalize_vec3([
				cameraPos[0]-enemies[i][0],
				0,
				cameraPos[2]-enemies[i][2]
			]);
			dir[0] *= speed;
			dir[1] *= speed;
			dir[2] *= speed;
			if (true) {
				let newPos = [
					enemies[i][0],
					enemies[i][1] - up[1]*speed,
					enemies[i][2]
				];
				let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
				if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
					enemies[i] = [...newPos];
				}
			}
			if (true) {
				let newPos = [
					enemies[i][0]+dir[0],
					enemies[i][1]+dir[1],
					enemies[i][2]+dir[2]
				];
				let aabb = [newPos[0], newPos[1], newPos[2], 1, 1, 1];
				if (!aabb_aabb_intersection_test(aabb, floorAABB)) {
					enemies[i] = [...newPos];
				}
			}
			let enemyAABB = [...enemies[i], 1, 1, 1];
			let playerAABB = [...cameraPos, 1, 1, 1];
			if (aabb_aabb_intersection_test(playerAABB, enemyAABB)) {
				let oof = new Audio("A.mp3");
				oof.play();
				health -= 1;
				killList.push(i);
			}
		}
		for (let i = 0; i < killList.length; i++) {
			enemies.splice(killList[i], 1);

		}
	}


	let weaponEquipped = false;
	let currentWave = 0;
	let currentlySpawningWave = false;
	function enemy_control()
	{
		if (currentlySpawningWave == false && weaponEquipped == true
				&& enemies.length == 0) {
			currentlySpawningWave = true;
			setTimeout(() => {
				currentWave += 1;
				let enemyCount = 2*currentWave;
				for (let i = 0; i < enemyCount; i++) {
					let enemyPos = [0, 0, 0];
					while (true) {
						enemyPos[0] = 30*(1-2*Math.random());
						enemyPos[1] = 8 * Math.random();
						enemyPos[2] = 30*(1-2*Math.random());
						let x = enemyPos[0]-cameraPos[0];
						let y = enemyPos[1]-cameraPos[1];
						let z = enemyPos[2]-cameraPos[2];
						let length = Math.sqrt(x*x+y*y+z*z);
						if (length > 4) {
							break;
						}
					}
					enemies.push(enemyPos);
				}
				currentlySpawningWave = false;
			}, 1000);
		}
	}

	let inModelMatrixLocation;
	let inViewMatrixLocation;
	let inProjectionMatrixLocation;
	let albedoLocation;
	let enableGreenscreenLocation;

	onMount(() => {
		addEventListener("keydown", (event) => {
			keyIsPressed[event.code] = true;
		});
		addEventListener("keyup", (event) => {
			keyIsPressed[event.code] = false;
		});
		addEventListener("click", (event) => {
			lock_cursor(canvas);
		});
		addEventListener("mousedown", (event) => {
			shoot_bullet();
		});
		addEventListener("mousemove", (event) => {
			if (!(canvas === document.pointerLockElement)) {
				return;
			}
			let xOffset = event.movementX;
			let yOffset = -event.movementY;

			let m_yaw = 0.022; // to get same sensitivity as the Source engine

			let sensitivity = 3.0;

			let incrementX = xOffset * sensitivity * m_yaw;
			let incrementY = yOffset * sensitivity * m_yaw;

			mouseYaw += incrementX;
			mousePitch += incrementY;
			
			if (mousePitch > 89) {
				mousePitch = 89;
			} else if (mousePitch < -89) {
				mousePitch = -89;
			}

			cameraAxis[0] = Math.cos(mouseYaw*Math.PI/180)
				* Math.cos(mousePitch*Math.PI/180);
			cameraAxis[1] = Math.sin(mousePitch*Math.PI/180);
			cameraAxis[2] = Math.sin(mouseYaw*Math.PI/180)
				* Math.cos(mousePitch*Math.PI/180);
		});

		canvas = document.getElementById("webglCanvas");

		gl = canvas.getContext("webgl2");
		if (!gl) {
			console.log("epic fail #1");
		}

		let vertexShader = create_shader(gl.VERTEX_SHADER, vertexShaderSource);
		let fragmentShader = create_shader(gl.FRAGMENT_SHADER, fragmentShaderSource);
		let program = create_program(vertexShader, fragmentShader);

		inModelMatrixLocation = gl.getUniformLocation(program, "inModelMatrix");
		inViewMatrixLocation = gl.getUniformLocation(program, "inViewMatrix");
		inProjectionMatrixLocation = gl.getUniformLocation(program, "inProjectionMatrix");
		albedoLocation = gl.getUniformLocation(program, "albedo");
		enableGreenscreenLocation = gl.getUniformLocation(program, "enableGreenscreen");

		let asset1 = load_asset("defaultcube");
		let asset2 = load_asset("floor");
		let asset3 = load_asset("M4A4");
		let asset4 = load_asset("bullet");
		
		asset2.matrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, -2, 0, 1,
		];
		asset3.matrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		];
		asset4.matrix = [
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
		];
		
		let nearVal = 0.1;
		let farVal = 1000;

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.depthMask(true);
		gl.clearColor(0, 0, 0, 1);
		gl.clearDepth(0);
		gl.depthFunc(gl.LESS);
		gl.enable(gl.DEPTH_TEST);

		let hasBeenJumpscared = false;

		let firstFrame = true;
		let oldTime;
		function draw(timestamp)
		{
			if (health > 2) {
				joepicture = "joe.jpg";
			} else if (health == 2) {
				joepicture = "joe4.jpg";
			} else if (health == 1) {
				joepicture = "moment.jpg";
			} else if (health == 0) {
				hasBeenJumpscared = true;
				jumpscareStyle = "";
			}
			scoreText = "score: " + score + "\nwave: " + currentWave;
			if (firstFrame) {
				firstFrame = false;
				oldTime = timestamp;
			}
			let deltaTime = (timestamp-oldTime)/1000; // in seconds
			oldTime = timestamp;
			let maxDeltaTime = 0.3;
			if (deltaTime > maxDeltaTime) {
				deltaTime = maxDeltaTime;
			}

			let newEffects = [];
			for (let i = 0; i < effects.length; i++) {
				if (effects[i].destroyTime > window.performance.now()) {
					newEffects.push(effects[i]);
					
					if (effects[i].needsVideoUpdate) {
						update_asset(effects[i]);
					}
				} else {
					destroy_asset(effects[i]);
				}
			}
			effects = [...newEffects];
			
			const up = [0, 1, 0];

			player_movement(deltaTime);
			enemy_movement(deltaTime);
			enemy_control(timestamp);
			bullet_physics(timestamp, deltaTime);

			let forwardDir = normalize_vec3([cameraAxis[0], 0, cameraAxis[2]]);
			let length = Math.sqrt(
				forwardDir[0]*forwardDir[0]
				+ forwardDir[1]*forwardDir[1]
				+ forwardDir[2]*forwardDir[2]
			);
			let sideDir = cross_vec3(up, forwardDir);
			let weaponPosVec = [
				cameraPos[0]-0.4*sideDir[0]+0.6*forwardDir[0],
				cameraPos[1]-0.1,
				cameraPos[2]-0.4*sideDir[2]+0.6*forwardDir[2]
			];
			mat4.targetTo(
				asset3.matrix,
				weaponPosVec,
				[
					weaponPosVec[0]-cameraAxis[0],
					weaponPosVec[1]-cameraAxis[1],
					weaponPosVec[2]-cameraAxis[2]
				],
				up
			);
			
			canvas.width = document.documentElement.clientWidth;
			canvas.height = document.documentElement.clientHeight;
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_COLOR_BIT);

			let viewMatrix = [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			];
			let projectionMatrix = [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			];
			let target = [
				cameraPos[0]+cameraAxis[0],
				cameraPos[1]+cameraAxis[1],
				cameraPos[2]+cameraAxis[2]
			];
			mat4.lookAt(viewMatrix, cameraPos, target, up);
			let vfov = 74*Math.PI/180.0
			let aspect = canvas.width / canvas.height;
			mat4.perspective(projectionMatrix, vfov, aspect, nearVal, farVal);

			gl.useProgram(program);
			gl.uniformMatrix4fv(inViewMatrixLocation, false, new Float32Array(viewMatrix));
			gl.uniformMatrix4fv(inProjectionMatrixLocation, false, new Float32Array(projectionMatrix));

			for (let i = 0; i < enemies.length; i++) {
				asset1.matrix = [
					1, 0, 0, 0,
					0, 1, 0, 0,
					0, 0, 1, 0,
					enemies[i][0], enemies[i][1], enemies[i][2], 1,
				];
				draw_asset(asset1);
			}
			
			draw_asset(asset2);

			let playerAABB = [cameraPos[0], cameraPos[1], cameraPos[2], 1, 1, 1];
			let weaponAABB = [0, 0, 0, 1, 1, 1];
			if (aabb_aabb_intersection_test(playerAABB, weaponAABB)) {
				headerClassName = "headerAnimationClass";
				scoreClassName = "scoreAnimationClass";
				weaponEquipped = true;
			}
			
			if (weaponEquipped == false) {
				asset3.matrix = [
					1, 0, 0, 0,
					0, 1, 0, 0,
					0, 0, 1, 0,
					0, 0, 0, 1,
				];
				mat4.translate(asset3.matrix, asset3.matrix, [0, -1.2, 0]);
				mat4.rotateY(asset3.matrix, asset3.matrix, timestamp/1000);
			}
			let scaleVal = 0.2;
			mat4.scale(asset3.matrix, asset3.matrix, [scaleVal, scaleVal, scaleVal]);
			draw_asset(asset3);
			
			for (let i = 0; i < bullets.length; i++) {
				mat4.targetTo(
					asset4.matrix,
					[
						bullets[i][0],
						bullets[i][1],
						bullets[i][2]
					],
					[
						bullets[i][0]-bullets[i][3],
						bullets[i][1]-bullets[i][4],
						bullets[i][2]-bullets[i][5]
					],
					up
				);

				draw_asset(asset4);
			}

			for (let i = 0; i < effects.length; i++) {
				draw_asset(effects[i]);
			}

			window.requestAnimationFrame(draw);
		}
		window.requestAnimationFrame(draw);
	});
</script>
