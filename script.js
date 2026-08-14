/* ── MATRIX RAIN (full page background) ── */
const mc=document.getElementById('matrixCanvas');
mc.width=window.innerWidth;mc.height=window.innerHeight;
window.addEventListener('resize',()=>{mc.width=window.innerWidth;mc.height=window.innerHeight;});
const ctx2=mc.getContext('2d');

const PARTICLE_COUNT = 280;
const particles = [];
function mkParticle(x){
  return {
    x: x !== undefined ? x : Math.random()*mc.width,
    y: Math.random()*mc.height,
    speed: 0.4 + Math.random()*2.2,
    fontSize: 9 + Math.floor(Math.random()*10),
    opacity: 0.2 + Math.random()*0.8,
    char: ()=> Math.random()<0.7 ? (Math.random()<0.5?'0':'1') : String.fromCharCode(0x30A0+Math.random()*96),
    drift: (Math.random()-0.5)*0.3,
    glitch: Math.random()<0.08,
    timer: Math.floor(Math.random()*40)
  };
}
for(let i=0;i<PARTICLE_COUNT;i++) particles.push(mkParticle());

function drawMatrix(){
  ctx2.clearRect(0,0,mc.width,mc.height);
  particles.forEach(p=>{
    p.timer--;
    if(p.timer<=0){
      p.currentChar = p.char();
      p.timer = 8 + Math.floor(Math.random()*30);
    }
    const col = p.glitch && Math.random()>0.92 ? '#ffffff' : Math.random()>0.9 ? '#f3f3f3' : '#d8d8d8';
    ctx2.globalAlpha = p.opacity;
    ctx2.fillStyle = col;
    ctx2.font = `${p.fontSize}px monospace`;
    ctx2.fillText(p.currentChar||'1', p.x, p.y);
    ctx2.globalAlpha = 1;
    p.y += p.speed;
    p.x += p.drift;
    if(p.y > mc.height + 20){
      p.y = -20;
      p.x = Math.random()*mc.width;
      p.speed = 0.4 + Math.random()*2.2;
      p.opacity = 0.2 + Math.random()*0.8;
      p.drift = (Math.random()-0.5)*0.3;
    }
  });
}
setInterval(drawMatrix,40);

/* ── PROGRESS ── */
window.addEventListener('scroll',()=>{
  const pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  document.getElementById('progressBar').style.width=pct+'%';
  if(window.scrollY>200)unlock('[+]','Explorer');
  if(window.scrollY>1500)unlock('[+]','Deep Diver');
  if(pct>98)unlock('[OK]','Completionist');
});

/* ── CINEMATIC VIDEO ── */
const cinematicVideo=document.querySelector('.cinematic-video');
if(cinematicVideo){
  const vidObs=new IntersectionObserver(e=>{
    e.forEach(i=>{
      if(i.isIntersecting){cinematicVideo.play().catch(()=>{});}
      else{cinematicVideo.pause();}
    });
  },{threshold:0.25});
  vidObs.observe(cinematicVideo);
}

/* ── MISSION VIDEO LOOP (mobile-safe) ── */
const goalVideo=document.querySelector('.goal-video');
if(goalVideo){
  goalVideo.muted=true;
  goalVideo.loop=true;
  goalVideo.setAttribute('playsinline','true');
  goalVideo.setAttribute('webkit-playsinline','true');

  const startGoalVideo=()=>{
    goalVideo.muted=true;
    goalVideo.loop=true;
    goalVideo.play().catch(()=>{});
  };

  goalVideo.addEventListener('ended',()=>{
    goalVideo.currentTime=0;
    startGoalVideo();
  });

  goalVideo.addEventListener('pause',()=>{
    if(document.visibilityState==='visible') startGoalVideo();
  });

  ['loadeddata','canplay','loadedmetadata'].forEach(ev=>{
    goalVideo.addEventListener(ev, startGoalVideo, { once: true });
  });

  const resumeGoalVideo=()=>{
    startGoalVideo();
    document.removeEventListener('pointerdown', resumeGoalVideo);
    document.removeEventListener('touchstart', resumeGoalVideo);
  };

  document.addEventListener('pointerdown', resumeGoalVideo, { once: true });
  document.addEventListener('touchstart', resumeGoalVideo, { once: true });
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible') startGoalVideo();
  });
}

