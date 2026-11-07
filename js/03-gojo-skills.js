(()=>{const g=document.querySelector('.gojo'),sec=document.getElementById('skills');if(!g||!sec)return;const $=i=>g.querySelector(i),H=$('#gjHead'),R=$('#gjHair'),B=$('#gjBody'),I=$('.ir');
const W=294,Ht=300;const MOB=matchMedia('(hover:none),(pointer:coarse)').matches;
/* The character is glued to the top edge of the "Spoken Languages" box: every frame it is aligned to the box's REAL on-screen rectangle
   (including its slide-in/scroll movement), so it moves exactly with the box and never jumps when chips are tapped. */
let cb=null,rq=0;
function place(){rq=0;
 if(innerWidth<=1100)return; /* small screens: the separate fit() script positions him */
 if(!cb||!cb.isConnected)cb=[...sec.querySelectorAll('.glass')].find(e=>/spoken/i.test(e.textContent.slice(0,40)));
 if(!cb)return;
 /* offsetTop/offsetLeft ignore transforms (slide-in, hover), so he never moves while scrolling */
 let t=0,l=0,el=cb;while(el&&el!==sec){t+=el.offsetTop;l+=el.offsetLeft;el=el.offsetParent}
 const st=g.style;st.width=W+'px';st.height=Ht+'px';st.right='auto';st.bottom='auto';
 const L=Math.round(l+cb.offsetWidth-28-W),T=Math.round(t-Ht),v='translate3d('+L+'px,'+T+'px,0)';st.left='0px';st.top='0px';if(st.transform!==v)st.transform=v}
const again=()=>{if(!rq)rq=requestAnimationFrame(place)};
place();if(window.ResizeObserver){const ro2=new ResizeObserver(again);ro2.observe(document.body);const bx=[...sec.querySelectorAll('.glass')].find(e=>/spoken/i.test(e.textContent.slice(0,40)));bx&&ro2.observe(bx)}addEventListener('scroll',again,{passive:true});[200,700,1500,3000].forEach(t=>setTimeout(again,t));addEventListener('load',again);addEventListener('resize',again);if(document.fonts)document.fonts.ready.then(again);
if(window.ResizeObserver){const ro=new ResizeObserver(again);ro.observe(sec)}
let tx=0,ty=0,x=0,y=0;
const track=e=>{if(document.documentElement.hasAttribute('data-calm'))return;const r=H.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height*.55;
tx=Math.max(-1,Math.min(1,(e.clientX-cx)/(innerWidth*.35)));ty=Math.max(-1,Math.min(1,(e.clientY-cy)/(innerHeight*.35)))};
/* taps/hovers on buttons, chips, links and the nav must NOT move the character: only free movement over empty space does */
const UI='.tags span,.chip,.btn,.nav-cta,.mt,.links a,button,a,input,select,textarea,label,[role=button],nav,header';
const onUI=e=>{const t=e&&e.target;return !!(t&&t.closest&&t.closest(UI))};
const ptr=e=>{if(!MOB&&!onUI(e))track(e)};
addEventListener('pointermove',ptr,{passive:true});addEventListener('pointerdown',ptr,{passive:true});
/* touch screens: follow the finger, even while scrolling (but not when it is pressing a control) */
let tch=false;
const tt=e=>{if(MOB)return;const t=e.touches&&e.touches[0];if(t&&!onUI(t)){tch=true;track(t)}};
addEventListener('touchstart',tt,{passive:true});addEventListener('touchmove',tt,{passive:true});
let rt=0;addEventListener('touchend',()=>{if(!tch)return;tch=false;clearTimeout(rt);rt=setTimeout(()=>{tx=0;ty=0},1800)},{passive:true});
let gv=true,run=0;function f(){run=0;if(document.documentElement.hasAttribute('data-calm')){tx=ty=x=y=0}x+=(tx-x)*.12;y+=(ty-y)*.12;
H&&H.setAttribute('transform',`translate(${x*26} ${y*14}) rotate(${x*11} 272 400)`);
R&&R.setAttribute('transform',`translate(${x*12} ${y*8})`);
I&&I.setAttribute('transform',`translate(${x*9} ${y*5})`);
if(gv&&(Math.abs(tx-x)>.002||Math.abs(ty-y)>.002))run=requestAnimationFrame(f)}
const wake=()=>{if(gv&&!run)run=requestAnimationFrame(f)};
addEventListener('pointermove',wake,{passive:true});addEventListener('touchmove',wake,{passive:true});addEventListener('touchstart',wake,{passive:true});addEventListener('pointerdown',wake,{passive:true});addEventListener('touchend',()=>setTimeout(wake,1900),{passive:true});
new IntersectionObserver(es=>{gv=es[0].isIntersecting;wake()},{rootMargin:'120px'}).observe(sec);addEventListener('motionchange',()=>{if(!run)run=requestAnimationFrame(f)});wake()})();
