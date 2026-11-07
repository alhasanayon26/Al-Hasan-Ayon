(()=>{'use strict';
const D=document,H=D.documentElement,$=(s,r=D)=>r.querySelector(s);
const KEY='ayon-secrets-v1';
const ALL=[
 {id:'konami',t:"The Old Code",h:"Gamers know it by heart: ↑ ↑ ↓ ↓ ← → ← → B A. Type it anywhere on the page. On a phone, swipe that pattern (skip the B A)."},
 {id:'gojo',t:"The Sorcerer",h:"Someone stands guard over the Skills section, and he doesn’t like being poked. Click him 5 times."},
 {id:'spidey',t:"Secret Identity",h:"Hover over my photo in the hero and hold still for a couple of seconds. Spider-sense does the rest. On a phone, press and hold it."},
 {id:'cmd',t:"Command Line",h:"Press the ` key on a PC, or tap my logo 5 times on a phone. Or use the button below. Type cheats for the secret codes."},
 {id:'console',t:"Behind the Curtain",h:"Developers only: open your browser’s developer tools from its menu (⋯ → More tools → Developer tools), pick the Console tab and follow the message waiting there."}
];
/* phones/tablets have no developer console, so they only get the first three secrets */
const noDev=(()=>{try{return matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod|Mobi|Tablet/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}catch(_){return false}})();
const noCmdQ=()=>{try{return matchMedia('(max-width:920px),(hover:none) and (pointer:coarse)').matches}catch(_){return false}};
const S=ALL.filter(x=>!(noDev&&x.id==='console')&&!(noCmdQ()&&x.id==='cmd'));
const got=()=>S.filter(x=>found.includes(x.id)).length;
let found=[],seen=false;
try{const j=JSON.parse(localStorage.getItem(KEY)||'{}');found=Array.isArray(j.f)?j.f:[];seen=!!j.s}catch(_){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({f:found,s:seen}))}catch(_){}};
const calm=()=>H.hasAttribute('data-calm');
const btn=$('#secB'),panel=$('#secP'),list=$('#secList'),cnt=$('#secCnt'),bar=$('#secBar'),neonRow=$('#secNeon'),toastEl=$('#secToast'),links=$('#links'),burger=$('#bg');
if(!btn||!panel)return;
D.body.appendChild(panel);
list.addEventListener('click',e=>{const li=e.target.closest('li.ok');if(li)li.classList.toggle('open')});
const render=()=>{
 list.innerHTML=S.map((s,i)=>{const ok=found.includes(s.id);return '<li class="'+(ok?'ok':'')+'"><span class="n">'+(ok?'✓':'0'+(i+1))+'</span><div><b>'+s.t+'</b><p>'+s.h+'</p></div><em>'+(ok?'Found':'Hidden')+'</em></li>'}).join('');
 const c=got()+' / '+S.length;cnt.textContent=c;btn.querySelector('em').textContent=c;bar.style.width=(got()/S.length*100)+'%';
 btn.classList.toggle('new',!seen);neonRow.hidden=!H.classList.contains('neon')};
let tt;const toast=m=>{toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),3600)};
const mark=(id,extra)=>{if(found.includes(id))return false;found.push(id);save();render();
 const s=S.find(x=>x.id===id);toast('✦ Secret found · '+got()+'/'+S.length+' — '+s.t+(extra?' · '+extra:''));
 if(got()===S.length)setTimeout(()=>toast('✦ You found them all. Respect.'),3800);return true};
const setP=o=>{panel.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);if(o){seen=true;save();render()}};
btn.addEventListener('click',e=>{e.stopPropagation();links.classList.remove('open');burger.setAttribute('aria-expanded',false);setP(!panel.classList.contains('open'))});
burger.addEventListener('click',()=>setP(false));
D.addEventListener('click',e=>{if(!e.target.closest('#secP,#secB'))setP(false)});
D.addEventListener('keydown',e=>{if(e.key==='Escape')setP(false)});
/* 1 · Konami -> Neon mode */
const flash=()=>{if(calm())return;const f=D.createElement('div');f.className='sx-flash';D.body.appendChild(f);setTimeout(()=>f.remove(),900)};
const neon=q=>{const on=!H.classList.contains('neon');H.classList.toggle('neon',on);render();
 if(q){if(on)flash();return}
 if(on){flash();if(!mark('konami','Neon mode on, repeat the code to exit'))toast('Neon mode on · repeat the code to switch it off')}else toast('Neon mode off. Back to normal.')};
$('#neonOff').addEventListener('click',()=>{H.classList.remove('neon');render();toast('Neon mode off. Back to normal.')});
const KC=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let kb=[];
addEventListener('keydown',e=>{const t=e.target;if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
 kb.push(e.key.length===1?e.key.toLowerCase():e.key);if(kb.length>10)kb.shift();
 if(kb.length===10&&kb.every((x,i)=>x===KC[i])){kb=[];neon()}});
const SC=['u','u','d','d','l','r','l','r'];let sw=[],sx=0,sy=0,ls=0;
addEventListener('touchstart',e=>{const t=e.changedTouches[0];sx=t.clientX;sy=t.clientY},{passive:true});
addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<60)return;
 const n=Date.now();if(n-ls>2500)sw=[];ls=n;sw.push(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'));if(sw.length>8)sw.shift();
 if(sw.length===8&&sw.every((x,i)=>x===SC[i])){sw=[];neon()}},{passive:true});
/* 2 · Poke the sorcerer 5x -> Domain Expansion */
const GL=["Hey.","That tickles.","Careful now.","Last warning…"];let gc=0,gt=0,lock=0;
const bubble=(x,y,m)=>{const b=D.createElement('span');b.className='sx-bub';b.textContent=m;b.style.left=x+'px';b.style.top=y+'px';D.body.appendChild(b);setTimeout(()=>b.remove(),1150)};
const domain=q=>{if($('#domain'))return;const d=D.createElement('div');d.id='domain';d.setAttribute('aria-hidden','true');
 d.innerHTML='<i></i><i></i><i></i><b lang="ja">領域展開</b><span>Domain Expansion · Infinite Void</span>';D.body.appendChild(d);
 const kill=()=>{d.classList.add('out');setTimeout(()=>d.remove(),calm()?0:500)};setTimeout(kill,3400); lock=Date.now()+5000;gc=0;
 setTimeout(()=>{if(!q)mark('gojo')},calm()?300:1400)};
