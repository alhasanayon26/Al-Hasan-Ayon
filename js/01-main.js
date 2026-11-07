(()=>{'use strict';
const D=document,H=D.documentElement,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>[...r.querySelectorAll(s)],raf=requestAnimationFrame;
const calm=()=>H.hasAttribute('data-calm'),lite=()=>H.hasAttribute('data-lite')||calm();
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const nv=navigator,cn=nv.connection||{};
/* effects stay identical on every device: no automatic low-power mode */

/* motion toggle */
const mt=$('#mt'),lab=()=>{mt.lastChild.textContent='Motion: '+(calm()?'Off':'On')};
/* Motion switch: ON by default. OFF pauses every animation, effect, loop and typing routine on PC and mobile. */
const killIntro=()=>{if(H.classList.contains('px-run')||H.classList.contains('dr-run')){H.classList.remove('px-run','dr-run');H.classList.add('px-done','entered');$$('body>canvas,.hero .portrait canvas').forEach(c=>c.remove())}};
const freezeAll=()=>{killIntro();
 try{D.getAnimations().forEach(a=>{if(!(window.CSSAnimation&&a instanceof CSSAnimation)&&!(window.CSSTransition&&a instanceof CSSTransition))a.cancel()})}catch(e){}
 $$('.tilt.on').forEach(c=>c.classList.remove('on'));
 P.forEach(p=>{p.el.style.translate=''});};
mt.onclick=()=>{if(calm()){H.removeAttribute('data-calm')}else{H.setAttribute('data-calm','');freezeAll()}lab();dispatchEvent(new Event('motionchange'))};lab();

/* pointer parallax: one tiny loop that sleeps when nothing moves */
const P=[];let px=0,py=0,cx=0,cy=0,loop=0;
const step=()=>{cx+=(px-cx)*.09;cy+=(py-cy)*.09;const on=fine&&!calm();
 for(const p of P)p.el.style.translate=on?`${(cx*p.k).toFixed(1)}px ${(cy*p.k*.7).toFixed(1)}px`:'';
 loop=(Math.abs(px-cx)>.001||Math.abs(py-cy)>.001)?raf(step):0};
const spot=$('#spot');let sq=0,sx=0,sy=0;
addEventListener('pointermove',e=>{if(!fine||calm())return;px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;loop||(loop=raf(step));
 if(lite())return;sx=e.clientX;sy=e.clientY;sq||(sq=raf(()=>{sq=0;spot.style.transform=`translate3d(${sx}px,${sy}px,0)`}))},{passive:true});
P.push({el:$('.portrait img'),k:-34},{el:$('#h1'),k:26});

/* spotlight: the Spider-Man photo shows through only around the cursor while it is over the portrait */
(()=>{const spx=$('.portrait img.spx'),pimg=$('.portrait img:not(.spx)');if(!spx||!pimg)return;
 P.push({el:spx,k:-34});
 let tx=0,ty=0,x=0,y=0,r=0,tr=0,lp=0;
 const say=D.createElement('div');say.className='sp-say';say.textContent='Oh, that\u2019s my favorite character \ud83d\udd77\ufe0f';D.body.appendChild(say);
 const R=Math.round(Math.max(110,Math.min(240,innerHeight*.24,innerWidth*.42)));
 const pf=spx.parentNode;
 const tick=()=>{r+=(tr-r)*.2;x+=(tx-x)*.4;y+=(ty-y)*.4;
  pf.style.setProperty('--r',r.toFixed(1)+'px');pf.style.setProperty('--sx',x.toFixed(1)+'px');pf.style.setProperty('--sy',y.toFixed(1)+'px');
  const idle=(r<.5&&!tr);
  spx.style.visibility=idle?'hidden':'visible';pf.classList.toggle('suit',!idle);
  lp=(Math.abs(tr-r)>.3||Math.abs(tx-x)>.3||Math.abs(ty-y)>.3)?raf(tick):0};
 const go=()=>{lp||(lp=raf(tick))};
 /* Spider-Man sting: plays once per hover over the photo, fades in/out, level matched to the BMW sound */
 const SV=.065,FI=.3,FO=.8;let snd=new Audio('assets/audio/sound-1.mp4'),was=false,sr=0,lv=1,tgt=false;snd.preload='auto';
 const sstep=()=>{sr=0;if(snd.paused||snd.ended)return;const d=snd.duration||4.3,p=snd.currentTime;
  lv=tgt?1:Math.max(0,lv-.03);const env=Math.max(0,Math.min(1,p/FI,(d-p)/FO));
  try{snd.volume=Math.min(1,SV*env*lv)}catch(e){}
  if(lv<=0){snd.pause();return}sr=raf(sstep)};
 const hov=v=>{if(v&&!was){was=true;tgt=true;lv=1;try{snd.currentTime=0;snd.volume=0;const pr=snd.play();pr&&pr.catch&&pr.catch(()=>{})}catch(e){}sr||(sr=raf(sstep))}else if(!v&&was){was=false;tgt=false}};
 const mv=e=>{
  if(calm()||H.classList.contains('is-splash')||H.classList.contains('px-run')){tr=0;say.classList.remove('on');hov(false);go();return}
  const b=pimg.getBoundingClientRect(),tg=e.target,onUi=!!(tg&&tg.closest&&tg.closest('#cmdWin,#secP,.sec-panel,#idCard,.btn,a,button')),inside=!onUi&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;
  tx=e.clientX-b.left;ty=e.clientY-b.top;
  if(inside&&r<1){x=tx;y=ty}
  tr=inside?R:0;go();hov(inside);
  say.classList.toggle('on',inside);
  if(inside){const sw=say.offsetWidth||250;say.style.transform=`translate3d(${Math.min(innerWidth-sw-12,Math.max(12,e.clientX+18))}px,${Math.min(innerHeight-56,e.clientY+26)}px,0)`}};
 addEventListener('pointermove',mv,{passive:true});addEventListener('pointerdown',mv,{passive:true});
 /* touch screens: the finger is the spotlight */
 const tm=e=>{const t=e.touches&&e.touches[0];if(t)mv(t)};addEventListener('touchstart',tm,{passive:true});addEventListener('touchmove',tm,{passive:true});
 const tl=()=>{tr=0;say.classList.remove('on');hov(false);go()};addEventListener('touchend',tl,{passive:true});addEventListener('touchcancel',tl,{passive:true});
 H.addEventListener('mouseleave',()=>{tr=0;say.classList.remove('on');hov(false);go()});
})();


/* pixel build: only the glyphs of the hero text are assembled from tiny flying dots. The photo has its own drawing animation (portraitDraw). */
function pixelBuild(){try{return pixelBuild2()}catch(e){H.classList.remove('px-run');H.classList.add('px-done');return Promise.resolve()}}
function pixelBuild2(){
 const w=innerWidth,h=innerHeight,tp=lite()?5:3,tt=lite()?3:2,cols=Math.ceil(w/tp),rows=Math.ceil(h/tp);
 const al=c=>{const m=c.match(/[\d.]+/g);return m&&m.length>3?+m[3]:1};
 const roots=$$('.hero h1,.hero .h-top,.hero .h-bottom,.hero .h-side').filter(e=>e.getClientRects().length);
 const si=D.createElement('canvas');si.width=cols*tp;si.height=rows*tp;const pi=si.getContext('2d');
 const st=D.createElement('canvas');st.width=w;st.height=h;const s=st.getContext('2d',{willReadFrequently:true});
 for(const root of roots){
  for(const el of $$('img:not(.spx)',root)){
   const r=el.getBoundingClientRect();if(r.width<1||!el.complete||!el.naturalWidth)continue;
   const tc=D.createElement('canvas');tc.width=Math.ceil(r.width);tc.height=Math.ceil(r.height);const t=tc.getContext('2d');
   t.filter='brightness(.88)';t.drawImage(el,0,0,tc.width,tc.height);t.filter='none';
   const g=t.createLinearGradient(0,0,0,tc.height);g.addColorStop(0,'#000');g.addColorStop(.6,'#000');g.addColorStop(.99,'rgba(0,0,0,0)');
   t.globalCompositeOperation='destination-in';t.fillStyle=g;t.fillRect(0,0,tc.width,tc.height);
   pi.drawImage(tc,r.left,r.top,r.width,r.height)}
  const tw=D.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while(n=tw.nextNode()){
   const txt=n.nodeValue;if(!txt.trim())continue;const cs=getComputedStyle(n.parentElement);if(cs.visibility==='hidden')continue;
   s.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;s.letterSpacing=cs.letterSpacing==='normal'?'0px':cs.letterSpacing;
   s.fillStyle=al(cs.color)<.05?'#f2f4f1':cs.color;s.textBaseline='alphabetic';
   const re=/\S+/g;let m;
   while(m=re.exec(txt)){const rg=D.createRange();rg.setStart(n,m.index);rg.setEnd(n,m.index+m[0].length);const rr=rg.getClientRects()[0];if(!rr)continue;
    let t=m[0];if(cs.textTransform==='uppercase')t=t.toUpperCase();
    s.fillText(t,rr.left,rr.top+(s.measureText(t).fontBoundingBoxAscent||rr.height*.8))}
  }
 }
 const T=[],R=h,mk=(x,y,col,a,sz)=>T.push({x,y,col,a,z:sz,sx:(Math.random()-.5)*30,sy:R*(.25+Math.random()*.6),t:Math.random()*.3+(1-y/h)*.12});
 /* photo dots: average colour of each small cell */
 const sm=D.createElement('canvas');sm.width=cols;sm.height=rows;const q=sm.getContext('2d',{willReadFrequently:true});q.imageSmoothingQuality='high';
 q.drawImage(si,0,0,cols,rows);const d=q.getImageData(0,0,cols,rows).data;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=(r*cols+c)*4,a=d[i+3];if(a<30)continue;mk(c*tp,r*tp,`rgb(${d[i]},${d[i+1]},${d[i+2]})`,Math.min(1,a/255*1.5),tp*.8)}
 /* text dots: only where a glyph really is (crisp, no halo, no boxes) */
 const td=s.getImageData(0,0,w,h).data;
 for(let y=0;y<h;y+=tt)for(let x=0;x<w;x+=tt){const i=((y+(tt>>1))*w+x+(tt>>1))*4;if(i+3>=td.length)continue;const a=td[i+3];if(a<120)continue;mk(x,y,`rgb(${td[i]},${td[i+1]},${td[i+2]})`,1,tt*.85)}
 const cv=D.createElement('canvas'),g=cv.getContext('2d');cv.width=w;cv.height=h;
 cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:999;pointer-events:none';D.body.appendChild(cv);
 const ease=u=>1-Math.pow(1-u,4),draw=p=>{g.clearRect(0,0,w,h);
  for(const k of T){const u=Math.min(1,Math.max(0,(p-k.t)/.55));if(u<=0)continue;const e=ease(u);
   g.globalAlpha=Math.min(1,u*4)*k.a;g.fillStyle=k.col;g.fillRect(k.x+k.sx*(1-e),k.y+k.sy*(1-e),k.z,k.z)}
  g.globalAlpha=1};
 const done=()=>{H.classList.remove('px-run');H.classList.add('px-done');cv.style.transition='opacity .3s';cv.style.opacity='0';setTimeout(()=>cv.remove(),360)};
 return new Promise(res=>{setTimeout(()=>{const t0=performance.now();
  (function f(n){const p=Math.min(1,(n-t0)/950);draw(p);if(p<1)return raf(f);done();res()})(t0)},450)})}

/* portrait sketch: the supplied photo is drawn like a pencil study (outline, every contour, shading strokes), then brushed in tone by tone until it is exactly the original picture */
const SKD='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';
const LINEIMG='assets/img/image-6.webp';
let skC=null;
function skStrokes(){
 if(skC)return skC;
 return skC=(async()=>{
  if(typeof DecompressionStream==='undefined')return [];
  const b=atob(SKD),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  const buf=await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
  const a=JSON.parse(new TextDecoder().decode(buf)),out=[];
  for(let i=0;i<a.length;){const t=a[i],n=a[i+1],p=new Float32Array(n*2);let x=a[i+2],y=a[i+3];p[0]=x;p[1]=y;i+=4;for(let k=1;k<n;k++){x+=a[i++];y+=a[i++];p[k*2]=x;p[k*2+1]=y}out.push({t,n,p})}
  return out})()}
function portraitDraw(){return portraitDraw2().catch(()=>{H.classList.remove('dr-run')})}
async function portraitDraw2(){
 const box=$('.portrait'),img=box&&$('img:not(.spx)',box),quit=()=>{H.classList.remove('dr-run')};
 if(!img||!img.complete||!img.naturalWidth)return quit();
 const W=box.clientWidth,HH=box.clientHeight;if(W<40||HH<40)return quit();
 const L=lite(),dpr=L?1:Math.min(2,devicePixelRatio||1),cw=Math.round(W*dpr),ch=Math.round(HH*dpr),K=cw/1041,rnd=Math.random,IW=1041,IH=1510;
 let S=[];try{S=await skStrokes()}catch(e){S=[]}
 const mc=(w,h)=>{const c=D.createElement('canvas');c.width=w;c.height=h;return c};
 const li=new Image();li.src=LINEIMG;try{await li.decode()}catch(e){}
 const lci=mc(cw,ch);lci.getContext('2d').drawImage(li,0,0,cw,ch);const tcv=mc(cw,ch),tg=tcv.getContext('2d');
 /* the finished photo exactly as supplied; brush strokes below paint real pixels of it */
 const src=mc(cw,ch);src.getContext('2d').drawImage(img,0,0,cw,ch);
 const cv=mc(cw,ch);cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2';box.appendChild(cv);
 const g=cv.getContext('2d'),lc=mc(cw,ch),lg=lc.getContext('2d');lg.lineCap=lg.lineJoin='round';
 const pat=g.createPattern(src,'no-repeat');
 const PA=[.34,.5,.86],PW=[78,38,16],PS=[46,23,9.5],PT=[[.7,1.9],[1.2,2.5],[1.7,3.0]],pcs=[];
 for(let k=0;k<3;k++){const c=mc(cw,ch),x=c.getContext('2d');x.lineCap=x.lineJoin='round';x.strokeStyle=pat;pcs.push({c,x})}
 const items=[],plen=(p,n)=>{let l=0;for(let k=1;k<n;k++)l+=Math.hypot(p[k*2]-p[k*2-2],p[k*2+1]-p[k*2-1]);return l};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const put=(s,t,du,w,col,echo)=>items.push({p:s.p,n:s.n,t,du,w:w*dpr,col,i:0,lx:s.p[0],ly:s.p[1],ctx:lg,line:1,ex:echo?(rnd()-.5)*2.2*dpr:0,ey:echo?(rnd()-.5)*2.2*dpr:0,echo:!!echo});
 const grp=t=>S.filter(s=>s.t===t),yk=(s,j)=>s.p[1]+rnd()*j;
 /* 1-3. the supplied line drawing is revealed by a pen: each traced stroke of it is run as a soft brush mask, so the picture appears exactly as it was drawn, head first then downwards */
 {const a=S.slice();a.sort((p,q)=>(p.p[1]+p.p[0]*.12)-(q.p[1]+q.p[0]*.12));const N=a.length;a.forEach((s,i)=>{const l=plen(s.p,s.n);put(s,.1+Math.pow(i/N,.92)*1.5,clamp(l/1300,.07,.5),13*K/dpr,'#fff',0)})}
 /* 4. tone: the real photo is brushed in over the lines in three passes, broad to fine, in diagonal back-and-forth strokes */
 const phi=-.42,dx=Math.cos(phi),dy=Math.sin(phi),nx=-dy,ny=dx;
 const cr=[[0,0],[IW,0],[0,IH],[IW,IH]].map(q=>q[0]*nx+q[1]*ny),vmin=Math.min(...cr),vmax=Math.max(...cr);
 for(let k=0;k<3;k++){const w=PW[k],st=PS[k],nb=Math.ceil((vmax-vmin)/st),[t0,t1]=PT[k],M=k===0?14:22;
  for(let b=0;b<=nb;b++){const v=vmin+b*st,cx=nx*v,cy=ny*v;
   let lo=-1e9,hi=1e9;
   if(Math.abs(dx)>1e-6){const a=(-w-cx)/dx,c=(IW+w-cx)/dx;lo=Math.max(lo,Math.min(a,c));hi=Math.min(hi,Math.max(a,c))}
   if(Math.abs(dy)>1e-6){const a=(-w-cy)/dy,c=(IH+w-cy)/dy;lo=Math.max(lo,Math.min(a,c));hi=Math.min(hi,Math.max(a,c))}
   if(hi<=lo)continue;
   const p=new Float32Array(M*2),ph=rnd()*6,dir=b%2?-1:1;
   for(let m=0;m<M;m++){const u=m/(M-1),s=dir>0?lo+(hi-lo)*u:hi-(hi-lo)*u,wb=Math.sin(u*9+ph)*st*.28;p[m*2]=cx+dx*s+nx*wb;p[m*2+1]=cy+dy*s+ny*wb}
   const f=b/Math.max(1,nb),du=(t1-t0)/nb*2.2;
   items.push({p,n:M,t:t0+f*(t1-t0),du,w:w*K,i:0,lx:p[0],ly:p[1],ctx:pcs[k].x,line:0,ex:0,ey:0,echo:false,reveal:1})}}
 items.sort((a,b)=>a.t-b.t);
 const act=[],tips=[];let si=0;
 const adv=el=>{
  while(si<items.length&&items[si].t<=el)act.push(items[si++]);
  tips.length=0;
  for(let j=act.length-1;j>=0;j--){const c=act[j],pr=Math.min(1,(el-c.t)/c.du),f=pr*(c.n-1),id=Math.min(c.n-1,Math.floor(f)),fr=pr>=1?0:f-id,p=c.p;
   let ex=p[id*2],ey=p[id*2+1];if(fr>0&&id<c.n-1){ex+=(p[id*2+2]-ex)*fr;ey+=(p[id*2+3]-ey)*fr}
   if(id>c.i||ex!==c.lx||ey!==c.ly){
    const x=c.ctx;
    const pth=(ox,oy)=>{x.beginPath();x.moveTo(c.lx*K+ox,c.ly*K+oy);for(let k=c.i+1;k<=id;k++)x.lineTo(p[k*2]*K+ox,p[k*2+1]*K+oy);x.lineTo(ex*K+ox,ey*K+oy);x.stroke()};
    x.lineWidth=c.w;
    if(c.echo){x.strokeStyle='#5b627a';x.lineWidth=c.w*.9;pth(c.ex,c.ey);x.lineWidth=c.w}
    if(c.line)x.strokeStyle=c.col;
    pth(0,0);c.i=id;c.lx=ex;c.ly=ey}
   if(pr>=1){act.splice(j,1);continue}
   if(c.line&&tips.length<3)tips.push(c.lx*K,c.ly*K)}};
 const compose=el=>{cv.style.translate=img.style.translate;g.globalCompositeOperation='source-over';g.globalAlpha=1;g.clearRect(0,0,cw,ch);
  for(let k=0;k<3;k++){g.globalAlpha=PA[k];g.drawImage(pcs[k].c,0,0)}
  const la=el<2.2?1:Math.max(0,1-(el-2.2)/.8);
  if(la>0){tg.globalCompositeOperation='source-over';tg.clearRect(0,0,cw,ch);tg.drawImage(lci,0,0);tg.globalCompositeOperation='destination-in';tg.drawImage(lc,0,0);g.globalAlpha=la;g.drawImage(tcv,0,0)}
  g.globalAlpha=1;
  if(el<2.3&&tips.length){g.fillStyle='#fff';g.shadowColor='#9fb4ff';g.shadowBlur=9*dpr;for(let k=0;k<tips.length;k+=2){g.beginPath();g.arc(tips[k],tips[k+1],2.1*dpr,0,7);g.fill()}g.shadowBlur=0}};
 const END=3.1,FADE=.3;
 return new Promise(res=>{setTimeout(()=>{const t0=performance.now();
  (function f(n){const el=Math.min(END,(n-t0)/1000);adv(el);compose(el);
   if(el<END)return raf(f);
   adv(1e9);tips.length=0;compose(END);
   img.style.transition=`opacity ${FADE}s ease`;H.classList.remove('dr-run');setTimeout(()=>{cv.remove();img.style.transition=''},FADE*1000+120);res()})(t0)},300)})}

/* clicking the name (top-left) reloads the page from the top, so the splash and every entrance animation play again */
(()=>{const b=$('header .brand');if(!b)return;b.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;e.preventDefault();
const clean=location.pathname+location.search;
if(e.target.closest('.mark')){ /* logo: reload the page from the very top */
 try{history.scrollRestoration='manual'}catch(_){}
 try{history.replaceState(null,'',clean)}catch(_){}
 scrollTo(0,0);location.reload();
}else{ /* name: smooth scroll back to the first page, no reload */
 try{history.replaceState(null,'',clean)}catch(_){}
 if(typeof navScroll==='function')navScroll(0);else scrollTo({top:0,behavior:'smooth'}); /* same eased scroll as the navbar links */
}})})();

