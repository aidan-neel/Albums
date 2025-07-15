<script lang="ts">
	import { SpotifyApi } from "@spotify/web-api-ts-sdk";
	import type { PageProps } from "../$types";
	import { onMount } from "svelte";
	import { CLIENT_ID, REDIRECT_URI, SCOPES, spotify } from "$lib/spotify.svelte";

    let data: { data: { code: string } } = $props();
    let code = $derived(data.data.code);

    onMount(() => {
        SpotifyApi.performUserAuthorization(CLIENT_ID, REDIRECT_URI, SCOPES, (accessToken) => {})
    })
</script>