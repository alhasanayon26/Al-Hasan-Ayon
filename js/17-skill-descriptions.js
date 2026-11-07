(()=>{
const D={
'C':'A fast, low-level language. I use it to understand how programs really work: memory, pointers and control flow.',
'C++':'C with objects and a rich standard library. I use it for problem solving, data structures and learning OOP.',
'HTML':'The structure behind every web page. I use it to build clean, semantic layouts for my projects.',
'Bangla (Native)':'My mother tongue, spoken and written with full native fluency.',
'English (Fluent)':'I read, write and speak it comfortably, for study, documentation and working with global tools.',
'Hindi/Urdu (Conversational)':'I can follow and hold everyday conversations in both, though not at a professional level.',
'GitHub':'Where I host my projects and track every change with Git. My code lives and gets shared here.',
'MS Word':'I use it for reports, assignments and neatly formatted documents.',
'PowerPoint':'I build clear, simple presentations for class and project work.',
'Excel':'Spreadsheets for organizing data, using formulas and doing quick calculations.',
'Google Workspace':'Docs, Sheets, Slides and Drive for creating and collaborating in the cloud.',
'Photography':'Capturing moments with a technical and an artistic eye.',
'Videography':'Shooting video with attention to framing, light and storytelling.',
'Video editing':'Turning raw footage into a polished story through pacing, transitions and sound.',
'Problem Solving':'Breaking a hard problem into small steps and finding a clean solution.',
'Debugging':'Tracking down why code misbehaves and fixing the root cause, not just the symptom.',
'Technical Documentation':'Writing clear READMEs and guides so others can understand and use my work.'};
document.querySelectorAll('.sk .glass').forEach(card=>{
 const tags=card.querySelector('.tags');if(!tags)return;
 const box=document.createElement('div');box.className='sk-desc';box.setAttribute('aria-live','polite');
 box.innerHTML='<div><div class="in"><b></b><p></p></div></div>';tags.after(box);
 const hb=box.querySelector('b'),hp=box.querySelector('p');let cur=null,tm=0;
 const chips=[...tags.children];
 chips.forEach(c=>{c.setAttribute('role','button');c.tabIndex=0;c.setAttribute('aria-expanded','false')});
 function close(){clearTimeout(tm);box.classList.remove('swap');if(cur){cur.classList.remove('on');cur.setAttribute('aria-expanded','false')}cur=null;box.classList.remove('open')}
 function pick(c){
  const k=c.textContent.trim(),d=D[k];if(!d)return;
  if(cur===c){close();return}
  const wasOpen=!!cur;
  if(cur){cur.classList.remove('on');cur.setAttribute('aria-expanded','false')}
  cur=c;c.classList.add('on');c.setAttribute('aria-expanded','true');
  const fill=()=>{hb.textContent=k;hp.textContent=d;box.classList.add('open')};
  clearTimeout(tm);
  if(wasOpen){box.classList.add('swap');tm=setTimeout(()=>{hb.textContent=k;hp.textContent=d;void box.offsetWidth;box.classList.remove('swap')},170)}else fill();
 }
 tags.addEventListener('click',e=>{const c=e.target.closest('span');if(c&&tags.contains(c))pick(c)});
 tags.addEventListener('keydown',e=>{const c=e.target.closest('span');if(!c)return;
  if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(c)}else if(e.key==='Escape')close()});
});
})();
