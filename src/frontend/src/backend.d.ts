import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TeamMember {
    id: bigint;
    bio: string;
    name: string;
    role: string;
    imageUrl: string;
}
export interface Activity {
    id: bigint;
    title: string;
    date: Time;
    description: string;
    location: string;
}
export type Time = bigint;
export interface Article {
    id: bigint;
    title: string;
    content: string;
    date: Time;
    imageUrl: string;
    excerpt: string;
    category: string;
}
export interface backendInterface {
    createArticle(title: string, excerpt: string, content: string, category: string, imageUrl: string): Promise<Article>;
    deleteArticle(id: bigint): Promise<void>;
    getActivities(): Promise<Array<Activity>>;
    getActivity(id: bigint): Promise<Activity>;
    getAllArticles(): Promise<Array<Article>>;
    getArticle(id: bigint): Promise<Article>;
    getTeamMember(id: bigint): Promise<TeamMember>;
    getTeamMembers(): Promise<Array<TeamMember>>;
    updateArticle(id: bigint, title: string, excerpt: string, content: string, category: string, imageUrl: string): Promise<Article>;
}
