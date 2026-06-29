# Dokumen Desain: Job.In (Pelacak Lamaran Pekerjaan)

Dokumen ini mendefinisikan estetika desain, tata letak, palet warna, interaksi, serta skema data untuk aplikasi web **Job.In**.

---

## 1. Konsep & Estetika Visual

Aplikasi ini menggunakan konsep **Glassmorphism Premium** dengan **Tema Gelap Modern (Modern Dark Mode)** untuk memberikan kesan profesional, modern, dan tidak membosankan.

### A. Palet Warna
Kita menggunakan sistem warna HSL agar gradasi dan efek transparansi terlihat menyatu secara natural:

*   **Background Utama:** `hsla(270, 77%, 28%, 1.00)` (Deep Dark Blue/Slate)
*   **Card Background (Glass):** `hsla(224, 32%, 18%, 0.65)` dengan backdrop-filter blur `12px` dan border tipis `hsla(0, 0%, 100%, 0.08)`.
*   **Warna Aksen:**
    *   **Primary/Applied:** `hsl(217, 91%, 60%)` (Neon Blue) - Melambangkan langkah awal/lamaran terkirim.
    *   **Interviewing:** `hsl(38, 92%, 50%)` (Warm Amber/Orange) - Melambangkan proses aktif & komunikasi.
    *   **Offered:** `hsl(142, 70%, 45%)` (Emerald Green) - Melambangkan keberhasilan/penawaran kerja.
    *   **Rejected:** `hsl(350, 89%, 60%)` (Rose Red) - Melambangkan penolakan/belum beruntung.
    *   **Text Primary:** `hsl(210, 40%, 98%)` (Pure White/Ice Blue)
    *   **Text Secondary:** `hsl(215, 20%, 65%)` (Muted Slate)

### B. Tipografi
Menggunakan font sans-serif modern yang bersih:
*   **Font Family:** `Inter`, system-ui, -apple-system, sans-serif.
*   **Header (H1, H2):** Tebal (Bold/Extra Bold) dengan gradasi teks (`background-clip: text` dari Neon Blue ke Emerald Green).

---

## 2. Struktur Tata Letak (Layout)

Tata letak bersifat responsif (*Mobile-First*) dengan struktur grid yang fleksibel.

```
+---------------------------------------------------------+
|  Logo [Job.In]          Ekspor/Impor     [+ Tambah Job] |  Header
+---------------------------------------------------------+
|  [ Total: 12 ] [ Applied: 5 ] [ Interview: 3 ] [ Offer: 2 ]  Metrics Bar
+---------------------------------------------------------+
|  [ Cari Perusahaan/Posisi... ]     [ Tampilan: Kanban / List ]  Search & Toggle
+---------------------------------------------------------+
|                                                         |
|  [ KOLOM APPLIED ]  [ KOLOM INTERVIEW ]  [ KOLOM OFFER ] |  Main Area
|  +--------------+  +-----------------+  +-------------+ |  (Kanban Board /
|  | Card Job A   |  | Card Job B      |  | Card Job C  | |   List View)
|  +--------------+  +-----------------+  +-------------+ |
|                                                         |
+---------------------------------------------------------+
```

### A. Metrik Statistik (Metrics Bar)
Kartu informasi cepat di bagian atas yang menyajikan ringkasan instan:
*   **Total Lamaran:** Jumlah kumulatif lamaran.
*   **Dalam Proses:** Lamaran berstatus *Applied* + *Interviewing*.
*   **Diterima (Offered):** Jumlah sukses (berwarna hijau berkilau).
*   **Rasio Keberhasilan:** Persentase penawaran dibanding total lamaran.

### B. Kontrol Utama (Search & Toggle)
*   Kotak pencarian teks untuk menyaring nama perusahaan atau posisi secara instan.
*   Tombol *toggle* untuk berpindah antara tampilan **Papan Kanban** (visual alur) dan **Daftar/Tabel** (tinjauan cepat).

### C. Kanban Board (Tampilan Default)
*   Memiliki 4 kolom utama: *Applied*, *Interviewing*, *Offered*, dan *Rejected*.
*   Setiap kolom berisi kartu-kartu lamaran pekerjaan yang bisa diklik untuk detail/edit, atau dipindahkan statusnya dengan mudah.

### D. Daftar Tabel (List View)
*   Tampilan baris demi baris yang rapi.
*   Sangat baik untuk melihat banyak data secara bersamaan dengan pengurutan berdasarkan tanggal melamar.

---

## 3. Skema Data (Data Schema)

Setiap entri lamaran pekerjaan disimpan sebagai objek JavaScript dalam larik (*array*) di LocalStorage dengan format berikut:

```typescript
interface JobApplication {
  id: string;             // UUID unik
  company: string;        // Nama Perusahaan (wajib)
  position: string;       // Posisi/Pekerjaan (wajib)
  status: 'applied' | 'interviewing' | 'offered' | 'rejected'; // Status lamaran
  dateApplied: string;    // Format YYYY-MM-DD (default: hari ini)
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  link: string;           // URL lowongan kerja (opsional)
  salary: string;         // Kisaran gaji (opsional)
  notes: string;          // Catatan wawancara, persiapan, langkah selanjutnya (opsional)
  updatedAt: string;      // Timestamp pembaruan terakhir
}
```

---

## 4. Efek Interaksi & Animasi (Micro-interactions)

Untuk memberikan kesan premium dan hidup:
*   **Card Hover:** Kartu akan sedikit bergeser ke atas (`translateY(-4px)`) dengan bayangan neon tipis yang menyala sesuai warna statusnya.
*   **Hover Glow:** Tombol "+ Tambah Job" memiliki efek gradasi warna yang meluncur lancar saat kursor berada di atasnya.
*   **Modal Slide-In:** Form tambah/edit muncul dari bawah layar (pada HP) atau memudar lembut dari tengah (pada Desktop) menggunakan transisi `cubic-bezier`.
*   **Badge Pulse:** Status *Interviewing* memiliki titik indikator kecil yang berkedip (*pulsing yellow*) untuk menandakan aksi aktif.
