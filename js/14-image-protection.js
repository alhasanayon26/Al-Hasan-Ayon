/* image protection */
(function(){
 function lock(i){i.setAttribute('draggable','false');i.oncontextmenu=function(e){e.preventDefault();return false}}
 function all(){var l=document.images;for(var k=0;k<l.length;k++)lock(l[k])}
 all();document.addEventListener('DOMContentLoaded',all);addEventListener('load',all);
 new MutationObserver(all).observe(document.documentElement,{childList:true,subtree:true});
 var stop=function(e){if(e.target&&e.target.tagName==='IMG'||e.type==='dragstart'){e.preventDefault();return false}};
 ['dragstart','drag','drop','dragover','selectstart'].forEach(function(t){document.addEventListener(t,function(e){if(t==='selectstart'&&!(e.target&&e.target.tagName==='IMG'))return;e.preventDefault()},true)});
 document.addEventListener('contextmenu',function(e){e.preventDefault()},true);
})();
