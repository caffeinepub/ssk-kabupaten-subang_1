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
import { useState } from "react";
import { toast } from "sonner";
import type { Activity, Article, TeamMember } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllActivities,
  useAllArticles,
  useContactInfo,
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
      toast.success("Informasi kontak berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui informasi kontak"),
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
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {identity?.getPrincipal().toString().slice(0, 20)}…
                </span>
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
        ) : (
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
          </Tabs>
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
                URL Gambar
              </Label>
              <Input
                id="art-image"
                value={articleForm.imageUrl}
                onChange={(e) =>
                  setArticleForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://..."
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
                URL Foto
              </Label>
              <Input
                id="team-image"
                value={teamForm.imageUrl}
                onChange={(e) =>
                  setTeamForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://..."
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
    </main>
  );
}
