/* Desktop only: "Email Me" opens Gmail compose in a new tab. Phones/tablets keep the native mailto (opens Gmail app). */
(()=>{
const desktop=window.matchMedia('(hover:hover) and (pointer:fine)').matches&&!/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
if(!desktop)return;
document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{
const to=a.getAttribute('href').replace(/^mailto:/i,'').split('?')[0];
a.href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(to);
a.target='_blank';a.rel='noopener';
});
})();
