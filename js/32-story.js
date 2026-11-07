/* My Story: highlights the chapter in the middle of the screen, fills the timeline line and swaps the big year.
   Cheap by design: runs only while the section is near the screen, and only touches transform/opacity/classes. */
(()=>{
const box=document.getElementById('storyBox');if(!box)return;
const chs=[...box.querySelectorAll('.st-ch')],N=chs.length;
const yr=document.getElementById('stN'),lab=document.getElementById('stT'),idx=document.getElementById('stI');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let act=-1,tk=0;const fs=new Array(N).fill(-1);
function swap(el,txt){el.textContent=txt;el.classList.remove('sw');void el.offsetWidth;el.classList.add('sw')}
function setSide(i){
 if(!yr)return;const c=chs[i];
 swap(yr,c.dataset.year);yr.classList.toggle('w',c.dataset.year.length>5);
 swap(lab,c.dataset.label);
 if(idx)idx.textContent=String(i+1).padStart(2,'0');
}
function update(){
 tk=0;
 const r=box.getBoundingClientRect(),vh=innerHeight;
 if(r.bottom<-300||r.top>vh+300)return;
 const mid=vh*.5,tops=chs.map(c=>c.getBoundingClientRect().top);
 /* active chapter = the last one whose card has reached the middle of the screen (first one before that) */
 let a=0;for(let i=0;i<N;i++){if(tops[i]<=mid+40)a=i}
 if(a!==act){chs.forEach((c,i)=>{c.classList.toggle('on',i===a);c.classList.toggle('past',i<a)});act=a;setSide(a)}
 /* timeline line: each segment runs from one node to the next */
 for(let i=0;i<N-1;i++){
  const y0=tops[i]+38,y1=tops[i+1]+38,f=clamp((mid-y0)/(y1-y0),0,1);
  if(Math.abs(f-fs[i])>.002){fs[i]=f;chs[i].style.setProperty('--f',f.toFixed(3))}
 }
 box.style.setProperty('--p',((act+1)/N).toFixed(3));
}
const req=()=>{tk||(tk=requestAnimationFrame(update))};
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);addEventListener('load',req);
chs[0].classList.add('on');if(yr)yr.classList.add('sw');if(lab)lab.classList.add('sw');
req();
})();
