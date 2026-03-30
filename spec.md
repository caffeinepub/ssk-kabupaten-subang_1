# SSK Kabupaten Subang

## Current State
- Backend has full CRUD for Articles, and read-only seeded data for TeamMembers and Activities
- Admin page only manages Articles (Berita)
- TeamMembers, Activities, and ContactInfo are hardcoded in frontend
- Pages: Beranda, Tentang (shows team members), Berita & Artikel, Kontak (static contact info)

## Requested Changes (Diff)

### Add
- Backend CRUD for TeamMembers: createTeamMember, updateTeamMember, deleteTeamMember
- Backend CRUD for Activities: createActivity, updateActivity, deleteActivity
- Backend ContactInfo storage: getContactInfo, updateContactInfo
- Admin tabs: Anggota Tim, Kegiatan, Kontak Info (in addition to existing Berita tab)
- useQueries hooks for activities and contact info

### Modify
- main.mo: TeamMembers and Activities become mutable Maps with full CRUD; add ContactInfo singleton
- Admin.tsx: Add tabs (Berita, Anggota Tim, Kegiatan, Kontak) with full CRUD UI for each
- Kontak.tsx: Load contact info from backend instead of hardcoded values
- useQueries.ts: Add useActivities and useContactInfo hooks

### Remove
- Hardcoded seeded TeamMembers and Activities in backend (replaced by admin-managed data with initial seeded records)

## Implementation Plan
1. Update main.mo with CRUD for TeamMembers, Activities, and ContactInfo singleton
2. Regenerate backend bindings
3. Update useQueries.ts to add activities and contactInfo hooks
4. Update Admin.tsx to have 4 tabs: Berita, Anggota Tim, Kegiatan, Kontak
5. Update Kontak.tsx to read from backend contactInfo
