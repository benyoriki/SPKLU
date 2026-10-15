# EV Queue 2026 (prototype)
Vanilla HTML/CSS/JS + localStorage + PWA. Tanpa build.

## Jalankan lokal
`python3 -m http.server 8000` lalu buka http://localhost:8000/ (admin: /admin/)

## GitHub Pages
Struktur datar: semua file di root, hanya folder `admin/`. Upload semua isi folder ke repo → Settings → Pages → Deploy from branch `main` / root. Semua path relatif, aman untuk subfolder `https://user.github.io/EV-Queue/`.

## Akun demo admin (simulasi, BUKAN keamanan)
- admin / admin123
- operator / operator123

Reset data: tombol "Reset Data Demo" (Akun Saya atau Admin → Pengaturan).

## Keterbatasan
- localStorage tidak tersinkron antar browser/HP; antrean multi-perangkat butuh backend.
- Timer dihitung dari timestamp absolut dan diperiksa saat halaman terbuka; tidak ada penjadwal server.
- Login admin hanya di sisi klien.

## Migrasi
Firebase Realtime Database/Firestore + Auth, Cloud Functions untuk transaksi antrean (call/skip/expire terjadwal), aturan keamanan per peran, FCM untuk Web Push.

## Sudah berfungsi vs belum
Berfungsi: ambil/batal tiket, validasi & anti-duplikat, mesin status, panggil/lewati/mulai/selesai, timer 5 menit, gangguan charger, akun lokal, kendaraan tersimpan, tema, CSV, reset, PWA/offline dasar.
Belum/simulasi: QR code, grafik, push/WhatsApp/SMS, drawer admin ponsel (sidebar menjadi bar horizontal), halaman terpisah per tampilan (memakai hash di satu halaman), foto SPKLU.
Belum diuji di browser sungguhan.
