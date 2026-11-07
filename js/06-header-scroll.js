(()=>{const h=document.querySelector('header');if(!h)return;let ly=scrollY,tk=0;
const f=()=>{tk=0;const y=scrollY,d=y-ly;const open=document.querySelector('.links.open');
if(y<120||open||(h.matches(':focus-within')&&!matchMedia('(hover:none),(pointer:coarse)').matches))h.classList.remove('hide');else if(d>6){h.classList.add('hide');if(h.contains(document.activeElement)&&document.activeElement.blur)document.activeElement.blur()}else if(d<-6)h.classList.remove('hide');
if(Math.abs(d)>6)ly=y};
addEventListener('scroll',()=>{tk||(tk=requestAnimationFrame(f))},{passive:true});
document.addEventListener('mousemove',e=>{if(e.clientY<24)h.classList.remove('hide')},{passive:true})})();

/* education slider */
(()=>{const tl=document.getElementById('tl'),th=document.getElementById('tlThumb');if(!tl||!th)return;
const cs=[...tl.querySelectorAll('.glass')];let cur=0,drag=false,raf=0,tm;
const dotY=i=>cs[i].getBoundingClientRect().top-tl.getBoundingClientRect().top+36;
const place=y=>{th.style.transform='translate3d(0,'+(y-13).toFixed(1)+'px,0)'};
const loop=()=>{if(!drag)place(dotY(cur));raf=requestAnimationFrame(loop)};
const burst=()=>{cancelAnimationFrame(raf);clearTimeout(tm);loop();tm=setTimeout(()=>{cancelAnimationFrame(raf);if(!drag)place(dotY(cur))},800)};
const set=i=>{i=Math.max(0,Math.min(cs.length-1,i));if(i===cur)return;cur=i;cs.forEach((c,k)=>c.classList.toggle('on',k===i));th.setAttribute('aria-valuenow',i);burst()};
const fromY=cy=>{const r=tl.getBoundingClientRect(),a=dotY(0),b=dotY(cs.length-1),y=Math.max(a,Math.min(b,cy-r.top));place(y);set(Math.round((y-a)/(b-a)*(cs.length-1)))};
const down=e=>{drag=true;th.classList.add('drag');try{e.currentTarget.setPointerCapture(e.pointerId)}catch(_){}fromY(e.clientY);e.preventDefault()};
const move=e=>{if(drag)fromY(e.clientY)};
const up=()=>{if(!drag)return;drag=false;th.classList.remove('drag');burst()};
th.addEventListener('pointerdown',down);tl.addEventListener('pointerdown',e=>{if(e.target===tl&&e.offsetX<30)down(e)});
[th,tl].forEach(el=>{el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)});
cs.forEach((c,i)=>c.addEventListener('click',e=>{if(!e.target.closest('a'))set(i)}));
th.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'){set(cur+1);e.preventDefault()}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){set(cur-1);e.preventDefault()}});
addEventListener('resize',()=>place(dotY(cur)));addEventListener('load',()=>place(dotY(cur)));
place(dotY(cur));setTimeout(()=>place(dotY(cur)),700);
})();

