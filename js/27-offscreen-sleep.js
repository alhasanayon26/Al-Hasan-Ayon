/* all devices: animations that are far off-screen simply sleep (nothing visible changes) */
(function(){
 if(!('IntersectionObserver' in window))return;
 var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('off',!e.isIntersecting)})},{rootMargin:'300px'});
 document.querySelectorAll('.mq,.drift-anchor').forEach(function(el){io.observe(el)});
})();
