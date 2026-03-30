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
export interface ContactInfo {
    operationalHours: string;
    email: string;
    address: string;
    phone: string;
}
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
    createActivity(title: string, description: string, date: Time, location: string): Promise<Activity>;
    createArticle(title: string, excerpt: string, content: string, category: string, imageUrl: string): Promise<Article>;
    createTeamMember(name: string, role: string, bio: string, imageUrl: string): Promise<TeamMember>;
    deleteActivity(id: bigint): Promise<void>;
    deleteArticle(id: bigint): Promise<void>;
    deleteTeamMember(id: bigint): Promise<void>;
    getActivity(id: bigint): Promise<Activity>;
    getAllActivities(): Promise<Array<Activity>>;
    getAllArticles(): Promise<Array<Article>>;
    getAllTeamMembers(): Promise<Array<TeamMember>>;
    getArticle(id: bigint): Promise<Article>;
    getContactInfo(): Promise<ContactInfo>;
    getTeamMember(id: bigint): Promise<TeamMember>;
    updateActivity(id: bigint, title: string, description: string, date: Time, location: string): Promise<Activity>;
    updateArticle(id: bigint, title: string, excerpt: string, content: string, category: string, imageUrl: string): Promise<Article>;
    updateContactInfo(address: string, phone: string, email: string, operationalHours: string): Promise<ContactInfo>;
    updateTeamMember(id: bigint, name: string, role: string, bio: string, imageUrl: string): Promise<TeamMember>;
}
