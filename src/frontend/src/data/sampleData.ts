import type { Article, TeamMember } from "../types/backend";

export const sampleArticles: Article[] = [
  {
    id: 1n,
    title: "Peluncuran Program SSK Tahun 2026 di Kabupaten Subang",
    category: "Program",
    excerpt:
      "Program Sekolah Siaga Kependudukan resmi diluncurkan dengan target menjangkau seluruh kecamatan di Kabupaten Subang.",
    content:
      "<p>Program SSK resmi diluncurkan oleh Bupati Subang dalam sebuah upacara meriah yang dihadiri oleh ratusan tamu undangan dari berbagai instansi pemerintah dan masyarakat umum.</p><p>Peluncuran ini menandai babak baru dalam upaya peningkatan kesadaran kependudukan di Kabupaten Subang. Program ini dirancang untuk menjangkau seluruh lapisan masyarakat, mulai dari pelajar hingga orang tua.</p><p>Bupati Subang menyatakan komitmen penuh pemerintah daerah untuk mendukung keberhasilan program ini melalui alokasi anggaran dan sumber daya manusia yang memadai.</p>",
    date: BigInt(Date.now() * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-1.dim_800x450.jpg",
  },
  {
    id: 2n,
    title: "Workshop Kependudukan: Memahami Data untuk Kebijakan Lebih Baik",
    category: "Kependudukan",
    excerpt:
      "Workshop yang diikuti oleh 200 peserta dari berbagai kecamatan membahas pentingnya data kependudukan dalam perencanaan daerah.",
    content:
      "<p>Workshop intensif selama dua hari ini berhasil mengumpulkan 200 peserta dari 30 kecamatan di Kabupaten Subang.</p><p>Para peserta mendapatkan pemahaman mendalam tentang cara membaca dan menganalisis data kependudukan untuk kepentingan perencanaan pembangunan daerah.</p>",
    date: BigInt((Date.now() - 7 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-2.dim_800x450.jpg",
  },
  {
    id: 3n,
    title: "SSK Subang Raih Penghargaan Inovasi Program Kependudukan 2025",
    category: "Penghargaan",
    excerpt:
      "SSK Kabupaten Subang mendapatkan penghargaan tingkat provinsi atas dedikasi dalam program kependudukan.",
    content:
      "<p>Penghargaan bergengsi ini diterima oleh Ketua SSK Kabupaten Subang dalam upacara penghargaan yang diselenggarakan oleh Pemerintah Provinsi Jawa Barat.</p><p>Penghargaan ini merupakan pengakuan atas inovasi dan konsistensi SSK Subang dalam menjalankan program kependudukan selama beberapa tahun terakhir.</p>",
    date: BigInt((Date.now() - 14 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-3.dim_800x450.jpg",
  },
  {
    id: 4n,
    title: "Pelatihan Kader Kependudukan Tingkat Desa se-Kabupaten Subang",
    category: "Program",
    excerpt:
      "Sebanyak 270 kader kependudukan dari 270 desa mengikuti pelatihan intensif selama tiga hari.",
    content:
      "<p>Program pelatihan kader ini merupakan salah satu program unggulan SSK Kabupaten Subang yang bertujuan untuk memperkuat jaringan kependudukan di tingkat akar rumput.</p><p>Setiap desa mengirimkan satu kader terbaik mereka untuk mendapatkan pelatihan komprehensif tentang kependudukan dan keluarga berencana.</p>",
    date: BigInt((Date.now() - 21 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-2.dim_800x450.jpg",
  },
  {
    id: 5n,
    title: "Kerjasama SSK dengan BKKBN Provinsi Jawa Barat",
    category: "Kemitraan",
    excerpt:
      "MoU ditandatangani antara SSK Kabupaten Subang dan BKKBN Provinsi untuk penguatan program KB.",
    content:
      "<p>Penandatanganan MoU ini membuka babak baru kerjasama antara SSK Kabupaten Subang dan BKKBN Provinsi Jawa Barat.</p><p>Kerjasama ini mencakup pertukaran data, pelatihan bersama, dan pengembangan program keluarga berencana yang lebih komprehensif.</p>",
    date: BigInt((Date.now() - 28 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-3.dim_800x450.jpg",
  },
  {
    id: 6n,
    title: "Sosialisasi Program GenRe di Sekolah Menengah Atas Subang",
    category: "Kegiatan",
    excerpt:
      "Tim SSK mengunjungi 15 SMA di Kabupaten Subang untuk mensosialisasikan program Generasi Berencana.",
    content:
      "<p>Program sosialisasi GenRe (Generasi Berencana) ini menyasar remaja usia sekolah di Kabupaten Subang sebagai target utama.</p><p>Tim penyuluh SSK menggunakan metode interaktif dan media sosial untuk menjangkau generasi muda dengan pesan kependudukan yang relevan.</p>",
    date: BigInt((Date.now() - 35 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-1.dim_800x450.jpg",
  },
];

export const sampleTeamMembers: TeamMember[] = [
  {
    id: 1n,
    name: "Dr. Budi Santoso, M.Pd",
    role: "Ketua SSK",
    bio: "Berpengalaman lebih dari 20 tahun dalam bidang pendidikan dan pengembangan masyarakat. Memimpin program SSK sejak awal berdirinya dengan dedikasi penuh untuk meningkatkan kesadaran kependudukan di Kabupaten Subang.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Budi+Santoso&background=0B2C43&color=C9A24A&size=200",
  },
  {
    id: 2n,
    name: "Siti Rahayu, S.Sos",
    role: "Koordinator Kegiatan",
    bio: "Bertanggung jawab dalam perencanaan, koordinasi, dan pelaksanaan seluruh kegiatan SSK. Ahli dalam pemberdayaan masyarakat dan program sosial kemasyarakatan.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Siti+Rahayu&background=0B2C43&color=C9A24A&size=200",
  },
  {
    id: 3n,
    name: "dr. Hendra Wijaya",
    role: "Koordinator Program KB",
    bio: "Mengintegrasikan program kesehatan reproduksi dan keluarga berencana dalam kurikulum SSK. Berpengalaman dalam penyuluhan kesehatan masyarakat.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Hendra+Wijaya&background=0B2C43&color=C9A24A&size=200",
  },
  {
    id: 4n,
    name: "Dewi Lestari, S.E",
    role: "Bendahara",
    bio: "Mengelola keuangan dan administrasi program SSK dengan transparansi penuh.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Dewi+Lestari&background=0B2C43&color=C9A24A&size=200",
  },
  {
    id: 5n,
    name: "Ahmad Fauzi, S.Pd",
    role: "Koordinator Kader",
    bio: "Koordinator program pendidikan kependudukan di tingkat kecamatan dan desa. Bertanggung jawab atas administrasi dan dokumentasi seluruh kegiatan SSK Kabupaten Subang.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=0B2C43&color=C9A24A&size=200",
  },
  {
    id: 6n,
    name: "Ibu Nur Azizah",
    role: "Penyuluh Lapangan",
    bio: "Aktif dalam kegiatan penyuluhan di tingkat desa dan kelurahan. Mendorong partisipasi perempuan dalam program kependudukan dan KB.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Nur+Azizah&background=0B2C43&color=C9A24A&size=200",
  },
];

export const blogArticles = [
  {
    id: 101n,
    title: "Memahami Bonus Demografi: Peluang dan Tantangan Indonesia",
    category: "Kependudukan",
    excerpt:
      "Bonus demografi adalah kondisi ketika proporsi penduduk usia produktif jauh lebih besar dibandingkan penduduk non-produktif.",
    content:
      "<p>Bonus demografi adalah kondisi ketika proporsi penduduk usia produktif jauh lebih besar dibandingkan penduduk non-produktif. Indonesia diprediksi mengalami puncak bonus demografi antara tahun 2020-2030.</p><p>Kondisi ini membawa peluang besar bagi pertumbuhan ekonomi, namun juga tantangan dalam penyediaan lapangan kerja dan fasilitas sosial yang memadai.</p>",
    date: BigInt((Date.now() - 5 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-1.dim_800x450.jpg",
  },
  {
    id: 102n,
    title: "Peran Keluarga dalam Pendidikan Kependudukan Anak",
    category: "Keluarga",
    excerpt:
      "Keluarga sebagai unit terkecil masyarakat memegang peranan vital dalam membentuk pemahaman anak tentang kependudukan.",
    content:
      "<p>Keluarga adalah sekolah pertama bagi anak dalam memahami nilai-nilai kependudukan. Orang tua yang sadar kependudukan akan mendidik anak-anak mereka tentang pentingnya perencanaan keluarga dan kehidupan yang bertanggung jawab.</p>",
    date: BigInt((Date.now() - 10 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-2.dim_800x450.jpg",
  },
  {
    id: 103n,
    title: "Program Keluarga Berencana: Pilihan Kontrasepsi Modern",
    category: "Keluarga",
    excerpt:
      "Program Keluarga Berencana modern menawarkan berbagai pilihan kontrasepsi yang aman dan efektif bagi pasangan usia subur.",
    content:
      "<p>Program KB modern telah berkembang pesat dengan tersedianya berbagai pilihan kontrasepsi yang aman, efektif, dan terjangkau. Pasangan usia subur kini dapat memilih metode yang paling sesuai dengan kebutuhan dan kondisi kesehatan mereka.</p>",
    date: BigInt((Date.now() - 15 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-3.dim_800x450.jpg",
  },
  {
    id: 104n,
    title: "Migrasi Penduduk dan Dampaknya terhadap Pembangunan Daerah",
    category: "Kependudukan",
    excerpt:
      "Fenomena migrasi penduduk dari desa ke kota memberikan dampak signifikan terhadap struktur ekonomi dan sosial daerah.",
    content:
      "<p>Fenomena urbanisasi atau migrasi desa-kota merupakan tantangan nyata dalam pembangunan daerah. Di satu sisi, urbanisasi mendorong pertumbuhan ekonomi perkotaan. Di sisi lain, daerah asal kehilangan penduduk produktif yang seharusnya menjadi motor pembangunan lokal.</p>",
    date: BigInt((Date.now() - 20 * 24 * 3600 * 1000) * 1_000_000),
    imageUrl: "/assets/generated/ssk-news-1.dim_800x450.jpg",
  },
];
