import {random,REGIONS,DISCOVERIES,TREE_TIERS,ROCK_TIERS} from './data.js';
import {BUNKER_ENTRY,OLGA_HOME,MOONBELL,PICNIC} from './story-data.js';

import {bunkerBlocked} from './bunker-geometry.js';

export const WORLD={width:6000,height:4200};
export const CAMP={x:1100,y:2940};
export const riverX=y=>3340+Math.sin(y/520)*110;
export const BRIDGE={id:'river-bridge',type:'crossing',x:riverX(2700),y:2700,width:258,height:100};
export const TRAILS=[
 [[1550,1150],[1850,1100],[2100,970]],[[550,1920],[760,2060]],[[2420,620],[2460,760]],[[5520,2110],[5530,2510]],
 [[620,3510],[970,3210],[1150,3030],[1480,3010],[2300,2880],[BRIDGE.x,2700],[4100,2810],[4550,3000]],
 [[1150,3030],[1350,2400],[1200,1860],[1550,1150],[2420,620]],
 [[1550,1150],[2350,1540],[2780,2730],[2700,3830]],
 [[4550,3000],[4390,2390],[4700,1800],[4820,1050]],
 [[1200,1860],[550,1920]],[[1550,1150],[480,670]],[[4700,1800],[5520,2110]]
];
export function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
export function nearTrail(x,y,pad=70){return TRAILS.some(path=>path.slice(1).some((b,i)=>segmentDistance(x,y,path[i],b)<pad));}
export function isWater(x,y){return Math.abs(x-riverX(y))<91;}
export function terrainBlocked(s,x,y,pad=9){
 if(s.scene==='bunker')return bunkerBlocked(s,x,y,pad);
 if(x<35||y<35||x>WORLD.width-35||y>WORLD.height-35)return true;
 if(Math.abs(x-riverX(y))>=91+pad)return false;
 return !(s.bridge&&Math.abs(y-BRIDGE.y)<BRIDGE.height/2-pad&&Math.abs(x-BRIDGE.x)<BRIDGE.width/2+20);
}
export function zoneAt(x,y){if(x>riverX(y))return y<2050?'mill':'sugarbush';if(y<1800)return 'ridge';if(x>2100)return 'brook';if(x<850&&y>2900)return 'estate';return 'home';}
export function nodeName(n){return n.type==='tree'?TREE_TIERS[n.tier].name.replace('pine',n.variant==='maple'?'maple':'pine'):n.type==='rock'?ROCK_TIERS[n.tier].name:({loose:'Loose stones',fiber:'Wild fiber',berries:'Blueberries',mushrooms:'Chanterelles',sap:'Sugar maple',discovery:DISCOVERIES[n.discovery]?.name,crossing:'Mosswater crossing',sign:n.label,npc:n.person})[n.type]||n.type;}
function generate(){
 const nodes=[],rng=random(27091987);let serial=0;
 const add=(type,x,y,extra={})=>{const n={id:`wild-${serial++}`,type,x,y,region:zoneAt(x,y),...extra};nodes.push(n);return n;};
 const reserved=[{...BUNKER_ENTRY,r:180},{...OLGA_HOME,r:150},{...MOONBELL,r:100},{...PICNIC,r:100},{x:CAMP.x,y:CAMP.y,r:210},{x:620,y:3460,r:165},{x:1550,y:1090,r:145},{x:2780,y:2680,r:140},{x:4550,y:2940,r:140},{x:4820,y:1020,r:165},...Object.values(DISCOVERIES).map(p=>({...p,r:90}))];
 // Trails are actual empty space. They join all six neighborhoods without a scene transition.
 for(let i=0;i<1150;i++){
  const x=100+rng()*(WORLD.width-200),y=130+rng()*(WORLD.height-240);
  if(isWater(x,y)||Math.abs(x-riverX(y))<145||nearTrail(x,y,65)||reserved.some(p=>Math.hypot(x-p.x,y-p.y)<p.r)||nodes.some(n=>Math.hypot(n.x-x,n.y-y)<64))continue;
  const zone=zoneAt(x,y),r=rng();
  if(r<.61){const tier=zone==='mill'?2+Math.floor(rng()*3):zone==='sugarbush'?1+Math.floor(rng()*4):rng()<.49?0:rng()<.5?1:2+Math.floor(rng()*2);add('tree',x,y,{tier,size:TREE_TIERS[tier].size,variant:tier===3?'oak':tier<4&&zone==='sugarbush'?'maple':'pine',seed:serial});}
  else if(r<.79){const tier=zone==='mill'?Math.floor(rng()*4):zone==='ridge'?Math.floor(rng()*3):0;add('rock',x,y,{tier});}
  else add(r<.84?'loose':r<.9?'fiber':r<.96?'berries':'mushrooms',x,y);
 }
 // A generous patch of tiny trees and loose materials makes every starting recipe reachable.
 for(let i=0;i<34;i++){const angle=i*2.39996,rad=190+(i%5)*43,x=CAMP.x+Math.cos(angle)*rad,y=CAMP.y+Math.sin(angle)*rad;
  if(!nearTrail(x,y,58)&&!nodes.some(n=>Math.hypot(n.x-x,n.y-y)<50))add('tree',x,y,{tier:i<24?0:1,size:TREE_TIERS[i<24?0:1].size,variant:'pine',seed:i});}
 [[1000,3060],[1190,3090],[910,2900],[1200,2790],[1370,2880],[1040,3200]].forEach(([x,y])=>add('loose',x,y));
 [[980,3000],[1220,2980],[1140,2800],[900,3130],[1250,3220]].forEach(([x,y])=>add('fiber',x,y));
 [[950,2810],[1340,3000],[1120,3240]].forEach(([x,y])=>add('berries',x,y));
 add('tree',1280,3060,{tier:0,size:.34,variant:'pine',seed:1});
 add('tree',1420,3130,{tier:2,size:.88,variant:'pine',seed:2});
 add('tree',950,2700,{tier:3,size:1.18,variant:'oak',seed:3});
 add('rock',1440,2860,{tier:0});
 add('mansion',620,3450);add('npc',665,3600,{person:'everett'});
 add('workshop',1550,1090);add('npc',1590,1230,{person:'jo'});
 add('npc',2780,2790,{person:'mara'});add('npc',4550,3050,{person:'nell'});add('kettle',4600,2950);
 add('ruin',4820,1000);
 for(let i=0;i<12;i++)add('sap',4140+(i%4)*150,3170+Math.floor(i/4)*160,{variant:'maple',size:.8,seed:i});
 for(const [id,p]of Object.entries(DISCOVERIES))add('discovery',p.x,p.y,{discovery:id});
 for(const [x,y,label]of [[1280,2960,'NORTH · HEMLOCK RIDGE\nEAST · MOSSWATER BROOK'],[1510,1390,'SOUTH · PINE HOLLOW\nEAST · MOSSWATER BROOK'],[2990,2620,'EAST · OLD SUGARBUSH\nREPAIR THE RIVER CROSSING'],[4330,2800,'NORTH · FORGOTTEN MILL\nSOUTH · NELL’S MAPLE GROVE']])add('sign',x,y,{label});
 nodes.push(BRIDGE,BUNKER_ENTRY,MOONBELL,{id:'olga-cottage',type:'cottage',x:OLGA_HOME.x-75,y:OLGA_HOME.y-110},{id:'picnic',type:'picnic',...PICNIC});
 add('sign',1930,1080,{label:'NORTH · ABANDONED BUNKER\nBRING A CROWBAR · FORGE: 4 IRON + 2 WOOD'});
 return nodes;
}
export const NATURAL_NODES=generate();
export const REGIONAL_LABELS=Object.entries(REGIONS).map(([id,r])=>({id,...r}));
