/* disable right-click and common devtools shortcuts */
document.addEventListener('contextmenu',function(e){e.preventDefault()});
document.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase(),c=e.ctrlKey||e.metaKey;
 if(e.key==='F12'||(c&&e.shiftKey&&['i','j','c','k'].indexOf(k)>-1)||(c&&k==='u')||(e.metaKey&&e.altKey&&['i','j','c','u'].indexOf(k)>-1)){e.preventDefault();e.stopPropagation();return false}
},true);