const onGojo=e=>{
 if(e.target.closest('a,button,input,textarea,select,label,[role=button],nav,header,#domain,#cmdWin,#secP'))return false;
 const g=$('#skills .ani.gojo');if(!g||getComputedStyle(g).display==='none')return false;
 const ps=['#gjHead','#gjHair','#gjBody'].map(s=>g.querySelector(s)).filter(Boolean);if(!ps.length)return false;
 let l=1e9,t=1e9,r=-1e9,b=-1e9;ps.forEach(p=>{const q=p.getBoundingClientRect();l=Math.min(l,q.left);t=Math.min(t,q.top);r=Math.max(r,q.right);b=Math.max(b,q.bottom)});
 b=Math.min(b,g.getBoundingClientRect().bottom);const x=e.clientX,y=e.clientY;
 return !(x<l-6||x>r+6||y<t-6||y>b+6)};
const noSel=()=>{try{const s=getSelection();if(s&&s.rangeCount)s.removeAllRanges()}catch(_){}};
/* stop rapid pokes from selecting text (and popping the browser's selection menu) */
D.addEventListener('mousedown',e=>{if(e.button===0&&onGojo(e)){e.preventDefault();noSel()}});
D.addEventListener('dblclick',e=>{if(onGojo(e)){e.preventDefault();noSel()}});
D.addEventListener('selectstart',e=>{if(Date.now()-gt<1500)e.preventDefault()});
D.addEventListener('click',e=>{
 if(!onGojo(e))return;noSel();
 if(Date.now()<lock)return; /* clicks are ignored for 5s after Domain Expansion */
 const x=e.clientX,y=e.clientY,n=Date.now();if(n-gt>3000)gc=0;gt=n;gc++;
 if(gc<5){bubble(x,y,GL[gc-1]);return}gc=0;domain()});
/* 4 · Hold the cursor on the portrait -> secret identity */
const card=D.createElement('div');card.id='idCard';card.setAttribute('aria-hidden','true');
card.innerHTML='<div class="k"><span>◉ Classified file</span><span>Declassified</span></div><b>Rifaat Al Hasan Ayon</b><em>Your friendly neighborhood developer</em><dl><dt>Day job</dt><dd>Software Engineering student</dd><dt>Powers</dt><dd>Web apps, games and a little custom firmware</dd><dt>Mission</dt><dd>Learning · Building · Improving</dd><dt>Spider-sense</dt><dd>Tingles whenever a bug is nearby</dd></dl>';
D.body.appendChild(card);
let px=-1,py=-1,hold=0,hide=0,idDone=false; /* in-memory only: shows once per page load */
let uiOver=false;
const inPortrait=()=>{if(uiOver)return null;const p=$('.portrait');if(!p)return null;const r=p.getBoundingClientRect();return(px>=r.left&&px<=r.right&&py>=r.top&&py<=r.bottom)?r:null};
const showId=r=>{idDone=true;const w=Math.min(310,innerWidth-24);card.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';card.style.top=Math.max(80,Math.min(innerHeight-250,r.top+r.height*.5))+'px';card.classList.add('show');mark('spidey');clearTimeout(hide);hide=setTimeout(()=>card.classList.remove('show'),7000)};
addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;uiOver=!!(e.target&&e.target.closest&&e.target.closest('#cmdWin,#secP,.btn,a,button'));const r=inPortrait();
 if(r){if(!hold&&!idDone)hold=setTimeout(()=>{hold=0;const q=inPortrait();if(q)showId(q)},calm()?1500:2500)}
 else{clearTimeout(hold);hold=0;card.classList.remove('show')}},{passive:true});
