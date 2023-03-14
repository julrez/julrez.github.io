export async function load({fetch})
{
	const postModules = Object.entries(import.meta.glob("/src/lib/posts/*.md"));
	let postFilenames = [];
	for (let i = 0; i < postModules.length; i++) {
		postFilenames.push(postModules[i][0]);
	}
	const posts = [];
	for (let i = 0; i < postFilenames.length; i++) {
		let name = postFilenames[i].replace('/src/lib/posts/', '').replace('.md', '');
		posts[i] = await import(`../../lib/posts/${name}.md`);
	}
	console.log(postFilenames);
	const test = await import('../../lib/posts/test.md');
	return {
		postFilenames,
		posts,
	};
}
