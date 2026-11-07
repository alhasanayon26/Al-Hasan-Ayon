/* hold the page still while a finger is dragging over the portrait */
(function(){
 var H=document.documentElement,locked=false;
 function inPhoto(t){var im=document.querySelector('.portrait img:not(.spx)');if(!im)return false;
  var b=im.getBoundingClientRect();return t.clientX>=b.left&&t.clientX<=b.right&&t.clientY>=b.top&&t.clientY<=b.bottom}
 function s(e){var t=e.touches&&e.touches[0];if(e.touches.length===1&&t&&!H.classList.contains('is-splash')&&inPhoto(t)){locked=true;H.classList.add('pl')}}
 function m(e){if(locked&&e.cancelable)e.preventDefault()}
 function en(e){if(!e.touches||!e.touches.length){locked=false;H.classList.remove('pl')}}
 addEventListener('touchstart',s,{passive:true,capture:true});
 addEventListener('touchmove',m,{passive:false,capture:true});
 addEventListener('touchend',en,{passive:true,capture:true});
 addEventListener('touchcancel',en,{passive:true,capture:true});
})();
