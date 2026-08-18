# Dev Portfolio — Monochrome / Terminal Edition

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build untuk production

```bash
npm run build
npm run preview
```

## Mengedit konten

Semua teks (nama, bio, proyek, pengalaman, sosial media) ada di satu file:
`src/data/content.js`. Ganti isinya, tidak perlu menyentuh komponen lain.

## Struktur

- `src/components/Hero.jsx` — boot-sequence intro + canvas node graph
- `src/components/About.jsx` — bio & stack
- `src/components/Projects.jsx` — sticky-stack project cards
- `src/components/Experience.jsx` — timeline gaya `git log`
- `src/components/Contact.jsx` — CTA & tautan sosial
- `src/components/StatusBar.jsx` — indikator section aktif + jam, sticky di bawah
