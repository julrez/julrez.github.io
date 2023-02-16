<h1>random test thing with random-data-api.com</h1>
<p>username: {username}</p>
<p>name: {name}</p>
<p>email: {email}</p>

<style>
</style>

<script>
	import {onMount} from 'svelte';

	let username, name, email, address;

	onMount(() => {
		let url = "https://random-data-api.com/api/users/random_user";
		fetch(url).then((response) => response.json()).then((data) => {
			console.log(data);
			username = data.username;
			name = data.first_name + " " + data.last_name;
			email = data.email;
		});
	});
</script>