addEventListener('pointerdown',e=>{px=e.clientX;py=e.clientY;uiOver=!!(e.target&&e.target.closest&&e.target.closest('#cmdWin,#secP,.btn,a,button'))},{passive:true});
['pointercancel','blur'].forEach(k=>addEventListener(k,()=>{clearTimeout(hold);hold=0;card.classList.remove('show')}));
addEventListener('scroll',()=>{if(!inPortrait()){clearTimeout(hold);hold=0;card.classList.remove('show')}},{passive:true});
/* 5 · Command prompt: ` (backtick) on PC, or tap the logo 5 times anywhere */
const $$=(s,r=D)=>[...r.querySelectorAll(s)];
const cw=$('#cmdWin'),co=$('#cmdOut'),ci=$('#cmdIn'),cb=$('#cmdBody'),cbar=$('.cmd-bar',cw),t0=Date.now();
const PROMPT='C:\\Users\\guest>';
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const lk=t=>esc(t).replace(/(https?:\/\/[^\s<]+|\bgithub\.com\/[^\s<]+)/g,u=>'<a href="'+(u.indexOf('http')===0?u:'https://'+u)+'" target="_blank" rel="noopener">'+u+'</a>').replace(/\b([\w.+-]+@[\w-]+\.[\w.]+)\b/g,'<a href="mailto:$1">$1</a>');
const out=(t,c)=>{const d=D.createElement('div');if(c)d.className=c;d.innerHTML=(t===''||t==null)?'&nbsp;':lk(t);co.appendChild(d);cb.scrollTop=cb.scrollHeight;return d};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let tok=0;
const INFO={
 about:["Rifaat Al Hasan Ayon","First-year Software Engineering student at Daffodil International University.","Builder of KeySprint Cafe, Neon City and EchoLink.","Learning · Building · Improving."],
 projects:["KeySprint - Cafe","  Free typing-practice site with a code editor and an AI chat helper.","  github.com/alhasanayon26/KeySprint--Cafe","","Neon City","  Open-world 3D game that runs in your browser.","  github.com/alhasanayon26/Neon-City","","EchoLink","  Turn your phone into a wireless speaker for your PC.","  github.com/alhasanayon26/EchoLink"],
 skills:["Programming  C, C++, HTML","Tools        GitHub, Microsoft Office, Google Workspace","Spoken       Bangla (native), English (fluent), Hindi / Urdu (conversational)","Core         Photography, Videography, Video Editing, Problem Solving,","             Debugging, Technical Documentation"],
 contact:["Email   alhasanayon26@gmail.com","GitHub  github.com/alhasanayon26"]
};
const FILES={'about.txt':'about','projects.txt':'projects','skills.txt':'skills','contact.txt':'contact'};
const HELP=["Available commands:","","  help        show this list","  about       who is behind this website","  whoami      who are you, exactly?","  projects    things I have built","  skills      what I work with","  contact     how to reach me","  dir / ls    look around","  type FILE   read a file, e.g. type about.txt","  neofetch    system info, portfolio edition","  secrets     check your secret progress","  hint        a nudge toward the hidden stuff","  cheats      list the secret cheat codes","  echo TEXT   repeat after me","  date        today's date","  clear       clear the screen","  exit        close this window","","Psst: type \"cheats\" to see the secret codes."];
const HINTS=["Hidden commands exist. Some riddles:","","  1. Green rain falls where reality is only code. Who is waiting for you?","  2. One dangerous word makes everything fall apart. Another puts it back together.","  3. Paint the words: a verb and a color.","  4. Fonts have moods too: comic, serif, mono, cursive, impact.","  5. Pick things up and carry them around. Put them down when you are done.","  6. Turn the whole world upside down.","  7. Everything looks better in pink and cyan.","  8. Someone strong lives in the Skills section. Say his name.","  9. Real hackers ask nicely, with sudo.","10. A friendly neighborhood something has a word for you."];
const CHEATS=["Secret cheat codes:","","  DESTROY","  break        the whole website collapses (also: destroy, crash, ruin)","  explode      everything blows apart","  rm -rf /     the classic","  shake        earthquake for 3 seconds","  fix          rebuild everything and reset all effects (also: reset, undo)","","  STYLE","  color RED    text color: a name, #hex, rainbow or default","  bg COLOR     page background, e.g. bg #001133  (bg default)","  theme NAME   hacker, sunset, ocean, blood, candy, paper, default","  font NAME    comic, serif, mono, cursive, impact, default","  invert       flip all colors (run again to undo)","  gray, sepia  black-and-white / old photo (run again to undo)","  blur N       blur the page, e.g. blur 4  (blur off)","  hue N        rotate every color, 0 to 360","","  FUN","  drag / drop  grab and move anything on the page","  flip         turn the world upside down","  spin         one full rotation","  glitch       corrupted-screen mode  (glitch off)","  matrix       green code rain  (matrix off)","  snow         let it snow  (snow off)","  confetti     party popper","  party        rainbow + confetti  (party off)","  neon         neon mode","  gojo         Domain Expansion","  hire         type: sudo hire me"];
const THEMES={hacker:{fc:'#39ff14',bg:'#000000',ff:'mono'},sunset:{fc:'#ffe3c2',bg:'#3a0f2e'},ocean:{fc:'#d6f6ff',bg:'#031b34'},blood:{fc:'#ff4d4d',bg:'#0a0000'},candy:{fc:'#ff3df2',bg:'#12001a'},paper:{fc:'#222222',bg:'#f4efe4',ff:'serif'}};
const COLORS={red:'#ff4d4d',green:'#39ff14',lime:'#c7f36b',cyan:'#00f0ff',pink:'#ff3df2',purple:'#a78bfa',orange:'#ff9f1c',yellow:'#ffe14d',white:'#ffffff',gold:'#ffd700',blue:'#4da3ff',black:'#000000'};
const FONTS={comic:"'Comic Sans MS','Comic Neue','Chalkboard SE',cursive",serif:"Georgia,'Times New Roman',serif",mono:"'JetBrains Mono',ui-monospace,Consolas,monospace",cursive:"'Brush Script MT','Segoe Script',cursive",impact:"Impact,'Arial Narrow Bold',sans-serif"};
const VIS=['cheats','break','destroy','explode','fix','shake','spin','glitch','invert','gray','sepia','blur','hue','bg','theme','color','font','drag','drop','flip','matrix','snow','confetti','party','neon','gojo','help','about','whoami','projects','skills','contact','dir','ls','type','neofetch','secrets','hint','echo','date','clear','cls','exit','ver'];
/* effects */
const SK='#cmdWin,#cmdWin *,.sec-panel,.sec-panel *,#idCard,.sx-toast,#neonFx,#domain,#domain *,#mtx';
const BX='.glass,.it,.sp,.lang,.proj,.cert,.club,.ct,.pg,.chip,.btn,.sx-stats,.portrait,.ghx,.exp,.tl>*,figure,.tags span,.bs>*,.drift-anchor';
const BT='h1,h2,h3,h4,p,li,img,button,.sh,.vt,.mq';
let broken=false,brokenEls=[],rb=0,mx=null,dragOn=false,dgEl=null,dgs=null,crEl=null;const dragged=new Set();
/* collect every visible piece of the page (cards, headings, text, images) from ALL sections */
const collect=()=>{const out=[];
 const walk=el=>{if(out.length>=520||el.nodeType!==1)return;
  if(el.matches(SK)||el.matches('.ani,script,style,noscript,.sx-flash'))return;
  const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
  if(el.closest('svg')&&el.tagName.toLowerCase()!=='svg')return;
  const big=r.height>260&&el.children.length>1;
  if(el.matches(BX)||el.tagName.toLowerCase()==='svg'||(el.matches(BT)&&!el.querySelector(BX))||(!el.children.length&&el.textContent.trim())){out.push(el);if(!big||el.matches('svg,img,p,li,h1,h2,h3,h4,button'))return}
  for(const k of el.children)walk(k)};
 $$('main > *').forEach(walk);$$('header nav,footer').forEach(el=>{if(!el.matches(SK))out.push(el)});return out};