/* project cards: pick each card's sticky offset from its real height, so stacking works on phones and tablets too */
(()=>{const cards=$$('.stack .sc');if(!cards.length)return;const mq=matchMedia('(max-width:920px)');let raf0=0;
 const fit=()=>{raf0=0;const vh=innerHeight,small=mq.matches,base=small?74:92,step=small?10:16;
  cards.forEach((c,i)=>{const t=base+i*step,fitTop=vh-c.offsetHeight-14;c.style.setProperty('--stk',Math.min(t,fitTop).toFixed(1)+'px')})};
 const q=()=>{raf0||(raf0=raf(fit))};fit();addEventListener('resize',q);addEventListener('load',q);addEventListener('orientationchange',q);
 if(window.ResizeObserver){const ro=new ResizeObserver(q);cards.forEach(c=>ro.observe(c))}})();

/* splash */
if(H.classList.contains('is-splash')){
 const sp=$('#splash'),parts=$$('header,main,footer,.mt');let went=0;
 parts.forEach(n=>n.setAttribute('inert',''));
 P.push({el:$('#spFig img'),k:-16},{el:$('#spName'),k:22});
 const go=()=>sp.classList.add('ready');
 Promise.race([Promise.all([D.fonts.load('800 40px Inter'),D.fonts.load('600 12px "JetBrains Mono"')]),new Promise(r=>setTimeout(r,1600))]).catch(()=>{}).then(()=>raf(go));
 /* quick frame-rate probe: if the device struggles, switch to the lite tier automatically */
 
 const fin=()=>{if(fin.d)return;fin.d=1;H.classList.remove('is-splash');parts.forEach(n=>n.removeAttribute('inert'));sp.remove();scrollTo(0,0);$('#main').focus({preventScroll:true});
};
 const enter=()=>{if(went)return;went=1;sp.classList.add('lift');calm()||H.classList.add('px-run');H.classList.remove('pre');calm()?H.classList.add('entered'):(H.classList.add('px-run','dr-run','entered'),pixelBuild().catch(()=>{}),portraitDraw().catch(()=>{}));
  sp.addEventListener('transitionend',e=>{if(e.target===sp&&(e.propertyName==='transform'||e.propertyName==='opacity'))fin()});setTimeout(fin,1700)};
 $('#go').addEventListener('click',enter);
 addEventListener('keydown',e=>{if(!went&&sp.isConnected&&(e.key==='Enter'||e.key===' '||e.key==='ArrowDown')){e.preventDefault();enter()}});
 $('#go').focus({preventScroll:true});
}else{const s=$('#splash');s&&s.remove()}

