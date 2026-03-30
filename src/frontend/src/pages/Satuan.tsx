import { Building2, Mail, MapPin, Phone, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { useAllSatuanSSK } from "../hooks/useQueries";

export default function Satuan() {
  const { data: satuanList = [], isLoading } = useAllSatuanSSK();

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
            Satuan SSK
          </motion.h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-4" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Daftar satuan SSK yang tergabung di Kabupaten Subang
          </motion.p>
        </div>
      </section>

      {/* Satuan Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div
              className="flex justify-center py-20"
              data-ocid="satuan.loading_state"
            >
              <div className="w-10 h-10 border-4 border-navy border-t-gold rounded-full animate-spin" />
            </div>
          ) : satuanList.length === 0 ? (
            <div className="text-center py-20" data-ocid="satuan.empty_state">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                Belum ada satuan terdaftar
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Data satuan SSK akan segera tersedia
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {satuanList.map((satuan, i) => (
                <motion.div
                  key={satuan.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  data-ocid={`satuan.item.${i + 1}`}
                >
                  {/* Header with logo */}
                  <div className="bg-navy px-6 py-5 flex items-center gap-4">
                    {satuan.logoUrl ? (
                      <img
                        src={satuan.logoUrl}
                        alt={`Logo ${satuan.nama}`}
                        className="w-16 h-16 rounded-full object-contain bg-white p-1 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-gold" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
                        {satuan.nama}
                      </h3>
                      {satuan.ketua && (
                        <p className="text-gold text-sm mt-1 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {satuan.ketua}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    {satuan.deskripsi && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {satuan.deskripsi}
                      </p>
                    )}
                    {satuan.alamat && (
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span>{satuan.alamat}</span>
                      </div>
                    )}
                    {satuan.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{satuan.phone}</span>
                      </div>
                    )}
                    {satuan.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{satuan.email}</span>
                      </div>
                    )}
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
