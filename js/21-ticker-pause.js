/* pause the skills ticker while it is off screen */
(function(){var t=document.querySelector('#skills .sx-tick div');if(!t||!window.IntersectionObserver)return;
new IntersectionObserver(function(e){t.style.animationPlayState=e[0].isIntersecting?'running':'paused'},{rootMargin:'60px'}).observe(t.parentNode)})();
