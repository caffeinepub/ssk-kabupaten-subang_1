import { Calendar, Image, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { useAllGaleriItems } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isYoutubeId(str: string) {
  return /^[a-zA-Z0-9_-]{11}$/.test(str);
}

function getYoutubeId(str: string) {
  // Check if it's a full URL
  const urlMatch = str.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (urlMatch) return urlMatch[1];
  if (isYoutubeId(str)) return str;
  return null;
}

export default function Galeri() {
  const { data: items = [], isLoading } = useAllGaleriItems();

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
            Galeri Kegiatan
          </motion.h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-4" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Dokumentasi foto dan video kegiatan SSK Kabupaten Subang
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div
              className="flex justify-center py-20"
              data-ocid="galeri.loading_state"
            >
              <div className="w-10 h-10 border-4 border-navy border-t-gold rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20" data-ocid="galeri.empty_state">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                Belum ada galeri
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Konten galeri akan segera tersedia
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => {
                const ytId =
                  item.mediaType === "video"
                    ? getYoutubeId(item.mediaUrl)
                    : null;
                return (
                  <motion.div
                    key={item.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    data-ocid={`galeri.item.${i + 1}`}
                  >
                    {/* Media */}
                    {item.mediaType === "foto" ? (
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : ytId ? (
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          title={item.title}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        <a
                          href={item.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 text-white hover:text-gold transition-colors"
                        >
                          <PlayCircle className="w-12 h-12" />
                          <span className="text-sm">Tonton Video</span>
                        </a>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            item.mediaType === "foto"
                              ? "bg-navy/10 text-navy"
                              : "bg-gold/20 text-yellow-700"
                          }`}
                        >
                          {item.mediaType === "foto" ? "Foto" : "Video"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.tanggal)}
                        </span>
                      </div>
                      <h3 className="font-bold text-navy text-base mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
