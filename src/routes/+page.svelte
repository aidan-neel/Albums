<script lang="ts">
	import Player from "$lib/components/Player.svelte";
	import { spotify } from "$lib/spotify.svelte";
	import { getContrastTailwindColor } from "$lib/colors";
</script>

{#if spotify.sdk?.getAccessToken() !== null}
	{#await spotify.sdk?.player.getCurrentlyPlayingTrack()}
	{:then track} 
		<div class="flex flex-col gap-3 h-full w-full">
			<div class="rounded-lg bg-red-900 flex items-center justify-center h-full overflow-hidden relative w-full">
				<img src={track?.item.album.images[0].url} class="size-96 shadow-2xl rounded-md object-cover z-2" />
			</div>
			<div class="max-w-[40rem]  flex flex-row gap-4 rounded-lg text-white z-50">				
				{console.log(track)}
				<img src={track?.item.album.images[0].url} class="size-20 rounded-md object-cover" />
				<header class="flex flex-col">
					<h1 class="font-bold">
						{track?.item.name}
					</h1>
					<p class="text-white/70">
						{track?.item.artists[0].name}
					</p>
				</header>
			</div>	
		</div>
	{/await}
{/if}