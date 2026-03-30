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
import type { Article } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllArticles } from "../hooks/useQueries";

interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
}

const emptyForm: ArticleForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  imageUrl: "",
};

export default function Admin() {
  const { login, clear, isLoggingIn, isInitializing, identity } =
    useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: articles = [], isLoading: articlesLoading } = useAllArticles();

  const [formOpen, setFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const createMutation = useMutation({
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
      setFormOpen(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("Gagal menambahkan artikel"),
  });

  const updateMutation = useMutation({
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
      setFormOpen(false);
      setEditingArticle(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("Gagal memperbarui artikel"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel berhasil dihapus");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Gagal menghapus artikel"),
  });

  function openAddForm() {
    setEditingArticle(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEditForm(article: Article) {
    setEditingArticle(article);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
    });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
          /* Login Screen */
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
          /* Admin Panel */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-navy">
                  Manajemen Artikel
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {articles.length} artikel tersedia
                </p>
              </div>
              <Button
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                onClick={openAddForm}
                data-ocid="admin.primary_button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Artikel Baru
              </Button>
            </div>

            <Card className="shadow-sm border-0">
              <CardContent className="p-0">
                {articlesLoading ? (
                  <div
                    className="flex items-center justify-center py-20"
                    data-ocid="admin.articles.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-navy" />
                  </div>
                ) : articles.length === 0 ? (
                  <div
                    className="text-center py-20 text-gray-400"
                    data-ocid="admin.articles.empty_state"
                  >
                    <p className="font-medium">Belum ada artikel</p>
                    <p className="text-sm mt-1">
                      Klik tombol di atas untuk menambah artikel pertama
                    </p>
                  </div>
                ) : (
                  <Table data-ocid="admin.articles.table">
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
                          data-ocid={`admin.articles.item.${i + 1}`}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {article.title}
                              </p>
                              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                {article.excerpt}
                              </p>
                            </div>
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
                                onClick={() => openEditForm(article)}
                                data-ocid={`admin.articles.edit_button.${i + 1}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:bg-red-50"
                                onClick={() => setDeleteTarget(article)}
                                data-ocid={`admin.articles.delete_button.${i + 1}`}
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
          </div>
        )}
      </div>

      {/* Article Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
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
                ? "Perbarui informasi artikel di bawah ini."
                : "Isi informasi artikel baru di bawah ini."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-navy font-medium">
                Judul
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Judul artikel..."
                required
                data-ocid="admin.article.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-navy font-medium">
                Kategori
              </Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="Contoh: Berita, Kegiatan, Pengumuman..."
                required
                data-ocid="admin.article.category.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerpt" className="text-navy font-medium">
                Ringkasan
              </Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Ringkasan singkat artikel..."
                rows={2}
                required
                data-ocid="admin.article.excerpt.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-navy font-medium">
                Konten
              </Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Isi lengkap artikel..."
                rows={8}
                required
                data-ocid="admin.article.content.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl" className="text-navy font-medium">
                URL Gambar
              </Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
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
                  setFormOpen(false);
                  setEditingArticle(null);
                  setForm(emptyForm);
                }}
                data-ocid="admin.article.cancel_button"
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button
                type="submit"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                disabled={isSaving}
                data-ocid="admin.article.submit_button"
              >
                {isSaving ? (
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

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent data-ocid="admin.delete.dialog">
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Artikel</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus artikel &ldquo;
              <strong>{deleteTarget?.title}</strong>&rdquo;? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              data-ocid="admin.delete.cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
              disabled={deleteMutation.isPending}
              data-ocid="admin.delete.confirm_button"
            >
              {deleteMutation.isPending ? (
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
