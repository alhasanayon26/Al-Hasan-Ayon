/* tilt parallax: phones & tablets move the photo + name with the gyro (accelerometer as fallback), like the mouse does on PC */
(function(){
 var touchy=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
 if(!touchy||matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 var H=document.documentElement,Q=document.querySelector.bind(document);
 var T=[[Q('.portrait img.spx'),-34],[Q('.portrait img:not(.spx)'),-34],[Q('#h1'),26]].filter(function(a){return a[0]});
 var DO=window.DeviceOrientationEvent,DM=window.DeviceMotionEvent;
 var ios=!!(DO&&typeof DO.requestPermission==='function');
 var mode=null,base=null,tx=0,ty=0,cx=0,cy=0,raf=0,started=false;
 function clamp(v){return Math.max(-.5,Math.min(.5,v))}
 function ang(){return (screen.orientation&&typeof screen.orientation.angle==='number')?screen.orientation.angle:(window.orientation||0)}
 function feed(a,b){ /* a = left/right tilt, b = front/back tilt (degrees) */
  var r=ang(),x=a,y=b;
  if(r===90||r===-270){x=b;y=-a}else if(r===270||r===-90){x=-b;y=a}else if(r===180||r===-180){x=-a;y=-b}
  if(!base)base={x:x,y:y};
  base.x+=(x-base.x)*.004;base.y+=(y-base.y)*.004; /* slowly re-centres, so any holding angle works */
  tx=clamp((x-base.x)/34);ty=clamp((y-base.y)/34);
  if(!raf)raf=requestAnimationFrame(step);
 }
 function orient(e){
  if(e.gamma==null||e.beta==null)return;
  mode='o';feed(e.gamma,e.beta);
 }
 function motion(e){
  if(mode==='o')return;
  var g=e.accelerationIncludingGravity;if(!g||g.x==null||g.y==null)return;
  var s=ios?1:-1;mode='m';
  feed(s*g.x/9.81*60,(ios?-1:1)*g.y/9.81*60);
 }
 function step(){
  raf=0;
  var calm=H.hasAttribute('data-calm');
  cx+=((calm?0:tx)-cx)*.09;cy+=((calm?0:ty)-cy)*.09;
  for(var i=0;i<T.length;i++){
   T[i][0].style.translate=calm&&Math.abs(cx)<.001?'':(cx*T[i][1]).toFixed(1)+'px '+(cy*T[i][1]*.7).toFixed(1)+'px';
  }
  if(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001)raf=requestAnimationFrame(step);
 }
 function begin(){
  if(started)return;started=true;
  addEventListener('deviceorientation',orient,true);
  addEventListener('devicemotion',motion,true);
 }
 if(!DO&&!DM)return;
 if(!ios){begin();return}
 /* iOS / iPadOS: motion access must be allowed by the visitor after a tap */
 var busy=false,evs=['touchend','click'];
 function stop(){evs.forEach(function(t){removeEventListener(t,ask,true)})}
 function ask(){
  if(busy)return;busy=true;
  var ps=[];
  try{ps.push(DO.requestPermission())}catch(e){}
  try{if(DM&&typeof DM.requestPermission==='function')ps.push(DM.requestPermission())}catch(e){}
  Promise.all(ps.map(function(p){return Promise.resolve(p).catch(function(){return 'error'})})).then(function(r){
   if(r.indexOf('granted')>-1){stop();begin()}
   else if(r.indexOf('denied')>-1||!r.length)stop();   /* visitor said no: don't nag */
   else busy=false;  /* that touch was not a real tap (e.g. a scroll), so try again on the next one */
  });
 }
 evs.forEach(function(t){addEventListener(t,ask,{capture:true,passive:true})});
})();
