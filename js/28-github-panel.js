/* live GitHub panel: shows cached data instantly, then keeps itself in sync (revalidating requests are free when nothing changed) */
(()=>{const root=document.getElementById('ghx');if(!root)return;
const U=root.dataset.user,H=document.documentElement,calm=()=>H.hasAttribute('data-calm'),$=s=>root.querySelector(s);
const KEY='ghx:v1:'+U,COL=['#7cf2c8','#9db8ff','#ffd479','#ff9fc2','#c7f36b','#aab1bb'],WK=14,BASE=3e5,A='https://api.github.com/users/'+U;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dk=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const ago=t=>{const s=Math.max(0,(Date.now()-new Date(t).getTime())/1000);if(s<90)return 'just now';const m=s/60;if(m<60)return Math.round(m)+'m ago';const h=m/60;if(h<24)return Math.round(h)+'h ago';const d=h/24;if(d<30)return Math.round(d)+'d ago';const mo=d/30;if(mo<12)return Math.round(mo)+'mo ago';return Math.round(d/365)+'y ago'};
const nums=[...root.querySelectorAll('[data-c]')],pill=$('#ghLive');
let rl=false,wait=0,cur=null,syncT=0,live=null,went=false,vis=false,lastSig='',lastIso='',busy=false,fails=0,tm=0;
/* placeholder grid keeps the panel height stable while loading */
$('#ghGrid').innerHTML='<i></i>'.repeat(WK*7);
async function j(u,tries=2){for(let i=0;i<tries;i++){const c=new AbortController(),to=setTimeout(()=>c.abort(),15000);try{const r=await fetch(u,{headers:{Accept:'application/vnd.github+json'},signal:c.signal,cache:'no-cache'});
 if(r.status===403||r.status===429){const rs=+r.headers.get('x-ratelimit-reset')*1000||0;throw Object.assign(new Error('rate'),{rl:true,reset:rs,fatal:true})}
 if(!r.ok){const e=new Error(r.status);e.fatal=r.status<500&&r.status!==408;throw e}
 return await r.json()}catch(e){if(e.fatal||i===tries-1)throw e;await new Promise(f=>setTimeout(f,1500))}finally{clearTimeout(to)}}}
async function fetchAll(){const E=A+'/events/public?per_page=100&page=';
 const[u,r,e1]=await Promise.all([j(A),j(A+'/repos?per_page=100&sort=pushed'),j(E+1,1).catch(()=>null)]);
 let ev=[].concat(e1||[]);if(e1&&e1.length>=100){const e2=await j(E+2,1).catch(()=>[]);ev=ev.concat(e2);if(e2.length>=100)ev=ev.concat(await j(E+3,1).catch(()=>[]))}
 const days=e1?{}:Object.assign({},cur&&cur.days);ev.forEach(e=>{if(!e||!e.created_at)return;const k=dk(new Date(e.created_at)),p=e.payload||{};days[k]=(days[k]||0)+(e.type==='PushEvent'?Math.max(1,p.size||(p.commits&&p.commits.length)||1):1)});
 return{u:{name:u.name||u.login,av:u.avatar_url,followers:u.followers,repos:u.public_repos},repos:r.map(x=>({n:x.name,d:x.description,l:x.language,s:x.stargazers_count,p:x.pushed_at,f:x.fork,h:x.html_url})),days}}
function setPill(){if(!cur){pill.classList.toggle('off',live===false);pill.lastChild.textContent=live===false?(rl?'GitHub busy · retrying':'Offline · retrying'):'Syncing…';return}
 if(live===null){pill.classList.remove('off');pill.lastChild.textContent='Syncing…';return}
 pill.classList.toggle('off',!live);pill.lastChild.textContent=live?'Live · synced '+ago(syncT):(rl?'GitHub busy · cached ':'Offline · cached ')+ago(syncT)}
const setLast=()=>{$('#ghLast').textContent=lastIso?ago(lastIso):'—'};
function setNum(n,to,anim){to=+to||0;n.dataset.t=to;const from=n._v||0;cancelAnimationFrame(n._r);
 if(!anim||calm()||from===to){n._v=to;n.textContent=to;return}
 const t0=performance.now(),dur=Math.min(1300,500+Math.abs(to-from)*40);
 (function f(now){const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);n._v=Math.round(from+(to-from)*e);n.textContent=n._v;if(p<1&&!calm())n._r=requestAnimationFrame(f);else{n._v=to;n.textContent=to}})(t0)}
function build(d,own){
 const today=new Date();today.setHours(0,0,0,0);const st=new Date(today);st.setDate(st.getDate()-(WK-1)*7-today.getDay());
 let html='',tot=0;for(let i=0;i<WK*7;i++){const dt=new Date(st);dt.setDate(st.getDate()+i);if(dt>today){html+='<i class="x" style="--i:'+i+'"></i>';continue}
  const n=d.days[dk(dt)]||0;tot+=n;const l=n?n<2?1:n<4?2:n<8?3:4:0;
  html+='<i class="l'+l+'" style="--i:'+i+'" title="'+n+' contribution'+(n===1?'':'s')+' · '+dt.toDateString()+'"></i>'}
 $('#ghGrid').innerHTML=html;$('#ghTot').textContent=tot+' recent contributions';
 const lc={};own.forEach(x=>{if(x.l)lc[x.l]=(lc[x.l]||0)+1});const ls=Object.entries(lc).sort((a,b)=>b[1]-a[1]).slice(0,5),sum=ls.reduce((a,x)=>a+x[1],0)||1;
 $('#ghBar').innerHTML=ls.map((x,i)=>'<i style="--i:'+i+';flex:'+x[1]+';background:'+COL[i]+'"></i>').join('');
 $('#ghLang').innerHTML=ls.map((x,i)=>'<li><i style="background:'+COL[i]+'"></i>'+esc(x[0])+'<em>'+Math.round(x[1]/sum*100)+'%</em></li>').join('')||'<li style="color:var(--subtle)">No language data yet</li>';
 const li={};ls.forEach((x,i)=>li[x[0]]=COL[i]);
 $('#ghRepos').innerHTML=own.filter(x=>x.n.toLowerCase()!==U.toLowerCase()).slice(0,3).map(x=>'<a href="'+esc(x.h)+'" target="_blank" rel="noopener"><b>'+esc(x.n)+'</b><p>'+esc(x.d||'No description yet.')+'</p><small>'+(x.l?'<span style="margin:0"><i style="background:'+(li[x.l]||'#aab1bb')+'"></i>'+esc(x.l)+'</span>':'')+'<span>★ '+(x.s||0)+' · '+(x.p?ago(x.p):'')+'</span></small></a>').join('')}
function apply(d,t){cur=d;syncT=t;setPill();
 const own=d.repos.filter(x=>!x.f),stars=own.reduce((a,x)=>a+(x.s||0),0),tg={repos:d.u.repos,stars,followers:d.u.followers};
 lastIso=d.repos.reduce((a,x)=>x.p&&(!a||x.p>a)?x.p:a,'');setLast();
 const lr=d.repos.find(x=>x.p===lastIso&&x.h);if(lr)$('#ghLastA').href=lr.h;
 $('#ghName').textContent=d.u.name;const av=$('#ghAv');if(d.u.av&&!av.dataset.s){av.dataset.s=1;av.onerror=()=>{av.style.visibility='hidden'};av.src=d.u.av+(d.u.av.includes('?')?'&':'?')+'s=120'}
 nums.forEach(n=>{if(went)setNum(n,tg[n.dataset.c],true);else{n.dataset.t=tg[n.dataset.c]||0;n._v=calm()?+n.dataset.t:0;n.textContent=n._v}});
 const sig=JSON.stringify([d.u,d.repos.map(x=>[x.n,x.d,x.l,x.s,x.p,x.f]),d.days]);
 if(sig!==lastSig){lastSig=sig;build(d,own)}
 root.classList.add('ready');go()}
function go(){if(went||!vis||!cur)return;went=true;root.classList.add('go');nums.forEach(n=>{n._v=0;setNum(n,n.dataset.t,true)});setTimeout(()=>root.classList.add('settled'),3000)}
function schedule(){clearTimeout(tm);const d=wait||(fails?Math.min(9e5,2e4*Math.pow(3,fails-1)):BASE);wait=0;tm=setTimeout(()=>{document.hidden?schedule():sync()},d)}
async function sync(){if(busy)return;busy=true;
 try{const d=await fetchAll(),t=Date.now();try{localStorage.setItem(KEY,JSON.stringify({t,d}))}catch(e){}fails=0;rl=false;live=true;apply(d,t)}
 catch(e){fails++;live=false;rl=!!e.rl;if(e.rl)wait=Math.min(36e5,Math.max(12e4,(e.reset||0)-Date.now()+5e3));setPill()}
 finally{busy=false;schedule()}}
new IntersectionObserver(es=>{vis=es[0].isIntersecting;root.classList.toggle('off',!vis);go()},{threshold:.15}).observe(root);
let c=null;try{c=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
if(c&&c.d&&c.d.u&&c.d.repos&&c.d.days)apply(c.d,c.t);else setPill();
sync();
setInterval(()=>{if(!document.hidden){setPill();setLast()}},3e4);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-syncT>9e4)sync()});
addEventListener('online',()=>{fails=0;sync()});
})();
