import {BUILDABLES,bounds,pointInBounds} from './construction.js';
import {drawMoonbell} from './story-art.js';
const poly=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
function prism(c,w,h,z,top='#bda070',side='#927344'){
  rect(c,-w/2,-h/2-z,w,h,top);rect(c,-w/2,h/2-z,w,z,side);
  rect(c,-w/2,-h/2-z,w,2,'#ddc08a');rect(c,w/2-3,-h/2-z,3,h+z,'#826842');
}
export function drawStructure(renderer,c,node,preview=false){
  const o=preview?node:renderer.state.structures.find(s=>s.id===node.structureId)||node;
  const def=BUILDABLES[o.kind],b=bounds(o),vertical=o.rotation%180===90;
  c.save();c.translate(o.x,o.y);
  if(def.layer==='floor'){
    rect(c,-24,-24,48,48,'#987744');
    for(let i=0;i<48;i+=8)rect(c,vertical?-23:-23+i,vertical?-23+i:-23,vertical?46:7,vertical?7:46,(i/8)%2?'#bc9b63':'#c6a871');
    rect(c,-24,23,48,2,'#846c43');rect(c,-22,-22,2,2,'#7a6b49');rect(c,20,19,2,2,'#7a6b49');
  }else if(def.layer==='roof'){
    if(!preview&&pointInBounds(renderer.state.player.x,renderer.state.player.y,b,60))c.globalAlpha*=.24;
    if(vertical){
      poly(c,[[-26,-81],[26,-81],[26,-29],[-26,-29]],'#526f51');
      rect(c,-26,-81,52,12,'#91a36d');
      for(let y=-68;y<-29;y+=9)rect(c,-24,y,48,2,'#72905e');
    }else{
      poly(c,[[-26,-26],[-26,-72],[0,-87],[26,-72],[26,-26],[0,-39]],'#506c52');
      poly(c,[[-26,-72],[0,-87],[0,-39],[-26,-26]],'#7b9363');
      for(let y=-69;y<-27;y+=9){rect(c,-24,y,22,2,'#92a470');rect(c,2,y-1,22,2,'#66855a');}
    }
  }else if(['wall','window','door','fence'].includes(o.kind)){
    const z=o.kind==='fence'?27:47;
    if(!preview&&renderer.state.player.y<o.y&&Math.abs(renderer.state.player.x-o.x)<b.w/2+12&&Math.abs(renderer.state.player.y-o.y)<60)c.globalAlpha*=.42;
    if(o.kind==='door'){
      if(!vertical){prism(c,48,8,4);c.save();c.translate(-20,0);prism(c,8,8,z);c.restore();c.save();c.translate(20,0);prism(c,8,8,z);c.restore();rect(c,-24,-52,48,8,'#ceb078');}
      else{rect(c,-4,-24,8,48,'#9b8054');rect(c,-5,-24-z,10,9+z,'#b89b69');rect(c,-5,18-z,10,9+z,'#bd9e6b');rect(c,-5,-24-z,10,48,'#d0b078');}
    }else if(o.kind==='fence'){
      rect(c,-b.w/2,-b.h/2-z,b.w,b.h,'#bda16e');rect(c,-b.w/2,b.h/2-z+12,b.w,4,'#a48756');
      if(vertical){rect(c,-4,-24-z,8,z,'#8b7249');rect(c,-4,18-z,8,z,'#8b7249');}else{rect(c,-24,-z,6,z,'#8b7249');rect(c,18,-z,6,z,'#8b7249');}
    }else{
      prism(c,b.w,b.h,z,'#d1b37b','#a88855');
      if(!vertical){for(let y=-38;y<-2;y+=9)rect(c,-24,y,48,2,'#886d40');}
      else for(let y=-63;y<18;y+=10)rect(c,-4,y,8,2,'#947343');
      if(o.kind==='window'){
        if(!vertical){rect(c,-12,-38,24,25,'#654f36');rect(c,-9,-35,18,19,'#afc4ae');rect(c,-1,-36,2,20,'#d1b57d');rect(c,-10,-27,20,2,'#d1b57d');}
        else{rect(c,-3,-44,6,20,'#a9c4ad');rect(c,-3,-35,6,2,'#d4b67c');}
      }
    }
  }else if(o.kind==='bed'){
    prism(c,b.w,b.h,10,'#d4bb83');
    if(!vertical){rect(c,-13,-31,26,13,'#e7dec0');rect(c,-13,-16,26,27,'#8f644b');rect(c,-13,4,26,6,'#bb9168');}
    else{rect(c,-22,-23,12,27,'#e7dec0');rect(c,-8,-23,29,27,'#8f644b');rect(c,15,-23,6,27,'#bb9168');}
  }else if(o.kind==='lantern'){
    const glow=c.createRadialGradient(0,-16,0,0,-16,85);glow.addColorStop(0,'#e4f3b87a');glow.addColorStop(1,'#e4f3b800');c.fillStyle=glow;c.fillRect(-85,-101,170,170);rect(c,-9,-2,18,5,'#686b4f');rect(c,-6,-28,12,25,'#b8daba');rect(c,-9,-31,18,5,'#927b51');rect(c,-9,-5,18,4,'#927b51');rect(c,-1,-26,2,20,'#f1ebba');
  }else if(o.kind==='planter'&&o.plant==='moonbell'){
    prism(c,b.w,b.h,14,'#675d3c','#9e8250');drawMoonbell(c,0,-14);
  }else if(o.kind==='planter'){
    prism(c,b.w,b.h,14,'#675d3c','#9e8250');for(let i=0;i<6;i++){const x=-b.w/2+6+i*(b.w-10)/6;poly(c,[[x,-18],[x-5,-30-i%2*8],[x+1,-25],[x+6,-38+i%2*6],[x+8,-20]],i%2?'#759754':'#8baa65');}
  }else if(['workbench','sawmill','sharpener','forge','festival','sawbench'].includes(o.kind)){
    const w=b.w,h=b.h;
    c.fillStyle='#46573730';c.beginPath();c.ellipse(2,5,w*.65,h*.4,0,0,Math.PI*2);c.fill();
    for(const x of [-w/2+4,w/2-9])for(const y of [-h/2+4,h/2-6])rect(c,x,y-25,6,27,'#80653e');
    prism(c,w,h,6,'#c6a773','#9b7c4b');
    c.translate(0,-27);prism(c,w+6,h+3,5,'#d0b37f','#ad8a57');
    if(o.kind==='sawmill'||o.kind==='sharpener'||o.kind==='sawbench'){
      const radius=o.kind==='sawmill'?18:15;
      c.save();c.translate(0,-h/2-4);c.fillStyle='#aab4a0';c.beginPath();c.arc(0,0,radius,0,Math.PI*2);c.fill();
      if(!renderer.reduceMotion&&o.jobs?.some(j=>j.status==='working'))c.rotate(renderer.time*3);
      c.strokeStyle='#7d8978';c.lineWidth=2;for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(Math.cos(a)*5,Math.sin(a)*5);c.lineTo(Math.cos(a)*radius,Math.sin(a)*radius);c.stroke();}rect(c,-3,-3,6,6,'#60715e');c.restore();
      if(o.kind==='sawmill')renderer.log(c,-18,5);
    }else if(o.kind==='forge'){
      poly(c,[[-23,-13],[21,-13],[29,-8],[9,-1],[6,11],[-13,11],[-13,-2],[-26,-7]],'#75867c');rect(c,-17,-15,37,3,'#b1beb0');rect(c,20,3,4,17,'#8a6c41');rect(c,14,1,17,7,'#909c8b');
    }else if(o.kind==='festival'){
      rect(c,-7,-h/2,14,h,'#9f684b');for(let i=0;i<3;i++){rect(c,-w/2+12+i*30,-9,8,5,'#e5dcb8');rect(c,-w/2+12+i*30,9,8,5,'#e5dcb8');}
    }else{rect(c,-20,-5,20,5,'#8b9582');rect(c,9,-8,5,18,'#96774d');rect(c,4,-10,16,6,'#9eaa91');}
  }else{
    c.restore();renderer.drawNode(c,{...o,type:o.kind});return;
  }
  c.restore();
}