/* scroll: progress + compact header, one rAF-batched passive listener */
const bar=$('#bar'),hd=$('header');let maxS=1,tk=0;
const meas=()=>{maxS=Math.max(1,H.scrollHeight-innerHeight)};
const onS=()=>{tk=0;const y=scrollY;bar.style.transform=`scaleX(${Math.min(1,y/maxS).toFixed(4)})`;hd.classList.toggle('scrolled',y>40)};
addEventListener('scroll',()=>{tk||(tk=raf(onS))},{passive:true});
addEventListener('resize',meas);addEventListener('load',()=>{meas();onS()});
if(window.ResizeObserver)new ResizeObserver(meas).observe(D.body);meas();onS();

/* reveal on scroll + counters; classes are removed afterwards so nothing keeps animating */
function count(n){if(n.done)return;n.done=1;const t=+n.dataset.n,s=n.dataset.s||'',t0=performance.now();
 (function f(now){const p=calm()?1:Math.min((now-t0)/1300,1);n.textContent=Math.round(t*(1-Math.pow(1-p,3)))+(p===1?s:'');if(p<1)raf(f)})(t0)}
const rio=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;const t=e.target;t.classList.add('in');rio.unobserve(t);
 $$('[data-n]',t).forEach(count);const d=parseFloat(t.style.getPropertyValue('--d'))||0;setTimeout(()=>t.classList.remove('rv','in'),(d+1)*1000+120)}},{threshold:.01,rootMargin:'0px 0px 12% 0px'});