const doBreak=mode=>{if(broken)return;broken=true;const docH=H.scrollHeight,sy=scrollY,vh=innerHeight,vw=innerWidth,dyOf=new Map(),anc=el=>{let t=0,a=el.parentElement;while(a){if(dyOf.has(a))t+=dyOf.get(a);a=a.parentElement}return t};
 collect().forEach(el=>{const r=el.getBoundingClientRect(),fx=!!el.closest('header'),top=fx?r.top:r.top+sy,bot=fx?r.bottom:r.bottom+sy,lim=fx?vh:docH,maxD=Math.max(0,lim-bot-2-anc(el));
  let dx,dy,rot,dl,bez;
  if(mode==='explode'){const ex=r.left+r.width/2-vw/2,ey=r.top+r.height/2-vh/2,L=Math.hypot(ex,ey)||1,f=500+Math.random()*800;dx=ex/L*f+(Math.random()-.5)*140;dy=Math.max(-top+4,Math.min(maxD,ey/L*f+(Math.random()-.5)*140));rot=(Math.random()-.5)*620;dl=Math.random()*.12;bez='cubic-bezier(.08,.75,.3,1)'}
  else{dx=(Math.random()-.5)*280;dy=Math.min(maxD,vh*(.6+Math.random()*1.2));rot=(Math.random()-.5)*130;dl=Math.min(1,Math.max(0,r.top/vh)*.45)+Math.random()*.4;bez='cubic-bezier(.55,0,1,.45)'}
  dyOf.set(el,dy);el.style.setProperty('--bx',dx.toFixed(0)+'px');el.style.setProperty('--by',dy.toFixed(0)+'px');el.style.setProperty('--br',rot.toFixed(1)+'deg');el.style.setProperty('--bd',dl.toFixed(2)+'s');el.style.setProperty('--bez',bez);
  el.classList.add('bk');brokenEls.push(el)});
 requestAnimationFrame(()=>requestAnimationFrame(()=>H.classList.add('broken')))};
const undoBreak=()=>{if(!broken&&!brokenEls.length)return;broken=false;H.classList.add('fixing');H.classList.remove('broken');const els=brokenEls.splice(0);
 setTimeout(()=>{els.forEach(el=>{el.classList.remove('bk');['--bx','--by','--br','--bd','--bez'].forEach(p=>el.style.removeProperty(p))});H.classList.remove('fixing')},1300)};
/* cracked-glass overlay */
const cracks=()=>{if(crEl)crEl.remove();const W=innerWidth,Hh=innerHeight,cx=W*(.3+Math.random()*.4),cy=Hh*(.25+Math.random()*.4),R=Math.max(W,Hh)*.62;let d='';
 const ray=(x,y,ang,len,seg)=>{let s='M'+x.toFixed(0)+' '+y.toFixed(0);for(let i=0;i<seg;i++){ang+=(Math.random()-.5)*.55;x+=Math.cos(ang)*len/seg;y+=Math.sin(ang)*len/seg;s+=' L'+x.toFixed(0)+' '+y.toFixed(0);if(i>1&&Math.random()<.35)d+=ray(x,y,ang+(Math.random()<.5?-1:1)*(.5+Math.random()*.6),len*.35,4)}return s+' '};
 const n=11;for(let i=0;i<n;i++)d+=ray(cx,cy,i/n*Math.PI*2+Math.random()*.4,R*(.5+Math.random()*.5),7);
 const sv=D.createElementNS('http://www.w3.org/2000/svg','svg');sv.id='sxCr';sv.setAttribute('viewBox','0 0 '+W+' '+Hh);sv.setAttribute('aria-hidden','true');
 d.split(/(?=M)/).forEach((seg,i)=>{if(!seg.trim())return;const pa=D.createElementNS('http://www.w3.org/2000/svg','path');pa.setAttribute('d',seg.trim());pa.setAttribute('pathLength','1');pa.style.animationDelay=(i%n)*.025+'s';sv.appendChild(pa)});
 D.body.appendChild(sv);crEl=sv};
const crClear=()=>{if(crEl){crEl.remove();crEl=null}};
const breakSeq=async(mode,alive)=>{if(broken)return false;
 if(!calm()){cracks();H.classList.add('quake');await sleep(650);H.classList.remove('quake');if(!alive()){crClear();return false}}
 doBreak(mode);if(mode==='explode')crClear();return true};
/* page-wide filters (invert / gray / sepia / blur / hue) */
const fx={invert:0,gray:0,sepia:0,blur:0,hue:0};let partyT=0,pc=null;
const applyFx=()=>{const a=[];if(fx.invert)a.push('invert(1) hue-rotate(180deg)');if(fx.gray)a.push('grayscale(1)');if(fx.sepia)a.push('sepia(1)');if(fx.blur)a.push('blur('+fx.blur+'px)');if(fx.hue)a.push('hue-rotate('+fx.hue+'deg)');
 if(a.length){H.style.setProperty('--fx',a.join(' '));H.setAttribute('data-fx','')}else{H.removeAttribute('data-fx');H.style.removeProperty('--fx')}};
const setBg=v=>{H.style.setProperty('--bgc',v);H.setAttribute('data-bgc','')};
const clearBg=()=>{H.removeAttribute('data-bgc');H.style.removeProperty('--bgc')};
/* snow / confetti */
const stopParts=()=>{if(pc){pc.stop();pc=null}};
const particles=(mode,ms)=>{stopParts();const c=D.createElement('canvas');c.id='fxc';D.body.appendChild(c);const g=c.getContext('2d');let W,Hh,arr=[],id=0,dead=false;const end=ms?Date.now()+ms:0;
 const size=()=>{W=c.width=innerWidth;Hh=c.height=innerHeight};size();addEventListener('resize',size);
 const spawn=()=>{if(mode==='snow')arr.push({x:Math.random()*W,y:-10,r:1.5+Math.random()*3,vy:.7+Math.random()*1.5,vx:(Math.random()-.5)*.9,a:Math.random()*6});
  else for(let i=0;i<3;i++)arr.push({x:Math.random()*W,y:-14,w:6+Math.random()*6,h:8+Math.random()*9,vy:2.2+Math.random()*3.2,vx:(Math.random()-.5)*3.2,rot:Math.random()*6,vr:(Math.random()-.5)*.34,c:'hsl('+Math.floor(Math.random()*360)+',90%,60%)'})};
 const step=()=>{if(dead)return;id=requestAnimationFrame(step);g.clearRect(0,0,W,Hh);const live=!end||Date.now()<end;if(live)spawn();
  for(let i=arr.length-1;i>=0;i--){const q=arr[i];q.y+=q.vy;q.x+=q.vx;
   if(mode==='snow'){q.a+=.03;q.x+=Math.sin(q.a)*.6;g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.arc(q.x,q.y,q.r,0,6.3);g.fill()}
   else{q.rot+=q.vr;g.save();g.translate(q.x,q.y);g.rotate(q.rot);g.fillStyle=q.c;g.fillRect(-q.w/2,-q.h/2,q.w,q.h);g.restore()}
   if(q.y>Hh+20||q.x<-30||q.x>W+30)arr.splice(i,1)}
  if(end&&!live&&!arr.length)stopParts()};
 id=requestAnimationFrame(step);pc={stop(){dead=true;cancelAnimationFrame(id);removeEventListener('resize',size);c.remove()}}};
