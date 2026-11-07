/* Gojo: sit exactly on the first skills card at any screen size */
(function(){var sec=document.getElementById('skills'),g=sec&&sec.querySelector('.ani.gojo'),c=sec&&(sec.querySelector('.sx-stats')||sec.querySelector('.glass'));if(!g||!c)return;
function off(el,a){var t=0,l=0;while(el&&el!==a){t+=el.offsetTop;l+=el.offsetLeft;el=el.offsetParent}return{t:t,l:l}}
function fit(){if(innerWidth>1100){['top','right','left','bottom'].forEach(function(k){g.style.removeProperty(k)});return}
 var o=off(c,sec),h=g.offsetHeight,right=sec.clientWidth-(o.l+c.offsetWidth)+6;
 g.style.setProperty('top',Math.round(o.t-h-1)+'px','important');g.style.setProperty('bottom','auto','important');
 g.style.setProperty('left','auto','important');g.style.setProperty('right',Math.round(right)+'px','important')}
fit();var fq=0,fa=function(){fq||(fq=requestAnimationFrame(function(){fq=0;if(innerWidth<=1100)fit()}))};addEventListener('scroll',fa,{passive:true});[200,700,1500,3000].forEach(function(t){setTimeout(fa,t)});addEventListener('resize',fit);addEventListener('load',fit);addEventListener('orientationchange',fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
if(window.ResizeObserver){var ro=new ResizeObserver(fit);ro.observe(sec);ro.observe(c)}
})();
