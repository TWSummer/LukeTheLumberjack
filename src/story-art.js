import {drawBunkerNode} from './bunker-art.js';
export {drawBunkerTerrain,drawBunkerMap} from './bunker-art.js';
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
export function drawMoonbell(c,x,y){
 c.strokeStyle='#4e775b';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-30);c.moveTo(x,y-9);c.lineTo(x-10,y-19);c.moveTo(x,y-15);c.lineTo(x+12,y-24);c.stroke();
 for(const [dx,dy]of [[0,-30],[-10,-19],[12,-24]]){rect(c,x+dx-5,y+dy-5,10,7,'#d8e8f4');rect(c,x+dx-7,y+dy+2,14,4,'#a2bbdf');rect(c,x+dx-1,y+dy+2,2,6,'#f0d894');}
}
export function drawStoryNode(r,c,n){const {x,y,type}=n,s=r.state;
 if(drawBunkerNode(r,c,n))return true;
 if(type==='cottage'){c.save();c.translate(x,y);c.scale(.65,.65);r.house(c,0,0);c.restore();for(let i=0;i<4;i++){const xx=x-52+i*28;rect(c,xx,y+22,2,14,'#648653');rect(c,xx-4,y+19,10,7,'#e8ba9a');rect(c,xx,y+21,3,3,'#efd591');}r.label(c,x,y-120,'OLGA’S ORCHARD');return true;}
 if(type==='picnic'){rect(c,x-48,y-20,96,52,'#b37466');for(let i=0;i<6;i++)rect(c,x-48+i*16,y-20,7,52,'#e7caa788');for(let i=0;i<3;i++)rect(c,x-48,y-20+i*18,96,6,'#eedab47c');rect(c,x-28,y-23,21,15,'#9c7b4b');rect(c,x+11,y-6,14,7,'#f0e0b6');return true;}
 if(type==='rareplant'){c.fillStyle='#d2e7e034';c.beginPath();c.ellipse(x,y-14,40,30,0,0,Math.PI*2);c.fill();drawMoonbell(c,x,y);r.label(c,x,y-53,s.moonbellFound?'MOONBELL · GROWING WILD':'MOONBELL','#dce7eb');return true;}
 if(type==='bunker'){
  rect(c,x-87,y-44,174,100,'#68796b');rect(c,x-77,y-94,154,116,'#838d7b');rect(c,x-69,y-87,138,89,'#a2aa94');rect(c,x-62,y-75,124,77,'#66776f');
  rect(c,x-44,y-54,88,76,'#293f3b');
  if(s.bunker.open){for(let i=0;i<5;i++)rect(c,x-38,y+16-i*12,76,5,'#536961');rect(c,x+42,y-58,21,76,'#a29472');}
  else{rect(c,x-39,y-53,78,76,'#7f8271');rect(c,x-33,y-49,4,64,'#aaa184');rect(c,x+11,y-25,17,5,'#bba474');rect(c,x-37,y-10,76,4,'#765e44');}
  for(const [dx,dy]of [[-70,-94],[-45,-90],[48,-92],[64,-14],[-77,2]])rect(c,x+dx,y+dy,22,9,'#6f8959');
  rect(c,x-48,y-85,96,16,'#bfb99c');c.font='9px monospace';c.textAlign='center';c.fillStyle='#44574d';c.fillText('CIVIL DEFENSE  04',x,y-73);r.label(c,x,y-116,s.bunker.open?'BUNKER · OPEN':'ABANDONED BUNKER');return true;
 }
 if(type==='bunkerexit'){rect(c,x-40,y-32,80,70,'#293d3b');for(let i=0;i<6;i++)rect(c,x-35,y-29+i*10,70,4,'#a6ac98');r.label(c,x,y-54,'↑ TO THE WOODS','#eddeb6');return true;}
 if(type==='bunkercache'){const opened=s.bunker.looted[n.cache];rect(c,x-26,y-51,52,56,'#607971');rect(c,x-23,y-48,46,8,'#a7b7a1');rect(c,x-21,y-34,42,34,opened?'#344c46':'#8e9c85');if(!opened){rect(c,x+10,y-23,4,14,'#d7c590');r.label(c,x,y-68,'SEARCH · E','#c6d7c3');}else rect(c,x+23,y-37,12,34,'#7c8e7c');return true;}
 if(type==='growtray'){rect(c,x-41,y-18,82,26,'#788579');rect(c,x-36,y-15,72,17,'#354e45');for(let i=0;i<5;i++){const xx=x-29+i*14,yy=y-13-i%2*4;rect(c,xx,yy-6,3,9,'#cbd6b0');rect(c,xx-4,yy-11,11,5,s.bunker.harvestDay===s.day?'#77968b':'#bce3c9');}r.label(c,x,y-49,'LANTERN CAPS','#cee4cb');return true;}
 return false;
}
