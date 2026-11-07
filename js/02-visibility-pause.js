/* run background animations only while visible */
(()=>{const els=document.querySelectorAll('.ani');if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('on'));return}
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('on',e.isIntersecting)),{rootMargin:'80px'});els.forEach(e=>io.observe(e))})();