/* education rain: canvas, batched strokes (4 draw calls/frame) */
(()=>{const host=document.querySelector('#journey .ani.rain');if(!host)return;
const cv=document.createElement('canvas');host.insertBefore(cv,host.firstChild);const x=cv.getContext('2d');
let W=0,H=0,drops=[],vis=false,last=0,raf=0;
const BK=[.14,.24,.36,.5],k=Math.tan(14*Math.PI/180),coarse=matchMedia('(hover:none),(pointer:coarse)').matches;
const mk=init=>({x:Math.random()*(W+200),y:init?Math.random()*H:-100-Math.random()*200,l:28+Math.random()*70,v:520+Math.random()*620,b:(Math.random()*4)|0});
const size=()=>{W=host.clientWidth;H=host.clientHeight;if(!W||!H)return;cv.width=W;cv.height=H;x.lineWidth=1;x.lineCap='round';const n=Math.round(Math.max(30,Math.min(80,W*H/22000)));drops=Array.from({length:n},()=>mk(true));draw()};
const draw=()=>{x.clearRect(0,0,W,H);for(let b=0;b<4;b++){x.strokeStyle='rgba(214,219,226,'+BK[b]+')';x.beginPath();for(const d of drops){if(d.b!==b)continue;x.moveTo(d.x,d.y);x.lineTo(d.x+d.l*k,d.y-d.l)}x.stroke()}};
const frame=t=>{raf=0;if(!vis||document.hidden)return;raf=requestAnimationFrame(frame);if(last&&t-last<30)return;const dt=Math.min(.05,(t-(last||t))/1000);last=t;
 if(!document.documentElement.hasAttribute('data-calm'))for(const d of drops){d.y+=d.v*dt;d.x-=d.v*dt*k;if(d.y-d.l>H||d.x<-60){Object.assign(d,mk(false));d.x=Math.random()*(W+200)}}
 draw()};
const start=()=>{if(!raf){last=0;raf=requestAnimationFrame(frame)}};
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)start()},{rootMargin:'50px'}).observe(host);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&vis)start()});
new ResizeObserver(size).observe(host);size();
})();

/* V8 drift sound: one continuous engine + tyre-squeal loop (no pops, no gaps).
   Throttle and squeal rise/fall with the car's slide, locked to the CSS animation, and fade with scroll position. */
