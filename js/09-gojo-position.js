/* Gojo: sit exactly on the first skills card at any screen size.
   If the title would run into him, room is reserved between the title and the card for him to stand in
   (same idea as the BMW's .drift-anchor). Wide screens, where he stands beside the title, are left alone. */
(function(){var sec=document.getElementById('skills'),g=sec&&sec.querySelector('.ani.gojo'),c=sec&&(sec.querySelector('.sx-stats')||sec.querySelector('.glass'));if(!g||!c)return;
var sh=sec.querySelector('.sh'),h2=sh&&sh.querySelector('h2'),lastKey='';
function off(el,a){var t=0,l=0;while(el&&el!==a){t+=el.offsetTop;l+=el.offsetLeft;el=el.offsetParent}return{t:t,l:l}}
/* right edge of the title's rendered text (all lines), measured from the left edge of the section */
function titleRight(){if(!h2)return 0;var r=document.createRange();r.selectNodeContents(h2);var rs=r.getClientRects(),x0=sec.getBoundingClientRect().left,m=0;for(var i=0;i<rs.length;i++)if(rs[i].width>.5)m=Math.max(m,rs[i].right-x0);return m}
function fit(force){if(!sec.clientWidth||!c.offsetWidth)return;var w=innerWidth,H=w>1100?Math.min(300,Math.max(190,w*.21)):w>560?Math.min(210,Math.max(120,w*.26)):Math.min(140,Math.max(100,w*.31)),W=Math.round(H*548/559),cs=sec.querySelectorAll('.sxt'),k=(cs[1]&&cs[0]&&Math.abs(off(cs[1],sec).t-off(cs[0],sec).t)<24)?cs[1]:(cs[0]||c),P=function(k,v){g.style.setProperty(k,v,'important')};
 H=Math.round(H);
 /* decide about the reserved space only when the layout actually changed (keeps scrolling cheap) */
 var key=w+'|'+sec.clientWidth+'|'+k.offsetWidth+'|'+(h2?h2.offsetHeight:0);
 if(sh&&h2&&(force||key!==lastKey)){lastKey=key;
  sh.style.removeProperty('margin-bottom');                      /* start from the stylesheet's own gap */
  var o0=off(k,sec),right0=Math.round(sec.clientWidth-(o0.l+k.offsetWidth)+k.offsetWidth*.04),
      gl=sec.clientWidth-right0-W,                               /* Gojo's left edge */
      gap=o0.t-(off(h2,sec).t+h2.offsetHeight),                  /* free height between title and card now */
      need=H+4;                                                  /* his head must clear the title */
  if(gap<need&&titleRight()+16>gl)sh.style.setProperty('margin-bottom',Math.round((parseFloat(getComputedStyle(sh).marginBottom)||0)+need-gap)+'px','important')}
 var o=off(k,sec);
 P('display','block');P('position','absolute');P('height',H+'px');P('width',W+'px');P('clip-path','none');P('overflow','visible');P('z-index','3');P('pointer-events','auto');P('bottom','auto');P('left','auto');
 P('transform','none');P('top',Math.round(o.t-H+2)+'px');P('right',Math.round(sec.clientWidth-(o.l+k.offsetWidth)+k.offsetWidth*.04)+'px')}
fit(true);var fq=0,fa=function(){fq||(fq=requestAnimationFrame(function(){fq=0;fit()}))},fb=function(){lastKey='';fa()};addEventListener('scroll',fa,{passive:true});[200,700,1500,3000].forEach(function(t){setTimeout(fb,t)});addEventListener('resize',fit);addEventListener('load',fit);addEventListener('orientationchange',fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
if(window.ResizeObserver){var ro=new ResizeObserver(fa);ro.observe(sec);ro.observe(c);ro.observe(document.body)}document.addEventListener('visibilitychange',fa);if(window.IntersectionObserver)new IntersectionObserver(fa).observe(sec);addEventListener('pageshow',fb);
})();