$$('.rv').forEach(n=>rio.observe(n));

/* pause decorative loops that are off screen */
const pio=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('paused',!e.isIntersecting)),{rootMargin:'80px'});
$$('.mq,.vis,.hero').forEach(n=>pio.observe(n));

/* card glow + tilt: delegated, only while a card is hovered */
if(fine){let cur=null,ev=null,q=0,rect=null;
 $$('.exp .glass,.add .glass,.beyond .glass,.cert .glass,.sk .glass,.stat').forEach(c=>c.classList.add('tilt'));
 const draw=()=>{q=0;if(!cur||!ev)return;rect=rect||cur.getBoundingClientRect();const x=(ev.clientX-rect.left)/rect.width,y=(ev.clientY-rect.top)/rect.height;
  cur.style.setProperty('--mx',(x*100).toFixed(1)+'%');cur.style.setProperty('--my',(y*100).toFixed(1)+'%');
  if(cur.classList.contains('tilt')){cur.style.setProperty('--ry',((x-.5)*7).toFixed(2)+'deg');cur.style.setProperty('--rx',((.5-y)*7).toFixed(2)+'deg')}};
 const leave=c=>{if(c&&c.classList.contains('tilt'))c.classList.remove('on')};
 D.addEventListener('pointermove',e=>{if(calm())return;const c=e.target.closest&&e.target.closest('.glass');
  if(c!==cur){leave(cur);cur=c;rect=null;if(cur&&cur.classList.contains('tilt'))cur.classList.add('on')}
  if(!cur)return;ev=e;q||(q=raf(draw))},{passive:true});
 D.addEventListener('pointerleave',()=>{leave(cur);cur=null},true);
 addEventListener('scroll',()=>{rect=null},{passive:true})}


