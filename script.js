/* ── MATRIX RAIN (full page background) ── */
const mc=document.getElementById('matrixCanvas');
mc.width=window.innerWidth;mc.height=window.innerHeight;
window.addEventListener('resize',()=>{mc.width=window.innerWidth;mc.height=window.innerHeight;});
const ctx2=mc.getContext('2d');

// Organic particles — each has its own x, y, speed, size, opacity
const PARTICLE_COUNT = 280;
const particles = [];
function mkParticle(x){
  return {
    x: x !== undefined ? x : Math.random()*mc.width,
    y: Math.random()*mc.height,
    speed: 0.4 + Math.random()*2.2,
    fontSize: 9 + Math.floor(Math.random()*10),
    opacity: 0.15 + Math.random()*0.65,
    char: ()=> Math.random()<0.6 ? (Math.random()<0.5?'0':'1') : String.fromCharCode(0x30A0+Math.random()*96),
    drift: (Math.random()-0.5)*0.3,  // slight horizontal drift
    glitch: Math.random()<0.08,       // some chars glitch brighter
    timer: Math.floor(Math.random()*40)
  };
}
for(let i=0;i<PARTICLE_COUNT;i++) particles.push(mkParticle());

function drawMatrix(){
  ctx2.clearRect(0,0,mc.width,mc.height);
  particles.forEach(p=>{
    p.timer--;
    if(p.timer<=0){
      // pick new char on timer
      p.currentChar = p.char();
      p.timer = 8 + Math.floor(Math.random()*30);
    }
    const col = p.glitch && Math.random()>0.92 ? '#caffb9' : Math.random()>0.85 ? '#00ff41' : '#009922';
    ctx2.globalAlpha = p.opacity;
    ctx2.fillStyle = col;
    ctx2.font = `${p.fontSize}px monospace`;
    ctx2.fillText(p.currentChar||'1', p.x, p.y);
    ctx2.globalAlpha = 1;
    // move down with slight drift
    p.y += p.speed;
    p.x += p.drift;
    // reset when off screen
    if(p.y > mc.height + 20){
      p.y = -20;
      p.x = Math.random()*mc.width;
      p.speed = 0.4 + Math.random()*2.2;
      p.opacity = 0.15 + Math.random()*0.65;
      p.drift = (Math.random()-0.5)*0.3;
    }
  });
}
setInterval(drawMatrix,40);

/* ── PROGRESS ── */
window.addEventListener('scroll',()=>{
  const pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  document.getElementById('progressBar').style.width=pct+'%';
  if(window.scrollY>200)unlock('🧭','Explorer');
  if(window.scrollY>1500)unlock('🏊','Deep Diver');
  if(pct>98)unlock('✅','Completionist');
});

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

/* ── SKILL BARS ── */
const skObs=new IntersectionObserver(e=>{e.forEach(i=>{if(i.isIntersecting){i.target.querySelector('.s-fill').style.width=i.target.dataset.pct+'%';skObs.unobserve(i.target);}});},{threshold:0.3});
document.querySelectorAll('.skill-item').forEach(el=>skObs.observe(el));

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
  unlock('😊','Mood Shared');
}

/* ── EXPAND CARD (interests, hobbies, games) ── */
function expandCard(el,icon,title,desc){
  const isOpen=el.classList.contains('open');
  // close all same-type siblings
  el.closest('.int-grid,.hob-grid,.game-grid').querySelectorAll('.open').forEach(c=>c.classList.remove('open'));
  if(!isOpen){
    el.classList.add('open');
    el.querySelector('.card-drawer').textContent=desc;
    unlock(icon,title);
  }
}

/* ── EXPAND SKILL ── */
function expandSkill(el,icon,title,desc){
  const isOpen=el.classList.contains('open');
  document.querySelectorAll('.skill-item.open').forEach(s=>s.classList.remove('open'));
  if(!isOpen){
    el.classList.add('open');
    el.querySelector('.skill-detail').textContent=desc;
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
  if(e.key.length===1){sec=(sec+e.key.toLowerCase()).slice(-6);if(sec==='adrian'){unlock('🤫','Secret Found');toast('> you typed your own name lol 😂');document.body.style.filter='brightness(1.3)';setTimeout(()=>document.body.style.filter='',600);}}
});