/* ── TYPED HERO ── */
const words=['FRONT-END DEVELOPER','IT STUDENT','GAMER','CREATIVE BUILDER','ALWAYS LEARNING'];
let wi=0,ci=0,del=false;
function typeHero(){
  const el=document.getElementById('typedHero');
  const w=words[wi];
  if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length){del=true;setTimeout(typeHero,1400);return;}}
  else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length;}}
  setTimeout(typeHero,del?45:90);
}
typeHero();

/* ── STAT COUNTERS ── */
const sObs=new IntersectionObserver(e=>{e.forEach(i=>{if(i.isIntersecting){animN(i.target);sObs.unobserve(i.target);}});},{threshold:0.5});
document.querySelectorAll('[data-target]').forEach(el=>sObs.observe(el));
function animN(el){const t=+el.dataset.target;let c=0;const iv=setInterval(()=>{c=Math.min(c+1,t);el.textContent=c;if(c>=t)clearInterval(iv);},80);}

/* ── FADE IN ── */
const fObs=new IntersectionObserver(e=>{e.forEach(i=>{if(i.isIntersecting)i.target.classList.add('visible');});},{threshold:0.08});
document.querySelectorAll('.fade-in').forEach(el=>fObs.observe(el));

/* ── ACHIEVEMENTS ── */
const done=new Set();let achT=null;
function unlock(icon,title){
  if(done.has(title))return;done.add(title);
  document.getElementById('achIcon').textContent=icon;
  document.getElementById('achTitle').textContent=title;
  const p=document.getElementById('achPopup');p.classList.add('show');
  clearTimeout(achT);achT=setTimeout(()=>p.classList.remove('show'),3200);
}

/* ── TOAST ── */
function toast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600);
}

/* ── MOOD ── */
function setMood(btn,who,resp){
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('moodResp').textContent=resp;
  unlock('[:]','Mood Shared');
}

/* ── EXPAND CARD (interests, hobbies, games) ── */
function expandCard(el,icon,title,desc){
  const isOpen=el.classList.contains('open');
  el.closest('.int-grid,.hob-grid,.game-grid').querySelectorAll('.open').forEach(c=>c.classList.remove('open'));
  if(!isOpen){
    el.classList.add('open');
    el.querySelector('.card-drawer').textContent=desc;
    unlock(icon,title);
  }
}

/* ── EXPAND MOVIE ── */
function expandMovie(el,icon,title,filmTitle,meta,desc){
  const isOpen=el.classList.contains('open');
  document.querySelectorAll('.movie-card.open').forEach(m=>m.classList.remove('open'));
  if(!isOpen){
    el.classList.add('open');
    el.querySelector('.movie-drawer').textContent='> '+desc;
    unlock(icon,title);
  }
}

/* ── SECRET WORD ── */
let sec='';
document.addEventListener('keydown',e=>{
  if(e.key.length===1){sec=(sec+e.key.toLowerCase()).slice(-6);if(sec==='adrian'){unlock('[SHH]','Secret Found');toast('> you typed your own name lol [lol]');document.body.style.filter='brightness(1.3)';setTimeout(()=>document.body.style.filter='',600);}}
});

/* ── LOGO CLICK x5 ── */
let lc=0,lt=null;
document.querySelector('.nav-logo').addEventListener('click',()=>{
  lc++;clearTimeout(lt);lt=setTimeout(()=>lc=0,1800);
  if(lc>=5){lc=0;unlock('[HSE]','Logo Clicker');toast('> ok you really clicked that 5 times bro [!!]');}
});

/* ── HAMBURGER ── */
function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  m.classList.toggle('open');
}
if(window.innerWidth<=700){
  document.getElementById('hamburger').style.display='flex';
}
window.addEventListener('resize',()=>{
  const h=document.getElementById('hamburger');
  h.style.display=window.innerWidth<=700?'flex':'none';
  if(window.innerWidth>700)document.getElementById('mobileMenu').classList.remove('open');
});