const stopRb=()=>{clearInterval(rb);rb=0};
const setColor=v=>{stopRb();H.style.setProperty('--fc',v);H.setAttribute('data-fc','')};
const clearColor=()=>{stopRb();H.removeAttribute('data-fc');H.style.removeProperty('--fc')};
const rainbow=()=>{stopRb();H.setAttribute('data-fc','');let h=0;const st=()=>{H.style.setProperty('--fc','hsl('+h+',100%,65%)');h=(h+14)%360};st();if(!calm())rb=setInterval(st,300)};
const setFlip=on=>{if(on){H.classList.add('flipx','flip')}else if(H.classList.contains('flip')){H.classList.remove('flip');setTimeout(()=>H.classList.remove('flipx'),1200)}};
const dragOff=()=>{dragOn=false;H.classList.remove('dragmode')};
const undoDrag=()=>{[...dragged].forEach(t=>{t.style.transition='transform .6s cubic-bezier(.16,1,.3,1)';t.classList.remove('dgd');setTimeout(()=>{t.style.transition='';t.style.removeProperty('--dx');t.style.removeProperty('--dy');t._dx=t._dy=0},700)});dragged.clear()};
const matrixOn=()=>{if(mx)return;const c=D.createElement('canvas');c.id='mtx';c.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:120;pointer-events:none;background:rgba(0,12,0,.55)';D.body.appendChild(c);
 const g=c.getContext('2d'),fs=16,chars='ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789ABCDEF';let W,Hh,cols,drops,last=0,id;
 const size=()=>{W=c.width=innerWidth;Hh=c.height=innerHeight;cols=Math.ceil(W/fs);drops=Array.from({length:cols},()=>Math.random()*-50)};size();addEventListener('resize',size);
 const step=t=>{id=requestAnimationFrame(step);if(t-last<55)return;last=t;g.globalCompositeOperation='destination-out';g.fillStyle='rgba(0,0,0,.14)';g.fillRect(0,0,W,Hh);g.globalCompositeOperation='source-over';g.fillStyle='#39ff14';g.font=fs+'px monospace';
  for(let i=0;i<cols;i++){g.fillText(chars[Math.floor(Math.random()*chars.length)],i*fs,drops[i]*fs);if(drops[i]*fs>Hh&&Math.random()>.975)drops[i]=0;drops[i]++}};
 id=requestAnimationFrame(step);mx={stop(){cancelAnimationFrame(id);removeEventListener('resize',size);c.remove();mx=null}}};
const fixAll=()=>{if(mx)mx.stop();clearColor();clearBg();H.removeAttribute('data-ff');H.style.removeProperty('--ff');setFlip(false);if(H.classList.contains('neon')){H.classList.remove('neon');render()}dragOff();undoDrag();undoBreak();crClear();stopParts();clearInterval(partyT);partyT=0;fx.invert=fx.gray=fx.sepia=fx.blur=fx.hue=0;applyFx();['quake','glitch','spin'].forEach(k=>H.classList.remove(k))};
/* drag mode */
const DG='.glass,.btn,.chip,.sh,.it,.lang,.sp,.proj,.tags span,h1,h2,.portrait,.brand,.cert,.club,.ct,.pg,.sx-stats';
D.addEventListener('pointerdown',e=>{if(!dragOn||e.target.closest('#cmdWin,#secP,#secB,#idCard,#bar'))return;const t=e.target.closest(DG);if(!t)return;e.preventDefault();e.stopPropagation();
 if(getComputedStyle(t).position==='static')t.style.position='relative';t._dx=t._dx||0;t._dy=t._dy||0;dgEl=t;dgs={x:e.clientX,y:e.clientY,dx:t._dx,dy:t._dy};t.classList.add('dgd','dragging');dragged.add(t)},true);
