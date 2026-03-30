# SSK Kabupaten Subang

## Current State
Website SSK Subang dengan admin panel di `/admin`. Sudah ada manajemen: Berita, Anggota Tim, Kegiatan, Kontak, Program Unggulan, Video YouTube, dan Profil. Header menggunakan icon shield statis. Belum ada halaman Galeri, Pendaftaran Anggota, Satuan SSK, dan logo yang bisa diubah admin.

## Requested Changes (Diff)

### Add
- **GaleriItem** backend type (id, title, description, mediaUrl, mediaType: foto/video, date) + full CRUD
- **PendaftaranAnggota** backend type (id, nama, nik, alamat, phone, email, pekerjaan, alasan, tanggalDaftar, status) + CRUD
- **SatuanSSK** backend type (id, nama, alamat, phone, email, deskripsi, logoUrl, ketua) + full CRUD
- **SiteSettings** backend type (logoUrl) + get/update functions
- Page `/galeri` - halaman publik galeri foto dan video kegiatan dengan grid layout
- Page `/daftar` - form pendaftaran anggota SSK (publik dapat mengisi, admin melihat daftar pendaftar)
- Page `/satuan` - halaman publik menampilkan daftar satuan SSK dengan profil masing-masing (nama, ketua, deskripsi, logo)
- Admin tabs baru: **Galeri**, **Pendaftaran**, **Satuan SSK**, **Pengaturan Logo**
- Galeri admin: upload foto dari galeri perangkat, tambah link video YouTube, edit, hapus
- Pendaftaran admin: lihat daftar pendaftar, ubah status (Menunggu/Diterima/Ditolak), hapus
- Satuan SSK admin: tambah/edit/hapus satuan dengan input logo (upload dari galeri perangkat)
- Pengaturan Logo admin: upload logo situs yang tampil di header dan footer

### Modify
- `Header.tsx`: tambah nav link Galeri, Satuan, Daftar; tampilkan logo dari backend (jika ada) menggantikan icon Shield
- `Footer.tsx`: tampilkan logo dari backend (jika ada)
- `App.tsx`: tambah routes untuk `/galeri`, `/daftar`, `/satuan`
- `Admin.tsx`: tambah tab Galeri, Pendaftaran, Satuan SSK, Pengaturan Logo

### Remove
- (tidak ada)

## Implementation Plan
1. Generate Motoko backend dengan tipe baru: GaleriItem, PendaftaranAnggota, SatuanSSK, SiteSettings
2. Update backend.d.ts dengan type definitions baru
3. Buat halaman Galeri.tsx, Daftar.tsx, Satuan.tsx
4. Update App.tsx untuk routes baru
5. Update Header.tsx dengan nav links baru dan logo dinamis dari backend
6. Update Footer.tsx dengan logo dinamis dari backend
7. Update Admin.tsx dengan tab-tab baru
