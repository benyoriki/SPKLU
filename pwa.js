if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register(document.currentScript?.dataset.sw||'sw.js').catch(()=>{}));