D.addEventListener('pointermove',e=>{if(!dgEl)return;dgEl._dx=dgs.dx+e.clientX-dgs.x;dgEl._dy=dgs.dy+e.clientY-dgs.y;dgEl.style.setProperty('--dx',dgEl._dx+'px');dgEl.style.setProperty('--dy',dgEl._dy+'px');if(e.cancelable)e.preventDefault()},{passive:false});
['pointerup','pointercancel'].forEach(k=>D.addEventListener(k,()=>{if(dgEl)dgEl.classList.remove('dragging');dgEl=null}));
D.addEventListener('click',e=>{if(dragOn&&!e.target.closest('#cmdWin,#secP,#secB,#idCard,#bar')&&e.target.closest(DG)){e.preventDefault();e.stopPropagation()}},true);
/* commands */
const exec=async raw=>{
 const line=raw.trim().replace(/\s+/g,' ');if(!line)return;
 const low=line.toLowerCase(),parts=line.split(' '),c=parts[0].toLowerCase(),arg=parts.slice(1).join(' '),my=++tok,alive=()=>my===tok;
 if(/^(sudo )?(rm -rf ?(\/\*?|\*|~)|del( \/\w)* \*(\.\*)?|format c:?)$/.test(low)){
  out('Deleting everything…','cmd-y');await sleep(450);if(!alive())return;out('Removing C:\\Users\\guest\\website\\*','cmd-e');await sleep(350);if(!alive())return;
  await breakSeq('fall',alive);if(!alive())return;out('Oops. Everything is broken. Type "fix" to put it all back.','cmd-g');return}
 if(low==='sudo hire me'){out('[sudo] password for guest: ********');await sleep(600);if(!alive())return;out('Permission granted.','cmd-g');out('Hiring manager detected. Here is the good stuff:');INFO.contact.forEach(l=>out(l));out('');out('Let’s build something. ✦','cmd-c');return}
 if(c==='sudo'){out('guest is not in the sudoers file. This incident will be reported.','cmd-e');return}
 switch(c){
  case 'help':case '?':HELP.forEach(l=>out(l));break;
  case 'hint':case 'hints':HINTS.forEach(l=>out(l,l?'cmd-y':''));break;
  case 'clear':case 'cls':co.innerHTML='';break;
  case 'exit':case 'quit':closeCmd();break;
  case 'about':INFO.about.forEach(l=>out(l));break;
  case 'projects':INFO.projects.forEach(l=>out(l));break;
  case 'skills':INFO.skills.forEach(l=>out(l));break;
  case 'contact':INFO.contact.forEach(l=>out(l));break;
  case 'whoami':out('ayon-portfolio\\guest');out('A curious visitor. Type "about" to meet whoever built this place.');break;
  case 'echo':out(arg);break;
  case 'date':case 'time':out('The current date is: '+new Date().toDateString());break;
  case 'ver':out('Portfolio Command Prompt [Version 1.0.2026.11]');break;
  case 'cd':out('Nothing to see in other folders. Try "dir".');break;
  case 'dir':case 'ls':{const d=new Date(),ds=(d.getMonth()+1+'').padStart(2,'0')+'/'+(d.getDate()+'').padStart(2,'0')+'/'+d.getFullYear();
   out(' Volume in drive C is PORTFOLIO');out(' Directory of C:\\Users\\guest');out('');
   ['about.txt','projects.txt','skills.txt','contact.txt','secrets.txt'].forEach(f=>out(ds+'   '+f));out('');out('               5 File(s)');break}
  case 'type':case 'cat':{const f=arg.toLowerCase();if(FILES[f])INFO[FILES[f]].forEach(l=>out(l));else if(f==='secrets.txt'){out('Access denied. Hint: real hackers ask nicely.','cmd-e')}else out(arg?'The system cannot find the file specified.':'The syntax of the command is incorrect.','cmd-e');break}
  case 'secrets':{out('Secrets found: '+got()+' / '+S.length);S.forEach((s,i)=>out('  '+(i+1)+'. '+(found.includes(s.id)?s.t:'???'),found.includes(s.id)?'cmd-g':''));break}
  case 'neofetch':{const art=['      /\\      ','     /  \\     ','    / /\\ \\    ','   / ____ \\   ','  /_/    \\_\\  ','               '],info=['guest@ayon-portfolio','--------------------','OS: Portfolio OS 2026','Host: Rifaat Al Hasan Ayon','Uptime: '+Math.round((Date.now()-t0)/1000)+'s','Stack: HTML · CSS · JS','Secrets: '+got()+'/'+S.length];
   if(innerWidth<520)info.forEach(l=>out(l,'cmd-c'));else for(let i=0;i<Math.max(art.length,info.length);i++)out((art[i]||'               ')+' '+(info[i]||''),'cmd-c');break}
  /* ---- hidden ---- */
  case 'matrix':if(arg==='off'||arg==='stop'){if(mx){mx.stop();out('Back to the real world.','cmd-g')}else out('The matrix is not running.')}else if(calm())out('Motion is off. The matrix needs motion.','cmd-e');else{matrixOn();out('Wake up, Neo…  (type "matrix off" or press Ctrl+C to stop)','cmd-g')}break;
  case 'break':case 'destroy':case 'crash':case 'wreck':case 'ruin':case 'collapse':{if(broken){out('Already destroyed. Type "fix" to rebuild it.','cmd-e');break}out('Initiating demolition…','cmd-y');const ok=await breakSeq('fall',alive);if(ok&&alive())out('The whole website has collapsed. Scroll down to see the ruins. Type "fix" to rebuild it.','cmd-g');break}
  case 'explode':case 'boom':case 'bomb':case 'blast':{if(broken){out('Already destroyed. Type "fix" first.','cmd-e');break}out('Arming charges…','cmd-y');const ok=await breakSeq('explode',alive);if(ok&&alive())out('💥 BOOM. Pieces everywhere. Type "fix" to put them back.','cmd-g');break}
  case 'shake':case 'quake':case 'earthquake':{if(calm()){out('Motion is off. Earthquakes need motion.','cmd-e');break}H.classList.add('quake');out('Earthquake! Hold on…','cmd-y');await sleep(3000);H.classList.remove('quake');if(alive())out('It stopped. For now.','cmd-g');break}
  case 'spin':case 'roll':{if(calm()){out('Motion is off.','cmd-e');break}H.style.setProperty('--oy',(scrollY+innerHeight/2)+'px');H.classList.remove('spin');void H.offsetWidth;H.classList.add('spin');setTimeout(()=>H.classList.remove('spin'),1800);out('Whee! 🌀','cmd-g');break}
  case 'glitch':{const a=arg.toLowerCase();if(a==='off'||(!a&&H.classList.contains('glitch'))){H.classList.remove('glitch');out('Signal restored.','cmd-g')}else{H.classList.add('glitch');out('Signal corrupted. (\"glitch off\" to stop)','cmd-g')}break}
  case 'invert':fx.invert^=1;applyFx();out(fx.invert?'Colors inverted. Run \"invert\" again to undo.':'Colors back to normal.','cmd-g');break;
  case 'gray':case 'grey':case 'grayscale':fx.gray^=1;applyFx();out(fx.gray?'Black and white mode. Run it again to undo.':'Color is back.','cmd-g');break;
  case 'sepia':fx.sepia^=1;applyFx();out(fx.sepia?'Old-timey mode. Run it again to undo.':'Back to the present.','cmd-g');break;
  case 'blur':{const a=arg.toLowerCase();if(a==='off'||a==='0'||(!a&&fx.blur)){fx.blur=0;out('Vision restored.','cmd-g')}else{fx.blur=Math.max(1,Math.min(12,parseFloat(a)||4));out('Blur set to '+fx.blur+'. (\"blur off\" to stop)','cmd-g')}applyFx();break}
  case 'hue':{const n=parseFloat(arg);if(isNaN(n)){out('Usage: hue <0-360>  (hue 0 to reset)','cmd-y');break}fx.hue=((n%360)+360)%360;applyFx();out('All colors rotated by '+fx.hue+'°.','cmd-g');break}
  case 'bg':case 'background':{const a=arg.toLowerCase();
   if(!a){out('Usage: bg <name | #hex | default>','cmd-y');out('Names: '+Object.keys(COLORS).join(', '),'cmd-y');break}
   if(a==='default'||a==='reset'){clearBg();out('Background restored.','cmd-g');break}
   const v=COLORS[a]||(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/.test(a)?(a[0]==='#'?a:'#'+a):null);if(!v){out('Unknown color \"'+arg+'\".','cmd-e');break}setBg(v);out('Background set to '+v+'.','cmd-g');break}
  case 'theme':{const a=arg.toLowerCase();
   if(!a){out('Usage: theme <'+Object.keys(THEMES).join(' | ')+' | default>','cmd-y');break}
   if(a==='default'||a==='reset'){clearColor();clearBg();H.removeAttribute('data-ff');H.style.removeProperty('--ff');out('Original theme restored.','cmd-g');break}
   const t=THEMES[a];if(!t){out('Unknown theme \"'+arg+'\".','cmd-e');break}
   setColor(t.fc);setBg(t.bg);if(t.ff){H.style.setProperty('--ff',FONTS[t.ff]);H.setAttribute('data-ff','')}else{H.removeAttribute('data-ff');H.style.removeProperty('--ff')}out('Theme \"'+a+'\" applied. (\"theme default\" to undo)','cmd-g');break}
  case 'snow':{if(arg.toLowerCase()==='off'){stopParts();out('The snow melted.','cmd-g');break}if(calm()){out('Motion is off.','cmd-e');break}particles('snow',0);out('❄️  Let it snow. (\"snow off\" to stop)','cmd-g');break}
  case 'confetti':{if(calm()){out('Motion is off.','cmd-e');break}particles('confetti',4500);out('🎉 Congratulations on finding this!','cmd-g');break}
  case 'party':{if(arg.toLowerCase()==='off'){clearInterval(partyT);partyT=0;fx.hue=0;applyFx();stopParts();out('Party is over. Everyone go home.','cmd-g');break}if(calm()){out('Motion is off.','cmd-e');break}clearInterval(partyT);let h=0;partyT=setInterval(()=>{h=(h+14)%360;fx.hue=h;applyFx()},160);particles('confetti',0);out('🥳 PARTY MODE. (\"party off\" to stop)','cmd-g');break}
  case 'cheats':case 'cheat':case 'codes':CHEATS.forEach(l=>out(l,/^  [A-Z]+$/.test(l)?'cmd-y':''));break;
  case 'fix':case 'repair':case 'reset':case 'undo':fixAll();out('Everything is back where it belongs.','cmd-g');break;
  case 'color':case 'colour':{const a=arg.toLowerCase();
   if(!a){out('Usage: color <name | #hex | rainbow | default>','cmd-y');out('Names: '+Object.keys(COLORS).join(', '),'cmd-y');break}
   if(a==='default'||a==='reset'){clearColor();out('Text color restored.','cmd-g');break}
   if(a==='rainbow'){rainbow();out('Taste the rainbow. ("color default" to stop)','cmd-g');break}
   const v=COLORS[a]||(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/.test(a)?(a[0]==='#'?a:'#'+a):null);
   if(!v){out('Unknown color "'+arg+'".','cmd-e');break}
   setColor(v);out('Text color set to '+v+'.'+(a==='black'?' Bold choice. Good luck reading this site.':''),'cmd-g');break}
  case 'rainbow':rainbow();out('Taste the rainbow. ("color default" to stop)','cmd-g');break;
  case 'font':{const a=arg.toLowerCase();
   if(!a){out('Usage: font <'+Object.keys(FONTS).join(' | ')+' | default>','cmd-y');break}
   if(a==='default'||a==='reset'){H.removeAttribute('data-ff');H.style.removeProperty('--ff');out('Font restored.','cmd-g');break}
   if(!FONTS[a]){out('Unknown font "'+arg+'".','cmd-e');break}
   H.style.setProperty('--ff',FONTS[a]);H.setAttribute('data-ff','');out('Font changed to '+a+'.','cmd-g');break}
  case 'flip':case 'upside-down':case 'mirror':{const on=!H.classList.contains('flip');setFlip(on);out(on?'The world is upside down. Run "flip" again to fix it.':'Right side up again.','cmd-g');break}
  case 'drag':case 'move':dragOn=true;H.classList.add('dragmode');out('Drag mode on. Minimize this window, then grab any card, button or heading and move it (touch works too).','cmd-g');out('Type "drop" when you are done, or "fix" to put everything back.','cmd-g');break;
  case 'drop':dragOff();out('Drag mode off. Things stay where you put them.','cmd-g');break;
  case 'neon':{const on=!H.classList.contains('neon');neon(true);out(on?'Neon mode on.':'Neon mode off.','cmd-c');break}
  case 'gojo':out('Domain Expansion: Infinite Void','cmd-c');domain(true);break;
  case 'spider':case 'spiderman':case 'spider-man':out('🕷️  With great power comes great responsibility.');out('Your friendly neighborhood developer.','cmd-c');break;
  case 'hack':{['Initializing exploit kit…','Scanning ports 22, 80, 443… open','Bypassing firewall…','Injecting payload…'].forEach(()=>0);
   for(const l of ['Initializing exploit kit…','Scanning ports 22, 80, 443… open','Bypassing firewall…','Injecting payload…']){if(!alive())return;out(l,'cmd-y');await sleep(450)}
   const b=out('');for(let i=0;i<=20;i++){if(!alive())return;b.textContent='['+'#'.repeat(i)+'-'.repeat(20-i)+'] '+i*5+'%';await sleep(90)}
   out('ACCESS GRANTED','cmd-g');await sleep(500);if(!alive())return;out('Just kidding. I only hack together web apps. 😄');break}
  default:out("'"+parts[0]+"' is not recognized as an internal or external command,",'cmd-e');out('operable program or batch file.','cmd-e')}
};
/* window */
const hist=[];let hi=0;
const openCmd=()=>{if(noCmdQ())return;if(cw.hidden){cw.hidden=false;requestAnimationFrame(()=>cw.classList.add('on'));if(!co.childElementCount){['Portfolio Command Prompt [Version 1.0.2026.11]','(c) Rifaat Al Hasan Ayon. Some rights reserved.','','Type "help" to get started.',''].forEach(l=>out(l))}mark('cmd')}
 cw.classList.remove('min');setP(false);ci.focus({preventScroll:true})};
