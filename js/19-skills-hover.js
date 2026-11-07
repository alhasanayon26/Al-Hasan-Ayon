(()=>{const root=document.getElementById('skills');if(!root)return;
root.addEventListener('pointermove',e=>{const t=e.target.closest&&e.target.closest('.it');if(!t)return;const r=t.getBoundingClientRect();t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('go');io.unobserve(x.target)}}),{threshold:.3});
root.querySelectorAll('.sxt').forEach(t=>io.observe(t));
const io2=new IntersectionObserver(es=>es.forEach(x=>x.target.classList.toggle('vis',x.isIntersecting)),{rootMargin:'40px'});root.querySelectorAll('.sxt').forEach(t=>io2.observe(t));
})();
