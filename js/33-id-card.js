/* ===== Education ID card: verlet rope + rigid card, spring-driven flip ===== */
(()=>{const stage=document.getElementById('idcStage');if(!stage)return;
const H=document.documentElement,card=document.getElementById('idcCard'),flip=document.getElementById('idcFlip'),clip=card.querySelector('.idc-clip'),
 lan=document.getElementById('idcLan'),L0=document.getElementById('idcL0'),L1=document.getElementById('idcL1'),L2=document.getElementById('idcL2'),lt=lan.querySelector('text'),
 bars=document.getElementById('idcBars');
const makeSim=(o)=>{
 const N=o.n, P=[];
 for(let i=0;i<=N+1;i++)P.push({x:0,y:0,px:0,py:0,im:i===0?3:(i<N?3:1)});
 const s={P,N,S:1,ax:0,ay:0,R:0,L:0,r:0,pinned:true,landed:false,drag:null,g:o.g};
 s.layout=(S,ax,ay)=>{s.S=S;s.ax=ax;s.ay=ay;s.R=o.rope*S;s.L=o.stick*S;s.r=s.R/N};
 s.reset=(D,phi)=>{ // D = drop distance above pin, phi = initial tilt (rad)
  const {ax,ay,r,L}=s;
  for(let i=0;i<=N;i++){const p=P[i];p.x=p.px=ax;p.y=p.py=ay-D+i*r}
  const e=P[N],b=P[N+1];
  b.x=b.px=e.x+Math.sin(phi)*L;b.y=b.py=e.y+Math.cos(phi)*L;
  s.pinned=D<=0;s.landed=D<=0;
 };
 const solve=(k)=>{
  for(let i=0;i<N;i++){const a=P[i],b=P[i+1];
   const pa=(i===0&&s.pinned)?0:a.im;
   let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
   if(d>s.r){const w=pa+b.im,f=o.kRope*(d-s.r)/d/w;
    a.x+=dx*f*pa;a.y+=dy*f*pa;b.x-=dx*f*b.im;b.y-=dy*f*b.im}}
  {const a=P[N],b=P[N+1];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1e-6;
   const f=(d-s.L)/d/(a.im+b.im);
   a.x+=dx*f*a.im;a.y+=dy*f*a.im;b.x-=dx*f*b.im;b.y-=dy*f*b.im}
  if(s.pinned){P[0].x=s.ax;P[0].y=s.ay}
 };
 s.step=(h)=>{
  const g=s.g*s.S*h*h, dmp=o.damp;
  for(let i=0;i<=N+1;i++){const p=P[i];
   if(i===0&&s.pinned)continue;
   let vx=(p.x-p.px)*dmp,vy=(p.y-p.py)*dmp;
   const vm=Math.hypot(vx,vy),mx=o.vmax*s.S*h;
   if(vm>mx){vx*=mx/vm;vy*=mx/vm}
   p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy+g;
  }
  if(!s.pinned)P[0].x=s.ax,P[0].px=s.ax;
  const dr=s.drag;
  for(let it=0;it<o.iter;it++){
   if(dr){const e=P[N],b=P[N+1],t=dr.t,cx=e.x+(b.x-e.x)*t,cy=e.y+(b.y-e.y)*t;
    const dx=dr.x-cx,dy=dr.y-cy,den=(1-t)*(1-t)+t*t,k=o.kDrag;
    e.x+=dx*(1-t)/den*k;e.y+=dy*(1-t)/den*k;b.x+=dx*t/den*k;b.y+=dy*t/den*k}
   solve();
  }
  if(!s.pinned&&P[0].y>=s.ay){s.pinned=true;s.landed=true;P[0].x=P[0].px=s.ax;P[0].y=P[0].py=s.ay;s.hit=true;for(const p of P){p.px=p.x-(p.x-p.px)*o.land;p.py=p.y-(p.y-p.py)*o.land}P[0].px=P[0].x;P[0].py=P[0].y}
 };
 s.energy=()=>{let e=0;for(const p of P){const vx=p.x-p.px,vy=p.y-p.py;e+=vx*vx+vy*vy}return e};
 s.freeze=()=>{for(const p of P){p.px=p.x;p.py=p.y}};
 return s;
};
const CFG={n:12,rope:150,stick:492,g:2600,damp:.992,vmax:1900,iter:14,kRope:.6,kDrag:.42,land:.65};
const sim=makeSim(CFG),P=sim.P,N=sim.N,h=1/180,mqStack=matchMedia('(max-width:980px)'),mqRM=matchMedia('(prefers-reduced-motion:reduce)');
const calm=()=>H.hasAttribute('data-calm')||mqRM.matches;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
let S=1,W=400,started=false,vis=false,raf=0,last=0,acc=0,idle=0,rotY=0,wY=0,flipT=null,wasDrag=false,lastTap=0;
const drag={on:false,t:.5,gx:0,x:0,y:0,lx:0,ly:0,lt:0,vx:0,vy:0,sx:0,sy:0,t0:0,moved:0};

/* decorative barcode (seeded, not real data) */
(()=>{let s=26,r=()=>(s=(s*16807)%2147483647)/2147483647,x=0,o='';while(x<148){const w=.8+Math.floor(r()*3)*.7;if(r()>.34)o+='<rect x="'+x.toFixed(1)+'" y="0" width="'+w.toFixed(1)+'" height="22"/>';x+=w+.7+r()*.9}bars.innerHTML=o})();

const layout=()=>{W=stage.clientWidth||400;const stacked=mqStack.matches;
 S=Math.min(1,(W-64)/300,stacked?1:(innerHeight-100)/700);S=clamp(S,.55,1);
 stage.style.setProperty('--idc-h',(700*S).toFixed(1));stage.style.setProperty('--ax',(W/2)+'px');stage.style.setProperty('--ay',(26*S)+'px');
 sim.layout(S,W/2,26*S);
 const lw=24*S;L0.style.strokeWidth=lw;L1.style.strokeWidth=lw*.84;L2.style.strokeWidth=lw*.84;L2.style.strokeDasharray=(1.3*S)+' '+(3.1*S);lt.style.fontSize=(7*S)+'px';
 lan.setAttribute('viewBox','0 0 '+W+' '+(700*S))};
const settle=()=>{sim.reset(0,0);for(let i=0;i<260;i++)sim.step(h);sim.freeze()};

const render=()=>{const E=P[N],B=P[N+1],ang=Math.atan2(-(B.x-E.x),B.y-E.y);
 card.style.transform='translate3d('+(E.x-150).toFixed(2)+'px,'+(E.y-22).toFixed(2)+'px,0) rotate('+ang.toFixed(4)+'rad) scale('+S.toFixed(3)+')';
 const rad=rotY*Math.PI/180;flip.style.transform='perspective(1500px) rotateY('+rotY.toFixed(2)+'deg)';
 flip.style.setProperty('--sx',clamp(50+Math.sin(rad)*42-ang*38,-30,130).toFixed(1));
 clip.style.transform='scaleX('+(.45+.55*Math.abs(Math.cos(rad))).toFixed(3)+')';
 let d='M'+P[0].x.toFixed(1)+','+P[0].y.toFixed(1);
 for(let i=1;i<N;i++){const a=P[i],b=P[i+1];d+='Q'+a.x.toFixed(1)+','+a.y.toFixed(1)+' '+((a.x+b.x)/2).toFixed(1)+','+((a.y+b.y)/2).toFixed(1)}
 d+='L'+E.x.toFixed(1)+','+E.y.toFixed(1);L0.setAttribute('d',d);L1.setAttribute('d',d);L2.setAttribute('d',d)};

const spin=dt=>{let tgt,K,C;
 if(flipT!==null){tgt=flipT;K=170;C=11}
 else{tgt=Math.round(rotY/180)*180;const b=clamp(1-(Math.abs(wY)-220)/380,0,1);K=(drag.on?60:150)*b;C=1.5+b*(drag.on?7:7.5)}
 wY+=((tgt-rotY)*K-wY*C)*dt;rotY+=wY*dt;
 if(flipT!==null&&Math.abs(rotY-flipT)<.4&&Math.abs(wY)<6){rotY=flipT;wY=0;flipT=null}};

const frame=ts=>{raf=0;const dt=Math.max(0,Math.min(.033,(ts-last)/1000||0));last=ts;acc+=dt;let n=0;
 while(acc>=h&&n<7){sim.step(h);acc-=h;n++}if(n===7)acc=0;
 spin(dt);render();
 if(sim.landed&&!drag.on){const f=Math.round(rotY/180)*180;
  if(sim.energy()<.1&&Math.abs(wY)<2&&flipT===null&&Math.abs(rotY-f)<.25)idle++;else idle=0;
  if(idle>40){sim.freeze();rotY=((rotY%360)+360)%360;if(rotY>359.5)rotY=0;wY=0;idle=0;render();return}
  if(!vis)return}
 raf=requestAnimationFrame(frame)};
const wake=()=>{idle=0;if(!raf){last=performance.now();acc=0;raf=requestAnimationFrame(frame)}};

const start=()=>{if(started)return;started=true;layout();
 if(calm()){settle();stage.classList.add('on');render();return}
 const top=stage.getBoundingClientRect().top;
 const D=Math.min(1800,Math.max(sim.ay+sim.R+sim.L+40,top+sim.ay+sim.R+sim.L+40));
 sim.hit=false;sim.reset(D,.12);rotY=0;wY=0;flipT=null;render();stage.classList.add('on');wake()};
const rearm=()=>{if(!started||drag.on)return;started=false;stage.classList.remove('on');cancelAnimationFrame(raf);raf=0};

new IntersectionObserver(es=>{for(const e of es){vis=e.isIntersecting;
 if(e.isIntersecting&&e.intersectionRatio>=.28)start();
 else if(!e.isIntersecting)rearm();
 if(vis&&started&&sim.landed)wake()}},{threshold:[0,.28]}).observe(stage);

let rzT=0;const onResize=()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const was=started&&sim.landed;layout();if(was){settle();render()}},120)};
addEventListener('resize',onResize);if(window.ResizeObserver)new ResizeObserver(onResize).observe(stage);
layout();

