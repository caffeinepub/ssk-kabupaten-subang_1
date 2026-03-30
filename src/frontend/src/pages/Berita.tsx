import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Article } from "../backend.d";
import { blogArticles, sampleArticles } from "../data/sampleData";
import { useAllArticles } from "../hooks/useQueries";

const categories = [
  "Semua",
  "Kependudukan",
  "Keluarga",
  "Program",
  "Penghargaan",
  "Kemitraan",
  "Kegiatan",
];

function formatDate(time: bigint) {
  const ms = Number(time) / 1_000_000;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Berita() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { data: articlesData } = useAllArticles();

  const allArticles: Article[] =
    articlesData && articlesData.length > 0
      ? articlesData
      : [...sampleArticles, ...blogArticles];

  const filtered =
    activeCategory === "Semua"
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);

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
              Informasi Terkini
            </p>
            <h1 className="text-white font-bold text-3xl md:text-4xl uppercase">
              Berita & Artikel
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-ocid="berita.filter.tab"
                className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wide transition-colors ${
                  activeCategory === cat
                    ? "bg-navy text-gold"
                    : "bg-gray-100 text-gray-600 hover:bg-navy hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div data-ocid="berita.empty_state" className="text-center py-16">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">
                Tidak ada artikel untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.div
                  key={article.id.toString()}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  data-ocid={`berita.item.${i + 1}`}
                  className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={
                        article.imageUrl ||
                        `/assets/generated/ssk-news-${(i % 3) + 1}.dim_800x450.jpg`
                      }
                      alt={article.title}
                      className="w-full h-44 object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-gold text-navy text-xs font-bold px-2 py-1 rounded">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </div>
                    <h3 className="text-navy font-bold text-sm leading-snug mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <Link
                      to="/berita/$id"
                      params={{ id: article.id.toString() }}
                      data-ocid={`berita.read.${i + 1}.link`}
                      className="text-gold font-semibold text-xs uppercase tracking-wide hover:text-gold-dark flex items-center gap-1"
                    >
                      Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
