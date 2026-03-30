import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import { motion } from "motion/react";
import type { Article } from "../backend.d";
import { blogArticles, sampleArticles } from "../data/sampleData";
import { useAllArticles } from "../hooks/useQueries";

function formatDate(time: bigint) {
  const ms = Number(time) / 1_000_000;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleContent({ content }: { content: string }) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: article content is from trusted backend
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default function BeritaDetail() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const { data: articlesData } = useAllArticles();

  const allArticles: Article[] =
    articlesData && articlesData.length > 0
      ? articlesData
      : [...sampleArticles, ...blogArticles];

  const article = allArticles.find((a) => a.id.toString() === id);
  const related = allArticles.filter((a) => a.id.toString() !== id).slice(0, 3);

  if (!article) {
    return (
      <main className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">Artikel tidak ditemukan.</p>
          <Link
            to="/berita"
            className="text-gold mt-4 inline-block hover:underline"
          >
            ← Kembali ke Berita
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={
            article.imageUrl || "/assets/generated/ssk-news-1.dim_800x450.jpg"
          }
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 h-full flex flex-col justify-end pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded mb-3 inline-block">
              {article.category}
            </span>
            <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-gray-300 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {article.category}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-navy text-sm font-semibold hover:text-gold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg p-8 shadow-card prose max-w-none prose-headings:text-navy prose-a:text-gold"
          >
            <ArticleContent content={article.content} />
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-navy font-bold text-xl uppercase mb-6">
              Artikel Terkait
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((rel, i) => (
                <Link
                  key={rel.id.toString()}
                  to="/berita/$id"
                  params={{ id: rel.id.toString() }}
                  data-ocid={`related.item.${i + 1}.link`}
                  className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow block"
                >
                  <img
                    src={
                      rel.imageUrl ||
                      `/assets/generated/ssk-news-${(i % 3) + 1}.dim_800x450.jpg`
                    }
                    alt={rel.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <span className="text-gold text-xs font-bold">
                      {rel.category}
                    </span>
                    <h3 className="text-navy font-bold text-sm mt-1 leading-snug line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> Baca Selengkapnya
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