const closeCmd=()=>{cw.classList.remove('on');setTimeout(()=>{if(!cw.classList.contains('on'))cw.hidden=true},calm()?0:220);ci.blur()};
ci.addEventListener('keydown',e=>{e.stopPropagation();
 if(e.key==='Enter'){const v=ci.value;ci.value='';out(PROMPT+v,'cmd-in');if(v.trim())hist.push(v);hi=hist.length;exec(v)}
 else if(e.key==='ArrowUp'){e.preventDefault();if(hi>0){hi--;ci.value=hist[hi]}}
 else if(e.key==='ArrowDown'){e.preventDefault();if(hi<hist.length-1){hi++;ci.value=hist[hi]}else{hi=hist.length;ci.value=''}}
 else if(e.key==='Tab'){e.preventDefault();const v=ci.value.toLowerCase();if(v&&v.indexOf(' ')<0){const m=VIS.filter(x=>x.indexOf(v)===0);if(m.length===1)ci.value=m[0]}}
 else if(e.ctrlKey&&e.key.toLowerCase()==='c'&&!String(getSelection()||'')){tok++;if(mx)mx.stop();out(PROMPT+ci.value+'^C','cmd-in');ci.value=''}
 else if(e.ctrlKey&&e.key.toLowerCase()==='l'){e.preventDefault();co.innerHTML=''}
 else if(e.key==='Escape'){closeCmd()}});
