import {BUNKER,BUNKER_FLOORS,BUNKER_WALLS,BUNKER_ROOMS,BUNKER_RESOURCES,BUNKER_GATES} from './bunker-data.js';
import {bunkerInactive,bunkerFootprint,bunkerRoomAt} from './bunker-geometry.js';
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
const visible=(r,v)=>!v||r.x+r.w>v.left-100&&r.x<v.right+100&&r.y+r.h>v.top-100&&r.y<v.bottom+100;
function lamp(c,x,y,on){const glow=c.createRadialGradient(x,y,3,x,y,70);glow.addColorStop(0,on?'#eed69042':'#b4cab528');glow.addColorStop(1,'#eed69000');c.fillStyle=glow;c.fillRect(x-70,y-70,140,140);rect(c,x-12,y-5,24,10,'#354b44');rect(c,x-9,y-3,18,5,on?'#efdb99':'#a2b9a4');}
function machine(c,x,y,w,h){rect(c,x+7,y+9,w,h,'#354c4366');rect(c,x,y,w,h,'#657b70');rect(c,x,y,w,7,'#a9b8a0');for(let i=13;i<w-10;i+=17)rect(c,x+i,y+15,7,h-27,'#425e55');rect(c,x+w-22,y+12,9,8,'#c4a779');}
function bed(c,x,y){rect(c,x-22,y-36,44,77,'#4e6053');rect(c,x-18,y-31,36,67,'#8a8267');rect(c,x-16,y-28,32,18,'#c2c2a5');rect(c,x-18,y+22,36,9,'#a29575');}
export function drawBunkerTerrain(c,s,view){
 for(const f of BUNKER_FLOORS){if(!visible(f,view))continue;rect(c,f.x-5,f.y-5,f.w+10,f.h+10,'#849181');rect(c,f.x,f.y,f.w,f.h,'#69796b');}
 for(const room of BUNKER_ROOMS){if(!visible(room,view))continue;
  const cave=['quarry','cistern','crystal'].includes(room.id);rect(c,room.x,room.y,room.w,room.h,room.color);
  const x0=Math.max(room.x,Math.floor((view?.left??room.x)/40)*40),y0=Math.max(room.y,Math.floor((view?.top??room.y)/40)*40),x1=Math.min(room.x+room.w,view?.right??Infinity),y1=Math.min(room.y+room.h,view?.bottom??Infinity);
  for(let x=x0;x<x1;x+=40)for(let y=y0;y<y1;y+=40){rect(c,x,y,cave?17:38,cave?3:38,cave?'#b4b49b19':'#a5b6a514');if(cave)rect(c,x+22,y+15,6,4,'#324c4328');}
  lamp(c,room.x+room.w/2,room.y+22,s.bunker.power);
  c.font='12px monospace';c.fillStyle='#e4dec09c';c.textAlign='center';c.fillText(room.name.toUpperCase(),room.x+room.w/2,room.y+room.h-35);
 }
 // The old living space is deliberately unchanged around saved player positions.
 rect(c,110,99,255,7,'#a88e68');rect(c,357,99,7,48,'#a88e68');rect(c,450,421,242,110,'#857758');
 for(let i=0;i<7;i++)rect(c,456+i*34,427,15,98,'#9d8d6777');rect(c,694,562,73,20,'#7b6e51');
 rect(c,468,531,47,48,'#685e49');rect(c,470,519,42,21,'#a09570');rect(c,465,533,9,35,'#a09570');rect(c,508,533,9,35,'#a09570');
 // Equipment along the walls tells each room's story; the center aisles stay legible.
 if(visible({x:924,y:84,w:676,h:576},view)){for(let i=0;i<3;i++){machine(c,960,140+i*150,60,60);rect(c,1018,160+i*150,47,5,'#b59c71');}rect(c,1230,110,110,42,'#b0966c');for(let i=0;i<6;i++)rect(c,1240+i*15,123,5,17,'#6b8075');}
 if(visible({x:1624,y:84,w:676,h:576},view)){machine(c,1860,105,210,88);rect(c,2080,133,100,13,'#ad9263');rect(c,2168,133,12,220,'#ad9263');for(let i=0;i<5;i++)rect(c,1770+i*77,380,42,9,'#d2b26755');lamp(c,1960,175,s.bunker.power);}
 if(visible({x:2324,y:84,w:676,h:576},view)){for(let row=0;row<3;row++)for(let col=0;col<3;col++){const x=2400+col*185,y=110+row*173;rect(c,x,y,96,35,'#596e68');for(let i=0;i<8;i++)rect(c,x+4+i*11,y+4,8,24,i%2?'#a99c74':'#879f94');}}
 if(visible({x:924,y:684,w:676,h:576},view)){for(const x of [1030,1250,1480])for(const y of [800,1140])bed(c,x,y);rect(c,1220,1020,120,46,'#a58c61');rect(c,1257,1027,45,20,'#e0c2a3');}
 if(visible({x:1624,y:684,w:676,h:576},view)){machine(c,1860,760,190,98);for(const x of [1710,2100]){rect(c,x,714,18,398,'#849d93');rect(c,x-4,738,26,10,'#afba9b');rect(c,x,1094,90,18,'#849d93');}lamp(c,1955,835,s.bunker.drained);}
 if(visible({x:2324,y:684,w:676,h:576},view)){for(const x of [2440,2790])for(let i=0;i<4;i++){rect(c,x,750+i*110,110,64,'#465d46');for(let j=0;j<7;j++){const xx=x+8+j*14,y=760+i*110;rect(c,xx,y,6,39,'#8ca274');rect(c,xx-3,y+7,12,5,'#bfd2a3');}}}
 if(visible({x:924,y:1284,w:676,h:652},view)){for(let y=1340;y<1860;y+=38){rect(c,1280,y,115,5,'#978768');}rect(c,1293,1330,4,552,'#b6b99d');rect(c,1378,1330,4,552,'#b6b99d');machine(c,1390,1350,90,52);}
 if(visible({x:1624,y:1284,w:676,h:652},view)){rect(c,1900,1380,225,390,s.bunker.drained?'#7c8270':'#446e78');for(let y=1400;y<1760;y+=32)rect(c,1910,y,204,3,s.bunker.drained?'#989a7d':'#80b4af77');rect(c,1730,1340,16,545,'#abc0a0');for(let y=1370;y<1860;y+=90)rect(c,1726,y,24,10,'#596e61');}
 if(visible({x:2324,y:1284,w:676,h:652},view)){for(let i=0;i<9;i++){const x=2360+i*74,y=1320+(i%3)*206;rect(c,x,y,7,29,'#b4d8d077');rect(c,x+9,y+13,5,20,'#91bdcc66');}lamp(c,2640,1630,true);}
 if(visible({x:3114,y:1384,w:492,h:476},view)){rect(c,3190,1430,140,75,'#627866');rect(c,3198,1438,124,55,'#cabd8a');c.strokeStyle='#7a967c';c.lineWidth=3;c.strokeRect(3215,1448,36,34);c.strokeRect(3260,1455,47,20);machine(c,3490,1740,65,64);}
 for(const b of BUNKER_WALLS){if(!visible(b,view))continue;rect(c,b.x+5,b.y+7,b.w,b.h,'#30483ed0');rect(c,b.x,b.y,b.w,b.h,'#96a08a');rect(c,b.x,b.y,b.w,4,'#b7c0a6');}
}
export function drawBunkerNode(r,c,n){const s=r.state,{x,y}=n;
 if(n.type==='bunkerresource'){
  if(bunkerInactive(s,n)){rect(c,x-19,y+2,12,4,'#6f7257');rect(c,x+5,y-1,16,5,'#909478');return true;}
  const b=bunkerFootprint(n);rect(c,b.x-3,b.y+5,b.w+6,b.h,'#2a453746');
  const shake=r.action?.node.id===n.id&&!r.reduceMotion?Math.sin(r.time*30)*2:0;c.save();c.translate(shake,0);
  if(n.kind==='timber'||n.kind==='crate'){
   rect(c,b.x,b.y-12,b.w,b.h+12,'#785f43');for(let yy=b.y-8;yy<b.y+b.h;yy+=14){rect(c,b.x+2,yy,b.w-4,10,'#b19363');rect(c,b.x+4,yy+2,b.w-9,2,'#d2b881');}
   if(b.w>b.h){rect(c,x-29,b.y-16,7,b.h+19,'#687c72');rect(c,x+21,b.y-16,7,b.h+19,'#687c72');}else{rect(c,b.x-2,y-25,b.w+4,7,'#687c72');rect(c,b.x-2,y+24,b.w+4,7,'#687c72');}
  }else{
   c.fillStyle=n.kind==='crystal'?'#8bb9c0':'#9c9e86';c.beginPath();c.moveTo(b.x,y+12);c.lineTo(b.x+7,b.y-10);c.lineTo(x+5,b.y-22);c.lineTo(b.x+b.w-3,b.y+4);c.lineTo(b.x+b.w,y+b.h/2);c.lineTo(x,y+b.h/2+4);c.closePath();c.fill();
   for(let i=0;i<4;i++){const xx=b.x+9+i*(b.w-16)/4;rect(c,xx,y-18+(i%2)*16,n.kind==='crystal'?9:12,n.kind==='crystal'?26:9,n.kind==='crystal'?'#c8e4d8':n.kind==='ore'?'#b98355':'#c2c6aa');}
  }c.restore();if(n.barrier)r.label(c,x,b.y-28,n.tool==='axe'?'AXE · CLEAR PASSAGE':'PICK · CLEAR PASSAGE','#d7c99c');return true;
 }
 if(n.type==='bunkergate'){
  const b=bunkerFootprint(n),open=s.bunker[n.flag];
  if(n.flag==='drained'){rect(c,b.x-4,b.y-4,b.w+8,b.h+8,open?'#8f967e':'#437b87');for(let i=0;i<4;i++)rect(c,b.x+5,b.y+4+i*(b.h-8)/4,b.w-10,2,open?'#b0af8d':'#8ec6c2');}
  else if(!open){rect(c,b.x,b.y-27,b.w,b.h+27,'#627976');for(let yy=b.y-20;yy<b.y+b.h;yy+=13)rect(c,b.x+2,yy,b.w-4,4,'#8e9b88');rect(c,x-7,y-10,14,12,'#d4a176');}
  else{rect(c,b.x-3,b.y-20,5,22,'#a6b394');rect(c,b.x+b.w-2,b.y+b.h-10,5,16,'#a6b394');}
  if(!open)r.label(c,x,b.y-43,n.flag==='drained'?'FLOODED':n.flag==='power'?'NO POWER':'RELEASE FROM EAST',n.flag==='drained'?'#b3d6d4':'#dbbb90');return true;
 }
 if(n.type==='bunkercontrol'){rect(c,x-36,y-30,72,39,'#4a685c');rect(c,x-33,y-33,66,7,'#b2bda3');rect(c,x-24,y-21,28,18,'#30483f');rect(c,x-20,y-17,20,8,s.bunker[n.action]?'#cbe4a7':'#d29a72');rect(c,x+14,y-21,12,12,'#c2b484');r.label(c,x,y-52,n.action==='power'?'GENERATOR · E':'DRAINAGE · E');return true;}
 if(n.type==='bunkernote'){rect(c,x-13,y-31,26,34,'#606e59');rect(c,x-10,y-28,20,26,'#dfd1a4');for(let i=0;i<4;i++)rect(c,x-7,y-23+i*5,14-i%2*4,2,'#8b886c');if(!s.bunker.read[n.note])r.label(c,x,y-43,'READ · E','#e4d9b4');return true;}
 if(n.type==='bunkergarden'){rect(c,x-50,y-10,100,32,'#38584a');for(let i=0;i<8;i++){const xx=x-41+i*11;rect(c,xx,y-24+i%2*10,3,30,'#94b494');rect(c,xx-4,y-28+i%2*10,11,7,'#bfe3bc');}r.label(c,x,y-52,'LIVING CULTURES · E','#c4dec0');return true;}
 return false;
}
export function drawBunkerMap(canvas,s,mini){
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,sx=w/BUNKER.width,sy=h/BUNKER.height;c.clearRect(0,0,w,h);rect(c,0,0,w,h,'#253d36');c.save();c.scale(sx,sy);
 for(const f of BUNKER_FLOORS)rect(c,f.x,f.y,f.w,f.h,'#4a6254');
 for(const room of BUNKER_ROOMS)rect(c,room.x,room.y,room.w,room.h,s.bunker.rooms[room.id]?room.color:'#344c41');
 for(const b of BUNKER_WALLS)rect(c,b.x,b.y,b.w,b.h,'#a6b69a');
 for(const n of [...BUNKER_RESOURCES.filter(n=>n.barrier),...BUNKER_GATES]){const room=bunkerRoomAt(n.x,n.y);if(room&&!s.bunker.rooms[room.id])continue;const b=bunkerFootprint(n);rect(c,b.x-6,b.y-6,b.w+12,b.h+12,n.type==='bunkerresource'?(bunkerInactive(s,n)?'#91b895':'#e1bb73'):s.bunker[n.flag]?'#91b895':n.flag==='drained'?'#70b9c4':'#c78c71');}
 rect(c,160,525,40,40,'#f0d49a');c.restore();
 if(!mini){c.font='11px system-ui';c.textAlign='center';for(const r of BUNKER_ROOMS){c.fillStyle=s.bunker.rooms[r.id]?'#f1e8ca':'#98aa93';const title=r.id==='intake'?'Entrance / Gerald':r.name;c.fillText(s.bunker.rooms[r.id]?title:'?',(r.x+r.w/2)*sx,(r.y+r.h/2)*sy);}}
 c.fillStyle='#fff0b0';c.beginPath();c.arc(s.player.x*sx,s.player.y*sy,mini?3:4,0,Math.PI*2);c.fill();c.strokeStyle='#34493c';c.lineWidth=1;c.stroke();
}
