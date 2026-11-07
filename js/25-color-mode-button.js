(function(){var c=document.getElementById('clb'),b=document.getElementById('clm');if(!c||!b)return;
function sync(){b.lastChild.textContent=c.textContent.trim();var on=c.classList.contains('on');b.classList.toggle('on',on);b.classList.toggle('off',!on)}
b.addEventListener('click',function(e){e.stopPropagation();c.click();sync()});
new MutationObserver(sync).observe(c,{attributes:true,childList:true,subtree:true,characterData:true});sync()})();
