import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";

export default function Kontak() {
  return (
    <main>
      <section className="bg-navy py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Hubungi Kami
            </p>
            <h1 className="text-white font-bold text-3xl md:text-4xl uppercase">
              Kontak
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-navy font-bold text-xl uppercase mb-6">
                Informasi Kontak
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: "Alamat",
                    value:
                      "Jl. Brigjen Katamso No. 1, Subang, Jawa Barat 41211",
                  },
                  { icon: Phone, label: "Telepon", value: "(0260) 411-1234" },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "info@ssk-subang.go.id",
                  },
                  {
                    icon: Clock,
                    label: "Jam Operasional",
                    value: "Senin \u2013 Jumat, 08.00 \u2013 16.00 WIB",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-navy font-semibold text-sm">
                        {item.label}
                      </p>
                      <p className="text-gray-600 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 shadow-card"
            >
              <h2 className="text-navy font-bold text-xl uppercase mb-6">
                Kirim Pesan
              </h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="kontak-nama"
                    className="block text-navy text-sm font-semibold mb-1"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="kontak-nama"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    data-ocid="kontak.name.input"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="kontak-email"
                    className="block text-navy text-sm font-semibold mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="kontak-email"
                    type="email"
                    placeholder="email@contoh.com"
                    data-ocid="kontak.email.input"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="kontak-pesan"
                    className="block text-navy text-sm font-semibold mb-1"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="kontak-pesan"
                    rows={5}
                    placeholder="Tulis pesan Anda di sini..."
                    data-ocid="kontak.message.textarea"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  data-ocid="kontak.submit.button"
                  className="w-full bg-navy text-gold font-bold py-3 rounded hover:bg-navy-light transition-colors uppercase tracking-wide text-sm"
                >
                  Kirim Pesan
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
