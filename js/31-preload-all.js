/* Load everything once, up front, so nothing loads or fades in while you scroll.
   Runs after the page has fully loaded and the intro splash is gone. */
(()=>{
const H=document.documentElement;
function preload(){
  /* 1. decode every image now (no decoding work while scrolling) */
  document.querySelectorAll('img').forEach(i=>{if(i.decode)i.decode().catch(()=>{})});
  /* 2. fetch every font weight now (no late font swap further down the page) */
  if(document.fonts&&document.fonts.load){
    ['300 1em Inter','400 1em Inter','500 1em Inter','600 1em Inter','700 1em Inter','800 1em Inter',
     '500 1em "JetBrains Mono"','600 1em "JetBrains Mono"','700 1em "JetBrains Mono"',
     '500 1em "Reem Kufi"','700 1em "Reem Kufi"',
     '500 1em "Shippori Mincho"','700 1em "Shippori Mincho"','800 1em "Shippori Mincho"'
    ].forEach(f=>document.fonts.load(f).catch(()=>{}));
  }
  /* 3. counters: show final numbers, so they don't count up on scroll */
  document.querySelectorAll('[data-n]').forEach(n=>{if(n.done)return;n.done=1;n.textContent=n.dataset.n+(n.dataset.s||'')});
  /* 4. reveal every section now (same trick the nav links use), without transitions */
  document.querySelectorAll('.rv:not(.in)').forEach(n=>n.classList.add('in'));
  H.classList.add('nav-go');
  setTimeout(()=>H.classList.remove('nav-go'),150);
}
function afterIntro(){
  /* wait for the splash to finish, then give the first screen a moment to animate in */
  const go=()=>setTimeout(preload,1500);
  if(!H.classList.contains('is-splash')){go();return}
  const mo=new MutationObserver(()=>{if(!H.classList.contains('is-splash')){mo.disconnect();go()}});
  mo.observe(H,{attributes:true,attributeFilter:['class']});
}
if(document.readyState==='complete')afterIntro();else addEventListener('load',afterIntro,{once:true});
})();
