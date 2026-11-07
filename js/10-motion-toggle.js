/* motion toggle inside the mobile menu */
(function(){var m=document.getElementById('mt'),b=document.getElementById('mtm');if(!m||!b)return;
function sync(){var t=m.textContent.trim();b.lastChild.textContent=t;b.classList.toggle('off',/Off/.test(t))}
b.addEventListener('click',function(e){e.stopPropagation();m.click();sync()});
new MutationObserver(sync).observe(m,{childList:true,subtree:true,characterData:true});sync();
})();
