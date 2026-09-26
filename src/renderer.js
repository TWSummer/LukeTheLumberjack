import {REGIONS,random,TREE_TIERS,ROCK_TIERS} from './data.js';
import {WORLD,TRAILS,CAMP,BRIDGE,riverX,zoneAt} from './world.js';
import {BUILDABLES,bounds,pointInBounds} from './construction.js';
import {drawStructure} from './building-renderer.js';
import {SpriteArt} from './sprite-art.js';
import {BUNKER,MOONBELL} from './story-data.js';
import {olgaPosition} from './construction.js';
import {drawBunkerTerrain,drawBunkerMap} from './story-art.js';

export class Renderer extends SpriteArt {
 constructor(canvas,state,nodes){super();Object.assign(this,{canvas,ctx:canvas.getContext('2d'),state,nodes,zoom:1.1,time:0,walking:false,facing:1,action:null,nearest:null,placement:null,particles:[],treeCache:new Map(),tiles:new Map(),reduceMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});new ResizeObserver(()=>this.resize()).observe(canvas);this.resize();}
 resize(){const r=this.canvas.getBoundingClientRect();this.width=r.width;this.height=r.height;this.canvas.width=Math.round(r.width);this.canvas.height=Math.round(r.height);this.ctx.imageSmoothingEnabled=false;}
 transform(){const scale=this.zoom,w=this.width,h=this.height,vw=w/scale,vh=h/scale;const area=this.state.scene==='bunker'?BUNKER:WORLD,clamp=(p,v,max)=>v>=max?max/2:Math.max(v/2,Math.min(max-v/2,p));const x=clamp(this.state.player.x,vw,area.width),y=this.state.scene==='bunker'?this.state.player.y-35:clamp(this.state.player.y+(this.placement?90:-35),vh,area.height);return {scale,ox:w/2-x*scale,oy:h/2-y*scale,left:x-vw/2,right:x+vw/2,top:y-vh/2,bottom:y+vh/2};}
 toWorld(clientX,clientY){const r=this.canvas.getBoundingClientRect(),t=this.transform();return {x:(clientX-r.left-t.ox)/t.scale,y:(clientY-r.top-t.oy)/t.scale};}
 visible(){return true;}
 burst(x,y,color,count=9){if(this.reduceMotion)return;for(let i=0;i<count;i++)this.particles.push({x,y:y-16,vx:(Math.random()-.5)*100,vy:-40-Math.random()*60,life:.8,color});}
 tile(tx,ty){const key=tx+','+ty;if(this.tiles.has(key))return this.tiles.get(key);const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const c=canvas.getContext('2d'),rng=random(tx*9381+ty*2917+829);c.fillStyle='#a3b27b';c.fillRect(0,0,512,512);const tones=['#a9b981','#98ad74','#afbb83','#9faf75'];for(let i=0;i<100;i++){c.fillStyle=tones[i%4];c.beginPath();c.ellipse(rng()*512,rng()*512,20+rng()*90,10+rng()*35,0,0,Math.PI*2);c.fill();}
  for(let i=0;i<800;i++){c.fillStyle=i%3?'#d8db9b55':'#657e4d35';c.fillRect(Math.floor(rng()*512),Math.floor(rng()*512),2+rng()*3,1+rng()*3);}
  c.save();c.translate(-tx*512,-ty*512);c.lineCap='round';c.lineJoin='round';for(const path of TRAILS){c.beginPath();path.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineWidth=94;c.strokeStyle='#919e6a40';c.stroke();c.lineWidth=76;c.strokeStyle='#c1b785';c.stroke();c.lineWidth=49;c.strokeStyle='#cbbd8e';c.stroke();}
  c.beginPath();for(let y=-100;y<WORLD.height+150;y+=50)y===-100?c.moveTo(riverX(y),y):c.lineTo(riverX(y),y);for(const [w,color]of [[218,'#7f986e'],[193,'#b9c69c'],[180,'#689e98'],[143,'#81b3a6'],[93,'#8bbdac']]){c.lineWidth=w;c.strokeStyle=color;c.stroke();}c.restore();
  this.tiles.set(key,canvas);if(this.tiles.size>110)this.tiles.delete(this.tiles.keys().next().value);return canvas;
 }
 drawCrossing(c){const {x,y,width:w,height:h}=BRIDGE;c.save();c.translate(x,y);c.fillStyle='#4b685344';c.fillRect(-w/2-8,-h/2+9,w+16,h+10);for(let dx=-w/2;dx<w/2;dx+=12){if(!this.state.bridge&&Math.abs(dx)<53)continue;c.fillStyle=Math.round(dx)%24?'#c7a975':'#d3b680';c.fillRect(dx,-h/2,10,h);}for(const yy of [-h/2,h/2]){c.fillStyle='#877346';for(const xx of [-w/2,-w/2+58,w/2-58,w/2])c.fillRect(xx,yy-17,6,28);if(this.state.bridge){c.fillStyle='#e2c890';c.fillRect(-w/2,yy-15,w,5);}}if(!this.state.bridge)this.label(c,-142,-69,'BROKEN CROSSING');c.restore();}
 draw(dt){this.time+=dt;const c=this.ctx,t=this.transform();c.setTransform(1,0,0,1,0,0);c.fillStyle='#a2b17c';c.fillRect(0,0,this.width,this.height);c.setTransform(t.scale,0,0,t.scale,t.ox,t.oy);
  if(this.state.scene==='bunker'){c.fillStyle='#253a36';c.fillRect(t.left,t.top,t.right-t.left,t.bottom-t.top);drawBunkerTerrain(c,this.state,t);}else{
  for(let x=Math.floor(t.left/512);x<=Math.floor(t.right/512);x++)for(let y=Math.floor(t.top/512);y<=Math.floor(t.bottom/512);y++)c.drawImage(this.tile(x,y),x*512,y*512);
  this.drawCrossing(c);}
  const visible=this.nodes.filter(n=>n.x>t.left-180&&n.x<t.right+180&&n.y>t.top-70&&n.y<t.bottom+350);
  for(const n of visible.filter(n=>n.type==='structure'&&BUILDABLES[n.kind].layer==='floor'))drawStructure(this,c,n);
  if(this.nearest){const n=this.nearest;c.strokeStyle='#fff2b9';c.lineWidth=2;c.beginPath();c.ellipse(n.x,n.y+2,n.type==='tree'?18+n.tier*5:28,11,0,0,Math.PI*2);c.stroke();}
  const sorted=visible.filter(n=>!(n.type==='structure'&&BUILDABLES[n.kind].layer));sorted.push({...this.state.player,type:'player'});sorted.sort((a,b)=>a.y-b.y);for(const n of sorted)n.type==='player'?this.person(c,n.x,n.y):this.drawNode(c,n);
  for(const n of visible.filter(n=>n.type==='structure'&&BUILDABLES[n.kind].layer==='roof'))drawStructure(this,c,n);
  for(const o of this.state.scene==='bunker'?[]:this.state.structures){if(o.x<t.left-100||o.x>t.right+100||o.y<t.top||o.y>t.bottom+100)continue;if(o.jobs.length)this.label(c,o.x,o.y-bounds(o).h/2-64,o.jobs.some(j=>j.status==='ready')?'✓ READY · E':'◷ WORKING',o.jobs.some(j=>j.status==='ready')?'#f2dda0':'#e0e8c8');}
  if(this.nearest&&['tree','rock','bunkerresource'].includes(this.nearest.type)){const n=this.nearest,def=n.type==='bunkerresource'?n:(n.type==='tree'?TREE_TIERS:ROCK_TIERS)[n.tier],damage=(n.type==='bunkerresource'?this.state.bunker.damage[n.id]:this.state.damage[n.id])||0;if(damage){c.fillStyle='#2b463ddd';c.fillRect(n.x-28,n.y+15,56,6);c.fillStyle='#eac586';c.fillRect(n.x-27,n.y+16,54*(1-damage/def.hp),4);}}
  if(this.placement){const p=this.placement,b=bounds(p);if(p.snap){c.strokeStyle='#f8f1c32b';c.lineWidth=1;c.beginPath();for(let x=Math.floor((p.x-170)/24)*24;x<p.x+170;x+=24){c.moveTo(x,p.y-160);c.lineTo(x,p.y+160);}for(let y=Math.floor((p.y-160)/24)*24;y<p.y+160;y+=24){c.moveTo(p.x-170,y);c.lineTo(p.x+170,y);}c.stroke();}c.save();c.globalAlpha=.68;drawStructure(this,c,p,true);c.restore();c.strokeStyle=p.error?'#d78269':'#fff3b6';c.lineWidth=3;c.strokeRect(b.left,b.top,b.w,b.h);}
  for(const p of this.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=150*dt;c.globalAlpha=Math.max(0,p.life);c.fillStyle=p.color;c.fillRect(p.x,p.y,4,4);}c.globalAlpha=1;this.particles=this.particles.filter(p=>p.life>0);
 }
}
export function drawMap(canvas,s,mini=false){if(s.scene==='bunker')return drawBunkerMap(canvas,s,mini);const c=canvas.getContext('2d');const w=canvas.width,h=canvas.height,sx=w/WORLD.width,sy=h/WORLD.height;c.clearRect(0,0,w,h);c.fillStyle='#91a77b';c.fillRect(0,0,w,h);c.save();c.scale(sx,sy);c.lineWidth=65;c.strokeStyle='#d4c291';for(const path of TRAILS){c.beginPath();path.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}c.beginPath();for(let y=0;y<=WORLD.height;y+=70)y?c.lineTo(riverX(y),y):c.moveTo(riverX(y),y);c.lineWidth=180;c.strokeStyle='#507e7d';c.stroke();c.fillStyle=s.bridge?'#e9cc8d':'#b37052';c.fillRect(BRIDGE.x-145,BRIDGE.y-45,290,90);c.restore();
 for(const [id,r]of Object.entries(REGIONS)){const x=r.x*sx,y=r.y*sy;c.fillStyle=s.visited[id]?'#f5ebc3':'#c5cfa7';c.beginPath();c.arc(x,y,mini?2.5:5,0,Math.PI*2);c.fill();if(!mini){c.font='13px Georgia';c.textAlign='center';c.fillStyle='#243f34';c.fillText(r.name,x,y-12);}}
 const olga=olgaPosition(s);c.fillStyle='#e8be84';c.beginPath();c.arc(olga.x*sx,olga.y*sy,mini?3:5,0,Math.PI*2);c.fill();if(!mini){c.font='12px Georgia';c.textAlign='center';c.fillStyle='#3d4d3b';c.fillText(s.olga.step===2&&s.olga.active?'Olga · picnic':'Olga',olga.x*sx,olga.y*sy+18);if(s.olga.step===1){c.textAlign='right';c.fillText('Moonbell hollow',MOONBELL.x*sx,MOONBELL.y*sy);}}
 for(const o of s.structures){c.fillStyle=o.kind==='tent'?'#ffe1a2':o.jobs.some(j=>j.status==='ready')?'#ffe893':'#e2d9b2';c.fillRect(o.x*sx-2,o.y*sy-2,4,4);}
 c.fillStyle='#263e34';c.beginPath();c.arc(s.player.x*sx,s.player.y*sy,mini?5:7,0,Math.PI*2);c.fill();c.fillStyle='#fff0b9';c.beginPath();c.arc(s.player.x*sx,s.player.y*sy,mini?3:4,0,Math.PI*2);c.fill();
}
