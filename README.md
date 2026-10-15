# EV Queue 2026 (prototype, MODE DEMO)
HTML/CSS/JS murni + localStorage + PWA. Struktur datar: semua file di root, satu-satunya folder `admin/`.
Situs: https://benyoriki.github.io/SPKLU/ — Admin: /admin/

## Akun demo admin (simulasi, BUKAN keamanan)
admin / admin123 · operator / operator123. Reset: tombol "Reset Data Demo" (Akun Saya / Admin → Pengaturan).

## Ganti QR saat domain berubah
`pip install segno` lalu: `python3 -c "import segno;segno.make('URL-BARU/#queue').save('qr.svg',scale=8,border=2)"`; ubah juga konstanta `QURL` di `app.js` dan `admin.js`.

## Keterbatasan
localStorage hanya berlaku di browser/perangkat yang sama (tidak real-time lintas perangkat). Timer memakai timestamp absolut dan dievaluasi saat halaman terbuka; tidak ada penjadwal server. Login admin hanya di sisi klien.

## Migrasi
Firebase Auth + Realtime Database; Cloud Functions untuk callNext/skip/expire terjadwal. `queue-engine.js` (logika) terpisah dari UI sehingga dapat dipindah ke Functions.
