// Pointer input stays separate from keyboard state, including on hybrid devices.
export function stickVector(dx,dy,radius=44,deadZone=8){
 const distance=Math.hypot(dx,dy);
 if(distance<=deadZone)return {x:0,y:0};
 const strength=Math.min(1,(distance-deadZone)/(radius-deadZone));
 return {x:dx/distance*strength,y:dy/distance*strength};
}

export function bindJoystick(element,onMove){
 let pointer=null,center=null;
 function move(e){
  if(e.pointerId!==pointer)return;
  const dx=e.clientX-center.x,dy=e.clientY-center.y,radius=center.radius;
  const v=stickVector(dx,dy,radius,Math.min(8,radius/4));
  element.style.setProperty('--stick-x',v.x*radius+'px');
  element.style.setProperty('--stick-y',v.y*radius+'px');
  onMove(v);
 }
 function reset(){
  const previous=pointer;pointer=null;center=null;
  if(previous!==null&&element.hasPointerCapture(previous))element.releasePointerCapture(previous);
  element.style.setProperty('--stick-x','0px');element.style.setProperty('--stick-y','0px');
  element.classList.remove('held');onMove({x:0,y:0});
 }
 function down(e){
  if(pointer!==null||e.button!==0)return;
  e.preventDefault();const rect=element.getBoundingClientRect();
  pointer=e.pointerId;center={x:rect.left+rect.width/2,y:rect.top+rect.height/2,radius:rect.width*.34};
  element.setPointerCapture(pointer);element.classList.add('held');move(e);
 }
 function up(e){if(e.pointerId===pointer)reset();}
 element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);
 for(const event of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(event,up);
 return {reset};
}

export function createTouchControls(hooks){
 const $=id=>document.getElementById(id),media=matchMedia('(any-pointer: coarse)');
 let mode='auto',seenTouch=false,enabled=false,movement={x:0,y:0},running=false;
 try{const saved=hooks.storage.getItem('luke-touch-controls');if(['auto','on','off'].includes(saved))mode=saved;}catch{}
 const joystick=bindJoystick($('touch-stick'),v=>{movement=v;if(v.x||v.y)hooks.move();});
 function reset(){joystick.reset();running=false;$('touch-run').setAttribute('aria-pressed','false');}
 function apply(){
  enabled=mode==='on'||mode==='auto'&&(media.matches||seenTouch);
  document.documentElement.classList.toggle('touch-mode',enabled);reset();hooks.reset();
 }
 function setMode(value){mode=['auto','on','off'].includes(value)?value:'auto';try{hooks.storage.setItem('luke-touch-controls',mode);}catch{}apply();}
 media.addEventListener('change',apply);
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!seenTouch){seenTouch=true;if(mode==='auto'&&!enabled)apply();}},{capture:true});
 $('touch-use').onclick=hooks.interact;$('touch-strike').onclick=hooks.work;$('touch-next').onclick=hooks.next;
 $('touch-run').onclick=()=>{running=!running;$('touch-run').setAttribute('aria-pressed',String(running));};
 $('zoom-in').onclick=()=>hooks.zoom(.1);$('zoom-out').onclick=()=>hooks.zoom(-.1);
 document.querySelector('.touch-controls').addEventListener('contextmenu',e=>e.preventDefault());
 function update(target,working){
  const resource=target&&['tree','rock','bunkerresource'].includes(target.type);
  const tool=target?.tool||(target?.type==='rock'?'pick':'axe');
  $('touch-strike').disabled=!resource&&!working;
  $('touch-strike').textContent=working?'Stop':resource?(tool==='axe'?'Chop':'Mine'):'Work';
  $('touch-strike').setAttribute('aria-pressed',String(!!working));
  $('touch-use').disabled=!target||!!resource;
  $('touch-use').textContent=target?.type==='npc'?'Talk':target?.type==='structure'?'Use':target&&['loose','fiber','berries','mushrooms','sap','growtray','bunkergarden','rareplant'].includes(target.type)?'Gather':'Interact';
 }
 apply();
 return {get enabled(){return enabled;},get mode(){return mode;},get movement(){return movement;},get running(){return running;},setMode,reset,update};
}
