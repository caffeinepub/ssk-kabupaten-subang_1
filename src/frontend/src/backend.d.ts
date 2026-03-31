import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SliderBanner {
  id: bigint;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  urutan: bigint;
}
export interface SiteSettings {
    logoUrl: string;
}
export type Time = bigint;
export interface Activity {
    id: bigint;
    title: string;
    date: Time;
    description: string;
    location: string;
}
export interface GaleriItem {
    id: bigint;
    title: string;
    tanggal: Time;
    description: string;
    mediaUrl: string;
    mediaType: string;
}
export interface VideoYoutube {
    id: bigint;
    title: string;
    description: string;
    youtubeId: string;
}
export interface ProgramUnggulan {
    kecamatanTerlayani: string;
    judul: string;
    deskripsi: string;
    penghargaan: string;
    programKegiatan: string;
    pesertaTerlatih: string;
}
export interface TeamMember {
    id: bigint;
    bio: string;
    name: string;
    role: string;
    imageUrl: string;
}
export interface SatuanSSK {
    id: bigint;
    alamat: string;
    nama: string;
    deskripsi: string;
    email: string;
    logoUrl: string;
    phone: string;
    ketua: string;
}
export interface Profile {
    tagline: string;
    misi: string;
    visi: string;
    deskripsi: string;
    namaOrganisasi: string;
}
export interface PendaftaranAnggota {
    id: bigint;
    nik: string;
    status: string;
    alamat: string;
    alasan: string;
    nama: string;
    email: string;
    pekerjaan: string;
    tanggalDaftar: Time;
    phone: string;
}
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
    createGaleriItem(title: string, description: string, mediaUrl: string, mediaType: string): Promise<GaleriItem>;
    createPendaftaran(nama: string, nik: string, alamat: string, phone: string, email: string, pekerjaan: string, alasan: string): Promise<PendaftaranAnggota>;
    createSatuanSSK(nama: string, alamat: string, phone: string, email: string, deskripsi: string, logoUrl: string, ketua: string): Promise<SatuanSSK>;
    createSliderBanner(title: string, description: string, imageUrl: string, linkUrl: string, urutan: bigint): Promise<SliderBanner>;
  createTeamMember(name: string, role: string, bio: string, imageUrl: string): Promise<TeamMember>;
    createVideo(title: string, youtubeId: string, description: string): Promise<VideoYoutube>;
    deleteActivity(id: bigint): Promise<void>;
  deleteSliderBanner(id: bigint): Promise<void>;
    deleteArticle(id: bigint): Promise<void>;
    deleteGaleriItem(id: bigint): Promise<void>;
    deletePendaftaran(id: bigint): Promise<void>;
    deleteSatuanSSK(id: bigint): Promise<void>;
    deleteTeamMember(id: bigint): Promise<void>;
    deleteVideo(id: bigint): Promise<void>;
    getActivity(id: bigint): Promise<Activity>;
    getAllActivities(): Promise<Array<Activity>>;
    getAllArticles(): Promise<Array<Article>>;
    getAllGaleriItems(): Promise<Array<GaleriItem>>;
    getAllPendaftaran(): Promise<Array<PendaftaranAnggota>>;
    getAllSatuanSSK(): Promise<Array<SatuanSSK>>;
    getAllTeamMembers(): Promise<Array<TeamMember>>;
    getAllVideos(): Promise<Array<VideoYoutube>>;
    getArticle(id: bigint): Promise<Article>;
    getContactInfo(): Promise<ContactInfo>;
    getProfile(): Promise<Profile>;
    getProgramUnggulan(): Promise<ProgramUnggulan>;
    getSiteSettings(): Promise<SiteSettings>;
    getTeamMember(id: bigint): Promise<TeamMember>;
    updateActivity(id: bigint, title: string, description: string, date: Time, location: string): Promise<Activity>;
    updateArticle(id: bigint, title: string, excerpt: string, content: string, category: string, imageUrl: string): Promise<Article>;
    updateContactInfo(address: string, phone: string, email: string, operationalHours: string): Promise<ContactInfo>;
    updateGaleriItem(id: bigint, title: string, description: string, mediaUrl: string, mediaType: string): Promise<GaleriItem>;
    updatePendaftaranStatus(id: bigint, status: string): Promise<PendaftaranAnggota>;
    updateProfile(namaOrganisasi: string, tagline: string, deskripsi: string, visi: string, misi: string): Promise<Profile>;
    updateProgramUnggulan(judul: string, deskripsi: string, pesertaTerlatih: string, programKegiatan: string, penghargaan: string, kecamatanTerlayani: string): Promise<ProgramUnggulan>;
    updateSatuanSSK(id: bigint, nama: string, alamat: string, phone: string, email: string, deskripsi: string, logoUrl: string, ketua: string): Promise<SatuanSSK>;
    updateSliderBanner(id: bigint, title: string, description: string, imageUrl: string, linkUrl: string, urutan: bigint): Promise<SliderBanner>;
  updateSiteSettings(logoUrl: string): Promise<SiteSettings>;
    updateTeamMember(id: bigint, name: string, role: string, bio: string, imageUrl: string): Promise<TeamMember>;
    updateVideo(id: bigint, title: string, youtubeId: string, description: string): Promise<VideoYoutube>;
    registerAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    getAdminPrincipal(): Promise<[Principal] | []>;
    isAdmin(): Promise<boolean>;
    resetAdmin(): Promise<boolean>;
    forceResetAdmin(): Promise<boolean>;
}