/* magnetic hover: buttons and text drift toward the cursor */
if(fine){const BT='.btn',TX='h2,h3,h4,p,li,.chip,.ico,.quote,.role,.stat b';let mc=null,mk=0;
 const clr=()=>{if(mc){mc.style.translate='';mc=null}};
 D.addEventListener('pointermove',e=>{if(calm()){clr();return}const t=e.target.closest&&e.target.closest(BT+','+TX);
  if(!t||t.classList.contains('rv')||t.closest('#splash')){clr();return}
  if(t!==mc){clr();mc=t;mk=t.matches(BT)?18:8}
  const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  t.style.translate=`${(x*mk).toFixed(1)}px ${(y*mk*.7).toFixed(1)}px`},{passive:true});
 D.addEventListener('pointerleave',clr,true)}

/* nav: custom real-time eased scroll (faster than native smooth) */
let navRaf=0;
const navScroll=to=>{cancelAnimationFrame(navRaf);const from=scrollY,dist=to-from;if(!dist)return;
 if(calm()){scrollTo(0,to);return}  /* only the site's own Motion toggle disables it (the OS reduced-motion flag made it jump instantly) */
 const dur=Math.min(1600,Math.max(750,Math.abs(dist)*.35+450)),t0=performance.now(),de=document.documentElement,prev=de.style.scrollBehavior;
 de.style.scrollBehavior='auto';document.querySelectorAll('.rv:not(.in)').forEach(n=>n.classList.add('in'));de.classList.add('nav-go');
 const ease=p=>p<.5?16*p*p*p*p*p:1-Math.pow(-2*p+2,5)/2;
 const stop=()=>{cancelAnimationFrame(navRaf);de.style.scrollBehavior=prev;setTimeout(()=>de.classList.remove('nav-go'),60);['wheel','touchstart','keydown','mousedown'].forEach(k=>removeEventListener(k,stop))};
 ['wheel','touchstart','keydown','mousedown'].forEach(k=>addEventListener(k,stop,{passive:true,once:true}));
 const step=now=>{const p=Math.min(1,(now-t0)/dur);scrollTo(0,from+dist*ease(p));if(p<1)navRaf=requestAnimationFrame(step);else stop()};
 navRaf=requestAnimationFrame(step)};
