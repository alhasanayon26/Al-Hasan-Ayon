/* mobile/tablet: shrink the hero portrait just enough so the whole hero (incl. tagline) fits one screen */
(function(){var h=document.querySelector('.hero'),pt=h&&h.querySelector('.portrait');if(!h||!pt)return;var q=0;
function fit(){q=0;var props=['--ph'];
 if(innerWidth>920){h.style.removeProperty('--ph');pt.style.removeProperty('--ph');return}
 h.style.removeProperty('--ph');pt.style.removeProperty('--ph');
 var over=h.offsetHeight-innerHeight;if(over<=1)return;
 var ph=pt.getBoundingClientRect().height,n=Math.max(220,Math.floor(ph-over-4))+'px';
 h.style.setProperty('--ph',n);pt.style.setProperty('--ph',n)}
function r(){q||(q=requestAnimationFrame(fit))}
fit();addEventListener('resize',r);addEventListener('orientationchange',r);addEventListener('load',r);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(r);[300,900,2000].forEach(function(t){setTimeout(r,t)})})();
