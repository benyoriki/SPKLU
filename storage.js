const EVS=(()=>{const K='evq2026_v1';let mem=null,ok=true;
const now=Date.now(),m=x=>now-x*60000;
const T=(no,plat,type,model,st,created,extra={})=>({id:'T'+no,no:'A-00'+no,plat,type,model,phone:'0812345678'+no,status:st,created:m(created),history:[{at:m(created),to:'WAITING',why:'Tiket dibuat (data demo)',by:'sistem'}],...extra});
function seed(){return{v:1,seq:8,settings:{name:'SPKLU Senayan',addr:'Jakarta Pusat',callMin:5,minPerCar:12,theme:'dark'},
chargers:[{id:'C1',name:'Charger 1',status:'available',connector:'CCS2',kw:150,ticket:'T4'},{id:'C2',name:'Charger 2',status:'using',connector:'CCS2',kw:150,ticket:'T3',startedAt:m(18)},{id:'C3',name:'Charger 3',status:'available',connector:'Type 2',kw:22,ticket:null},{id:'C4',name:'Charger 4',status:'fault',connector:'CCS2',kw:50,ticket:null},{id:'C5',name:'Charger 5',status:'available',connector:'CCS2',kw:50,ticket:null},{id:'C6',name:'Charger 6',status:'offline',connector:'Type 2',kw:22,ticket:null}],
tickets:[T(1,'B 4455 KLM','car','Hyundai Ioniq 5','COMPLETED',90),T(2,'D 2211 XYZ','car','Wuling Air EV','SKIPPED',70),T(3,'B 5678 DEF','car','Tesla Model 3','CHARGING',40),T(4,'B 1111 AAA','car','Hyundai Ioniq 5','CALLED',25,{deadline:now+298000,charger:'C1'}),T(5,'B 1234 ABC','car','Tesla Model Y','WAITING',20),T(6,'D 9876 XYZ','car','BYD Seal','WAITING',15),T(7,'F 2222 BBB','moto','Alva One','WAITING',10),T(8,'B 3333 CCC','car','Wuling Air EV','WAITING',5)],
profile:null,log:[{at:now,who:'sistem',msg:'Data demo dibuat'}]}}
function load(){if(mem)return mem;try{const r=localStorage.getItem(K);mem=r?JSON.parse(r):seed();if(!mem||!mem.tickets)throw 0}catch(e){mem=seed();try{localStorage.removeItem(K)}catch(_){}}return mem}
function save(s){mem=s;try{localStorage.setItem(K,JSON.stringify(s));ok=true}catch(e){ok=false}return ok}
function reload(){if(!ok&&mem)return mem;mem=null;return load()}
function reset(){mem=seed();try{localStorage.removeItem('evq_my')}catch(e){}save(mem);return mem}
function exportData(){return JSON.stringify(load(),null,1)}
return{load,save,reload,reset,exportData,get ok(){return ok}}})();