/* nav */
const links=$('#links'),burger=$('#bg'),aEls=$$('a',links);
const setMenu=o=>{links.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)};
burger.onclick=e=>{e.stopPropagation();setMenu(!links.classList.contains('open'))};
D.addEventListener('click',e=>{if(!e.target.closest('nav'))setMenu(false)});
D.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
$$('header a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1),t=D.getElementById(id);if(!t)return;e.preventDefault();setMenu(false);
 const y=id==='home'?0:Math.max(0,Math.min(t.getBoundingClientRect().top+scrollY-84,H.scrollHeight-innerHeight));
 navScroll(y);try{if(history.replaceState)history.replaceState(null,'','#'+id)}catch(_){}}));
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)aEls.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>sio.observe(s));

/* typed roles (paused/static when Motion is off) */
(()=>{const roles=['Software Engineering Student','Web App Builder','Game Developer','Learning · Building · Improving'],el=$('#role');let ri=0,ci=0,del=false,tm=0;
 const stat=()=>{clearTimeout(tm);tm=0;el.textContent=roles[0]};
 const tick=()=>{tm=0;if(calm()){stat();return}const w=roles[ri];
  el.textContent=w.slice(0,ci);if(!del&&ci===w.length){del=true;tm=setTimeout(tick,1800);return}
  if(del&&ci===0){del=false;ri=(ri+1)%roles.length}ci+=del?-1:1;tm=setTimeout(tick,del?28:60)};
 addEventListener('motionchange',()=>{if(calm())stat();else{clearTimeout(tm);ri=0;ci=0;del=false;tick()}});tick()})();

