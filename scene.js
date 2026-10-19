// CSS 3D geometry with one SVG route shared by the road and the moving truck.
(() => {
 const card=document.querySelector('.hero-art-3d');
 if(!card)return;
 const path=card.querySelector('#truck-route'),truck=card.querySelector('#route-truck');
 const hint=card.querySelector('#scene-instruction');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const length=path.getTotalLength();
 let distance=0,previous=0,frame=0,hovering=false,pinned=false,focused=false;
 const place=()=>{const p=path.getPointAtLength(distance),ahead=path.getPointAtLength((distance+1)%length);const angle=Math.atan2(ahead.y-p.y,ahead.x-p.x)*180/Math.PI;truck.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${angle})`);};
 function tick(now){if(previous)distance=(distance+Math.min(now-previous,50)*.075)%length;previous=now;place();frame=requestAnimationFrame(tick);}
 function sync(){const active=hovering||pinned||focused;card.classList.toggle('route-running',active);card.setAttribute('aria-pressed',String(pinned));hint.textContent=active?'В пути · каждый километр ближе':'Наведите — отправим груз в путь';if(active&&!reduced.matches&&!document.hidden){if(!frame){previous=0;frame=requestAnimationFrame(tick);}}else{cancelAnimationFrame(frame);frame=0;previous=0;}}
 const resize=()=>{const r=card.getBoundingClientRect();card.style.setProperty('--world-scale',Math.min(r.width/720,r.height/570));};
 new ResizeObserver(resize).observe(card);resize();place();
 card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;sync();}});
 card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduced.matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--scene-x',`${53-y*10}deg`);card.style.setProperty('--scene-z',`${-28+x*9}deg`);card.style.setProperty('--scene-y',`${x*7}deg`);card.style.setProperty('--shine-x',`${(x+.5)*100}%`);card.style.setProperty('--shine-y',`${(y+.5)*100}%`);});
 card.addEventListener('pointerleave',()=>{hovering=false;card.style.setProperty('--scene-x','53deg');card.style.setProperty('--scene-z','-28deg');card.style.setProperty('--scene-y','0deg');sync();});
 card.addEventListener('click',()=>{focused=false;pinned=!pinned;sync();});
 card.addEventListener('focus',()=>{focused=card.matches(':focus-visible');sync();});
 card.addEventListener('blur',()=>{focused=false;pinned=false;sync();});
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pinned=!pinned;focused=false;sync();}if(e.key==='Escape'){pinned=false;focused=false;hovering=false;sync();}});
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
})();