/* flip */
const doFlip=()=>{if(!started||!sim.landed)return;flipT=(Math.round(rotY/180)+(wY<-80?-1:1))*180;P[N+1].x+=(Math.random()-.5)*14;wake()};

card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){if(e.target.closest('a'))return;e.preventDefault();doFlip()}});
card.addEventListener('click',e=>{if(wasDrag){e.preventDefault();e.stopPropagation()}},true);

/* pointer drag with real force: the grab point is pulled toward the cursor, rope + gravity do the rest */
const local=e=>{const r=stage.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
card.addEventListener('pointerdown',e=>{if((e.pointerType==='mouse'&&e.button!==0)||!started||!sim.landed)return;
 const isLink=!!e.target.closest('a');if(!isLink)e.preventDefault();try{card.focus({preventScroll:true})}catch(_){}
 const[x,y]=local(e),E=P[N],B=P[N+1],ux=(B.x-E.x)/sim.L,uy=(B.y-E.y)/sim.L,rx=x-E.x,ry=y-E.y;
 drag.t=clamp((rx*ux+ry*uy)/sim.L,0,1);drag.gx=clamp((rx*-uy+ry*ux)/(150*S),-1,1)*-1;
 drag.on=true;drag.x=x;drag.y=y;drag.lx=x;drag.ly=y;drag.lt=performance.now();drag.vx=drag.vy=0;drag.sx=x;drag.sy=y;drag.t0=drag.lt;drag.moved=0;drag.link=isLink;
 flipT=null;sim.drag=drag;stage.classList.add('grab');wake();
 addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)});