/* clock */
(()=>{const el=$('#clock');if(!el)return;
 let tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
 const city=tz?tz.split('/').pop().replace(/_/g,' ').toUpperCase():'LOCAL';
 let f;try{f=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'})}catch(e){}
 const off=()=>{try{const p=new Intl.DateTimeFormat('en-US',{timeZoneName:'shortOffset'}).formatToParts(new Date()).find(x=>x.type==='timeZoneName');if(p)return p.value.replace('GMT','UTC')}catch(e){}
  const m=-new Date().getTimezoneOffset(),a=Math.abs(m),h=Math.floor(a/60),mm=a%60;return 'UTC'+(m<0?'-':'+')+h+(mm?':'+String(mm).padStart(2,'0'):'')};
 const pad=n=>String(n).padStart(2,'0');
 const t=()=>{const d=new Date();el.textContent=city+' · '+(f?f.format(d):pad(d.getHours())+':'+pad(d.getMinutes()))+' · '+off()};
 t();setInterval(t,15000)})();

/* KeySprint demo, paused when off screen */
(()=>{const ty=$('#ty'),kb=$('#kb'),win=$('.win');if(!ty)return;const keys={};
 ['qwertyuiop','asdfghjkl','zxcvbnm'].forEach(r=>{const d=D.createElement('div');[...r].forEach(c=>{const i=D.createElement('i');i.textContent=c;keys[c]=i;d.appendChild(i)});kb.appendChild(d)});
 const txt='Practice daily.\nType faster. Code better.',br=s=>s.replace('\n','<br>');let n=0,hold=0,seen=true;
 new IntersectionObserver(es=>{seen=es[0].isIntersecting}).observe(win);
 (function tick(){if(!seen)return setTimeout(tick,400);
  if(calm()){if(!tick.s){tick.s=1;ty.innerHTML='<b>'+br(txt)+'</b>'}return setTimeout(tick,400)}tick.s=0;
  if(n>txt.length){if(++hold>22){n=0;hold=0}return setTimeout(tick,90)}
  ty.innerHTML='<b>'+br(txt.slice(0,n))+'</b><u></u>'+br(txt.slice(n));
  const c=txt[n-1],k=c&&keys[c.toLowerCase()];if(k){k.classList.add('k');setTimeout(()=>k.classList.remove('k'),120)}
  n++;setTimeout(tick,85+Math.random()*70)})()})();
})();
