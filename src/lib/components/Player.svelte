<script lang="ts">
    import { spotify } from "$lib/spotify.svelte"
</script>

<div class="max-w-[40rem]  flex flex-row gap-4 rounded-lg text-white z-50">
    {#await spotify.sdk?.player.getCurrentlyPlayingTrack()}
        
    {:then track} 
        {console.log(track)}
        <img src={track?.item.album.images[0].url} class="size-20 rounded-md" />
        <header class="flex flex-col">
            <h1 class="font-bold">
                {track?.item.name}
            </h1>
            <p class="text-white/70">
                {track?.item.artists[0].name}
            </p>
        </header>
    {/await}
</div>