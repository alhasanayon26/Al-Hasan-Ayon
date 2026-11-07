(()=>{const H=document.documentElement,btn=document.getElementById('clb'),pt=document.querySelector('.portrait'),clr=pt&&pt.querySelector('img.clr');if(!btn||!clr)return;
const sk=pt.querySelector('img:not(.spx):not(.clr)');const cv=document.createElement('canvas');cv.className='dots';pt.appendChild(cv);const cx=cv.getContext('2d');
const calm=()=>H.hasAttribute('data-calm'),sm=x=>x*x*(3-2*x),cl=x=>x<0?0:x>1?1:x,eio=x=>x<.5?16*x*x*x*x*x:1-Math.pow(-2*x+2,5)/2;
let on=false,t=0,dir=0,last=0,raf=0,N=0,tx,ty,sx,sy,dl,ph,wb,cs,g,W,Hh,dpr,ready=false;const T=2;let bp=null;
// keep colour photo + dots moving with the same parallax as the sketch photo
const sync=()=>{const tr=document.querySelector('.portrait img:not(.spx):not(.clr)').style.translate;clr.style.translate=tr;cv.style.translate=tr};
new MutationObserver(sync).observe(document.querySelector('.portrait img:not(.spx):not(.clr)'),{attributes:true,attributeFilter:['style']});sync();
const build=async()=>{try{await clr.decode()}catch(e){}
 W=pt.offsetWidth;Hh=pt.offsetHeight;dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=Hh*dpr;
 const o=document.createElement('canvas');o.width=W;o.height=Hh;const oc=o.getContext('2d',{willReadFrequently:true});oc.drawImage(clr,0,0,W,Hh);const d=oc.getImageData(0,0,W,Hh).data;
 g=Math.max(5,Math.round(Math.sqrt(W*Hh*.5/2600)));const cols=Math.ceil(W/g),rows=Math.ceil(Hh/g),M=cols*rows;
 tx=new Float32Array(M);ty=new Float32Array(M);sx=new Float32Array(M);sy=new Float32Array(M);dl=new Float32Array(M);ph=new Float32Array(M);wb=new Float32Array(M);cs=new Array(M);N=0;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=Math.min(W-1,Math.floor(c*g+g/2)),y=Math.min(Hh-1,Math.floor(r*g+g/2)),i=(y*W+x)*4;if(d[i+3]<140)continue;
  tx[N]=c*g+g/2;ty[N]=r*g+g/2;sx[N]=tx[N]+(Math.random()-.5)*W*.9;sy[N]=Hh+20+Math.random()*Hh*.9;
  dl[N]=(1-ty[N]/Hh)*.36+Math.random()*.2;ph[N]=Math.random()*6.283;wb[N]=3+Math.random()*7;cs[N]='rgb('+d[i]+','+d[i+1]+','+d[i+2]+')';N++}
 ready=true};
const draw=()=>{cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,Hh);
 const fadeOut=1-sm(cl((t-.86)/.14));if(t>0&&t<1||(t>=1&&fadeOut>0)){cx.globalAlpha=1;
  for(let i=0;i<N;i++){const p=cl((t-dl[i])/.44),e=eio(p);if(p<=0)continue;const k=1-e,x=tx[i]+(sx[i]-tx[i])*k+Math.sin(e*6.283+ph[i])*wb[i]*k,y=ty[i]+(sy[i]-ty[i])*k,s=g*(.26+.14*e);
   cx.globalAlpha=Math.min(1,p*4)*fadeOut;cx.fillStyle=cs[i];cx.fillRect(x-s/2,y-s/2,s,s)}}
 const co=sm(cl((t-.68)/.3));clr.style.opacity=co.toFixed(3);sk.style.opacity=(1-co).toFixed(3)};
const tick=n=>{raf=0;const dt=Math.min(.05,(n-last)/1000||0);last=n;t=cl(t+dir*dt/(dir>0?T:T*.55));draw();if((dir>0&&t<1)||(dir<0&&t>0))raf=requestAnimationFrame(tick);else{dir=0;if(t<=0)cx.clearRect(0,0,W,Hh)}};
const set=async v=>{on=v;btn.classList.toggle('on',on);btn.setAttribute('aria-pressed',on);btn.lastChild.textContent='Colors: '+(on?'On':'Off');
 if(on&&!ready)await(bp||(bp=build()));
 if(calm()){t=on?1:0;dir=0;cx.clearRect(0,0,W||1,Hh||1);clr.style.opacity=t;sk.style.opacity=1-t;return}
 dir=on?1:-1;last=performance.now();raf||(raf=requestAnimationFrame(tick))};
btn.onclick=()=>set(!on);addEventListener('load',()=>{const run=()=>{ready||bp||(bp=build())};'requestIdleCallback' in window?requestIdleCallback(run,{timeout:7000}):setTimeout(run,3500)});
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(async()=>{if(!ready)return;ready=false;bp=null;await(bp=build());if(t>=1){t=1;draw()}},250)});
})();
