let S=EVS.load();const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CL={available:'Tersedia',using:'Mengisi',fault:'Gangguan',offline:'Offline'},SL={WAITING:'Menunggu',CALLED:'Dipanggil',READY:'Siap',CHARGING:'Mengisi',COMPLETED:'Selesai',SKIPPED:'Terlewati',CANCELLED:'Dibatalkan',EXPIRED:'Kedaluwarsa'};
const tm=x=>new Date(x).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
const mine=()=>S.tickets.find(t=>t.id===localStorage.getItem('evq_my'));
const toast=m=>{const e=document.createElement('div');e.className='toast';e.setAttribute('role','status');e.textContent=m;document.body.append(e);setTimeout(()=>e.remove(),2600)};
const save=()=>{if(!EVS.save(S))toast('Peringatan: browser tidak bisa menyimpan data.')};
const cnt=()=>{const c=S.chargers;return{av:c.filter(x=>x.status==='available'&&!x.ticket).length,us:c.filter(x=>x.status==='using').length,fa:c.filter(x=>x.status==='fault').length,w:EVQ.waiting(S).length}};
const demo='<span class=demo>MODE DEMO</span>';
const chargers=()=>`<div class="grid g4">${S.chargers.map(c=>`<div class=stat><b>${esc(c.id)}</b><span class="badge ${c.status}">${CL[c.status]}</span><small>${esc(c.connector)} · ${c.kw} kW</small></div>`).join('')}</div>`;
const V={
home(){const k=cnt();return`<div class=hero><div class=logo>EV <b>QUEUE</b></div><h1>${esc(S.settings.name)}</h1><div style="color:#9fb0c3">${esc(S.settings.addr)} · Beroperasi 06.00–22.00</div><p>${demo}</p></div>
<div class="grid g4"><div class=stat><b>${S.chargers.length}</b><small>Total</small></div><div class=stat><b style="color:var(--c)">${k.av}</b><small>Tersedia</small></div><div class=stat><b style="color:var(--g)">${k.us}</b><small>Mengisi</small></div><div class=stat><b style="color:var(--r)">${k.fa}</b><small>Gangguan</small></div></div>
<p class=mu>${k.w} kendaraan menunggu</p><a class=btn href="#form">Ambil Nomor Antrean</a><a class="btn s" href="#queue">Lihat Antrean</a>
<div class=card><h2>Cara menggunakan</h2><ol class=mu><li>Cek antrean (tanpa login).</li><li>Ambil nomor dan isi data kendaraan.</li><li>Pantau posisi; konfirmasi saat dipanggil (batas ${S.settings.callMin} menit).</li></ol></div>
<div class="card mu" style="font-size:13px">Data tersimpan di browser ini saja dan tidak tersinkron ke perangkat lain.</div>`},
queue(){const cur=S.tickets.filter(t=>t.status==='CALLED'||t.status==='CHARGING'),w=EVQ.waiting(S);return`<h1>Status Antrean ${demo}</h1><div class=card><h2>Sedang dilayani</h2>${cur.map(t=>`<div class=row><b>${t.no}</b><span>${EVQ.maskPlat(t.plat)}</span><span class="badge ${t.status}">${SL[t.status]}</span></div>`).join('')||'<p class=mu>Belum ada kendaraan dilayani.</p>'}</div>
<div class=card><h2>Antrean berikutnya</h2>${w.map(t=>`<div class=row><b>${t.no}</b><span>${EVQ.maskPlat(t.plat)}</span><span class=mu>±${EVQ.eta(S,t)} mnt</span></div>`).join('')||'<p class=mu>Antrean kosong. Ambil nomor sekarang.</p>'}</div>
<div class=card><h2>Status charger</h2>${chargers()}</div><p class=mu style="font-size:13px">Estimasi dapat berubah. Diperbarui ${tm(Date.now())}.</p>`},
form(){const p=S.profile,vs=p?p.vehicles:[];return`<h1>Ambil Nomor Antrean</h1><form id=f class=card novalidate>${vs.length?`<label for=sv>Kendaraan tersimpan</label><select id=sv><option value="">— isi manual —</option>${vs.map((v,i)=>`<option value=${i}>${esc(v.plat)} · ${esc(v.model)}</option>`).join('')}</select>`:''}
<label>Jenis kendaraan</label><div class=seg><label><input type=radio name=type value=car checked><span>🚗 Mobil</span></label><label><input type=radio name=type value=moto><span>🛵 Motor</span></label></div>
<label for=plat>Plat nomor</label><input id=plat placeholder="B 1234 ABC" autocomplete=off><label for=model>Merek & model</label><input id=model placeholder="Tesla Model Y"><label for=phone>Nomor HP</label><input id=phone inputmode=tel placeholder="0812 3456 7890" value="${esc(p?p.phone:'')}">
<label for=conn>Konektor</label><select id=conn><option>CCS2</option><option>Type 2</option><option>CHAdeMO</option></select><label style="display:flex;gap:8px;font-weight:400"><input id=ok type=checkbox style="width:auto;min-height:0"> Saya menyetujui aturan antrean dan pemrosesan data.</label><div id=err class=err role=alert></div><button class=btn>Ambil Nomor</button></form>`},
ticket(){const t=mine();if(!t)return`<h1>Tiket Antrean</h1><div class=card><p>Anda belum punya tiket.</p><a class=btn href="#form">Ambil Nomor Antrean</a></div>`;const st=['WAITING','CALLED','READY','CHARGING','COMPLETED'],i=st.indexOf(t.status),ch=S.chargers.find(c=>c.id===t.charger);
return`<h1>Tiket Antrean</h1><div class=card><div style="text-align:center"><small class=mu>${esc(S.settings.name)}</small><div class=big>${t.no}</div><span class="badge ${t.status}">${SL[t.status]}</span></div>
${t.status==='CALLED'?`<p class=mu style="text-align:center;margin-bottom:0">Menuju ${esc(ch?ch.name:'charger')} — konfirmasi dalam</p><div class=timer id=cd data-d="${t.deadline}"></div>`:''}
<div class=row><span class=mu>Plat</span><b>${esc(t.plat)}</b></div><div class=row><span class=mu>Kendaraan</span><b>${esc(t.model)}</b></div><div class=row><span class=mu>Kode tiket</span><b>${t.id}-${t.created.toString(36).toUpperCase()}</b></div>
${t.status==='WAITING'?`<div class=row><span class=mu>Posisi</span><b>${EVQ.position(S,t)}</b></div><div class=row><span class=mu>Estimasi</span><b>±${EVQ.eta(S,t)} menit</b></div>`:''}
<div class=steps>${['Menunggu','Dipanggil','Siap','Mengisi','Selesai'].map((n,k)=>`<div class="${k<=i?'on':''}"><i></i>${n}</div>`).join('')}</div>
${EVQ.act(t)?`<button class=btn data-a=ready ${t.status==='CALLED'?'':'disabled'}>Saya Siap</button><button class="btn y" data-a=late ${t.status==='CALLED'&&!t.late?'':'disabled'}>Saya Terlambat (+2 mnt)</button><button class="btn d" data-a=cancel ${t.status==='CHARGING'?'disabled':''}>Batalkan Antrean</button>`:''}
${t.status==='SKIPPED'?`<p>Giliran Anda terlewati. Anda dapat masuk antrean lagi di posisi akhir.</p><button class=btn data-a=requeue>Masuk Antrean Lagi</button>`:''}${t.status==='CHARGING'?'<p class=mu>Pengisian diselesaikan oleh petugas.</p>':''}</div>`},
notif(){const t=mine();return`<h1>Notifikasi</h1><div class=card>${t?t.history.slice().reverse().map(h=>`<div class=row><span>${SL[h.to]} — ${esc(h.why)}</span><small class=mu>${tm(h.at)}</small></div>`).join(''):'<p class=mu>Belum ada notifikasi. Ambil nomor antrean dulu.</p>'}</div><button class="btn s" data-a=perm>Izinkan notifikasi browser</button><p class=mu style="font-size:13px">Web Push, WhatsApp, dan SMS belum terhubung (simulasi). Notifikasi browser hanya muncul saat halaman terbuka.</p>`},
account(){const p=S.profile||{name:'',phone:'',vehicles:[]},h=S.tickets.filter(t=>!EVQ.act(t)&&p.vehicles.some(v=>v.plat===t.plat));return`<h1>Akun Saya</h1><p class=mu style="font-size:13px">Akun lokal ${demo}: hanya berlaku di browser dan perangkat ini, tanpa password.</p>
<form id=pf class=card><label for=pn>Nama panggilan</label><input id=pn value="${esc(p.name)}"><label for=pp>Nomor HP</label><input id=pp inputmode=tel value="${esc(p.phone)}"><button class=btn>Simpan Profil</button></form>
<div class=card><h2>Kendaraan tersimpan</h2>${p.vehicles.map((v,i)=>`<div class=row><span>${esc(v.plat)}<br><small class=mu>${esc(v.model)}</small></span><button class="btn sm d" data-a=delveh data-i=${i}>Hapus</button></div>`).join('')||'<p class=mu>Belum ada kendaraan.</p>'}
<form id=vf style="margin-top:10px"><input id=vp placeholder="Plat, mis. B 1234 ABC" aria-label=Plat><input id=vm placeholder="Merek & model" aria-label=Model style="margin-top:6px"><div id=verr class=err></div><button class="btn s">+ Tambah Kendaraan</button></form></div>
<div class=card><h2>Riwayat antrean</h2>${h.map(t=>`<div class=row><span>${t.no} · ${esc(t.plat)}</span><span class="badge ${t.status}">${SL[t.status]}</span></div>`).join('')||'<p class=mu>Belum ada riwayat.</p>'}</div>
<button class="btn s" data-a=theme>Ganti tema (terang/gelap)</button><button class="btn d" data-a=reset>Reset Data Demo</button>`}};
function route(){return location.hash.slice(1)||'home'}
function render(force){const r=V[route()]?route():'home';if(!force&&['form','account'].includes(r)&&$('#view').dataset.r===r)return;$('#view').innerHTML=V[r]();$('#view').dataset.r=r;document.querySelectorAll('nav.bot a').forEach(a=>a.classList.toggle('on',a.dataset.r===r||(r==='form'&&a.dataset.r==='queue')))}
function cd(){const e=$('#cd');if(e){const s=Math.max(0,Math.round((e.dataset.d-Date.now())/1000));e.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');e.style.color=s<60?'var(--r)':'var(--y)'}}
function sync(){S=EVS.reload();if(EVQ.tick(S))save()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,t=mine();try{
if(a==='ready'){EVQ.ready(S,t,'pengendara');toast('Kesiapan dikonfirmasi')}
else if(a==='late'){t.deadline+=120000;t.late=1;t.history.push({at:Date.now(),to:t.status,why:'Pengendara terlambat (+2 menit)',by:'pengendara'})}
else if(a==='cancel'){if(!confirm('Batalkan antrean?'))return;EVQ.cancel(S,t,'pengendara');toast('Antrean dibatalkan')}
else if(a==='requeue'){EVQ.requeue(S,t,'pengendara')}
else if(a==='theme'){S.settings.theme=S.settings.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=S.settings.theme}
else if(a==='reset'){if(!confirm('Reset semua data demo?'))return;S=EVS.reset();document.documentElement.dataset.theme='dark'}
else if(a==='delveh'){S.profile.vehicles.splice(+b.dataset.i,1)}
else if(a==='perm'){if('Notification' in window)Notification.requestPermission().then(p=>toast('Izin: '+p));else toast('Browser tidak mendukung notifikasi')}
}catch(x){toast(x.message)}save();render(true)});
document.addEventListener('change',e=>{if(e.target.id==='sv'&&e.target.value!==''){const v=S.profile.vehicles[+e.target.value];$('#plat').value=v.plat;$('#model').value=v.model;document.querySelector(`[name=type][value=${v.type||'car'}]`).checked=true}});
document.addEventListener('submit',e=>{e.preventDefault();const id=e.target.id;
if(id==='f'){const d={type:document.querySelector('[name=type]:checked').value,plat:$('#plat').value,model:$('#model').value.trim(),phone:$('#phone').value.replace(/[\s-]/g,''),connector:$('#conn').value},er=$('#err');
if(!EVQ.norm(d.plat))return er.textContent='Plat nomor tidak valid. Contoh: B 1234 ABC';if(d.model.length<3)return er.textContent='Isi merek dan model kendaraan.';if(!/^(08|\+628)\d{8,11}$/.test(d.phone))return er.textContent='Nomor HP tidak valid (contoh 081234567890).';if(!$('#ok').checked)return er.textContent='Anda harus menyetujui aturan antrean.';
try{const t=EVQ.create(S,d);localStorage.setItem('evq_my',t.id);save();toast('Antrean berhasil dibuat');location.hash='ticket'}catch(x){er.textContent=x.message}}
if(id==='pf'){S.profile=S.profile||{vehicles:[]};S.profile.name=$('#pn').value.trim();S.profile.phone=$('#pp').value.trim();save();toast('Profil disimpan');render(true)}
if(id==='vf'){const p=EVQ.norm($('#vp').value),m=$('#vm').value.trim();if(!p||m.length<3)return $('#verr').textContent='Isi plat valid dan model.';S.profile=S.profile||{name:'',phone:'',vehicles:[]};if(S.profile.vehicles.some(v=>v.plat===p))return $('#verr').textContent='Kendaraan sudah tersimpan.';S.profile.vehicles.push({plat:p,model:m,type:'car'});save();render(true)}});
addEventListener('hashchange',()=>render(true));addEventListener('storage',()=>{sync();render()});
setInterval(()=>{sync();render();cd()},1000);
document.documentElement.dataset.theme=S.settings.theme;render(true);cd();
