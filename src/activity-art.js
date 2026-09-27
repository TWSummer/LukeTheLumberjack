import {RACE} from './activity-data.js';

export function drawSwiftness(c,x,y){
 c.save();c.translate(x,y);c.strokeStyle='#587f4a';c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-5,-12,2,-28);c.stroke();
 c.fillStyle='#7c9d54';for(const sign of [-1,1]){c.beginPath();c.ellipse(sign*6,-11,9,3,sign*.6,0,Math.PI*2);c.fill();}
 c.fillStyle='#edd16e';for(let i=0;i<7;i++){const a=i*Math.PI*2/7;c.beginPath();c.ellipse(2+Math.cos(a)*8,-29+Math.sin(a)*6,8,3,a-.3,0,Math.PI*2);c.fill();}
 c.fillStyle='#b67c3b';c.beginPath();c.arc(2,-29,4,0,Math.PI*2);c.fill();c.restore();
}
export function drawRaceCourse(c,t){
 if(t.top>RACE.bottom+100||t.bottom<RACE.top-60)return;
 c.fillStyle='#bfb285';c.fillRect(RACE.west-55,RACE.top-15,RACE.east-RACE.west+110,RACE.bottom-RACE.top+30);
 c.strokeStyle='#e6d6a6';c.lineWidth=2;c.setLineDash([12,14]);c.beginPath();c.moveTo(RACE.west,RACE.top);c.lineTo(RACE.east,RACE.top);c.moveTo(RACE.west,72);c.lineTo(RACE.east,72);c.moveTo(RACE.west,RACE.bottom);c.lineTo(RACE.east,RACE.bottom);c.stroke();c.setLineDash([]);
 for(const x of [RACE.west,RACE.east])for(let i=0;i<7;i++)for(let j=0;j<2;j++){c.fillStyle=(i+j)%2?'#54634d':'#eee7c7';c.fillRect(x-6+j*6,RACE.top+i*10,6,10);}
 for(let x=RACE.west+200;x<RACE.east;x+=200){c.fillStyle='#7d8860';c.fillRect(x,RACE.bottom+13,4,14);c.fillStyle='#eee0ab';c.fillRect(x-8,RACE.bottom+8,21,9);}
 c.fillStyle='#eee2b9';c.font='bold 11px Georgia';c.textAlign='center';c.fillText('WALTER’S BOUNDARY DASH',RACE.west+135,RACE.top-24);c.fillText('2,400 PACES · BRING ONE WOOD',RACE.east-135,RACE.top-24);
}
export function drawActivityNode(r,c,n){
 if(n.type==='swiftness'){drawSwiftness(c,n.x,n.y);if(!r.state.swiftnessFound)r.label(c,n.x,n.y-54,'✦','#f3dda0');return true;}
 if(n.type==='raceflag'){c.fillStyle='#806844';c.fillRect(n.x-3,n.y-66,5,68);c.fillStyle='#e5d3a1';c.fillRect(n.x+2,n.y-65,26,19);c.fillStyle='#8d634a';c.fillRect(n.x+2,n.y-58,26,5);r.label(c,n.x,n.y+26,n.side==='west'?'WEST FLAG':'EAST FLAG');return true;}
 return false;
}
