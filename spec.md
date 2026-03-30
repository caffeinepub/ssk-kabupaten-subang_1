# SSK Kabupaten Subang

## Current State
The site has sections including Struktur Organisasi (team members grid) at the bottom of Home.tsx. Admin panel has multiple tabs for managing content. No slider/banner section exists.

## Requested Changes (Diff)

### Add
- `SliderBanner` type in backend: `{ id, title, description, imageUrl, linkUrl, urutan }`
- Backend CRUD: `createSliderBanner`, `getAllSliderBanners`, `updateSliderBanner`, `deleteSliderBanner`
- Stable storage for slider banners
- Auto-sliding carousel section on Home page, below Struktur Organisasi, showing slide image, title, description
- Admin tab "Slider Banner" for managing slides (add/edit/delete, image upload from gallery)

### Modify
- `main.mo`: add SliderBanner type, stable vars, CRUD, preupgrade/postupgrade
- `backend.d.ts`, `backend.did.d.ts`, `backend.did.js`: add SliderBanner type and functions
- `Home.tsx`: add slider section below team section
- `Admin.tsx`: add Slider Banner tab

### Remove
- Nothing removed

## Implementation Plan
1. Update backend with SliderBanner type and CRUD
2. Update all declaration files
3. Add slider section to Home.tsx
4. Add admin tab for Slider Banner management
