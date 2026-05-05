export type Lang = "no" | "en" | "es" | "de";

export interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: Date | string;
    isDraft?: boolean;
}