(()=>{const anchor=document.querySelector('.drift-anchor'),AC=window.AudioContext||window.webkitAudioContext;if(!anchor||!AC)return;
let ctx,master,spool,active=false,started=false;
const MAXV=.03,      /* overall volume */
      PERIOD=4.6,    /* must match the dslide/dtilt animation length (s) */
      ENGINE=.8,     /* engine level */
      SQUEAL=.5;     /* tyre-squeal level */
const build=()=>{ctx=new AC();
 master=ctx.createGain();master.gain.value=0;
 const lim=ctx.createDynamicsCompressor();lim.threshold.value=-14;lim.knee.value=12;lim.ratio.value=6;lim.attack.value=.004;lim.release.value=.2;
 master.connect(lim);lim.connect(ctx.destination);

 /* line the loops up with the car: start the LFOs on the next animation cycle */
 let delay=0;try{const a=anchor.querySelector('.drift-car').getAnimations()[0];if(a&&a.currentTime!=null){delay=(PERIOD-((Number(a.currentTime)/1000)%PERIOD))%PERIOD}}catch(e){}
 const t0=ctx.currentTime+delay+.05,at=f=>t0+f*PERIOD;

 /* "throttle" LFO: two surges per slide (one per pass), peaking when the car is fastest, never dropping to silence */
 spool=ctx.createConstantSource();spool.offset.value=0;spool.start();   /* 0 = engine off/idle, 1 = full throttle */
 const rev=ctx.createOscillator();rev.frequency.value=2/PERIOD;rev.start(at(.125));
 const wob=ctx.createOscillator();wob.frequency.value=.55;wob.start();      /* slow tyre-pitch wobble */
 const slip=ctx.createOscillator();slip.frequency.value=7.3;slip.start();   /* fast stick-slip shimmer */
 const mod=(src,depth,param)=>{const g=ctx.createGain();g.gain.value=depth;src.connect(g);g.connect(param);return g};

 /* shared noise */
 const len=ctx.sampleRate*2,nb=ctx.createBuffer(1,len,ctx.sampleRate),d=nb.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
 const ns=ctx.createBufferSource();ns.buffer=nb;ns.loop=true;ns.start();

 /* ---- ENGINE ---- */
 const eng=ctx.createGain();eng.gain.value=.25;mod(spool,.25,eng.gain);
 mod(rev,.05,eng.gain);                                  /* louder on throttle */
 const am=ctx.createOscillator();am.frequency.value=18;am.start();
 mod(rev,3,am.frequency);mod(am,.1,eng.gain);            /* rumble speeds up with revs, smooth (no chopping) */
 const osc=(type,m,g,det)=>{const o=ctx.createOscillator();o.type=type;o.frequency.value=50*m;mod(spool,70*m,o.frequency);o.detune.value=det;
  const og=ctx.createGain();og.gain.value=g;o.connect(og);og.connect(eng);mod(rev,9*m,o.frequency);o.start()};
 osc('sawtooth',1,.5,0);osc('sawtooth',1,.4,11);osc('square',.5,.35,-6);osc('sawtooth',2,.1,5);osc('triangle',1,.4,0);
 const sh=ctx.createWaveShaper(),cv=new Float32Array(256);for(let i=0;i<256;i++){const x=i/255*2-1;cv[i]=Math.tanh(x*2.4)}sh.curve=cv;
 const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=500;mod(spool,800,lp.frequency);lp.Q.value=1.1;mod(rev,150,lp.frequency);   /* brighter as revs climb */
 const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=260;bp.Q.value=.8;
 const bg=ctx.createGain();bg.gain.value=.05;ns.connect(bp);bp.connect(bg);bg.connect(lp);                                /* exhaust burble bed */
 const eo=ctx.createGain();eo.gain.value=ENGINE;
 eng.connect(sh);sh.connect(lp);lp.connect(eo);eo.connect(master);

 /* ---- DRIFT ROAR (continuous) ---- */
 const sq=ctx.createGain();sq.gain.value=.3;mod(spool,.55,sq.gain);mod(rev,.1,sq.gain);        /* .3 – 1.0, never silent */
 const band=(f,q,g,k)=>{const b=ctx.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=q;
  mod(rev,160*k,b.frequency);mod(wob,110*k,b.frequency);mod(slip,35*k,b.frequency);
  const o=ctx.createGain();o.gain.value=g;ns.connect(b);b.connect(o);o.connect(sq)};
 /* soft low tyre-roar only (no high squeal, so nothing sounds like braking) */
 const tl=ctx.createBiquadFilter();tl.type='lowpass';tl.frequency.value=650;tl.Q.value=.5;mod(rev,40,tl.frequency);
 const tg2=ctx.createGain();tg2.gain.value=.6;ns.connect(tl);tl.connect(tg2);tg2.connect(sq);
 const so=ctx.createGain();so.gain.value=SQUEAL;sq.connect(so);so.connect(master)};
/* engine start: crank, catch, idle, then throttle up to steady revs */
const startUp=()=>{const p=spool.offset,t=ctx.currentTime;p.cancelScheduledValues(t);p.setValueAtTime(0,t);
 p.linearRampToValueAtTime(.06,t+.12);p.linearRampToValueAtTime(.015,t+.28);p.linearRampToValueAtTime(.07,t+.42);p.linearRampToValueAtTime(.02,t+.58);
 p.linearRampToValueAtTime(.16,t+.8);p.setValueAtTime(.16,t+1.2);
 p.linearRampToValueAtTime(.55,t+1.7);p.linearRampToValueAtTime(.4,t+1.95);p.linearRampToValueAtTime(1,t+3)};
let cT=0,cY=0,cOk=false;
const level=(fresh)=>{let top;if(fresh||!cOk){top=anchor.getBoundingClientRect().top;cT=top;cY=scrollY;cOk=true}else top=cT-(scrollY-cY);  /* scroll frames reuse the last measurement: no layout work */
const vh=innerHeight;let t=1-Math.abs(top-vh*.5)/(vh*1.1);t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
const apply=(fromScroll)=>{if(!ctx)return;const calm=document.documentElement.hasAttribute('data-calm');const tg=(calm||document.hidden)?0:level(fromScroll!==true)*MAXV;
 if(tg>.0008&&!active){active=true;startUp()}
 if(tg<.0005&&master.gain.value<.0005){active=false;if(ctx.state==='running')ctx.suspend().catch(function(){})}
 master.gain.setTargetAtTime(tg,ctx.currentTime,tg>master.gain.value?.3:.8);if(tg>.0005&&ctx.state==='suspended')ctx.resume()};
let tk=0;const sched=()=>{tk||(tk=requestAnimationFrame(()=>{tk=0;apply(true)}))};
const init=()=>{if(started)return;started=true;try{build();ctx.resume()}catch(e){}apply()};
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,init,{passive:true}));
addEventListener('scroll',sched,{passive:true});addEventListener('resize',sched);document.addEventListener('visibilitychange',apply);setInterval(apply,500);
})();
