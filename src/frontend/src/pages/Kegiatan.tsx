import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useAllActivities } from "../hooks/useQueries";

function formatDate(time: bigint) {
  const ms = Number(time) / 1_000_000;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Kegiatan() {
  const { data: activities, isLoading } = useAllActivities();

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
              Program & Agenda
            </p>
            <h1 className="text-white font-bold text-3xl md:text-4xl uppercase">
              Kegiatan SSK
            </h1>
            <p className="text-gray-300 mt-3 text-sm max-w-xl mx-auto">
              Informasi kegiatan, program, dan agenda Sekolah Siaga Kependudukan
              Kabupaten Subang.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div
              data-ocid="kegiatan.loading_state"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg p-5 shadow-card">
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : !activities || activities.length === 0 ? (
            <div data-ocid="kegiatan.empty_state" className="text-center py-20">
              <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium">
                Belum ada kegiatan
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Kegiatan akan ditampilkan di sini setelah ditambahkan oleh
                admin.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id.toString()}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  data-ocid={`kegiatan.item.${i + 1}`}
                  className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow"
                >
                  <div className="bg-navy px-5 py-4 flex items-center gap-3">
                    <div className="bg-gold text-navy rounded p-2 flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-white text-xs font-semibold">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-navy font-bold text-sm leading-snug mb-2">
                      {activity.title}
                    </h3>
                    {activity.location && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                        <MapPin className="w-3 h-3 text-gold flex-shrink-0" />
                        {activity.location}
                      </div>
                    )}
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-4">
                      {activity.description}
                    </p>
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
