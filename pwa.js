const SWP=document.currentScript?.dataset.sw||'sw.js';
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register(SWP).catch(()=>{}));
