import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Activity,
  Article,
  GaleriItem,
  PendaftaranAnggota,
  Profile,
  SatuanSSK,
  SliderBanner,
  TeamMember,
  VideoYoutube,
} from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

async function compressImageToBase64(
  file: File,
  maxSize = 800,
  quality = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

import {
  useAllActivities,
  useAllArticles,
  useAllGaleriItems,
  useAllPendaftaran,
  useAllSatuanSSK,
  useAllSliderBanners,
  useAllVideos,
  useContactInfo,
  useProfile,
  useProgramUnggulan,
  useSiteSettings,
  useTeamMembers,
} from "../hooks/useQueries";

// ---- Article ----
interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
}
const emptyArticleForm: ArticleForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  imageUrl: "",
};

// ---- TeamMember ----
interface TeamMemberForm {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}
const emptyTeamForm: TeamMemberForm = {
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
};

// ---- Activity ----
interface ActivityForm {
  title: string;
  description: string;
  date: string;
  location: string;
}
const emptyActivityForm: ActivityForm = {
  title: "",
  description: "",
  date: "",
  location: "",
};
// ---- VideoYoutube ----
interface VideoForm {
  title: string;
  youtubeId: string;
  description: string;
}
const emptyVideoForm: VideoForm = { title: "", youtubeId: "", description: "" };

// ---- GaleriItem ----
interface GaleriForm {
  title: string;
  description: string;
  mediaType: string;
  mediaUrl: string;
}
const emptyGaleriForm: GaleriForm = {
  title: "",
  description: "",
  mediaType: "foto",
  mediaUrl: "",
};

// ---- SatuanSSK ----
interface SatuanForm {
  nama: string;
  ketua: string;
  alamat: string;
  phone: string;
  email: string;
  deskripsi: string;
  logoUrl: string;
}
const emptySatuanForm: SatuanForm = {
  nama: "",
  ketua: "",
  alamat: "",
  phone: "",
  email: "",
  deskripsi: "",
  logoUrl: "",
};

// ---- SliderBanner ----
interface SliderForm {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  urutan: number;
}
const emptySliderForm: SliderForm = {
  title: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  urutan: 1,
};

