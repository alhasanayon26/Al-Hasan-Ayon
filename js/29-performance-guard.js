/* performance guard: pauses everything in background tabs, and if the page stays under ~24fps for two 4s windows
   (after the intro), it switches the site's existing lite mode on so weak devices never freeze */
(()=>{const H=document.documentElement;
document.addEventListener('visibilitychange',()=>H.classList.toggle('tab-hidden',document.hidden));
let t0=0,f=0,bad=0,wins=0,stop=false;
const tick=t=>{if(stop)return;
 if(document.hidden||H.classList.contains('is-splash')||H.classList.contains('px-run')||H.classList.contains('dr-run')||H.hasAttribute('data-calm')||H.hasAttribute('data-lite')){t0=0;f=0;bad=0;requestAnimationFrame(tick);return}
 if(!t0){t0=t;f=0}else{f++;if(t-t0>=4000){const fps=f*1000/(t-t0);t0=t;f=0;
  if(fps<24){if(++bad>=2){H.setAttribute('data-lite','');stop=true;return}}else bad=0;
  if(++wins>=20)stop=true}}
 requestAnimationFrame(tick)};
requestAnimationFrame(tick)})();
