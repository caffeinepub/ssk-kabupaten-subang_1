# SSK Kabupaten Subang

## Current State
Admin panel di `/admin` menggunakan Internet Identity untuk autentikasi, namun siapa saja yang login via Internet Identity bisa mengakses panel admin.

## Requested Changes (Diff)

### Add
- Backend: `stable var stableAdminPrincipal : ?Principal = null` — menyimpan principal admin tunggal secara permanen
- Backend functions: `registerAdmin()`, `isAdmin()`, `getAdminPrincipal()`, `resetAdmin()`
- Frontend: Pengecekan isAdmin setelah login — hanya principal terdaftar yang bisa akses panel admin
- Frontend: Layar "Daftarkan sebagai Admin" untuk pengguna pertama yang login
- Frontend: Layar "Akses Ditolak" untuk pengguna yang bukan admin
- Frontend: Tombol "Reset Admin" di panel admin untuk mengganti akun admin

### Modify
- Admin.tsx: Tambah logika access control di antara login form dan tab panel

### Remove
- Tidak ada

## Implementation Plan
1. Tambah stable adminPrincipal ke backend
2. Tambah fungsi registerAdmin, isAdmin, getAdminPrincipal, resetAdmin
3. Update declarations (backend.did.d.ts, backend.did.js, backend.d.ts)
4. Update Admin.tsx dengan logika pengecekan admin setelah login