cb.addEventListener('click',()=>{if(!String(getSelection()||''))ci.focus({preventScroll:true})});
cw.addEventListener('click',e=>{const a=e.target.closest('.cmd-btns button');if(!a)return;const k=a.getAttribute('data-a');if(k==='x')closeCmd();else if(k==='min')cw.classList.toggle('min');else{cw.classList.toggle('max');cw.classList.remove('min')}});
let wd=null;
cbar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||cw.classList.contains('max'))return;const r=cw.getBoundingClientRect();wd={x:e.clientX-r.left,y:e.clientY-r.top};cw.style.left=r.left+'px';cw.style.top=r.top+'px';try{cbar.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
cbar.addEventListener('pointermove',e=>{if(!wd)return;cw.style.left=Math.max(-200,Math.min(innerWidth-80,e.clientX-wd.x))+'px';cw.style.top=Math.max(0,Math.min(innerHeight-40,e.clientY-wd.y))+'px'});
['pointerup','pointercancel'].forEach(k=>cbar.addEventListener(k,()=>{wd=null}));
/* triggers: backtick on PC, 5 logo taps everywhere */
addEventListener('keydown',e=>{const t=e.target;if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
 if(!noCmdQ()&&(e.code==='Backquote'||e.key==='`'||e.key==='~')&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();(!cw.hidden&&cw.classList.contains('on'))?closeCmd():openCmd()}});
let lt=0,lc=0;
[$('.brand'),$('.sp-top')].filter(Boolean).forEach(el=>el.addEventListener('click',e=>{if(noCmdQ())return;const n=Date.now();if(n-lt>2500)lc=0;lt=n;lc++;if(lc>=5){lc=0;e.preventDefault();e.stopImmediatePropagation();openCmd()}},true));
const secCmd=$('#secCmd');if(secCmd)secCmd.addEventListener('click',e=>{e.stopPropagation();openCmd()});
/* cheat codes tab: visible on the site, tap a code to run it in the prompt */
const CH=[['Destroy',[['break','The whole website collapses'],['explode','Everything blows apart'],['shake','3-second earthquake'],['fix','Rebuild it all and reset every effect']]],
['Style',[['color red','Text color: a name, #hex, rainbow or default'],['bg #001133','Page background (bg default)'],['theme hacker','hacker, sunset, ocean, blood, candy, paper'],['font comic','comic, serif, mono, cursive, impact'],['invert','Flip all colors (run again to undo)'],['gray','Black and white (run again to undo)'],['sepia','Old photo look (run again to undo)'],['blur 4','Blur the page (blur off)'],['hue 90','Rotate every color, 0 to 360']]],
['Fun',[['drag','Grab and move anything (drop to stop)'],['flip','Turn the page upside down'],['spin','One full rotation'],['glitch','Corrupted screen (glitch off)'],['matrix','Green code rain (matrix off)'],['snow','Let it snow (snow off)'],['confetti','Party popper'],['party','Rainbow plus confetti (party off)'],['neon','Neon mode'],['gojo','Domain Expansion']]]];
const cheatBox=$('#secCheats'),secSub=$('#secSub');
if(cheatBox){cheatBox.innerHTML=CH.map(g=>'<h5>'+g[0]+'</h5>'+g[1].map(c=>'<button type="button" class="cx" data-c="'+c[0]+'"><code>'+c[0]+'</code><span>'+c[1]+'</span></button>').join('')).join('')+'<p class="tip">Tap a code to run it in the Command Prompt, or type it yourself. Type <b>cheats</b> there for this list, and <b>fix</b> to undo everything.</p>';
 cheatBox.addEventListener('click',e=>{const b=e.target.closest('.cx');if(!b)return;e.stopPropagation();const c=b.getAttribute('data-c');openCmd();out(PROMPT+c,'cmd-in');hist.push(c);hi=hist.length;exec(c)})}
panel.querySelectorAll('.sec-tabs button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const c=b.getAttribute('data-t')==='c';
 panel.classList.toggle('tab-c',c);panel.querySelectorAll('.sec-tabs button').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
 list.hidden=c;if(cheatBox)cheatBox.hidden=!c;const h4=panel.querySelector('h4');if(h4)h4.textContent=c?'Secret cheat codes':'Hidden in plain sight';if(secSub)secSub.textContent=c?'Type these in the Command Prompt, or tap one to run it.':'Find them all. Tap a found one to re-read it.';
 const sc=panel.querySelector('.sec-scroll');if(sc)sc.scrollTop=0}));
/* 3 · Console */
const c1='font:800 18px Inter,system-ui,sans-serif;color:#c7f36b',c2='font:500 13px ui-monospace,monospace;color:#9aa3ad',c3='font:700 13px ui-monospace,monospace;color:#05060a;background:#c7f36b;padding:2px 8px;border-radius:6px';
try{console.log('%c✦ Oh, a developer. Welcome.',c1);console.log('%cThis site hides a few secrets. Type %chireMe()%c and press Enter.',c2,c3,c2);
 Object.defineProperty(window,'hireMe',{configurable:true,value:function(){mark('console');console.log('%cLet’s build something.%c\n✉ alhasanayon26@gmail.com\n⌥ github.com/alhasanayon26',c1,c2);return 'Message received. ✦'}})}catch(_){}
render();
})();
