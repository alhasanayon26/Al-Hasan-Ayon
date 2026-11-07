(()=>{const box=document.getElementById('beyondStack');if(!box)return;
box.querySelectorAll('.bs-card').forEach((c,i)=>c.dataset.n='0'+(i+1));const stage=box.querySelector('.bs-stage'),cards=[...box.querySelectorAll('.bs-card')],shs=cards.map(c=>c.querySelector('.bs-sh')),N=cards.length,de=document.documentElement;
cards.forEach(c=>c.classList.remove('tilt'));let bh=0,W=0,PEEK=84,CW=0,CH=250,boxY=0,stickTop=0,total=1,target=0,cur=0,raf=0,lastDraw=-1;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>1-Math.pow(1-t,2.2);
/* layout reads only here (load/resize); scrolling never touches layout */
function measure(){W=stage.clientWidth;const m=innerWidth<=560;PEEK=m?30:150;CH=m?380:420;CW=Math.min(m?W-(N-1)*PEEK:400,W-(N-1)*PEEK);
 box.style.setProperty('--n',N);box.style.setProperty('--ch',CH+'px');
 cards.forEach(c=>{c.style.width=CW+'px'});
 let y=0,el=box;while(el){y+=el.offsetTop;el=el.offsetParent}boxY=y;bh=box.offsetHeight;
 stickTop=parseFloat(getComputedStyle(stage).top)||0;total=Math.max(1,box.offsetHeight-stage.offsetHeight);
 readTarget();cur=target;lastDraw=-1;render()}
function readTarget(){const hold=innerHeight*.15,span=Math.max(1,total-hold-innerHeight*.1);target=clamp((scrollY+stickTop-boxY-hold)/span,0,1)*(N-1)}
function render(){if(de.hasAttribute('data-calm'))return;
 if(Math.abs(cur-lastDraw)<1e-4)return;lastDraw=cur;
 const e=cards.map((_,i)=>i===0?1:ease(clamp(cur-(i-1),0,1)));
 let k=0;for(let i=1;i<N;i++)k+=e[i];
 const off=(W-(CW+k*PEEK))/2;let acc=0;
 for(let i=0;i<N;i++){if(i>0)acc+=e[i];
  let d=0;for(let j=i+1;j<N;j++)d+=e[j];
  const x=off+acc*PEEK+(1-e[i])*(W*.9),sc=1-d*.05,y=-d*10,rot=-d*1.2;
  const c=cards[i];c.style.zIndex=i+1;
  c.style.transform='translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) rotate('+rot.toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
  c.style.opacity=i===0?1:Math.min(1,e[i]*4).toFixed(3);
  shs[i].style.opacity=(Math.min(d,3)*.08).toFixed(3)}}
/* inertia: the stack eases toward the scroll position, so it glides instead of stepping */
const com=document.getElementById('community');let act=false;
function tick(){raf=0;const y=scrollY,inr=y>=boxY-innerHeight*1.2&&y<=boxY+bh+innerHeight*.2;if(inr!==act){act=inr;com&&com.classList.toggle('bsa',inr)}if(!inr)return;readTarget();cur=target;render()}
function onScroll(){raf||(raf=requestAnimationFrame(tick))}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',()=>requestAnimationFrame(measure));addEventListener('load',measure);
if(document.fonts)document.fonts.ready.then(measure);
if(window.ResizeObserver)new ResizeObserver(()=>requestAnimationFrame(measure)).observe(stage);
new MutationObserver(()=>{lastDraw=-1;requestAnimationFrame(()=>{if(de.hasAttribute('data-calm')){cards.forEach(c=>{c.style.transform='';c.style.opacity=''})}else measure()})}).observe(de,{attributes:true,attributeFilter:['data-calm']});
measure();
})();
