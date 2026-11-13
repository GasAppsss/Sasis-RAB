# Sistem RAB — Panduan Setup & Deploy

Aplikasi Rencana Anggaran Biaya untuk arsitek. Dibangun dengan React + Vite,
database Supabase (Postgres sungguhan), dan bisa diinstall sebagai aplikasi
di HP Android (PWA).

Total waktu setup dari nol sampai bisa dibuka di HP: **sekitar 15 menit**.

---

## Yang kamu butuhkan

- Node.js versi 18 ke atas ([nodejs.org](https://nodejs.org)) — untuk menjalankan & build aplikasi di komputer
- Akun Supabase, gratis ([supabase.com](https://supabase.com))
- Akun GitHub, gratis ([github.com](https://github.com)) — untuk menyimpan kode dan hosting lewat GitHub Pages
  (alternatif: akun Vercel, lihat bagian "Alternatif: deploy ke Vercel")

---

## Langkah 1 — Buat project Supabase (± 3 menit)

1. Buka [supabase.com](https://supabase.com), daftar/login, klik **New Project**.
2. Isi nama project bebas (misalnya "sistem-rab"), buat password database (simpan baik-baik), pilih region terdekat (misalnya Singapore).
3. Tunggu ± 1-2 menit sampai project selesai dibuat.
4. Di sidebar kiri, klik **SQL Editor** > **New query**.
5. Buka file `supabase-schema.sql` yang ada di folder ini, copy semua isinya, paste ke SQL Editor, lalu klik **Run**.
   Ini akan membuat 3 tabel (`price_items`, `ahsp_items`, `projects`) beserta pengaturan aksesnya.
6. Masih di Supabase, buka **Project Settings** (ikon gerigi) > **API**. Catat dua hal ini:
   - **Project URL** (bentuknya `https://xxxxx.supabase.co`)
   - **anon public key** (string panjang di bagian "Project API keys")

---

## Langkah 2 — Jalankan di komputer dulu untuk memastikan semua beres (± 5 menit)

1. Extract/buka folder proyek ini di terminal.
2. Copy `.env.example` jadi `.env`:
   ```
   cp .env.example .env
   ```
3. Buka `.env`, ganti dua baris paling bawah dengan URL dan anon key dari Langkah 1.
4. Install dependencies:
   ```
   npm install
   ```
5. Jalankan:
   ```
   npm run dev
   ```
6. Buka `http://localhost:5173` di browser. Kalau database Supabase kosong, aplikasi otomatis mengisinya dengan data contoh (28 item AHSP, 50 item harga, 1 proyek contoh) saat pertama kali dibuka — jadi tunggu beberapa detik di layar "Memuat data...".
7. Kalau muncul RAB dengan proyek "Rumah Tinggal Type 45", berarti sudah tersambung ke Supabase dengan benar.

**Kalau ada error "Gagal terhubung ke database":** cek lagi URL/anon key di `.env`, dan pastikan Langkah 1.5 (jalankan SQL schema) sudah dilakukan.

---

## Langkah 3 — Deploy ke GitHub Pages (gratis, ± 5 menit)

Proyek ini sudah dilengkapi workflow otomatis di `.github/workflows/deploy.yml`:
setiap kali kode di-push ke branch `main`, GitHub akan build dan memublikasikannya.
Cukup lakukan setup satu kali, **urutannya penting** supaya deploy pertama langsung berhasil:

1. **Buat repository kosong** di GitHub (misalnya `sistem-rab`), tanpa README/.gitignore bawaan.
   GitHub Pages versi gratis hanya bisa dipakai untuk repository **Public**
   (repository Private butuh akun GitHub berbayar).
2. **Isi kredensial Supabase sebagai secret:** di repo tersebut buka
   **Settings > Secrets and variables > Actions > New repository secret**, lalu tambahkan dua secret:
   - `VITE_SUPABASE_URL` — isinya Project URL dari Langkah 1
   - `VITE_SUPABASE_ANON_KEY` — isinya anon public key dari Langkah 1
3. **Aktifkan Pages:** buka **Settings > Pages**, pada bagian *Build and deployment*
   ubah **Source** menjadi **GitHub Actions**.
4. **Push kode** dari folder proyek ini:
   ```
   git init
   git add .
   git commit -m "Sistem RAB"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
   (Ganti `USERNAME` dan `NAMA-REPO`. File `.env` tidak ikut ter-push karena sudah masuk `.gitignore`.)
5. Buka tab **Actions** di repo, tunggu workflow "Deploy ke GitHub Pages" selesai (± 1-2 menit).
   Alamat aplikasimu: `https://USERNAME.github.io/NAMA-REPO/`

Selanjutnya, setiap `git push` ke `main` otomatis memperbarui situs. Workflow juga bisa
dijalankan manual lewat tab Actions > Deploy ke GitHub Pages > **Run workflow**.

**Kalau workflow gagal dengan pesan "Secret ... belum diisi":** ulangi langkah 2, lalu klik *Re-run jobs*.
**Kalau gagal di tahap deploy ("Pages site not found" dan sejenisnya):** pastikan langkah 3 sudah dilakukan.

---

## Langkah 4 — Install ke HP Android sebagai aplikasi (± 1 menit)

1. Buka alamat aplikasimu (GitHub Pages atau Vercel) di **Chrome** di HP Android.
2. Tap menu titik tiga (⋮) di pojok kanan atas.
3. Pilih **"Add to Home screen"** atau **"Install app"**.
4. Konfirmasi. Ikon "Sistem RAB" akan muncul di home screen dan terbuka fullscreen seperti aplikasi biasa (bukan tab browser).

---

## Alternatif: deploy ke Vercel

Kalau lebih suka Vercel, bisa lewat terminal tanpa perlu GitHub:

1. Install Vercel CLI sekali saja:
   ```
   npm install -g vercel
   ```
2. Dari folder proyek ini, jalankan:
   ```
   vercel
   ```
3. Ikuti pertanyaannya: login (buka link yang muncul di browser), lalu untuk pertanyaan setup pakai default saja (tekan Enter semua) — Vercel otomatis mendeteksi ini proyek Vite.
4. Tambahkan environment variables di Vercel supaya versi online tersambung ke Supabase:
   **Settings > Environment Variables** > tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
   dengan nilai yang sama seperti di `.env` lokal, lalu jalankan `vercel --prod` sekali lagi.

---

## Struktur data di Supabase

Tiga tabel, semuanya bisa kamu lihat/edit langsung lewat **Table Editor** di dashboard Supabase kalau perlu:

- **price_items** — daftar harga bahan/upah/alat (kategori, nama, satuan, harga)
- **ahsp_items** — daftar item pekerjaan AHSP (kode, kategori, nama, satuan, dan `komponen` berisi daftar bahan/upah/alat + koefisiennya dalam format JSON)
- **projects** — daftar proyek RAB (nama, lokasi, tanggal, persen BU&K/PPN, dan `items` berisi daftar pekerjaan yang dipakai di proyek itu dalam format JSON)

## Catatan keamanan (baca sebelum memasukkan data klien)

Aplikasi ini **belum punya sistem login**, dan situs di GitHub Pages bersifat **publik**.
Anon key Supabase ikut tertanam di file JavaScript yang diunduh browser — itu normal
untuk Supabase, karena keamanan data seharusnya dijaga oleh aturan RLS di database.
Masalahnya, aturan RLS di `supabase-schema.sql` saat ini mengizinkan **siapa saja**
membaca, mengubah, dan menghapus semua data. Jadi siapa pun yang membuka alamat situsnya
(atau mengambil key dari JavaScript-nya) bisa mengutak-atik database.

Selama belum ada login: pakai data contoh/uji saja, jangan isi data klien sungguhan,
dan jangan sebarkan alamat situsnya. Untuk pemakaian sungguhan, langkah berikutnya
adalah menambahkan Supabase Auth (login email/password) dan mengganti policy RLS
supaya hanya user yang sudah login yang bisa mengakses data.

Jangan pernah commit file `.env` ke GitHub (sudah dicegah lewat `.gitignore`).

## Update data harga secara berkala

Harga bahan/upah di database Supabase adalah **angka contoh yang realistis**,
bukan kutipan resmi SNI/Permen PUPR atau harga pasar terkini di daerahmu.
Sebelum dipakai untuk klien, sesuaikan dulu lewat tab **Harga** dan **AHSP**
di aplikasi — semua bisa diedit langsung dari sana, tidak perlu menyentuh SQL.

## Perintah yang tersedia

```
npm run dev      # jalankan di komputer untuk development
npm run build    # build untuk production (hasil di folder dist/)
npm run preview  # preview hasil build secara lokal
```
