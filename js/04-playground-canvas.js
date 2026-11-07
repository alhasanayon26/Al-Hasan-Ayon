(()=>{const cv=document.getElementById('pgc');if(!cv)return;const x=cv.getContext('2d'),sl=document.getElementById('pgr'),L=document.getElementById('pgLeft'),T=document.getElementById('pgTime'),Wn=document.getElementById('pgWin'),M=document.getElementById('pgMsg'),HD=document.getElementById('pgHead'),st=cv.parentElement;let rounds=0,best=null,lastPick={};
const rows={H:['10001','10001','10001','11111','10001','10001','10001'],E:['11111','10000','10000','11110','10000','10000','11111'],L:['10000','10000','10000','10000','10000','10000','11111'],O:['01110','10001','10001','10001','10001','10001','01110'],W:['10001','10001','10001','10101','10101','11011','10001'],R:['11110','10001','10001','11110','10100','10010','10001'],D:['11110','10001','10001','10001','10001','10001','11110']};
let dots=[],W,H,P,ox,oy,dpr,bx=.5,by=.5,tx=.5,ty=.5,mouse=false,t0=0,t=0,left=0,done=false,vis=false,trail=[];
function build(){dots=[];['HELLO','WORLD'].forEach((w,r)=>{[...w].forEach((c,i)=>{rows[c].forEach((row,gy)=>{[...row].forEach((v,gx)=>{if(v==='1'){dots.push({gx:i*6+gx,gy:r*10+gy,l:0,a:1,d:0});dots.push({gx:i*6+gx,gy:r*10+gy,l:1,a:1,d:0})}})})})});left=dots.length;done=false;t0=0;t=0;Wn.classList.remove('on');trail=[];if(P)layout()}
function size(){dpr=Math.min(2,devicePixelRatio||1);const r=cv.getBoundingClientRect();W=cv.width=Math.round(r.width*dpr);H=cv.height=Math.round(r.height*dpr);P=Math.min(W*.84/29,H*.86/17);ox=(W-(29*P-P))/2;oy=(H-(17*P-P))/2;layout()}
/* dot positions never change between resizes, so compute them once instead of every frame */
function layout(){for(const d of dots){const o=d.l?P*.42:0;d.cx=ox+d.gx*P+o;d.cy=oy+d.gy*P+o}}
const R=()=>P*.38;
let lL=-1,lT='';
function draw(now){if(!vis)return;requestAnimationFrame(draw);if(!t0)t0=now;if(!done)t=(now-t0)/1000;const r=R();
if(mouse){bx+=(tx-bx)*.28;by+=(ty-by)*.28;sl.value=Math.round(bx*1000)}else{bx+=(tx-bx)*.2;const ph=(now/1000*.55)%1;by=1-(r/H)-4*(1-2*r/H)*ph*(1-ph)}
const px=r+bx*(W-2*r),py=mouse?r+by*(H-2*r):by*H;
trail.push([px,py]);if(trail.length>12)trail.shift();
x.clearRect(0,0,W,H);
/* all untouched dots go into 3 paths = 3 fills per frame (was ~300 separate blurred fills) */
const hit=(r+P*.2)**2,rm=P*.15,rl=P*.12,pM=new Path2D(),pG=new Path2D(),pL=new Path2D();
x.fillStyle='#fff';
for(const d of dots){if(d.a<=0)continue;
 if(d.d===0){const dx=d.cx-px,dy=d.cy-py;if(dx*dx+dy*dy<hit){d.d=1;left--}}
 if(d.d===0){if(d.l){pL.moveTo(d.cx+rl,d.cy);pL.arc(d.cx,d.cy,rl,0,6.283)}else{pM.moveTo(d.cx+rm,d.cy);pM.arc(d.cx,d.cy,rm,0,6.283);pG.moveTo(d.cx+rm*2.2,d.cy);pG.arc(d.cx,d.cy,rm*2.2,0,6.283)}}
 else{d.a-=.06;if(d.a<0)d.a=0;if(d.a>0){const k=1+(1-d.a)*1.6;x.globalAlpha=d.a*(d.l?.38:1);x.beginPath();x.arc(d.cx,d.cy,(d.l?rl:rm)*k,0,6.283);x.fill()}}}
x.globalAlpha=.14;x.fill(pG);      /* soft glow, one cheap fill instead of a blur per dot */
x.globalAlpha=1;x.fill(pM);
x.globalAlpha=.38;x.fill(pL);
x.fillStyle='#d6dbe2';
for(let i=0;i<trail.length;i++){const p=trail[i];x.globalAlpha=i/trail.length*.22;x.beginPath();x.arc(p[0],p[1],r*(.4+i/trail.length*.6),0,6.283);x.fill()}
x.fillStyle='#fff';
x.globalAlpha=.1;x.beginPath();x.arc(px,py,r*2.4,0,6.283);x.fill();
x.globalAlpha=.18;x.beginPath();x.arc(px,py,r*1.6,0,6.283);x.fill();
x.globalAlpha=1;x.beginPath();x.arc(px,py,r,0,6.283);x.fill();
x.strokeStyle='#05060a';x.lineWidth=1.5*dpr;x.beginPath();x.arc(px,py,r*.5,0,6.283);x.stroke();
/* only touch the DOM when the text actually changes */
const lv=Math.max(0,left);if(lv!==lL){lL=lv;L.textContent='Dots left: '+lv}
const ts=t.toFixed(1)+'s';if(ts!==lT){lT=ts;T.textContent=ts}
if(!done&&left<=0){done=true;rounds++;const s=t.toFixed(1),pick=a=>{let i;do{i=Math.floor(Math.random()*a.length)}while(a.length>1&&i===lastPick[a[0]]);lastPick[a[0]]=i;return a[i]};
const GOOD=20,OKAY=40; /* seconds: under GOOD = great score, under OKAY = medium, above = slow */
const tier=t<GOOD?0:t<OKAY?1:2;
const H3=[
['Okay, I\'m impressed.','Whoa. Who gave you the cheat code?','Speedrunner detected. 🏃','Those hands are illegal.','Hello, World. Hello, champion. 🏆','Okay, that was actually fast.'],
['Nice. Clean sweep.','Not bad at all. 👏','Smooth moves, my friend.','Solid run. I see you.','Decent! There\'s a faster you in there.','Respectable. Not legendary, but respectable.'],
['That was... a journey. 🐢','Slow and steady wins hearts. 💚','Took your time, and that\'s fine.','Did you stop for tea halfway? ☕','Every dot, one by one. Respect.','Okay, warm-up round complete.']];
const M3=[
['Gone in '+s+'s. Do you want a job here?','Just '+s+'s. I may need to make this harder.','Blink and it was over: '+s+'s. Now hire me?','All dots gone in '+s+'s. Coffee next?'],
['Cleared in '+s+'s. Can you beat it in one more round?','Done in '+s+'s. Try for a faster time?','Hello World, said in '+s+'s. Not bad!','All dots gone in '+s+'s. Coffee next?'],
['It took '+s+'s, but you wiped every single dot.','Finished in '+s+'s. Try again, you will be faster now!','Done in '+s+'s. Good games are worth finishing.','All dots gone in '+s+'s. Round two will go better.']];
const heads=H3[tier],msgs=M3[tier];
let h=pick(heads),m=pick(msgs);
if(best===null||t<best){if(best!==null)m='New best: '+s+'s! Previous was '+best.toFixed(1)+'s.';best=t}
else if(rounds>1)m+=' (Best so far: '+best.toFixed(1)+'s)';
if(rounds===3)h='Round 3? You are officially addicted. 😏';else if(rounds>=5)h='Round '+rounds+'. Okay, now it\'s a lifestyle. 🎮';
HD.textContent=h;M.textContent=m;Wn.classList.add('on')}}
function pm(e){if(e.pointerType==='touch')return;const r=cv.getBoundingClientRect();const inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;mouse=inside;if(inside){tx=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));ty=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));if(!mouse){}}}
/* PC: the ball is steered only by the slider. Hovering the slider row grabs it (no click and hold) and it stays grabbed while the cursor drifts up or down a fair way, so a shaky finger on a touchpad never drops it. */
const ctl=sl.parentElement;let lock=false;
const setLock=v=>{lock=v;ctl.classList.toggle('lock',v)};
function steer(e){const r=sl.getBoundingClientRect(),th=22,f=Math.max(0,Math.min(1,(e.clientX-r.left-th/2)/(r.width-th)));mouse=false;tx=f;sl.value=Math.round(f*1000)}
ctl.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setLock(true)});
addEventListener('pointermove',e=>{if(!lock||e.pointerType!=='mouse')return;
 const r=sl.getBoundingClientRect(),cy=r.top+r.height/2;
 if(Math.abs(e.clientY-cy)>110||e.clientX<r.left-140||e.clientX>r.right+140){setLock(false);return}
 steer(e)},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>setLock(false));
sl.addEventListener('input',()=>{mouse=false;tx=sl.value/1000});
document.getElementById('pgAgain').addEventListener('click',build);
addEventListener('resize',size);size();build();
new IntersectionObserver(e=>{const v=e[0].isIntersecting;if(v&&!vis){vis=true;size();requestAnimationFrame(draw)}else if(!v)vis=false},{threshold:.05}).observe(cv);
window.__pg={dots:()=>left,set:v=>{sl.value=v;mouse=false;tx=v/1000}}})();
