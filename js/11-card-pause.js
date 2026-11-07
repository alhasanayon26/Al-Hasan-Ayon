/* pause animations on project cards hidden under the next card */
(function(){var cs=[].slice.call(document.querySelectorAll('.stack .sc'));if(cs.length<2)return;var q=0;
function f(){q=0;var vh=innerHeight,st=cs[0].parentElement.getBoundingClientRect();
 if(st.bottom<-300||st.top>vh+300)return;               /* stack nowhere near the screen: skip all work */
 var rs=[],i;for(i=0;i<cs.length;i++)rs.push(cs[i].getBoundingClientRect());   /* all reads first ... */
 for(i=0;i<cs.length-1;i++){var a=rs[i],b=rs[i+1],v=b.top<=a.top+40&&a.top<vh&&a.bottom>0&&b.top<vh;
  if(cs[i].classList.contains('cover')!==v)cs[i].classList.toggle('cover',v)}}   /* ... then writes, only on change */
function s(){q||(q=requestAnimationFrame(f))}
addEventListener('scroll',s,{passive:true});addEventListener('resize',s);f()})();
