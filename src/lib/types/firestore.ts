import { FieldValue, Timestamp } from "firebase/firestore";

export type Note = {
    content: string;
    created_at: Timestamp;
    display_name: string;
    email: string;
    href: string;
    is_public: boolean;
    progress_ms: number;
    song_id: string;
    uid: string;
}