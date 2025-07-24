<script lang="ts">
	import Player from "$lib/components/Player.svelte";
	import { spotify } from "$lib/spotify.svelte";
	import { getContrastTailwindColor } from "$lib/colors";
	import { fly, fade } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import type { PlaybackState } from "@spotify/web-api-ts-sdk";
	import { onDestroy, onMount } from "svelte";
	import { clickOutside, timeAgo } from "$lib/utils";
	import type { Note } from "$lib/types";
	import { collection, getDocs, query, where, setDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
	import { db } from "$lib/firebase";
	import { user } from "$lib/user.svelte";
	
	let note = $state<{ writing: boolean, isPublic: boolean, content: string }>({
		writing: false,
		isPublic: false,
		content: ""
	});

	let oldTrack = $state<PlaybackState | undefined>(undefined);
	let track = $state<PlaybackState | undefined>(undefined);
	let width = $derived((track?.progress_ms / track?.item.duration_ms) * 100)
	let notes = $state<Note[]>([]);
	let interval = $state<NodeJS.Timeout>();

	async function fetchTrack() {
		if (user.profile) {
			track = await spotify.sdk?.player.getCurrentlyPlayingTrack()
			
			if (track !== oldTrack) {
				spotify.playback = track;
				
				const q = query(
					collection(db, "notes"), 
					where("uid", "==", user.profile.id),
					where("song_id", "==", track?.item.id),
				)

				const qSnapshot = await getDocs(q);
				let songNotes: Note[] = [];
				qSnapshot.forEach((doc) => {
					let note: Note = doc.data() as Note
					songNotes = [...songNotes, note]
					notes = songNotes

					notes.sort((a, b) => {
						return b.created_at.seconds - a.created_at.seconds;
					})
				})
			}

			oldTrack = track;
		}
	}

	async function createNote() {
		if (user.profile && track) {
			let playingTrack = track;
			const data: Note = {
				content: note.content,
				created_at: serverTimestamp(),
				display_name: user.profile.display_name,
				email: user.profile.email,
				href: user.profile.href,
				is_public: note.isPublic,
				progress_ms: track.progress_ms,
				song_id: track.item.id,
				uid: user.profile.id
			}
			
			const ref = await addDoc(collection(db, "notes"), data)
			if (ref && ref.id) {
				note.writing = false;
				note.content = "";
				note.isPublic = false;

				notes = [...notes, data]
				notes.sort((a, b) => {
					return b.created_at.seconds - a.created_at.seconds;
				})
			}
		}
	}

	onMount(async() => {
		await fetchTrack();
		interval = setInterval(fetchTrack, 1000);
	})

	onDestroy(() => {
		clearInterval(interval);
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
				<button onclick={createNote} class="ml-auto rounded-full bg-white border-2 text-neutral-900 border-neutral-300 hover:bg-white/70 duration-200 z-10 p-2 px-6 font-bold">
					Create Note
				</button>
			</div>
		</div>
	</div>
{/if}

{#if spotify.sdk?.getAccessToken() !== null && track}
	<div class="flex flex-col gap-5 h-full w-full">
		<div class="rounded-lg bg-neutral-900 flex items-center justify-center h-full gap-8 flex-row overflow-hidden relative w-full">
			<div class="relative">
				<div class="z-10 group relative">
					<img src={track?.item.album.images[0].url} class="size-96 z-10 shadow-2xl rounded-md object-cover z-2" />
					<div onclick={() => {
						note.writing = true;
					}} class="size-96 absolute bg-black/50 opacity-0 group-hover:opacity-100 duration-250 hover:cursor-pointer flex items-center justify-center flex-col gap-2 rounded-md shadow-2xl top-0">
						<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24">
							<path fill="currentColor" d="M3 17.75A3.25 3.25 0 0 0 6.25 21h4.915l.356-1.423c.162-.648.497-1.24.97-1.712l5.902-5.903a3.28 3.28 0 0 1 2.607-.95V6.25A3.25 3.25 0 0 0 17.75 3H11v4.75A3.25 3.25 0 0 1 7.75 11H3zM9.5 3.44L3.44 9.5h4.31A1.75 1.75 0 0 0 9.5 7.75zm9.6 9.23l-5.903 5.902a2.7 2.7 0 0 0-.706 1.247l-.458 1.831a1.087 1.087 0 0 0 1.319 1.318l1.83-.457a2.7 2.7 0 0 0 1.248-.707l5.902-5.902A2.286 2.286 0 0 0 19.1 12.67"/>
						</svg>
						<h1 class="text-lg font-semibold">Create a note</h1>
					</div>
				</div>
			</div>
			
			<div class="flex flex-col z-10 gap-2 h-96 w-[25rem]">
				{#each notes as note}
					<div class="px-4 py-3 bg-neutral-900 border-neutral-800 border-2 rounded-lg shadow-md backdrop-blur-sm max-w-xs text-white">
						<metadata>
							<p class="opacity-50 text-sm">
								{timeAgo(note.created_at)}
							</p>
						</metadata>
						<p class="text-lg font-semibold leading-snug">{note.content}</p>
					</div>
				{/each}
			</div>

			<img src={track?.item.album.images[0].url} class="size-[350rem] idle-float blur-[24px] opacity-30 absolute shadow-2xl rounded-md object-cover z-2" />

			<!--
			<div class="w-[40rem] mt-36 z-20">
				<div class="w-full relative">
					<div class="h-1 bg-neutral-500 w-full rounded-full"></div>
					<div class="h-1 bg-white absolute top-0 rounded-full" style="width: {width}%"></div>
				</div>
			</div>
			-->
		</div>
		<div class="max-w-[40rem] flex flex-row mx-auto gap-4 items-center rounded-lg text-white z-50">				
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