/* ── LOGO CLICK x5 ── */
let lc=0,lt=null;
document.querySelector('.nav-logo').addEventListener('click',()=>{
  lc++;clearTimeout(lt);lt=setTimeout(()=>lc=0,1800);
  if(lc>=5){lc=0;unlock('🏠','Logo Clicker');toast('> ok you really clicked that 5 times bro 😭');}
});

/* ── SNAKE GAME ── */
const sc=document.getElementById('snakeCanvas');
const sctx=sc.getContext('2d');
const CELL=16,COLS=20,ROWS=15;
let snake,dir,food,running,snakeTimer,score,hiScore=0;

function resetSnake(){
  snake=[{x:10,y:7},{x:9,y:7},{x:8,y:7}];
  dir={x:1,y:0};score=0;running=false;
  clearInterval(snakeTimer);
  placeFood();drawSnake();
  document.getElementById('snakeScore').textContent=0;
}

function placeFood(){
  do{food={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}
  while(snake.some(s=>s.x===food.x&&s.y===food.y));
}

function drawSnake(){
  sctx.fillStyle='#000';sctx.fillRect(0,0,sc.width,sc.height);
  // grid
  sctx.strokeStyle='#0a1a0a';sctx.lineWidth=0.5;
  for(let x=0;x<=COLS;x++){sctx.beginPath();sctx.moveTo(x*CELL,0);sctx.lineTo(x*CELL,ROWS*CELL);sctx.stroke();}
  for(let y=0;y<=ROWS;y++){sctx.beginPath();sctx.moveTo(0,y*CELL);sctx.lineTo(COLS*CELL,y*CELL);sctx.stroke();}
  // food
  sctx.fillStyle='#ff3333';sctx.shadowColor='#ff3333';sctx.shadowBlur=8;
  sctx.fillRect(food.x*CELL+2,food.y*CELL+2,CELL-4,CELL-4);
  sctx.shadowBlur=0;
  // snake
  snake.forEach((seg,i)=>{
    sctx.fillStyle=i===0?'#00ff41':'#00aa2b';
    sctx.shadowColor='#00ff41';sctx.shadowBlur=i===0?10:4;
    sctx.fillRect(seg.x*CELL+1,seg.y*CELL+1,CELL-2,CELL-2);
  });
  sctx.shadowBlur=0;
  if(!running&&score===0){
    sctx.fillStyle='rgba(0,0,0,0.7)';sctx.fillRect(0,0,sc.width,sc.height);
    sctx.fillStyle='#00ff41';sctx.font='bold 12px "Press Start 2P",monospace';
    sctx.textAlign='center';sctx.fillText('PRESS START',sc.width/2,sc.height/2);
    sctx.textAlign='left';
  }
}

function startSnake(){
  if(running)return;
  running=true;
  snakeTimer=setInterval(()=>{
    const head={x:(snake[0].x+dir.x+COLS)%COLS,y:(snake[0].y+dir.y+ROWS)%ROWS};
    if(snake.some(s=>s.x===head.x&&s.y===head.y)){
      running=false;clearInterval(snakeTimer);
      sctx.fillStyle='rgba(0,0,0,0.75)';sctx.fillRect(0,0,sc.width,sc.height);
      sctx.fillStyle='#ff3333';sctx.font='bold 12px "Press Start 2P",monospace';
      sctx.textAlign='center';sctx.fillText('GAME OVER',sc.width/2,sc.height/2-10);
      sctx.fillStyle='#00ff41';sctx.font='8px "Press Start 2P",monospace';
      sctx.fillText('SCORE: '+score,sc.width/2,sc.height/2+12);
      sctx.textAlign='left';
      if(score>hiScore){hiScore=score;document.getElementById('snakeHi').textContent=hiScore;unlock('🐍','Snake Master');}
      if(score>=5)unlock('🎮','Gamer Confirmed');
      return;
    }
    snake.unshift(head);
    if(head.x===food.x&&head.y===food.y){
      score++;document.getElementById('snakeScore').textContent=score;
      placeFood();
      if(score===10)unlock('🏆','Snake Legend');
    } else snake.pop();
    drawSnake();
  },130);
}

document.addEventListener('keydown',e=>{
  if(!running)return;
  const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
    w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};
  const nd=map[e.key];
  if(nd&&!(nd.x===-dir.x&&nd.y===-dir.y)){dir=nd;e.preventDefault();}
});

