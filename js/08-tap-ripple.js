/* touch tap ripple */
(function(){if(!matchMedia('(hover:none),(pointer:coarse)').matches)return;
document.addEventListener('pointerdown',function(e){var t=e.target.closest&&e.target.closest('.btn,.nav-cta,.links a,.burger');if(!t)return;
 var r=t.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,x=document.createElement('span');x.className='tap-r';
 x.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
 t.appendChild(x);setTimeout(function(){x.remove()},650)},{passive:true});
})();
