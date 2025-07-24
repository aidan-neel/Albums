import { type UserProfile } from "@spotify/web-api-ts-sdk";

export let user = $state<{ profile?: UserProfile }>({
    profile: undefined
});