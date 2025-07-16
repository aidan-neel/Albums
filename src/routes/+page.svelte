<script lang="ts">
	import Player from "$lib/components/Player.svelte";
	import { spotify } from "$lib/spotify.svelte";
	import { getContrastTailwindColor } from "$lib/colors";
	import { fly, fade } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import type { PlaybackState } from "@spotify/web-api-ts-sdk";
	import { onMount } from "svelte";
	import { clickOutside } from "$lib/utils";

	let note = $state<{ writing: boolean, isPublic: boolean, content: string }>({
		writing: false,
		isPublic: false,
		content: ""
	});
	let track = $state<PlaybackState | undefined>(undefined);

	onMount(async() => {
		track = await spotify.sdk?.player.getCurrentlyPlayingTrack()
	})
</script>

{#if note.writing}
	<div transition:fade={{ duration: 150, easing: cubicOut }} class="bg-black/70 backdrop-blur-sm pb-24 h-screen w-screen fixed gap-4 z-[9999] flex items-center justify-center flex-col">
		<h1 class="font-semibold text-shadow-lg">
			Make a note of {track?.item.name}
		</h1>
		<div use:clickOutside={() => {
			note.writing = false;
		}} transition:fly={{ duration: 400, y: 10 }} class="min-w-[40rem] max-w-[40rem] bg-neutral-900 border-neutral-800 border-2 p-6 rounded-lg flex flex-col gap-6">
			<header class="flex flex-col gap-4">
				<h1 class="text-white text-2xl font-bold">
					{track?.item.name}
				</h1>
			</header>
			<textarea bind:value={note.content} placeholder="How do you feel about this song right now?" id="notearea" class="border-2 p-3 min-h-40 resize-none border-neutral-700 bg-neutral-800 rounded-lg" />
			<div class="w-full flex flex-row items-center justify-between">
				<div onclick={() => {
					note.isPublic = !note.isPublic
				}} class="flex flex-row items-center justify-center gap-2">
					<button class="{note.isPublic ? "bg-neutral-500 border-neutral-600" : "bg-white border-neutral-300 hover:bg-white/70" } size-6 rounded-md border-2 duration-200">
						{#if note.isPublic}
							<svg transition:fade={{ duration: 100 }} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 12L10 16L18 8" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						{/if}
					</button>
					<label>
						Publicly post
					</label>
				</div>
				<button onclick={() => {
					note.writing = false;
					note.content = "";
					note.isPublic = false;
				}} class="ml-auto rounded-full bg-white border-2 text-neutral-900 border-neutral-300 hover:bg-white/70 duration-200 z-10 p-2 px-6 font-bold">
					Create Note
				</button>
			</div>
		</div>
	</div>
{/if}

{#if spotify.sdk?.getAccessToken() !== null}
	<div class="flex flex-col gap-5 h-full w-full">
		<div class="rounded-lg bg-neutral-900 flex items-center justify-center h-full flex-col overflow-hidden relative w-full">
			<img src={track?.item.album.images[0].url} class="size-96 z-10 shadow-2xl rounded-md object-cover z-2" />
			<button onclick={() => {
				note.writing = true;
			}} class="mt-4 rounded-full bg-white border-2 text-neutral-900 border-neutral-300 hover:bg-white/70 duration-200 z-10 p-2 px-6 font-bold">
				Create a Note
			</button>
			<img src={track?.item.album.images[0].url} class="size-[350rem] idle-float blur-[30px] opacity-30 absolute shadow-2xl rounded-md object-cover z-2" />
		</div>
		<div class="max-w-[40rem] flex flex-row mx-auto gap-4 rounded-lg text-white z-50">				
			{console.log(track)}
			<img src={track?.item.album.images[0].url} class="size-16 rounded-md object-cover" />
			<header class="flex flex-col justify-center items-start">
				<h1 class="font-bold">
					{track?.item.name}
				</h1>
				<p class="text-white/70">
					{track?.item.artists[0].name}
				</p>
			</header>
		</div>	
	</div>
{/if}