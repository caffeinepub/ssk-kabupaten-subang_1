# SSK Kabupaten Subang

## Current State
Website SSK Kabupaten Subang dengan 5 halaman publik: Beranda, Tentang, Berita, Detail Berita, Kontak. Backend sudah punya CRUD artikel (createArticle, updateArticle, deleteArticle, getAllArticles). Belum ada halaman admin.

## Requested Changes (Diff)

### Add
- Halaman Admin (`/admin`) dengan login Internet Identity
- Form tambah/edit artikel di halaman admin
- Daftar artikel dengan tombol edit dan hapus
- Navigasi: tambah link Admin tersembunyi di footer atau akses via URL `/admin`

### Modify
- App.tsx: tambah route `/admin`
- Header.tsx: tidak perlu diubah (admin diakses via URL langsung)

### Remove
- Tidak ada yang dihapus

## Implementation Plan
1. Buat `src/frontend/src/pages/Admin.tsx` dengan:
   - Login/logout Internet Identity
   - Daftar artikel dari backend
   - Form untuk tambah dan edit artikel
   - Tombol hapus artikel
2. Update `App.tsx` tambah route `/admin`
3. Tambah link Admin kecil di Footer