/* ── HAMBURGER ── */
function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  m.classList.toggle('open');
}
// show hamburger on mobile
if(window.innerWidth<=700){
  document.getElementById('hamburger').style.display='flex';
}
window.addEventListener('resize',()=>{
  const h=document.getElementById('hamburger');
  h.style.display=window.innerWidth<=700?'flex':'none';
  if(window.innerWidth>700)document.getElementById('mobileMenu').classList.remove('open');
  resizeCanvas();
});

/* ── CANVAS RESIZE FOR MOBILE ── */
function resizeCanvas(){
  const wrap=sc.parentElement;
  const maxW=wrap.clientWidth-32;
  if(maxW<320){
    const ratio=maxW/320;
    sc.style.width=maxW+'px';
    sc.style.height=(240*ratio)+'px';
  } else {
    sc.style.width='320px';
    sc.style.height='240px';
  }
}
resizeCanvas();

/* ── D-PAD TOUCH CONTROLS ── */
const isMobile=()=>window.innerWidth<=700||('ontouchstart' in window);
function showDpad(){if(isMobile())document.getElementById('dpad').style.display='grid';}
showDpad();
window.addEventListener('resize',showDpad);

function dpadDir(dx,dy){
  if(!running){startSnake();return;}
  const nd={x:dx,y:dy};
  if(!(nd.x===-dir.x&&nd.y===-dir.y))dir=nd;
}
document.getElementById('dUp').addEventListener('touchstart',e=>{e.preventDefault();dpadDir(0,-1);},{passive:false});
document.getElementById('dDown').addEventListener('touchstart',e=>{e.preventDefault();dpadDir(0,1);},{passive:false});
document.getElementById('dLeft').addEventListener('touchstart',e=>{e.preventDefault();dpadDir(-1,0);},{passive:false});
document.getElementById('dRight').addEventListener('touchstart',e=>{e.preventDefault();dpadDir(1,0);},{passive:false});
// also work on click for non-touch
document.getElementById('dUp').addEventListener('click',()=>dpadDir(0,-1));
document.getElementById('dDown').addEventListener('click',()=>dpadDir(0,1));
document.getElementById('dLeft').addEventListener('click',()=>dpadDir(-1,0));
document.getElementById('dRight').addEventListener('click',()=>dpadDir(1,0));

/* ── SWIPE TO CONTROL SNAKE ── */
let touchStartX=0,touchStartY=0;
sc.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;},{passive:true});
sc.addEventListener('touchend',e=>{
  if(!running)return;
  const dx=e.changedTouches[0].clientX-touchStartX;
  const dy=e.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)>Math.abs(dy)){
    dpadDir(dx>0?1:-1,0);
  } else {
    dpadDir(0,dy>0?1:-1);
  }
},{passive:true});

resetSnake();
/* ── BROKEN IMAGE FALLBACKS ── */
document.querySelectorAll('.movie-poster').forEach(img=>{
  img.addEventListener('error',function(){
    const map={'Good Dinosaur':'🦕','Matrix':'🔴','Fight Club':'🧼','Whiplash':'🥁','Social Network':'💻'};
    const emoji=map[this.alt]||'🎬';
    this.outerHTML=`<div class="movie-poster" style="background:#0a1a0a;display:flex;align-items:center;justify-content:center;font-size:1.6rem;border-right:1px solid var(--border);flex-shrink:0;">${emoji}</div>`;
  });
});
