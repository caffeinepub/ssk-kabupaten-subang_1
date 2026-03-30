import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Handshake,
  Heart,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { Article } from "../backend.d";
import { sampleArticles, sampleTeamMembers } from "../data/sampleData";
import { useAllArticles, useTeamMembers } from "../hooks/useQueries";

function formatDate(time: bigint) {
  const ms = Number(time) / 1_000_000;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const features = [
  { icon: BookOpen, label: "Edukasi Kependudukan" },
  { icon: Heart, label: "Keluarga Berencana" },
  { icon: Users, label: "Generasi Berencana" },
  { icon: Handshake, label: "Kemitraan" },
];

export default function Home() {
  const { data: articlesData } = useAllArticles();
  const { data: teamData } = useTeamMembers();
  const articles: Article[] =
    articlesData && articlesData.length > 0 ? articlesData : sampleArticles;
  const teamMembers =
    teamData && teamData.length > 0 ? teamData : sampleTeamMembers;
  const latestNews = articles.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="/assets/generated/ssk-hero.dim_1400x600.jpg"
          alt="SSK Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">
              Kabupaten Subang, Jawa Barat
            </p>
            <h1 className="text-white font-bold text-4xl md:text-5xl uppercase leading-tight mb-2">
              Sekolah Siaga
            </h1>
            <h2 className="text-gold font-bold text-4xl md:text-5xl uppercase leading-tight mb-5">
              Kependudukan
            </h2>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed">
              Membangun Generasi Sadar Kependudukan untuk Masa Depan Indonesia
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tentang"
                data-ocid="hero.primary_button"
                className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wide"
              >
                Pelajari Program Kami
              </Link>
              <Link
                to="/berita"
                data-ocid="hero.secondary_button"
                className="border-2 border-white text-white hover:bg-white hover:text-navy font-bold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wide"
              >
                Baca Berita
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-navy font-bold text-2xl uppercase tracking-wide mb-10"
          >
            4 Fokus Utama Program SSK
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 hover:shadow-card transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center mb-4">
                  <f.icon className="w-8 h-8 text-gold" />
                </div>
                <p className="text-navy font-bold text-sm uppercase tracking-wide">
                  {f.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Unggulan */}
      <section className="py-16 bg-navy">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
                Program Kami
              </p>
              <h2 className="text-white font-bold text-2xl md:text-3xl uppercase leading-tight mb-4">
                Program Unggulan SSK Kabupaten Subang
              </h2>
              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                Edukasi Kependudukan yang Inovatif dan Berkelanjutan —
                memberikan dampak nyata bagi masyarakat Kabupaten Subang melalui
                program terstruktur dan terukur.
              </p>
              <Link
                to="/tentang"
                className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all"
              >
                Selengkapnya <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, value: "1.000+", label: "Peserta Terlatih" },
                { icon: BookOpen, value: "15+", label: "Program Kegiatan" },
                { icon: Award, value: "5+", label: "Penghargaan" },
                {
                  icon: TrendingUp,
                  value: "30+",
                  label: "Kecamatan Terlayani",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-navy-light rounded-lg p-5 text-center"
                >
                  <stat.icon className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-gold font-bold text-2xl">{stat.value}</p>
                  <p className="text-gray-300 text-xs uppercase tracking-wide mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 bg-gradient-to-br from-gold/10 to-gold/5 border-y border-gold/20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">
              Bersama Masyarakat
            </p>
            <h2 className="text-navy font-bold text-2xl md:text-3xl uppercase mb-4">
              Kegiatan Bersama Masyarakat Subang
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base leading-relaxed">
              Bersinergi dengan masyarakat untuk mewujudkan keluarga berkualitas
              dan generasi penerus yang sadar kependudukan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-navy font-bold text-2xl uppercase tracking-wide">
              Berita & Kegiatan Terbaru
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-3" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((article, i) => (
              <motion.div
                key={article.id.toString()}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`news.item.${i + 1}`}
                className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={
                      article.imageUrl ||
                      `/assets/generated/ssk-news-${(i % 3) + 1}.dim_800x450.jpg`
                    }
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-gold text-navy text-xs font-bold px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-navy text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-gray-400 text-xs mb-2">
                    {formatDate(article.date)}
                  </p>
                  <h3 className="text-navy font-bold text-sm leading-snug mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link
                    to="/berita/$id"
                    params={{ id: article.id.toString() }}
                    data-ocid={`news.read_more.${i + 1}.link`}
                    className="text-gold font-semibold text-xs uppercase tracking-wide hover:text-gold-dark flex items-center gap-1"
                  >
                    Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/berita"
              data-ocid="home.all_news.button"
              className="inline-flex items-center gap-2 bg-navy text-white font-bold px-6 py-3 rounded hover:bg-navy-light transition-colors text-sm uppercase tracking-wide"
            >
              Semua Berita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-navy font-bold text-2xl uppercase tracking-wide">
              Struktur Organisasi
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-3" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {teamMembers.slice(0, 6).map((member, i) => (
              <motion.div
                key={member.id.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-4 ring-gold/20">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-navy font-bold text-xs leading-snug">
                  {member.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
