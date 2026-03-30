import { CheckCircle, Eye, Target } from "lucide-react";
import { motion } from "motion/react";
import { sampleTeamMembers } from "../data/sampleData";
import { useTeamMembers } from "../hooks/useQueries";

const misi = [
  "Menyelenggarakan pendidikan kependudukan yang berkualitas dan aksesibel",
  "Mengembangkan kurikulum dan modul pembelajaran kependudukan yang inovatif dan kontekstual",
  "Mendorong keluarga berencana yang bertanggung jawab",
  "Memperkuat kemitraan dengan berbagai pihak untuk program kependudukan",
];

export default function Tentang() {
  const { data: teamData } = useTeamMembers();
  const teamMembers =
    teamData && teamData.length > 0 ? teamData : sampleTeamMembers;

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
              Tentang Kami
            </p>
            <h1 className="text-white font-bold text-3xl md:text-4xl uppercase">
              Tentang SSK Kabupaten Subang
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-700 text-base leading-relaxed">
              Sekolah Siaga Kependudukan (SSK) Kabupaten Subang adalah program
              inovatif yang dirancang untuk meningkatkan kesadaran dan pemahaman
              masyarakat tentang isu-isu kependudukan. Program ini merupakan
              hasil kolaborasi antara pemerintah daerah, lembaga pendidikan, dan
              organisasi masyarakat.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 shadow-card"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                  <Eye className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-navy font-bold text-lg uppercase tracking-wide">
                  Visi
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Menjadi pusat pendidikan kependudukan yang inovatif, inklusif,
                dan berkelanjutan dalam mewujudkan masyarakat Kabupaten Subang
                yang sadar dan berdaya dalam pengelolaan kependudukan menuju
                Indonesia yang sejahtera.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 shadow-card"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                  <Target className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-navy font-bold text-lg uppercase tracking-wide">
                  Misi
                </h2>
              </div>
              <ul className="space-y-3">
                {misi.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-navy font-bold text-2xl uppercase tracking-wide">
              Profil Anggota
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-3" />
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id.toString()}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`team.item.${i + 1}`}
                className="bg-white border border-gray-100 rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-gold/20">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-navy font-bold text-sm">{member.name}</h3>
                <p className="text-gold text-xs font-semibold uppercase tracking-wide mt-1 mb-3">
                  {member.role}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-navy font-bold text-2xl uppercase tracking-wide">
              Video Profil SSK
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-3" />
          </motion.div>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="SSK Kabupaten Subang"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