function bigintToDateStr(ts: bigint) {
  try {
    return new Date(Number(ts / 1_000_000n)).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}
function dateStrToBigint(s: string): bigint {
  return BigInt(new Date(s).getTime()) * 1_000_000n;
}

const formatDate = (ts: bigint) => {
  try {
    return new Date(Number(ts / 1_000_000n)).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

export default function Admin() {
  const { login, clear, isLoggingIn, isInitializing, identity } =
    useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Single-admin enforcement
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [registeringAdmin, setRegisteringAdmin] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  const checkAdminStatus = useCallback(async () => {
    if (!actor || !isAuthenticated) return;
    setCheckingAdmin(true);
    try {
      const adminPrincipal = await actor.getAdminPrincipal();
      const registered = adminPrincipal.length > 0;
      setAdminExists(registered);
      if (registered) {
        const callerIsAdmin = await actor.isCallerAdmin();
        setIsAdmin(callerIsAdmin);
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  }, [actor, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && actor) {
      checkAdminStatus();
    } else {
      setIsAdmin(null);
      setAdminExists(null);
    }
  }, [isAuthenticated, actor, checkAdminStatus]);

  const handleRegisterAdmin = async () => {
    if (!actor) return;
    setRegisteringAdmin(true);
    try {
      const result = await actor.registerAdmin();
      if (result) {
        toast.success("Berhasil terdaftar sebagai admin!");
        await checkAdminStatus();
      } else {
        toast.error("Admin sudah terdaftar oleh akun lain.");
        await checkAdminStatus();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Gagal mendaftar: ${msg}`);
    } finally {
      setRegisteringAdmin(false);
    }
  };

  const handleForceReset = async () => {
    if (!actor) return;
    try {
      await actor.forceResetAdmin();
      toast.success("Admin direset. Silakan daftarkan akun Anda.");
      await checkAdminStatus();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Gagal reset: ${msg}`);
    }
  };

  const handleResetAdmin = async () => {
    if (!actor) return;
    try {
      await actor.resetAdmin();
      toast.success("Admin berhasil direset.");
      await checkAdminStatus();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Gagal reset admin: ${msg}`);
    }
  };

  // ---- Articles state ----
  const { data: articles = [], isLoading: articlesLoading } = useAllArticles();
  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState<ArticleForm>(emptyArticleForm);
  const [deleteArticleTarget, setDeleteArticleTarget] =
    useState<Article | null>(null);

  // ---- Team Members state ----
  const { data: teamMembers = [], isLoading: teamLoading } = useTeamMembers();
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState<TeamMemberForm>(emptyTeamForm);
  const [deleteTeamTarget, setDeleteTeamTarget] = useState<TeamMember | null>(
    null,
  );

  // ---- Activities state ----
  const { data: activities = [], isLoading: activitiesLoading } =
    useAllActivities();
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityForm, setActivityForm] =
    useState<ActivityForm>(emptyActivityForm);
  const [deleteActivityTarget, setDeleteActivityTarget] =
    useState<Activity | null>(null);

  // ---- Contact Info state ----
  const { data: contactInfo } = useContactInfo();
  const [contactForm, setContactForm] = useState({
    address: "",
    phone: "",
    email: "",
    operationalHours: "",
  });
  const [contactLoaded, setContactLoaded] = useState(false);

  // Sync contact form when data loads
  if (contactInfo && !contactLoaded) {
    setContactForm({
      address: contactInfo.address,
      phone: contactInfo.phone,
      email: contactInfo.email,
      operationalHours: contactInfo.operationalHours,
    });
    setContactLoaded(true);
  }

  // ---- Program Unggulan state ----
  const { data: programUnggulanData } = useProgramUnggulan();
  const [programForm, setProgramForm] = useState({
    judul: "",
    deskripsi: "",
    pesertaTerlatih: "",
    programKegiatan: "",
    penghargaan: "",
    kecamatanTerlayani: "",
  });
  const [programLoaded, setProgramLoaded] = useState(false);

  // Sync program form when data loads
  if (programUnggulanData && !programLoaded) {
    setProgramForm({
      judul: programUnggulanData.judul,
      deskripsi: programUnggulanData.deskripsi,
      pesertaTerlatih: programUnggulanData.pesertaTerlatih,
      programKegiatan: programUnggulanData.programKegiatan,
      penghargaan: programUnggulanData.penghargaan,
      kecamatanTerlayani: programUnggulanData.kecamatanTerlayani,
    });
    setProgramLoaded(true);
  }

  // ---- Videos state ----
  const { data: videos = [], isLoading: videosLoading } = useAllVideos();
  const [videoFormOpen, setVideoFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoYoutube | null>(null);
  const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideoForm);
  const [deleteVideoTarget, setDeleteVideoTarget] =
    useState<VideoYoutube | null>(null);

  // ---- Profile state ----
  const { data: profileData } = useProfile();
  const [profileForm, setProfileForm] = useState({
    namaOrganisasi: "",
    tagline: "",
    deskripsi: "",
    visi: "",
    misi: "",
  });
  const [profileLoaded, setProfileLoaded] = useState(false);
  if (profileData && !profileLoaded) {
    setProfileForm({
      namaOrganisasi: profileData.namaOrganisasi,
      tagline: profileData.tagline,
      deskripsi: profileData.deskripsi,
      visi: profileData.visi,
      misi: profileData.misi,
    });
    setProfileLoaded(true);
  }

  // ---- Galeri state ----
  const { data: galeriItems = [], isLoading: galeriLoading } =
    useAllGaleriItems();
  const [galeriFormOpen, setGaleriFormOpen] = useState(false);
  const [editingGaleri, setEditingGaleri] = useState<GaleriItem | null>(null);
  const [galeriForm, setGaleriForm] = useState<GaleriForm>(emptyGaleriForm);
  const [deleteGaleriTarget, setDeleteGaleriTarget] =
    useState<GaleriItem | null>(null);

  // ---- Pendaftaran state ----
  const { data: pendaftaranList = [], isLoading: pendaftaranLoading } =
    useAllPendaftaran();
  const [deletePendaftaranTarget, setDeletePendaftaranTarget] =
    useState<PendaftaranAnggota | null>(null);

  // ---- Satuan SSK state ----
  const { data: satuanList = [], isLoading: satuanLoading } = useAllSatuanSSK();
  const [satuanFormOpen, setSatuanFormOpen] = useState(false);
  const [editingSatuan, setEditingSatuan] = useState<SatuanSSK | null>(null);
  const [satuanForm, setSatuanForm] = useState<SatuanForm>(emptySatuanForm);
  const [deleteSatuanTarget, setDeleteSatuanTarget] =
    useState<SatuanSSK | null>(null);

  // ---- Slider Banner state ----
  const { data: sliderBanners = [], isLoading: sliderLoading } =
    useAllSliderBanners();
  const [sliderFormOpen, setSliderFormOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<SliderBanner | null>(null);
  const [sliderForm, setSliderForm] = useState<SliderForm>(emptySliderForm);
  const [deleteSliderTarget, setDeleteSliderTarget] =
    useState<SliderBanner | null>(null);

  // ---- Site Settings state ----
  const { data: siteSettingsData } = useSiteSettings();
  const [logoUrl, setLogoUrl] = useState("");
  const [siteSettingsLoaded, setSiteSettingsLoaded] = useState(false);
  if (siteSettingsData && !siteSettingsLoaded) {
    setLogoUrl(siteSettingsData.logoUrl);
    setSiteSettingsLoaded(true);
  }

  // ---- Galeri mutations ----
  const createGaleriMutation = useMutation({
    mutationFn: async (data: GaleriForm) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createGaleriItem(
        data.title,
        data.description,
        data.mediaUrl,
        data.mediaType,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeriItems"] });
      toast.success("Item galeri berhasil ditambahkan");
      setGaleriFormOpen(false);
      setGaleriForm(emptyGaleriForm);
    },
    onError: () => toast.error("Gagal menambahkan item galeri"),
  });

  const updateGaleriMutation = useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: GaleriForm }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateGaleriItem(
        id,
        data.title,
        data.description,
        data.mediaUrl,
        data.mediaType,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeriItems"] });
      toast.success("Item galeri berhasil diperbarui");
      setGaleriFormOpen(false);
      setEditingGaleri(null);
      setGaleriForm(emptyGaleriForm);
    },
    onError: () => toast.error("Gagal memperbarui item galeri"),
  });

  const deleteGaleriMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteGaleriItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeriItems"] });
      toast.success("Item galeri berhasil dihapus");
      setDeleteGaleriTarget(null);
    },
    onError: () => toast.error("Gagal menghapus item galeri"),
  });

  // ---- Pendaftaran mutations ----
  const updatePendaftaranMutation = useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePendaftaranStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendaftaran"] });
      toast.success("Status pendaftaran diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui status"),
  });

  const deletePendaftaranMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deletePendaftaran(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendaftaran"] });
      toast.success("Data pendaftaran dihapus");
      setDeletePendaftaranTarget(null);
    },
    onError: () => toast.error("Gagal menghapus pendaftaran"),
  });

  // ---- Satuan SSK mutations ----
  const createSatuanMutation = useMutation({
    mutationFn: async (data: SatuanForm) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSatuanSSK(
        data.nama,
        data.alamat,
        data.phone,
        data.email,
        data.deskripsi,
        data.logoUrl,
        data.ketua,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuanSSK"] });
      toast.success("Satuan berhasil ditambahkan");
      setSatuanFormOpen(false);
      setSatuanForm(emptySatuanForm);
    },
    onError: () => toast.error("Gagal menambahkan satuan"),
  });

  const updateSatuanMutation = useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: SatuanForm }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSatuanSSK(
        id,
        data.nama,
        data.alamat,
        data.phone,
        data.email,
        data.deskripsi,
        data.logoUrl,
        data.ketua,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuanSSK"] });
      toast.success("Satuan berhasil diperbarui");
      setSatuanFormOpen(false);
      setEditingSatuan(null);
      setSatuanForm(emptySatuanForm);
    },
    onError: () => toast.error("Gagal memperbarui satuan"),
  });

  const deleteSatuanMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSatuanSSK(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuanSSK"] });
      toast.success("Satuan berhasil dihapus");
      setDeleteSatuanTarget(null);
    },
    onError: () => toast.error("Gagal menghapus satuan"),
  });

  // ---- Site Settings mutation ----
  const updateSiteSettingsMutation = useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSiteSettings(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Logo berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui logo"),
  });

  // ---- Slider Banner mutations ----
  const createSliderMutation = useMutation({
    mutationFn: async (data: SliderForm) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSliderBanner(
        data.title,
        data.description,
        data.imageUrl,
        data.linkUrl,
        BigInt(data.urutan),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliderBanners"] });
      toast.success("Slide berhasil ditambahkan");
      setSliderFormOpen(false);
      setSliderForm(emptySliderForm);
    },
    onError: () => toast.error("Gagal menambahkan slide"),
  });

  const updateSliderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: SliderForm }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSliderBanner(
        id,
        data.title,
        data.description,
        data.imageUrl,
        data.linkUrl,
        BigInt(data.urutan),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliderBanners"] });
      toast.success("Slide berhasil diperbarui");
      setSliderFormOpen(false);
      setEditingSlider(null);
      setSliderForm(emptySliderForm);
    },
    onError: () => toast.error("Gagal memperbarui slide"),
  });

  const deleteSliderMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSliderBanner(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliderBanners"] });
      toast.success("Slide berhasil dihapus");
      setDeleteSliderTarget(null);
    },
    onError: () => toast.error("Gagal menghapus slide"),
  });

  // ---- Article mutations ----
  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleForm) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createArticle(
        data.title,
        data.excerpt,
        data.content,
        data.category,
        data.imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel berhasil ditambahkan");
      setArticleFormOpen(false);
      setArticleForm(emptyArticleForm);
    },
    onError: () => toast.error("Gagal menambahkan artikel"),
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: ArticleForm }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateArticle(
        id,
        data.title,
        data.excerpt,
        data.content,
        data.category,
        data.imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel berhasil diperbarui");
      setArticleFormOpen(false);
      setEditingArticle(null);
      setArticleForm(emptyArticleForm);
    },
    onError: () => toast.error("Gagal memperbarui artikel"),
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel berhasil dihapus");
      setDeleteArticleTarget(null);
    },
    onError: () => toast.error("Gagal menghapus artikel"),
  });

  // ---- Team mutations ----
  const createTeamMutation = useMutation({
    mutationFn: async (data: TeamMemberForm) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createTeamMember(
        data.name,
        data.role,
        data.bio,
        data.imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Anggota tim berhasil ditambahkan");
      setTeamFormOpen(false);
      setTeamForm(emptyTeamForm);
    },
    onError: () => toast.error("Gagal menambahkan anggota tim"),
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: TeamMemberForm }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateTeamMember(
        id,
        data.name,
        data.role,
        data.bio,
        data.imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Anggota tim berhasil diperbarui");
      setTeamFormOpen(false);
      setEditingTeam(null);
      setTeamForm(emptyTeamForm);
    },
    onError: () => toast.error("Gagal memperbarui anggota tim"),
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteTeamMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Anggota tim berhasil dihapus");
      setDeleteTeamTarget(null);
    },
    onError: () => toast.error("Gagal menghapus anggota tim"),
  });

  // ---- Activity mutations ----
  const createActivityMutation = useMutation({
    mutationFn: async (data: ActivityForm) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createActivity(
        data.title,
        data.description,
        dateStrToBigint(data.date),
        data.location,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Kegiatan berhasil ditambahkan");
      setActivityFormOpen(false);
      setActivityForm(emptyActivityForm);
    },
    onError: () => toast.error("Gagal menambahkan kegiatan"),
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: ActivityForm }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateActivity(
        id,
        data.title,
        data.description,
        dateStrToBigint(data.date),
        data.location,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Kegiatan berhasil diperbarui");
      setActivityFormOpen(false);
      setEditingActivity(null);
      setActivityForm(emptyActivityForm);
    },
    onError: () => toast.error("Gagal memperbarui kegiatan"),
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteActivity(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Kegiatan berhasil dihapus");
      setDeleteActivityTarget(null);
    },
    onError: () => toast.error("Gagal menghapus kegiatan"),
  });

  // ---- Contact mutation ----
  const updateContactMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateContactInfo(
        contactForm.address,
        contactForm.phone,
        contactForm.email,
        contactForm.operationalHours,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactInfo"] });
      setContactLoaded(false);
      toast.success("Informasi kontak berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui informasi kontak"),
  });

  // ---- Program Unggulan mutation ----
  const updateProgramMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProgramUnggulan(
        programForm.judul,
        programForm.deskripsi,
        programForm.pesertaTerlatih,
        programForm.programKegiatan,
        programForm.penghargaan,
        programForm.kecamatanTerlayani,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programUnggulan"] });
      setProgramLoaded(false);
      toast.success("Program Unggulan berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui Program Unggulan"),
  });

  // ---- Video mutations ----
  const createVideoMutation = useMutation({
    mutationFn: async (data: VideoForm) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).createVideo(
        data.title,
        data.youtubeId,
        data.description,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setVideoFormOpen(false);
      setVideoForm(emptyVideoForm);
      toast.success("Video berhasil ditambahkan");
    },
    onError: () => toast.error("Gagal menambahkan video"),
  });

  const updateVideoMutation = useMutation({
    mutationFn: async (data: VideoForm) => {
      if (!actor || !editingVideo) throw new Error("Actor not ready");
      return (actor as any).updateVideo(
        editingVideo.id,
        data.title,
        data.youtubeId,
        data.description,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setVideoFormOpen(false);
      setEditingVideo(null);
      setVideoForm(emptyVideoForm);
      toast.success("Video berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui video"),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setDeleteVideoTarget(null);
      toast.success("Video berhasil dihapus");
    },
    onError: () => toast.error("Gagal menghapus video"),
  });

  // ---- Profile mutation ----
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).updateProfile(
        profileForm.namaOrganisasi,
        profileForm.tagline,
        profileForm.deskripsi,
        profileForm.visi,
        profileForm.misi,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setProfileLoaded(false);
      toast.success("Profil berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui profil"),
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-navy" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Panel Admin</h1>
                <p className="text-sm text-gray-300">SSK Kabupaten Subang</p>
              </div>
            </div>
            {isAuthenticated && isAdmin && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {identity?.getPrincipal().toString().slice(0, 20)}…
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetAdmin}
                  className="border-red-400/50 text-red-400 hover:bg-red-500 hover:text-white text-xs"
                  data-ocid="admin.reset_button"
                >
                  Reset Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="border-gold/50 text-gold hover:bg-gold hover:text-navy"
                  data-ocid="admin.logout_button"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Keluar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {isInitializing ? (
          <div
            className="flex items-center justify-center py-32"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-navy" />
          </div>
        ) : !isAuthenticated ? (
          <div className="flex items-center justify-center py-24">
            <Card className="w-full max-w-sm shadow-lg border-0">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gold" />
                </div>
                <CardTitle className="text-navy text-xl">Login Admin</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Masuk dengan Internet Identity untuk mengelola konten website
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  className="w-full bg-navy hover:bg-navy/90 text-white"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="admin.login_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Menghubungkan…
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" /> Masuk dengan Internet
                      Identity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : checkingAdmin ? (
          <div
            className="flex items-center justify-center py-32"
            data-ocid="admin.checking_admin"
          >
            <Loader2 className="w-8 h-8 animate-spin text-navy" />
            <span className="ml-3 text-navy">Memeriksa akses admin...</span>
          </div>
        ) : !isAdmin && !adminExists ? (
          <div className="flex items-center justify-center py-24">
            <Card className="w-full max-w-sm shadow-lg border-0">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gold" />
                </div>
                <CardTitle className="text-navy text-xl">
                  Daftar Sebagai Admin
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Belum ada admin yang terdaftar. Klik tombol di bawah untuk
                  mendaftarkan akun Anda sebagai admin pertama.
                </p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button
                  className="w-full bg-navy hover:bg-navy/90 text-white"
                  onClick={handleRegisterAdmin}
                  disabled={registeringAdmin}
                  data-ocid="admin.register_button"
                >
                  {registeringAdmin ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Daftarkan sebagai Admin
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-500 hover:bg-red-50"
                  onClick={clear}
                >
                  <LogOut className="w-4 h-4 mr-1" /> Keluar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : !isAdmin ? (
          <div className="flex items-center justify-center py-24">
            <Card className="w-full max-w-sm shadow-lg border-0">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
                <CardTitle className="text-red-600 text-xl">
                  Akses Ditolak
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Akun Anda tidak terdaftar sebagai admin. Hanya satu akun admin
                  yang diizinkan.
                </p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold"
                  onClick={handleForceReset}
                  data-ocid="admin.force_reset_button"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Ambil Alih sebagai Admin
                </Button>
                <Button variant="outline" className="w-full" onClick={clear}>
                  <LogOut className="w-4 h-4 mr-1" /> Keluar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <Tabs
              defaultValue="berita"
              className="space-y-6"
              data-ocid="admin.tab"
            >
              <TabsList className="bg-navy/10 border border-navy/20">
                <TabsTrigger
                  value="berita"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.berita.tab"
                >
                  Berita
                </TabsTrigger>
                <TabsTrigger
                  value="anggota"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.anggota.tab"
                >
                  Anggota Tim
                </TabsTrigger>
                <TabsTrigger
                  value="kegiatan"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.kegiatan.tab"
                >
                  Kegiatan
                </TabsTrigger>
                <TabsTrigger
                  value="kontak"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.kontak.tab"
                >
                  Kontak
                </TabsTrigger>
                <TabsTrigger
                  value="program-unggulan"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.program_unggulan.tab"
                >
                  Program Unggulan
                </TabsTrigger>
                <TabsTrigger
                  value="video-youtube"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.video.tab"
                >
                  Video YouTube
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.profile.tab"
                >
                  Profil
                </TabsTrigger>
                <TabsTrigger
                  value="galeri"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.galeri.tab"
                >
                  Galeri Kegiatan
                </TabsTrigger>
                <TabsTrigger
                  value="pendaftaran"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.pendaftaran.tab"
                >
                  Pendaftaran
                </TabsTrigger>
                <TabsTrigger
                  value="satuan"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.satuan.tab"
                >
                  Satuan SSK
                </TabsTrigger>
                <TabsTrigger
                  value="pengaturan-logo"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.logo.tab"
                >
                  Pengaturan Logo
                </TabsTrigger>
                <TabsTrigger
                  value="slider"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white"
                  data-ocid="admin.slider.tab"
                >
                  Slider Banner
                </TabsTrigger>
              </TabsList>

              {/* ---- BERITA TAB ---- */}
              <TabsContent value="berita" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      Manajemen Berita
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {articles.length} artikel tersedia
                    </p>
                  </div>
                  <Button
                    className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                    onClick={() => {
                      setEditingArticle(null);
                      setArticleForm(emptyArticleForm);
                      setArticleFormOpen(true);
                    }}
                    data-ocid="admin.berita.primary_button"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Artikel
                  </Button>
                </div>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {articlesLoading ? (
                      <div
                        className="flex items-center justify-center py-20"
                        data-ocid="admin.berita.loading_state"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-navy" />
                      </div>
                    ) : articles.length === 0 ? (
                      <div
                        className="text-center py-20 text-gray-400"
                        data-ocid="admin.berita.empty_state"
                      >
                        <p className="font-medium">Belum ada artikel</p>
                      </div>
                    ) : (
                      <Table data-ocid="admin.berita.table">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-navy">
                              Judul
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Kategori
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Tanggal
                            </TableHead>
                            <TableHead className="font-semibold text-navy text-right">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {articles.map((article, i) => (
                            <TableRow
                              key={article.id.toString()}
                              data-ocid={`admin.berita.item.${i + 1}`}
                            >
                              <TableCell>
                                <p className="font-medium text-gray-900 line-clamp-1">
                                  {article.title}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                  {article.excerpt}
                                </p>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="bg-navy/10 text-navy text-xs"
                                >
                                  {article.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {formatDate(article.date)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-navy hover:bg-navy/10"
                                    onClick={() => {
                                      setEditingArticle(article);
                                      setArticleForm({
                                        title: article.title,
                                        excerpt: article.excerpt,
                                        content: article.content,
                                        category: article.category,
                                        imageUrl: article.imageUrl,
                                      });
                                      setArticleFormOpen(true);
                                    }}
                                    data-ocid={`admin.berita.edit_button.${i + 1}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() =>
                                      setDeleteArticleTarget(article)
                                    }
                                    data-ocid={`admin.berita.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- ANGGOTA TIM TAB ---- */}
              <TabsContent value="anggota" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      Manajemen Anggota Tim
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {teamMembers.length} anggota terdaftar
                    </p>
                  </div>
                  <Button
                    className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                    onClick={() => {
                      setEditingTeam(null);
                      setTeamForm(emptyTeamForm);
                      setTeamFormOpen(true);
                    }}
                    data-ocid="admin.anggota.primary_button"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Anggota
                  </Button>
                </div>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {teamLoading ? (
                      <div
                        className="flex items-center justify-center py-20"
                        data-ocid="admin.anggota.loading_state"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-navy" />
                      </div>
                    ) : teamMembers.length === 0 ? (
                      <div
                        className="text-center py-20 text-gray-400"
                        data-ocid="admin.anggota.empty_state"
                      >
                        <p className="font-medium">Belum ada anggota tim</p>
                      </div>
                    ) : (
                      <Table data-ocid="admin.anggota.table">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-navy">
                              Nama
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Jabatan
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Bio
                            </TableHead>
                            <TableHead className="font-semibold text-navy text-right">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamMembers.map((member, i) => (
                            <TableRow
                              key={member.id.toString()}
                              data-ocid={`admin.anggota.item.${i + 1}`}
                            >
                              <TableCell className="font-medium">
                                {member.name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="bg-gold/20 text-navy text-xs"
                                >
                                  {member.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500 max-w-xs">
                                <p className="line-clamp-2">{member.bio}</p>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-navy hover:bg-navy/10"
                                    onClick={() => {
                                      setEditingTeam(member);
                                      setTeamForm({
                                        name: member.name,
                                        role: member.role,
                                        bio: member.bio,
                                        imageUrl: member.imageUrl,
                                      });
                                      setTeamFormOpen(true);
                                    }}
                                    data-ocid={`admin.anggota.edit_button.${i + 1}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() => setDeleteTeamTarget(member)}
                                    data-ocid={`admin.anggota.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- KEGIATAN TAB ---- */}
              <TabsContent value="kegiatan" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      Manajemen Kegiatan
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {activities.length} kegiatan terdaftar
                    </p>
                  </div>
                  <Button
                    className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                    onClick={() => {
                      setEditingActivity(null);
                      setActivityForm(emptyActivityForm);
                      setActivityFormOpen(true);
                    }}
                    data-ocid="admin.kegiatan.primary_button"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Kegiatan
                  </Button>
                </div>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {activitiesLoading ? (
                      <div
                        className="flex items-center justify-center py-20"
                        data-ocid="admin.kegiatan.loading_state"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-navy" />
                      </div>
                    ) : activities.length === 0 ? (
                      <div
                        className="text-center py-20 text-gray-400"
                        data-ocid="admin.kegiatan.empty_state"
                      >
                        <p className="font-medium">Belum ada kegiatan</p>
                      </div>
                    ) : (
                      <Table data-ocid="admin.kegiatan.table">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-navy">
                              Judul
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Tanggal
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Lokasi
                            </TableHead>
                            <TableHead className="font-semibold text-navy text-right">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activities.map((activity, i) => (
                            <TableRow
                              key={activity.id.toString()}
                              data-ocid={`admin.kegiatan.item.${i + 1}`}
                            >
                              <TableCell>
                                <p className="font-medium text-gray-900">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                  {activity.description}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {formatDate(activity.date)}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {activity.location}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-navy hover:bg-navy/10"
                                    onClick={() => {
                                      setEditingActivity(activity);
                                      setActivityForm({
                                        title: activity.title,
                                        description: activity.description,
                                        date: bigintToDateStr(activity.date),
                                        location: activity.location,
                                      });
                                      setActivityFormOpen(true);
                                    }}
                                    data-ocid={`admin.kegiatan.edit_button.${i + 1}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() =>
                                      setDeleteActivityTarget(activity)
                                    }
                                    data-ocid={`admin.kegiatan.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- KONTAK TAB ---- */}
              <TabsContent value="kontak" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy">
                    Informasi Kontak
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Perbarui informasi kontak yang ditampilkan di website
                  </p>
                </div>
                <Card className="shadow-sm border-0 max-w-2xl">
                  <CardHeader>
                    <CardTitle className="text-navy text-lg">
                      Edit Informasi Kontak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateContactMutation.mutate();
                      }}
                    >
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="contact-address"
                          className="text-navy font-medium"
                        >
                          Alamat
                        </Label>
                        <Textarea
                          id="contact-address"
                          value={contactForm.address}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          placeholder="Alamat kantor..."
                          rows={2}
                          data-ocid="admin.kontak.address.textarea"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="contact-phone"
                          className="text-navy font-medium"
                        >
                          Telepon
                        </Label>
                        <Input
                          id="contact-phone"
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="(0260) 411-xxxx"
                          data-ocid="admin.kontak.phone.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="contact-email"
                          className="text-navy font-medium"
                        >
                          Email
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="info@ssk-subang.go.id"
                          data-ocid="admin.kontak.email.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="contact-hours"
                          className="text-navy font-medium"
                        >
                          Jam Operasional
                        </Label>
                        <Input
                          id="contact-hours"
                          value={contactForm.operationalHours}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              operationalHours: e.target.value,
                            }))
                          }
                          placeholder="Senin – Jumat, 08.00 – 16.00 WIB"
                          data-ocid="admin.kontak.hours.input"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                        disabled={updateContactMutation.isPending}
                        data-ocid="admin.kontak.save_button"
                      >
                        {updateContactMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                            Menyimpan…
                          </>
                        ) : (
                          "Simpan Perubahan"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- PROGRAM UNGGULAN TAB ---- */}
              <TabsContent value="program-unggulan" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy">
                    Program Unggulan
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Perbarui data Program Unggulan yang ditampilkan di halaman
                    utama
                  </p>
                </div>
                <Card className="shadow-sm border-0 max-w-2xl">
                  <CardHeader>
                    <CardTitle className="text-navy text-lg">
                      Edit Program Unggulan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateProgramMutation.mutate();
                      }}
                    >
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="program-judul"
                          className="text-navy font-medium"
                        >
                          Judul
                        </Label>
                        <input
                          id="program-judul"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={programForm.judul}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              judul: e.target.value,
                            }))
                          }
                          placeholder="Program Unggulan SSK Kabupaten Subang"
                          data-ocid="admin.program_unggulan.judul.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="program-deskripsi"
                          className="text-navy font-medium"
                        >
                          Deskripsi
                        </Label>
                        <Textarea
                          id="program-deskripsi"
                          value={programForm.deskripsi}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              deskripsi: e.target.value,
                            }))
                          }
                          placeholder="Deskripsi program unggulan..."
                          rows={3}
                          data-ocid="admin.program_unggulan.deskripsi.textarea"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="program-peserta"
                            className="text-navy font-medium"
                          >
                            Peserta Terlatih
                          </Label>
                          <input
                            id="program-peserta"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={programForm.pesertaTerlatih}
                            onChange={(e) =>
                              setProgramForm((prev) => ({
                                ...prev,
                                pesertaTerlatih: e.target.value,
                              }))
                            }
                            placeholder="1.000+"
                            data-ocid="admin.program_unggulan.peserta.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="program-kegiatan"
                            className="text-navy font-medium"
                          >
                            Program Kegiatan
                          </Label>
                          <input
                            id="program-kegiatan"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={programForm.programKegiatan}
                            onChange={(e) =>
                              setProgramForm((prev) => ({
                                ...prev,
                                programKegiatan: e.target.value,
                              }))
                            }
                            placeholder="15+"
                            data-ocid="admin.program_unggulan.kegiatan.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="program-penghargaan"
                            className="text-navy font-medium"
                          >
                            Penghargaan
                          </Label>
                          <input
                            id="program-penghargaan"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={programForm.penghargaan}
                            onChange={(e) =>
                              setProgramForm((prev) => ({
                                ...prev,
                                penghargaan: e.target.value,
                              }))
                            }
                            placeholder="5+"
                            data-ocid="admin.program_unggulan.penghargaan.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="program-kecamatan"
                            className="text-navy font-medium"
                          >
                            Kecamatan Terlayani
                          </Label>
                          <input
                            id="program-kecamatan"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={programForm.kecamatanTerlayani}
                            onChange={(e) =>
                              setProgramForm((prev) => ({
                                ...prev,
                                kecamatanTerlayani: e.target.value,
                              }))
                            }
                            placeholder="30+"
                            data-ocid="admin.program_unggulan.kecamatan.input"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="bg-navy hover:bg-navy-light text-white w-full mt-2"
                        disabled={updateProgramMutation.isPending}
                        data-ocid="admin.program_unggulan.save_button"
                      >
                        {updateProgramMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan Perubahan"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- VIDEO YOUTUBE TAB ---- */}
              <TabsContent value="video-youtube" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      Video YouTube
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {videos.length} video terdaftar
                    </p>
                  </div>
                  <Button
                    className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                    onClick={() => {
                      setEditingVideo(null);
                      setVideoForm(emptyVideoForm);
                      setVideoFormOpen(true);
                    }}
                    data-ocid="admin.video.primary_button"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Video
                  </Button>
                </div>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {videosLoading ? (
                      <div
                        className="flex items-center justify-center py-20"
                        data-ocid="admin.video.loading_state"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-navy" />
                      </div>
                    ) : videos.length === 0 ? (
                      <div
                        className="text-center py-20 text-gray-400"
                        data-ocid="admin.video.empty_state"
                      >
                        <p className="font-medium">Belum ada video</p>
                      </div>
                    ) : (
                      <Table data-ocid="admin.video.table">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-navy">
                              Judul
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              YouTube ID
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Deskripsi
                            </TableHead>
                            <TableHead className="font-semibold text-navy text-right">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {videos.map((video, i) => (
                            <TableRow
                              key={video.id.toString()}
                              data-ocid={`admin.video.item.${i + 1}`}
                            >
                              <TableCell>
                                <p className="font-medium text-gray-900">
                                  {video.title}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm text-blue-600">
                                <a
                                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {video.youtubeId}
                                </a>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 max-w-xs line-clamp-2">
                                {video.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-navy hover:bg-navy/10"
                                    onClick={() => {
                                      setEditingVideo(video);
                                      setVideoForm({
                                        title: video.title,
                                        youtubeId: video.youtubeId,
                                        description: video.description,
                                      });
                                      setVideoFormOpen(true);
                                    }}
                                    data-ocid={`admin.video.edit_button.${i + 1}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() => setDeleteVideoTarget(video)}
                                    data-ocid={`admin.video.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- PROFILE TAB ---- */}
              <TabsContent value="profile" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy">
                    Profil Organisasi
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Edit informasi profil organisasi SSK Kabupaten Subang
                  </p>
                </div>
                <Card className="shadow-sm border-0">
                  <CardHeader className="border-b">
                    <CardTitle className="text-navy text-lg">
                      Informasi Profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateProfileMutation.mutate();
                      }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="namaOrganisasi"
                          className="text-navy font-medium"
                        >
                          Nama Organisasi
                        </Label>
                        <Input
                          id="namaOrganisasi"
                          value={profileForm.namaOrganisasi}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              namaOrganisasi: e.target.value,
                            }))
                          }
                          placeholder="Nama organisasi"
                          data-ocid="admin.profile.input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="tagline"
                          className="text-navy font-medium"
                        >
                          Tagline / Slogan
                        </Label>
                        <Input
                          id="tagline"
                          value={profileForm.tagline}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              tagline: e.target.value,
                            }))
                          }
                          placeholder="Tagline atau slogan organisasi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="deskripsi"
                          className="text-navy font-medium"
                        >
                          Deskripsi Singkat
                        </Label>
                        <Input
                          id="deskripsi"
                          value={profileForm.deskripsi}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              deskripsi: e.target.value,
                            }))
                          }
                          placeholder="Deskripsi singkat organisasi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visi" className="text-navy font-medium">
                          Visi
                        </Label>
                        <Textarea
                          id="visi"
                          rows={3}
                          value={profileForm.visi}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              visi: e.target.value,
                            }))
                          }
                          placeholder="Visi organisasi"
                          data-ocid="admin.profile.textarea"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="misi" className="text-navy font-medium">
                          Misi
                        </Label>
                        <Textarea
                          id="misi"
                          rows={3}
                          value={profileForm.misi}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              misi: e.target.value,
                            }))
                          }
                          placeholder="Misi organisasi"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          type="submit"
                          className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                          disabled={updateProfileMutation.isPending}
                          data-ocid="admin.profile.submit_button"
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                              Menyimpan…
                            </>
                          ) : (
                            "Simpan Perubahan"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- GALERI TAB ---- */}
              <TabsContent value="galeri" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      Galeri Kegiatan
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {galeriItems.length} item tersedia
                    </p>
                  </div>
                  <Button
                    className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                    onClick={() => {
                      setEditingGaleri(null);
                      setGaleriForm(emptyGaleriForm);
                      setGaleriFormOpen(true);
                    }}
                    data-ocid="admin.galeri.primary_button"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Item
                  </Button>
                </div>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {galeriLoading ? (
                      <div
                        className="flex items-center justify-center py-20"
                        data-ocid="admin.galeri.loading_state"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-navy" />
                      </div>
                    ) : galeriItems.length === 0 ? (
                      <div
                        className="text-center py-20 text-gray-400"
                        data-ocid="admin.galeri.empty_state"
                      >
                        <p className="font-medium">Belum ada item galeri</p>
                      </div>
                    ) : (
                      <Table data-ocid="admin.galeri.table">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-navy">
                              Judul
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Tipe
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Tanggal
                            </TableHead>
                            <TableHead className="font-semibold text-navy text-right">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {galeriItems.map((item, i) => (
                            <TableRow
                              key={item.id.toString()}
                              data-ocid={`admin.galeri.item.${i + 1}`}
                            >
                              <TableCell>
                                <p className="font-medium text-gray-900 line-clamp-1">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="bg-navy/10 text-navy text-xs"
                                >
                                  {item.mediaType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {formatDate(item.tanggal)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-navy hover:bg-navy/10"
                                    onClick={() => {
                                      setEditingGaleri(item);
                                      setGaleriForm({
                                        title: item.title,
                                        description: item.description,
                                        mediaType: item.mediaType,
                                        mediaUrl: item.mediaUrl,
                                      });
                                      setGaleriFormOpen(true);
                                    }}
                                    data-ocid={`admin.galeri.edit_button.${i + 1}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() => setDeleteGaleriTarget(item)}
                                    data-ocid={`admin.galeri.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- PENDAFTARAN TAB ---- */}
              <TabsContent value="pendaftaran" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy">
                    Pendaftaran Anggota
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {pendaftaranList.length} pendaftar
                  </p>
                </div>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {pendaftaranLoading ? (
                      <div
                        className="flex items-center justify-center py-20"
                        data-ocid="admin.pendaftaran.loading_state"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-navy" />
                      </div>
                    ) : pendaftaranList.length === 0 ? (
                      <div
                        className="text-center py-20 text-gray-400"
                        data-ocid="admin.pendaftaran.empty_state"
                      >
                        <p className="font-medium">Belum ada pendaftaran</p>
                      </div>
                    ) : (
                      <Table data-ocid="admin.pendaftaran.table">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-navy">
                              Nama
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              NIK
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Email / HP
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Pekerjaan
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Tanggal
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-navy text-right">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendaftaranList.map((p, i) => (
                            <TableRow
                              key={p.id.toString()}
                              data-ocid={`admin.pendaftaran.item.${i + 1}`}
                            >
                              <TableCell>
                                <p className="font-medium text-gray-900">
                                  {p.nama}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {p.alamat}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {p.nik}
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-gray-700">
                                  {p.email}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {p.phone}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {p.pekerjaan}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {formatDate(p.tanggalDaftar)}
                              </TableCell>
                              <TableCell>
                                <select
                                  value={p.status}
                                  onChange={(e) =>
                                    updatePendaftaranMutation.mutate({
                                      id: p.id,
                                      status: e.target.value,
                                    })
                                  }
                                  className={`text-xs font-semibold px-2 py-1 rounded border-0 outline-none cursor-pointer ${
                                    p.status === "Diterima"
                                      ? "bg-green-100 text-green-700"
                                      : p.status === "Ditolak"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                  }`}
                                  data-ocid={`admin.pendaftaran.select.${i + 1}`}
                                >
                                  <option value="Menunggu">Menunggu</option>
                                  <option value="Diterima">Diterima</option>
                                  <option value="Ditolak">Ditolak</option>
                                </select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:bg-red-50"
                                  onClick={() => setDeletePendaftaranTarget(p)}
                                  data-ocid={`admin.pendaftaran.delete_button.${i + 1}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- SATUAN SSK TAB ---- */}
              <TabsContent value="satuan" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">Satuan SSK</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {satuanList.length} satuan terdaftar
                    </p>
                  </div>
                  <Button
                    className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                    onClick={() => {
                      setEditingSatuan(null);
                      setSatuanForm(emptySatuanForm);
                      setSatuanFormOpen(true);
                    }}
                    data-ocid="admin.satuan.primary_button"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Satuan
                  </Button>
                </div>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {satuanLoading ? (
                      <div
                        className="flex items-center justify-center py-20"
                        data-ocid="admin.satuan.loading_state"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-navy" />
                      </div>
                    ) : satuanList.length === 0 ? (
                      <div
                        className="text-center py-20 text-gray-400"
                        data-ocid="admin.satuan.empty_state"
                      >
                        <p className="font-medium">
                          Belum ada satuan terdaftar
                        </p>
                      </div>
                    ) : (
                      <Table data-ocid="admin.satuan.table">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-navy">
                              Nama Satuan
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Ketua
                            </TableHead>
                            <TableHead className="font-semibold text-navy">
                              Kontak
                            </TableHead>
                            <TableHead className="font-semibold text-navy text-right">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {satuanList.map((s, i) => (
                            <TableRow
                              key={s.id.toString()}
                              data-ocid={`admin.satuan.item.${i + 1}`}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {s.logoUrl && (
                                    <img
                                      src={s.logoUrl}
                                      alt={s.nama}
                                      className="w-8 h-8 rounded-full object-contain border"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {s.nama}
                                    </p>
                                    <p className="text-xs text-gray-400 line-clamp-1">
                                      {s.deskripsi}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {s.ketua}
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-gray-700">
                                  {s.phone}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {s.email}
                                </p>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-navy hover:bg-navy/10"
                                    onClick={() => {
                                      setEditingSatuan(s);
                                      setSatuanForm({
                                        nama: s.nama,
                                        ketua: s.ketua,
                                        alamat: s.alamat,
                                        phone: s.phone,
                                        email: s.email,
                                        deskripsi: s.deskripsi,
                                        logoUrl: s.logoUrl,
                                      });
                                      setSatuanFormOpen(true);
                                    }}
                                    data-ocid={`admin.satuan.edit_button.${i + 1}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() => setDeleteSatuanTarget(s)}
                                    data-ocid={`admin.satuan.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- PENGATURAN LOGO TAB ---- */}
              <TabsContent value="pengaturan-logo" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy">
                    Pengaturan Logo
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Ubah logo yang tampil di header dan footer website
                  </p>
                </div>
                <Card className="shadow-sm border-0 max-w-lg">
                  <CardHeader>
                    <CardTitle className="text-navy text-lg">
                      Logo Website
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {logoUrl && (
                      <div className="flex items-center justify-center p-4 bg-navy/5 rounded-lg">
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          className="max-h-24 max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-navy font-semibold">
                        Upload Logo dari Galeri
                      </Label>
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-navy cursor-pointer"
                        data-ocid="admin.logo.upload_button"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await compressImageToBase64(file);
                            setLogoUrl(base64);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-navy font-semibold">
                        Atau Masukkan URL Logo
                      </Label>
                      <Input
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="border-gray-300"
                        data-ocid="admin.logo.input"
                      />
                    </div>
                    <Button
                      className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold"
                      onClick={() => updateSiteSettingsMutation.mutate(logoUrl)}
                      disabled={updateSiteSettingsMutation.isPending}
                      data-ocid="admin.logo.save_button"
                    >
                      {updateSiteSettingsMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Logo"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Slider Banner Tab */}
              <TabsContent value="slider" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      Manajemen Slider Banner
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {sliderBanners.length} slide tersedia
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
                    onClick={() => {
                      setEditingSlider(null);
                      setSliderForm(emptySliderForm);
                      setSliderFormOpen(true);
                    }}
                    data-ocid="admin.slider.open_modal_button"
                  >
                    <Plus className="w-4 h-4" /> Tambah Slide
                  </button>
                </div>

                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    {sliderLoading ? (
                      <div
                        className="flex items-center justify-center py-12"
                        data-ocid="admin.slider.loading_state"
                      >
                        <Loader2 className="w-8 h-8 animate-spin text-navy" />
                      </div>
                    ) : sliderBanners.length === 0 ? (
                      <div
                        className="text-center py-12 text-gray-400"
                        data-ocid="admin.slider.empty_state"
                      >
                        <p>Belum ada slide. Tambah slide pertama Anda.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-navy font-bold">
                              Urutan
                            </TableHead>
                            <TableHead className="text-navy font-bold">
                              Judul
                            </TableHead>
                            <TableHead className="text-navy font-bold">
                              Gambar
                            </TableHead>
                            <TableHead className="text-navy font-bold">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...sliderBanners]
                            .sort((a, b) => Number(a.urutan) - Number(b.urutan))
                            .map((slide, index) => (
                              <TableRow
                                key={slide.id.toString()}
                                data-ocid={`admin.slider.row.${index + 1}`}
                              >
                                <TableCell className="font-bold text-navy">
                                  {Number(slide.urutan)}
                                </TableCell>
                                <TableCell>
                                  <p className="font-semibold text-navy">
                                    {slide.title}
                                  </p>
                                  {slide.description && (
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                      {slide.description}
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {slide.imageUrl ? (
                                    <img
                                      src={slide.imageUrl}
                                      alt={slide.title}
                                      className="w-16 h-10 object-cover rounded"
                                    />
                                  ) : (
                                    <span className="text-gray-400 text-xs">
                                      No image
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      className="p-1.5 bg-navy/10 hover:bg-navy/20 rounded text-navy transition-colors"
                                      onClick={() => {
                                        setEditingSlider(slide);
                                        setSliderForm({
                                          title: slide.title,
                                          description: slide.description,
                                          imageUrl: slide.imageUrl,
                                          linkUrl: slide.linkUrl,
                                          urutan: Number(slide.urutan),
                                        });
                                        setSliderFormOpen(true);
                                      }}
                                      data-ocid={`admin.slider.edit_button.${index + 1}`}
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-500 transition-colors"
                                      onClick={() =>
                                        setDeleteSliderTarget(slide)
                                      }
                                      data-ocid={`admin.slider.delete_button.${index + 1}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Article Form Dialog */}
      <Dialog open={articleFormOpen} onOpenChange={setArticleFormOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.article.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingArticle
                ? "Perbarui informasi artikel."
                : "Isi informasi artikel baru."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingArticle) {
                updateArticleMutation.mutate({
                  id: editingArticle.id,
                  data: articleForm,
                });
              } else {
                createArticleMutation.mutate(articleForm);
              }
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="art-title" className="text-navy font-medium">
                Judul
              </Label>
              <Input
                id="art-title"
                value={articleForm.title}
                onChange={(e) =>
                  setArticleForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Judul artikel..."
                required
                data-ocid="admin.article.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="art-category" className="text-navy font-medium">
                Kategori
              </Label>
              <Input
                id="art-category"
                value={articleForm.category}
                onChange={(e) =>
                  setArticleForm((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="Berita, Kegiatan..."
                required
                data-ocid="admin.article.category.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="art-excerpt" className="text-navy font-medium">
                Ringkasan
              </Label>
              <Textarea
                id="art-excerpt"
                value={articleForm.excerpt}
                onChange={(e) =>
                  setArticleForm((p) => ({ ...p, excerpt: e.target.value }))
                }
                rows={2}
                required
                data-ocid="admin.article.excerpt.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="art-content" className="text-navy font-medium">
                Konten
              </Label>
              <Textarea
                id="art-content"
                value={articleForm.content}
                onChange={(e) =>
                  setArticleForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={8}
                required
                data-ocid="admin.article.content.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="art-image" className="text-navy font-medium">
                Foto/Gambar
              </Label>
              {articleForm.imageUrl && (
                <img
                  src={articleForm.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <input
                type="file"
                id="art-image"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-navy file:text-white hover:file:bg-navy/90 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const base64 = await compressImageToBase64(file);
                    setArticleForm((p) => ({ ...p, imageUrl: base64 }));
                  }
                }}
                data-ocid="admin.article.imageurl.input"
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setArticleFormOpen(false);
                  setEditingArticle(null);
                  setArticleForm(emptyArticleForm);
                }}
                data-ocid="admin.article.cancel_button"
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button
                type="submit"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                disabled={
                  createArticleMutation.isPending ||
                  updateArticleMutation.isPending
                }
                data-ocid="admin.article.submit_button"
              >
                {createArticleMutation.isPending ||
                updateArticleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan…
                  </>
                ) : editingArticle ? (
                  "Perbarui Artikel"
                ) : (
                  "Simpan Artikel"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Article Dialog */}
      <Dialog
        open={!!deleteArticleTarget}
        onOpenChange={(open) => !open && setDeleteArticleTarget(null)}
      >
        <DialogContent data-ocid="admin.berita.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Artikel</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus artikel &ldquo;
              <strong>{deleteArticleTarget?.title}</strong>&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteArticleTarget(null)}
              data-ocid="admin.berita.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteArticleTarget &&
                deleteArticleMutation.mutate(deleteArticleTarget.id)
              }
              disabled={deleteArticleMutation.isPending}
              data-ocid="admin.berita.delete.confirm_button"
            >
              {deleteArticleMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Member Form Dialog */}
      <Dialog open={teamFormOpen} onOpenChange={setTeamFormOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.anggota.dialog">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingTeam ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
            </DialogTitle>
            <DialogDescription>
              {editingTeam
                ? "Perbarui data anggota tim."
                : "Isi data anggota tim baru."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingTeam) {
                updateTeamMutation.mutate({
                  id: editingTeam.id,
                  data: teamForm,
                });
              } else {
                createTeamMutation.mutate(teamForm);
              }
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="team-name" className="text-navy font-medium">
                Nama
              </Label>
              <Input
                id="team-name"
                value={teamForm.name}
                onChange={(e) =>
                  setTeamForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Nama lengkap..."
                required
                data-ocid="admin.anggota.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="team-role" className="text-navy font-medium">
                Jabatan
              </Label>
              <Input
                id="team-role"
                value={teamForm.role}
                onChange={(e) =>
                  setTeamForm((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="Ketua, Sekretaris..."
                required
                data-ocid="admin.anggota.role.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="team-bio" className="text-navy font-medium">
                Bio
              </Label>
              <Textarea
                id="team-bio"
                value={teamForm.bio}
                onChange={(e) =>
                  setTeamForm((p) => ({ ...p, bio: e.target.value }))
                }
                rows={3}
                data-ocid="admin.anggota.bio.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="team-image" className="text-navy font-medium">
                Foto Anggota
              </Label>
              {teamForm.imageUrl && (
                <img
                  src={teamForm.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <input
                type="file"
                id="team-image"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-navy file:text-white hover:file:bg-navy/90 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const base64 = await compressImageToBase64(file);
                    setTeamForm((p) => ({ ...p, imageUrl: base64 }));
                  }
                }}
                data-ocid="admin.anggota.imageurl.input"
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTeamFormOpen(false);
                  setEditingTeam(null);
                  setTeamForm(emptyTeamForm);
                }}
                data-ocid="admin.anggota.cancel_button"
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button
                type="submit"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                disabled={
                  createTeamMutation.isPending || updateTeamMutation.isPending
                }
                data-ocid="admin.anggota.submit_button"
              >
                {createTeamMutation.isPending ||
                updateTeamMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan…
                  </>
                ) : editingTeam ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog
        open={!!deleteTeamTarget}
        onOpenChange={(open) => !open && setDeleteTeamTarget(null)}
      >
        <DialogContent data-ocid="admin.anggota.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Hapus Anggota Tim
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus anggota &ldquo;
              <strong>{deleteTeamTarget?.name}</strong>&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTeamTarget(null)}
              data-ocid="admin.anggota.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteTeamTarget &&
                deleteTeamMutation.mutate(deleteTeamTarget.id)
              }
              disabled={deleteTeamMutation.isPending}
              data-ocid="admin.anggota.delete.confirm_button"
            >
              {deleteTeamMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Form Dialog */}
      <Dialog open={activityFormOpen} onOpenChange={setActivityFormOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.kegiatan.dialog">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingActivity ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </DialogTitle>
            <DialogDescription>
              {editingActivity
                ? "Perbarui data kegiatan."
                : "Isi data kegiatan baru."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingActivity) {
                updateActivityMutation.mutate({
                  id: editingActivity.id,
                  data: activityForm,
                });
              } else {
                createActivityMutation.mutate(activityForm);
              }
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="act-title" className="text-navy font-medium">
                Judul
              </Label>
              <Input
                id="act-title"
                value={activityForm.title}
                onChange={(e) =>
                  setActivityForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Nama kegiatan..."
                required
                data-ocid="admin.kegiatan.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="act-desc" className="text-navy font-medium">
                Deskripsi
              </Label>
              <Textarea
                id="act-desc"
                value={activityForm.description}
                onChange={(e) =>
                  setActivityForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                rows={3}
                data-ocid="admin.kegiatan.description.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="act-date" className="text-navy font-medium">
                Tanggal
              </Label>
              <input
                id="act-date"
                type="date"
                value={activityForm.date}
                onChange={(e) =>
                  setActivityForm((p) => ({ ...p, date: e.target.value }))
                }
                required
                data-ocid="admin.kegiatan.date.input"
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="act-location" className="text-navy font-medium">
                Lokasi
              </Label>
              <Input
                id="act-location"
                value={activityForm.location}
                onChange={(e) =>
                  setActivityForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="Alamat lokasi..."
                required
                data-ocid="admin.kegiatan.location.input"
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActivityFormOpen(false);
                  setEditingActivity(null);
                  setActivityForm(emptyActivityForm);
                }}
                data-ocid="admin.kegiatan.cancel_button"
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button
                type="submit"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                disabled={
                  createActivityMutation.isPending ||
                  updateActivityMutation.isPending
                }
                data-ocid="admin.kegiatan.submit_button"
              >
                {createActivityMutation.isPending ||
                updateActivityMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan…
                  </>
                ) : editingActivity ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Activity Dialog */}
      <Dialog
        open={!!deleteActivityTarget}
        onOpenChange={(open) => !open && setDeleteActivityTarget(null)}
      >
        <DialogContent data-ocid="admin.kegiatan.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Kegiatan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kegiatan &ldquo;
              <strong>{deleteActivityTarget?.title}</strong>&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteActivityTarget(null)}
              data-ocid="admin.kegiatan.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteActivityTarget &&
                deleteActivityMutation.mutate(deleteActivityTarget.id)
              }
              disabled={deleteActivityMutation.isPending}
              data-ocid="admin.kegiatan.delete.confirm_button"
            >
              {deleteActivityMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Form Dialog */}
      <Dialog open={videoFormOpen} onOpenChange={setVideoFormOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.video.dialog">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingVideo ? "Edit Video" : "Tambah Video YouTube"}
            </DialogTitle>
            <DialogDescription>
              {editingVideo
                ? "Perbarui informasi video"
                : "Tambah video YouTube baru"}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingVideo) updateVideoMutation.mutate(videoForm);
              else createVideoMutation.mutate(videoForm);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="videoTitle" className="text-navy font-medium">
                Judul
              </Label>
              <Input
                id="videoTitle"
                value={videoForm.title}
                onChange={(e) =>
                  setVideoForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Judul video"
                required
                data-ocid="admin.video.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeId" className="text-navy font-medium">
                YouTube ID
              </Label>
              <Input
                id="youtubeId"
                value={videoForm.youtubeId}
                onChange={(e) =>
                  setVideoForm((p) => ({ ...p, youtubeId: e.target.value }))
                }
                placeholder="dQw4w9WgXcW"
                required
              />
              <p className="text-xs text-gray-400">
                Contoh: dQw4w9WgXcW dari URL youtube.com/watch?v=dQw4w9WgXcW
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoDesc" className="text-navy font-medium">
                Deskripsi
              </Label>
              <Textarea
                id="videoDesc"
                rows={3}
                value={videoForm.description}
                onChange={(e) =>
                  setVideoForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Deskripsi video"
                data-ocid="admin.video.textarea"
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVideoFormOpen(false)}
                data-ocid="admin.video.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                disabled={
                  createVideoMutation.isPending || updateVideoMutation.isPending
                }
                data-ocid="admin.video.submit_button"
              >
                {createVideoMutation.isPending ||
                updateVideoMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan…
                  </>
                ) : editingVideo ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Video Dialog */}
      <Dialog
        open={!!deleteVideoTarget}
        onOpenChange={(open) => !open && setDeleteVideoTarget(null)}
      >
        <DialogContent data-ocid="admin.video.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Video</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus video &ldquo;
              <strong>{deleteVideoTarget?.title}</strong>&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteVideoTarget(null)}
              data-ocid="admin.video.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteVideoTarget &&
                deleteVideoMutation.mutate(deleteVideoTarget.id)
              }
              disabled={deleteVideoMutation.isPending}
              data-ocid="admin.video.delete.confirm_button"
            >
              {deleteVideoMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Galeri Form Dialog */}
      <Dialog open={galeriFormOpen} onOpenChange={setGaleriFormOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.galeri.dialog">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingGaleri ? "Edit Item Galeri" : "Tambah Item Galeri"}
            </DialogTitle>
            <DialogDescription>
              {editingGaleri
                ? "Perbarui item galeri."
                : "Tambahkan foto atau video ke galeri."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (editingGaleri) {
                updateGaleriMutation.mutate({
                  id: editingGaleri.id,
                  data: galeriForm,
                });
              } else {
                createGaleriMutation.mutate(galeriForm);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Judul</Label>
              <Input
                required
                value={galeriForm.title}
                onChange={(e) =>
                  setGaleriForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Judul foto/video"
                data-ocid="admin.galeri.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Deskripsi</Label>
              <Textarea
                value={galeriForm.description}
                onChange={(e) =>
                  setGaleriForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Deskripsi singkat"
                rows={2}
                data-ocid="admin.galeri.desc.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Tipe Media</Label>
              <select
                value={galeriForm.mediaType}
                onChange={(e) =>
                  setGaleriForm((prev) => ({
                    ...prev,
                    mediaType: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
                data-ocid="admin.galeri.mediatype.select"
              >
                <option value="foto">Foto</option>
                <option value="video">Video</option>
              </select>
            </div>
            {galeriForm.mediaType === "foto" ? (
              <div className="space-y-1.5">
                <Label className="text-navy font-semibold">Upload Foto</Label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-navy cursor-pointer"
                  data-ocid="admin.galeri.foto.upload_button"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await compressImageToBase64(file);
                      setGaleriForm((prev) => ({ ...prev, mediaUrl: base64 }));
                    }
                  }}
                />
                {galeriForm.mediaUrl && (
                  <img
                    src={galeriForm.mediaUrl}
                    alt="Preview"
                    className="mt-2 max-h-32 rounded object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-navy font-semibold">
                  YouTube ID atau URL
                </Label>
                <Input
                  value={galeriForm.mediaUrl}
                  onChange={(e) =>
                    setGaleriForm((prev) => ({
                      ...prev,
                      mediaUrl: e.target.value,
                    }))
                  }
                  placeholder="dQw4w9WgXcQ atau https://youtu.be/..."
                  data-ocid="admin.galeri.video.input"
                />
              </div>
            )}
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setGaleriFormOpen(false);
                  setEditingGaleri(null);
                  setGaleriForm(emptyGaleriForm);
                }}
                data-ocid="admin.galeri.cancel_button"
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button
                type="submit"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                disabled={
                  createGaleriMutation.isPending ||
                  updateGaleriMutation.isPending
                }
                data-ocid="admin.galeri.submit_button"
              >
                {createGaleriMutation.isPending ||
                updateGaleriMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Menyimpan...
                  </>
                ) : editingGaleri ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Galeri Dialog */}
      <Dialog
        open={!!deleteGaleriTarget}
        onOpenChange={(open) => !open && setDeleteGaleriTarget(null)}
      >
        <DialogContent data-ocid="admin.galeri.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Hapus Item Galeri
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus item &ldquo;
              <strong>{deleteGaleriTarget?.title}</strong>&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteGaleriTarget(null)}
              data-ocid="admin.galeri.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteGaleriTarget &&
                deleteGaleriMutation.mutate(deleteGaleriTarget.id)
              }
              disabled={deleteGaleriMutation.isPending}
              data-ocid="admin.galeri.delete.confirm_button"
            >
              {deleteGaleriMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Pendaftaran Dialog */}
      <Dialog
        open={!!deletePendaftaranTarget}
        onOpenChange={(open) => !open && setDeletePendaftaranTarget(null)}
      >
        <DialogContent data-ocid="admin.pendaftaran.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Hapus Pendaftaran
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pendaftaran atas nama &ldquo;
              <strong>{deletePendaftaranTarget?.nama}</strong>&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletePendaftaranTarget(null)}
              data-ocid="admin.pendaftaran.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletePendaftaranTarget &&
                deletePendaftaranMutation.mutate(deletePendaftaranTarget.id)
              }
              disabled={deletePendaftaranMutation.isPending}
              data-ocid="admin.pendaftaran.delete.confirm_button"
            >
              {deletePendaftaranMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Satuan Form Dialog */}
      <Dialog open={satuanFormOpen} onOpenChange={setSatuanFormOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.satuan.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingSatuan ? "Edit Satuan SSK" : "Tambah Satuan SSK"}
            </DialogTitle>
            <DialogDescription>
              {editingSatuan
                ? "Perbarui data satuan."
                : "Isi data satuan SSK baru."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingSatuan) {
                updateSatuanMutation.mutate({
                  id: editingSatuan.id,
                  data: satuanForm,
                });
              } else {
                createSatuanMutation.mutate(satuanForm);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Nama Satuan *</Label>
              <Input
                required
                value={satuanForm.nama}
                onChange={(e) =>
                  setSatuanForm((prev) => ({ ...prev, nama: e.target.value }))
                }
                placeholder="Nama satuan SSK"
                data-ocid="admin.satuan.nama.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Nama Ketua</Label>
              <Input
                value={satuanForm.ketua}
                onChange={(e) =>
                  setSatuanForm((prev) => ({ ...prev, ketua: e.target.value }))
                }
                placeholder="Nama ketua satuan"
                data-ocid="admin.satuan.ketua.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Alamat</Label>
              <Textarea
                value={satuanForm.alamat}
                onChange={(e) =>
                  setSatuanForm((prev) => ({ ...prev, alamat: e.target.value }))
                }
                placeholder="Alamat satuan"
                rows={2}
                data-ocid="admin.satuan.alamat.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-navy font-semibold">No. Telepon</Label>
                <Input
                  value={satuanForm.phone}
                  onChange={(e) =>
                    setSatuanForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="08xx"
                  data-ocid="admin.satuan.phone.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-navy font-semibold">Email</Label>
                <Input
                  type="email"
                  value={satuanForm.email}
                  onChange={(e) =>
                    setSatuanForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="email@satuan.id"
                  data-ocid="admin.satuan.email.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Deskripsi</Label>
              <Textarea
                value={satuanForm.deskripsi}
                onChange={(e) =>
                  setSatuanForm((prev) => ({
                    ...prev,
                    deskripsi: e.target.value,
                  }))
                }
                placeholder="Deskripsi satuan"
                rows={3}
                data-ocid="admin.satuan.deskripsi.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Logo Satuan</Label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-navy cursor-pointer"
                data-ocid="admin.satuan.logo.upload_button"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const base64 = await compressImageToBase64(file);
                    setSatuanForm((prev) => ({ ...prev, logoUrl: base64 }));
                  }
                }}
              />
              {satuanForm.logoUrl && (
                <img
                  src={satuanForm.logoUrl}
                  alt="Logo preview"
                  className="mt-2 w-16 h-16 rounded-full object-contain border"
                />
              )}
              <Input
                value={satuanForm.logoUrl}
                onChange={(e) =>
                  setSatuanForm((prev) => ({
                    ...prev,
                    logoUrl: e.target.value,
                  }))
                }
                placeholder="Atau masukkan URL logo"
                className="mt-2"
                data-ocid="admin.satuan.logourl.input"
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSatuanFormOpen(false);
                  setEditingSatuan(null);
                  setSatuanForm(emptySatuanForm);
                }}
                data-ocid="admin.satuan.cancel_button"
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button
                type="submit"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                disabled={
                  createSatuanMutation.isPending ||
                  updateSatuanMutation.isPending
                }
                data-ocid="admin.satuan.submit_button"
              >
                {createSatuanMutation.isPending ||
                updateSatuanMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Menyimpan...
                  </>
                ) : editingSatuan ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Satuan Dialog */}
      <Dialog
        open={!!deleteSatuanTarget}
        onOpenChange={(open) => !open && setDeleteSatuanTarget(null)}
      >
        <DialogContent data-ocid="admin.satuan.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Satuan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus satuan &ldquo;
              <strong>{deleteSatuanTarget?.nama}</strong>&rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteSatuanTarget(null)}
              data-ocid="admin.satuan.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteSatuanTarget &&
                deleteSatuanMutation.mutate(deleteSatuanTarget.id)
              }
              disabled={deleteSatuanMutation.isPending}
              data-ocid="admin.satuan.delete.confirm_button"
            >
              {deleteSatuanMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slider Banner Form Dialog */}
      <Dialog open={sliderFormOpen} onOpenChange={setSliderFormOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.slider.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingSlider ? "Edit Slide" : "Tambah Slide Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingSlider
                ? "Perbarui informasi slide."
                : "Isi informasi slide baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Judul</Label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                value={sliderForm.title}
                onChange={(e) =>
                  setSliderForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Judul slide"
                data-ocid="admin.slider.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Deskripsi</Label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 min-h-[80px]"
                value={sliderForm.description}
                onChange={(e) =>
                  setSliderForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Deskripsi singkat slide"
                data-ocid="admin.slider.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Gambar</Label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-navy cursor-pointer"
                data-ocid="admin.slider.upload_button"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const base64 = await compressImageToBase64(file);
                    setSliderForm((p) => ({ ...p, imageUrl: base64 }));
                  }
                }}
              />
              {sliderForm.imageUrl && (
                <img
                  src={sliderForm.imageUrl}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">
                Link URL (opsional)
              </Label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                value={sliderForm.linkUrl}
                onChange={(e) =>
                  setSliderForm((p) => ({ ...p, linkUrl: e.target.value }))
                }
                placeholder="https://..."
                data-ocid="admin.slider.link.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-navy font-semibold">Urutan</Label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                value={sliderForm.urutan}
                onChange={(e) =>
                  setSliderForm((p) => ({
                    ...p,
                    urutan: Number(e.target.value),
                  }))
                }
                data-ocid="admin.slider.urutan.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSliderFormOpen(false)}
              data-ocid="admin.slider.cancel_button"
            >
              Batal
            </Button>
            <Button
              className="bg-gold text-navy hover:bg-gold/90 font-semibold"
              disabled={
                createSliderMutation.isPending || updateSliderMutation.isPending
              }
              data-ocid="admin.slider.submit_button"
              onClick={() => {
                if (editingSlider) {
                  updateSliderMutation.mutate({
                    id: editingSlider.id,
                    data: sliderForm,
                  });
                } else {
                  createSliderMutation.mutate(sliderForm);
                }
              }}
            >
              {createSliderMutation.isPending ||
              updateSliderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan…
                </>
              ) : editingSlider ? (
                "Perbarui Slide"
              ) : (
                "Tambah Slide"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Slider Confirmation */}
      <Dialog
        open={!!deleteSliderTarget}
        onOpenChange={() => setDeleteSliderTarget(null)}
      >
        <DialogContent data-ocid="admin.slider.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-navy">Hapus Slide</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus slide &quot;
              {deleteSliderTarget?.title}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteSliderTarget(null)}
              data-ocid="admin.slider.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteSliderTarget &&
                deleteSliderMutation.mutate(deleteSliderTarget.id)
              }
              disabled={deleteSliderMutation.isPending}
              data-ocid="admin.slider.delete.confirm_button"
            >
              {deleteSliderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
