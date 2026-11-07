(()=>{const box=document.getElementById('edu');if(!box)return;
const line=box.querySelector('.edu-line'),fill=box.querySelector('.edu-fill'),dot=box.querySelector('.edu-dot'),cards=[...box.querySelectorAll('.ed')],de=document.documentElement;
let t=0,boxY=0,y0=0,y1=1,ys=[],lastP=-1,on=[];
/* all layout reads happen here (resize/load only) - the scroll handler below reads nothing from the DOM */
const measure=()=>{let y=0,el=box;while(el){y+=el.offsetTop;el=el.offsetParent}boxY=y;
 ys=cards.map(c=>c.offsetTop+36);y0=ys[0];y1=ys[ys.length-1];
 line.style.top=y0+'px';line.style.height=(y1-y0)+'px';dot.style.top=y0+'px';lastP=-1;on=[];upd()};
const upd=()=>{t=0;const calm=de.hasAttribute('data-calm'),vh=innerHeight,mark=scrollY+vh*.58-boxY;
 const p=calm?1:Math.max(0,Math.min(1,(mark-y0)/(y1-y0)));
 if(Math.abs(p-lastP)>.0005){lastP=p;fill.style.transform='scaleY('+p.toFixed(4)+')';dot.style.transform='translate3d(0,'+(p*(y1-y0)).toFixed(1)+'px,0)'}
 cards.forEach((c,i)=>{const o=calm||mark>=ys[i];if(o!==on[i]){on[i]=o;c.classList.toggle('act',o)}})};
const req=()=>{if(!t)t=requestAnimationFrame(upd)};
addEventListener('scroll',req,{passive:true});
addEventListener('resize',()=>requestAnimationFrame(measure));addEventListener('load',measure);
if(document.fonts)document.fonts.ready.then(measure);
if(window.ResizeObserver)new ResizeObserver(()=>requestAnimationFrame(measure)).observe(box);
new MutationObserver(req).observe(de,{attributes:true,attributeFilter:['data-calm']});
measure();
})();
