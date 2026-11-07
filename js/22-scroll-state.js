(function(){var h=document.documentElement,t=0,on=0;
function off(){on=0;h.classList.remove('is-scrolling')}
document.addEventListener('visibilitychange',function(){h.classList.toggle('tab-hidden',document.hidden)});
})();
