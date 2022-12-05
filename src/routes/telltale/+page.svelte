<head>
  <title>epic game 2012</title>
</head>
<script>
    import { story_id_store } from "$lib/stores";
    import { stories } from "$lib/stories";
  
    /* https://svelte.dev/tutorial/in-and-out */
    import { fly } from "svelte/transition";
  
    /* https://svelte.dev/tutorial/reactive-statements */
    $: story_id = $story_id_store;
    $: story = stories.find((story) => story.id == story_id);
  </script>
  
  <div class="grid">
    <!-- https://svelte.dev/tutorial/key-blocks -->
    {#key story_id}
      <!-- https://svelte.dev/tutorial/in-and-out -->
      <div
        class="container"
        in:fly={{ x: 800, duration: 750 }}
        out:fly={{ x: -800, duration: 750 }}
      >
        <!-- https://svelte.dev/tutorial/if-blocks -->
        {#if story}
          {#if story.img}
            <img src={story.img} alt={story.message} />
          {/if}
          {#if story.html}
            <!-- https://svelte.dev/tutorial/html-tags -->
            {@html story.html}
          {/if}
          <p>{story.message}</p>
          <div class="row">
            <!-- https://svelte.dev/tutorial/each-blocks -->
            {#each story.choices as choice}
              <button
                on:click={() => {
                  $story_id_store = choice.id;
                }}>{choice.text}</button
              >
            {/each}
          </div>
          <!-- https://svelte.dev/tutorial/else-blocks -->
        {:else}
          <p>STORY FOR ID {story_id} MISSING</p>
        {/if}
      </div>
    {/key}
  </div>
  
  <style>
    .grid {
      margin: 10%;
      display: grid;
      align-items: center;
      place-items: center;
      justify-content: center;
    }
  
    /* force the container to stay in the same position of the grid */
    /* we need this to ensure that the container div does not move weirdly
       when two divs coexist which they do while the out and in transition
       is playing simultaneously. Try removing the grid-column placement stuff
       and you might notice some weird behaviour.
    */
    .container {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 400px;
      width: 500px;
    }
  
    .row {
      display: flex;
      flex-direction: row;
      gap: 20px;
    }
  
    img {
      width: 400px;
      height: 300px;
      object-fit: cover;
    }
  </style>