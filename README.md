# 📱 Job.In - Pelacak Lamaran Pekerjaan & Progress Karir

**Job.In** adalah aplikasi web dan mobile personal yang dirancang untuk membantu Anda mencatat, memantau, dan mengelola semua lamaran pekerjaan yang telah Anda kirimkan secara teratur di satu tempat. Ucapkan selamat tinggal pada spreadsheet yang rumit dan kelola karir Anda secara visual!

---

## 🚀 Fitur Utama
*   **📋 Papan Kanban Interaktif**: Geser dan letakkan (drag-and-drop) kartu lamaran untuk memperbarui tahapan rekrutmen Anda (Applied, Interviewing, Offered, Rejected) secara instan.
*   **📊 Dashboard & Pie Chart**: Analisis distribusi status lamaran Anda secara visual menggunakan diagram lingkaran yang interaktif.
*   **📈 Ringkasan Karir**: Pantau metrik penting seperti *Response Rate* (Tingkat Respon), *Success Rate* (Tingkat Keberhasilan), dan *Rejection Rate* (Tingkat Penolakan) secara real-time.
*   **🔍 Filter & Pencarian Cepat**: Cari lamaran berdasarkan nama perusahaan, posisi, atau catatan persiapan wawancara Anda secara instan.
*   **🔒 Login & Register (Firebase)**: Akses aman menggunakan Email/Password atau integrasi Google Sign-In 1-klik.
*   **☁️ Penyimpanan Cloud (Firestore)**: Seluruh data lamaran Anda tersimpan aman di cloud dan tersinkronisasi di semua perangkat (HP & Laptop).
*   **🌗 Tema Terang & Gelap**: Estetika modern dan premium dengan transisi warna yang nyaman di mata.

---

## 📦 Unduh Aplikasi Mobile (.APK)
Anda dapat mengunduh aplikasi versi Android langsung dari repositori ini untuk dipasang di handphone Anda:

👉 **[Unduh File APK Terbaru di Sini](https://github.com/matchateens/Job.In/releases)**

*(Masuk ke halaman rilis di atas, lalu unduh berkas `app-debug.apk` di bawah kolom **Assets**).*

---

## 🛠️ Teknologi yang Digunakan
*   **Frontend**: React (Vite), CSS3 (Glassmorphism & Custom Light/Dark Theme)
*   **Database & Autentikasi**: Firebase Auth & Google Cloud Firestore
*   **Mobile Wrapper**: Capacitor
*   **Chart**: Recharts (Responsive Donut Chart)
*   **CI/CD**: GitHub Actions (Auto-compile APK)

---

## 🖥️ Menjalankan Proyek Secara Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/matchateens/Job.In.git
   cd Job.In
   ```

2. Instal dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

4. Buka alamat `http://localhost:5173` di browser Anda.
