import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";

interface DaftarForm {
  nama: string;
  nik: string;
  alamat: string;
  phone: string;
  email: string;
  pekerjaan: string;
  alasan: string;
}

const emptyForm: DaftarForm = {
  nama: "",
  nik: "",
  alamat: "",
  phone: "",
  email: "",
  pekerjaan: "",
  alasan: "",
};

export default function Daftar() {
  const { actor } = useActor();
  const [form, setForm] = useState<DaftarForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof DaftarForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setError("Koneksi ke server belum siap, coba lagi sebentar.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await actor.createPendaftaran(
        form.nama,
        form.nik,
        form.alamat,
        form.phone,
        form.email,
        form.pekerjaan,
        form.alasan,
      );
      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      setError("Gagal mengirim pendaftaran. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Daftar Anggota SSK
          </motion.h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-4" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Bergabunglah menjadi anggota Sekolah Siaga Kependudukan Kabupaten
            Subang
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
              data-ocid="daftar.success_state"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-navy mb-3">
                Pendaftaran Berhasil!
              </h2>
              <p className="text-gray-600 mb-6">
                Terima kasih telah mendaftar sebagai anggota SSK Kabupaten
                Subang. Kami akan menghubungi Anda setelah data diverifikasi.
              </p>
              <Button
                className="bg-navy text-white hover:bg-navy/90"
                onClick={() => setSuccess(false)}
                data-ocid="daftar.primary_button"
              >
                Daftar Lagi
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-md border-0">
                <CardHeader className="bg-navy text-white rounded-t-lg">
                  <CardTitle className="text-xl">
                    Formulir Pendaftaran Anggota
                  </CardTitle>
                  <p className="text-gray-300 text-sm">
                    Isi data diri Anda dengan lengkap dan benar
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    data-ocid="daftar.modal"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="nama"
                          className="text-navy font-semibold"
                        >
                          Nama Lengkap *
                        </Label>
                        <Input
                          id="nama"
                          required
                          value={form.nama}
                          onChange={(e) => handleChange("nama", e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className="border-gray-300 focus:border-navy"
                          data-ocid="daftar.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="nik"
                          className="text-navy font-semibold"
                        >
                          NIK *
                        </Label>
                        <Input
                          id="nik"
                          required
                          value={form.nik}
                          onChange={(e) => handleChange("nik", e.target.value)}
                          placeholder="16 digit NIK"
                          maxLength={16}
                          className="border-gray-300 focus:border-navy"
                          data-ocid="daftar.input"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="alamat"
                        className="text-navy font-semibold"
                      >
                        Alamat Lengkap *
                      </Label>
                      <Textarea
                        id="alamat"
                        required
                        value={form.alamat}
                        onChange={(e) => handleChange("alamat", e.target.value)}
                        placeholder="Masukkan alamat lengkap"
                        rows={3}
                        className="border-gray-300 focus:border-navy resize-none"
                        data-ocid="daftar.textarea"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="phone"
                          className="text-navy font-semibold"
                        >
                          Nomor HP *
                        </Label>
                        <Input
                          id="phone"
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          placeholder="08xxxxxxxxxx"
                          className="border-gray-300 focus:border-navy"
                          data-ocid="daftar.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="email"
                          className="text-navy font-semibold"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          placeholder="email@example.com"
                          className="border-gray-300 focus:border-navy"
                          data-ocid="daftar.input"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="pekerjaan"
                        className="text-navy font-semibold"
                      >
                        Pekerjaan *
                      </Label>
                      <Input
                        id="pekerjaan"
                        required
                        value={form.pekerjaan}
                        onChange={(e) =>
                          handleChange("pekerjaan", e.target.value)
                        }
                        placeholder="Pelajar / Mahasiswa / PNS / Swasta / dll"
                        className="border-gray-300 focus:border-navy"
                        data-ocid="daftar.input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="alasan"
                        className="text-navy font-semibold"
                      >
                        Alasan Bergabung *
                      </Label>
                      <Textarea
                        id="alasan"
                        required
                        value={form.alasan}
                        onChange={(e) => handleChange("alasan", e.target.value)}
                        placeholder="Tuliskan alasan Anda ingin bergabung dengan SSK Kabupaten Subang"
                        rows={4}
                        className="border-gray-300 focus:border-navy resize-none"
                        data-ocid="daftar.textarea"
                      />
                    </div>

                    {error && (
                      <div
                        className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded"
                        data-ocid="daftar.error_state"
                      >
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold text-navy hover:bg-gold/90 font-bold text-base py-6"
                      data-ocid="daftar.submit_button"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                          Mengirim...
                        </>
                      ) : (
                        "Kirim Pendaftaran"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
