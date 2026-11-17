/* My English Coach – offline support */
const V='mec-20261117142326';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(ca=>ca.put(r,c))}return res};
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.hostname.endsWith('goatcounter.com')||u.hostname==='gc.zgo.at')return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>put('./index.html',res)).catch(()=>caches.match('./index.html')));return}
  if(u.origin===self.location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res))));return}
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(res=>put(r,res)).catch(()=>m);return m||f}));
  }
});
