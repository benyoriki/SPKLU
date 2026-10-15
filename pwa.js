const SWP=document.currentScript?.dataset.sw||'sw.js';
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register(SWP).catch(()=>{}));
(()=>{const H=document.documentElement,ua=navigator.userAgent,ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),and=/android/i.test(ua);let dp=null;
const sa=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true,mark=()=>H.classList.toggle('pwa-on',sa());mark();matchMedia('(display-mode: standalone)').addEventListener?.('change',mark);
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;H.classList.add('pwa-ready')});
addEventListener('appinstalled',()=>{dp=null;H.classList.add('pwa-on');H.classList.remove('pwa-ready')});
function help(){const s=ios?['Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas) di Safari.','Pilih <b>Tambah ke Layar Utama</b>.','Ketuk <b>Tambah</b>.']:and?['Ketuk menu <b>⋮</b> di pojok kanan atas Chrome.','Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.','Ketuk <b>Instal</b>.']:['Klik ikon <b>Instal</b> di sisi kanan kolom alamat (atau menu <b>⋮</b> → <b>Instal EV Queue</b>).','Konfirmasi dengan klik <b>Instal</b>.'];
const m=document.createElement('div');m.className='imod';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.innerHTML='<div class=imc><h2>Instal EV Queue</h2><p class=mu>Buka seperti aplikasi, tanpa toko aplikasi. Gunakan Chrome / Edge (Android &amp; PC) atau Safari (iPhone).</p><ol>'+s.map(x=>'<li>'+x+'</li>').join('')+'</ol><p class=mu style="font-size:13px">Tidak muncul? Muat ulang halaman, buka di tab biasa (bukan incognito / di dalam aplikasi lain), lalu coba lagi.</p><button class=btn data-x>Mengerti</button></div>';
m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-x]'))m.remove()});document.body.append(m);m.querySelector('button').focus()}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-install]');if(!b)return;e.preventDefault();if(dp){const p=dp;dp=null;H.classList.remove('pwa-ready');p.prompt();try{await p.userChoice}catch(_){}}else help()});
})();
