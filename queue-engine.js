const EVQ=(()=>{const ACT=['WAITING','CALLED','READY','CHARGING'];
const OK={WAITING:['CALLED','CANCELLED'],CALLED:['READY','SKIPPED','CANCELLED','WAITING'],READY:['CHARGING','SKIPPED','CANCELLED','WAITING'],CHARGING:['COMPLETED'],SKIPPED:['WAITING','CANCELLED'],COMPLETED:[],CANCELLED:[],EXPIRED:[]};
const act=t=>ACT.includes(t.status);
const norm=p=>{const a=String(p).toUpperCase().replace(/[^A-Z0-9]/g,''),m=a.match(/^([A-Z]{1,2})(\d{1,4})([A-Z]{0,3})$/);return m?[m[1],m[2],m[3]].filter(Boolean).join(' '):null};
const maskPlat=p=>{const q=p.split(' ');if(q[1]&&q[1].length>2)q[1]=q[1][0]+'••'+q[1].slice(-1);return q.join(' ')};
const maskPhone=h=>String(h).slice(0,4)+'••••'+String(h).slice(-3);
function set(s,t,to,why,by='sistem'){if(!OK[t.status].includes(to))throw Error(`Transisi ${t.status} → ${to} tidak diizinkan`);t.status=to;t.history.push({at:Date.now(),to,why,by});s.log.unshift({at:Date.now(),who:by,msg:`${t.no}: ${to} (${why})`});if(s.log.length>200)s.log.length=200}
function release(s,t){s.chargers.forEach(c=>{if(c.ticket===t.id){c.ticket=null;c.startedAt=null;if(c.status==='using')c.status='available'}});t.charger=null}
function create(s,d){const plat=norm(d.plat);if(!plat)throw Error('Format plat tidak valid. Contoh: B 1234 ABC');
if(s.tickets.some(t=>act(t)&&norm(t.plat)===plat))throw Error('Kendaraan ini sudah punya tiket aktif.');
const no='A-'+String(++s.seq).padStart(3,'0');const t={id:'T'+s.seq,no,plat,type:d.type,model:d.model,phone:d.phone,connector:d.connector,status:'WAITING',created:Date.now(),history:[{at:Date.now(),to:'WAITING',why:'Tiket dibuat',by:'pengendara'}]};s.tickets.push(t);s.log.unshift({at:Date.now(),who:'pengendara',msg:no+': tiket dibuat'});return t}
function waiting(s){return s.tickets.filter(t=>t.status==='WAITING').sort((a,b)=>a.created-b.created)}
function position(s,t){return waiting(s).findIndex(x=>x.id===t.id)+1}
function eta(s,t){const n=s.chargers.filter(c=>c.status==='available'||c.status==='using').length||1;return Math.max(5,Math.ceil(position(s,t)*s.settings.minPerCar/n))}
function callNext(s,by='admin'){const t=waiting(s)[0];if(!t)throw Error('Tidak ada antrean menunggu.');const c=s.chargers.find(c=>c.status==='available'&&!c.ticket);if(!c)throw Error('Tidak ada charger tersedia.');c.ticket=t.id;t.charger=c.id;t.deadline=Date.now()+s.settings.callMin*60000;set(s,t,'CALLED','Dipanggil ke '+c.name,by);return t}
function recall(s,t,by){if(t.status!=='CALLED')throw Error('Hanya tiket CALLED.');t.deadline=Date.now()+s.settings.callMin*60000;s.log.unshift({at:Date.now(),who:by,msg:t.no+': panggil ulang'})}
function ready(s,t,by){set(s,t,'READY','Kesiapan dikonfirmasi',by)}
function start(s,t,by){const c=s.chargers.find(c=>c.ticket===t.id);if(!c||c.status!=='available')throw Error('Charger tidak siap.');if(s.chargers.some(x=>x.status==='using'&&x.ticket===t.id))throw Error('Sudah mengisi.');set(s,t,'CHARGING','Pengisian dimulai',by);c.status='using';c.startedAt=Date.now();t.deadline=null}
function finish(s,t,by){set(s,t,'COMPLETED','Pengisian selesai',by);t.finished=Date.now();release(s,t)}
function skip(s,t,why,by){set(s,t,'SKIPPED',why,by);release(s,t);t.deadline=null}
function cancel(s,t,by){set(s,t,'CANCELLED','Dibatalkan',by);release(s,t);t.deadline=null}
function requeue(s,t,by){set(s,t,'WAITING','Masuk antrean lagi (posisi paling akhir)',by);t.created=Math.max(Date.now(),...s.tickets.map(x=>x.created))+1}
function setFault(s,c,by,st='fault'){c.status=st;const t=s.tickets.find(t=>t.id===c.ticket);if(t&&(t.status==='CALLED'||t.status==='READY')){set(s,t,'WAITING','Charger '+c.name+' gangguan, kembali ke antrean',by);t.created-=1e6;t.deadline=null;t.charger=null}c.ticket=t&&t.status==='CHARGING'?c.ticket:null;s.log.unshift({at:Date.now(),who:by,msg:c.name+(st==='fault'?' gangguan':' offline')+(t&&t.status==='CHARGING'?' (sesi aktif perlu ditangani manual)':'')})}
function tick(s){let ch=false;s.tickets.filter(t=>t.status==='CALLED'&&t.deadline&&t.deadline<Date.now()).forEach(t=>{skip(s,t,'Waktu konfirmasi habis','sistem');ch=true;try{callNext(s,'sistem')}catch(e){}});return ch}
return{ACT,act,norm,maskPlat,maskPhone,create,waiting,position,eta,callNext,recall,ready,start,finish,skip,cancel,requeue,setFault,tick,set}})();
