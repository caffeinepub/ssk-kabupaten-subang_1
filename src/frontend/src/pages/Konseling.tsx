import { Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle, Phone, Users } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Hubungi Kami",
    description:
      "Hubungi SSK Kabupaten Subang melalui telepon, email, atau kunjungi kantor kami untuk mengatur jadwal konseling.",
  },
  {
    number: "02",
    title: "Tentukan Topik",
    description:
      "Sampaikan topik atau permasalahan kependudukan yang ingin dikonsultasikan kepada petugas kami.",
  },
  {
    number: "03",
    title: "Sesi Konseling",
    description:
      "Lakukan sesi konseling dengan konselor SSK yang berpengalaman secara tatap muka atau daring.",
  },
  {
    number: "04",
    title: "Tindak Lanjut",
    description:
      "Terima rekomendasi dan tindak lanjut dari konselor untuk membantu menyelesaikan permasalahan Anda.",
  },
];

const topics = [
  "Keluarga Berencana (KB)",
  "Kesehatan Reproduksi",
  "Usia Perkawinan",
  "Pendidikan Kependudukan",
  "Pemberdayaan Keluarga",
  "Pengendalian Penduduk",
  "Ketahanan Keluarga",
  "Generasi Berencana (GenRe)",
];

export default function Konseling() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Layanan Kami
            </p>
            <h1 className="text-white font-bold text-3xl md:text-4xl uppercase">
              Layanan Konseling
            </h1>
            <p className="text-gray-300 mt-4 text-sm max-w-2xl mx-auto leading-relaxed">
              SSK Kabupaten Subang menyediakan layanan konseling kependudukan
              untuk membantu masyarakat memahami dan mengatasi berbagai isu
              terkait kependudukan dan keluarga.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Konseling */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
                Tentang Layanan
              </p>
              <h2 className="text-navy font-bold text-2xl md:text-3xl uppercase mb-4">
                Apa Itu Konseling Kependudukan?
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Konseling kependudukan adalah layanan pemberian informasi,
                bimbingan, dan pendampingan kepada individu atau keluarga dalam
                menghadapi berbagai persoalan terkait kependudukan, keluarga
                berencana, dan kesehatan reproduksi.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Melalui layanan ini, SSK Kabupaten Subang berupaya meningkatkan
                kesadaran dan pemahaman masyarakat tentang pentingnya
                perencanaan keluarga demi terwujudnya keluarga yang berkualitas
                dan sejahtera.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                {
                  icon: Users,
                  label: "Konseling Keluarga",
                  desc: "Masalah keluarga dan rumah tangga",
                },
                {
                  icon: BookOpen,
                  label: "Edukasi KB",
                  desc: "Program Keluarga Berencana",
                },
                {
                  icon: CheckCircle,
                  label: "Konsultasi Gratis",
                  desc: "Tidak dipungut biaya apapun",
                },
                {
                  icon: Phone,
                  label: "Layanan Daring",
                  desc: "Tersedia via telepon & online",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gold transition-colors"
                >
                  <div className="bg-navy w-9 h-9 rounded flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-navy font-bold text-xs mb-1">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Cakupan Layanan
            </p>
            <h2 className="text-navy font-bold text-2xl md:text-3xl uppercase">
              Topik Konseling
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {topics.map((topic, i) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-navy text-xs font-semibold hover:bg-navy hover:text-gold hover:border-navy transition-colors cursor-default"
              >
                {topic}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* How to access */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Panduan
            </p>
            <h2 className="text-navy font-bold text-2xl md:text-3xl uppercase">
              Cara Mengakses Layanan
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`konseling.item.${i + 1}`}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold font-bold text-lg">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-navy font-bold text-sm uppercase mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-navy">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white font-bold text-2xl md:text-3xl uppercase mb-4">
              Siap Berkonsultasi?
            </h2>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Hubungi kami sekarang untuk mendapatkan layanan konseling
              kependudukan secara gratis dari konselor SSK Kabupaten Subang yang
              berpengalaman.
            </p>
            <Link
              to="/kontak"
              data-ocid="konseling.contact.link"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm uppercase tracking-wide px-8 py-3 rounded hover:bg-yellow-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Hubungi Kami
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