const mv=e=>{if(!drag.on)return;const[x,y]=local(e),now=performance.now(),dt=Math.max(1,now-drag.lt)/1000;
 const dx=x-drag.lx;drag.vx+=((dx/dt)-drag.vx)*.4;drag.vy+=(((y-drag.ly)/dt)-drag.vy)*.4;
 rotY+=-dx*drag.gx*.55;           /* pulling a side edge twists the card around its axis */
 drag.x=x;drag.y=y;drag.lx=x;drag.ly=y;drag.lt=now;drag.moved=Math.max(drag.moved,Math.hypot(x-drag.sx,y-drag.sy));wake()};
const up=()=>{if(!drag.on)return;removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);
 drag.on=false;sim.drag=null;stage.classList.remove('grab');
 const now=performance.now(),quiet=now-drag.lt>90,vx=quiet?0:drag.vx,vy=quiet?0:drag.vy;
 wasDrag=drag.moved>6;setTimeout(()=>{wasDrag=false},0);
 if(!wasDrag&&now-drag.t0<450){if(!drag.link)doFlip()}
 else if(Math.abs(vx)>650&&Math.abs(vx)>Math.abs(vy)*.55){wY+=clamp(vx*.34,-1500,1500)}   /* a sideways flick spins it, both faces */
 wake()};
/* a light brush with the cursor nudges it */
stage.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||drag.on||!started||!sim.landed)return;if(!e.target.closest('.idc-card'))return;
 const m=clamp(e.movementX,-16,16);if(Math.abs(m)<2)return;P[N+1].x+=m*.5;P[N].x+=m*.12;wake()});
addEventListener('motionchange',()=>{if(started&&sim.landed&&calm()){settle();render()}});
})();
