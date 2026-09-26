import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,grant,strike,startJob,collectStation,tickWorkstations,packStructure,moveStructure,placeStructure,rest,saveState,loadState} from '../src/state.js';
import {acceptOlga,completeOlga,olgaStatus,takeMoonbell,plantMoonbell,enterBunker,leaveBunker,lootBunker,hermitSaying} from '../src/stories.js';
import {olgaPosition,worldNodes,nearStructure,RECIPE_BY_ID} from '../src/construction.js';
import {findOlgaRoom} from '../src/rooms.js';
import {OLGA_HOME,MOONBELL,PICNIC,BUNKER_ENTRY,BUNKER_NODES,HERMIT_LINES,BUNKER_CACHES} from '../src/story-data.js';
import {NATURAL_NODES,terrainBlocked,zoneAt} from '../src/world.js';
import {furnishedHouse} from './story-fixtures.js';
const visit=(s,n)=>{s.player={x:n.x,y:n.y+45};};
function piece(s,kind,x=1704,y=2400){const o={id:'placed-'+s.nextId++,kind,x,y,rotation:0,jobs:[]};s.structures.push(o);return o;}
function fell(s,id,tier){const n={id,type:'tree',tier,x:s.player.x+40,y:s.player.y};s.energy=100;while(!s.depleted[id])assert.ok(!strike(s,n).error);}
test('Olga counts actual post-acceptance logging, requires a visit, and gives each reward once',()=>{
 const s=freshState();s.axe=2;fell(s,'before',2);assert.ok(acceptOlga(s).error);visit(s,OLGA_HOME);assert.ok(acceptOlga(s).success);assert.ok(acceptOlga(s).error);
 fell(s,'tiny',0);assert.equal(olgaStatus(s).ready,false);assert.match(olgaStatus(s).detail,/0 \/ 3/);grant(s,{logs:1000});assert.ok(completeOlga(s).error);
 for(let i=0;i<3;i++)fell(s,'quality-'+i,1+i%2);assert.ok(olgaStatus(s).ready);s.player={x:1500,y:2500};assert.ok(completeOlga(s).error);visit(s,OLGA_HOME);assert.ok(completeOlga(s).success);assert.equal(s.olga.step,1);assert.equal(s.inventory.planks,12);assert.ok(completeOlga(s).error);assert.equal(s.inventory.planks,12);
});
test('moonbell is a unique cutting; actual planting counts, moving retains it, packing returns it',()=>{
 const s=freshState();s.olga.step=1;visit(s,OLGA_HOME);acceptOlga(s);assert.ok(takeMoonbell(s).error);visit(s,MOONBELL);assert.ok(takeMoonbell(s).success);assert.ok(takeMoonbell(s).error);assert.equal(s.inventory.moonbell,1);assert.equal(olgaStatus(s).ready,false);
 const p=piece(s,'planter');assert.ok(plantMoonbell(s,p.id).error);visit(s,p);assert.ok(plantMoonbell(s,p.id).success);assert.equal(s.inventory.moonbell,0);assert.ok(olgaStatus(s).ready);assert.ok(plantMoonbell(s,p.id).error);
 for(const n of NATURAL_NODES)s.depleted[n.id]=true;assert.ok(moveStructure(s,p.id,p.x+48,p.y).structure);assert.equal(p.plant,'moonbell');visit(s,p);assert.ok(packStructure(s,p.id).kind);assert.equal(s.inventory.moonbell,1);assert.equal(olgaStatus(s).ready,false);assert.ok(packStructure(s,p.id).error);
 visit(s,s.structures[0]);rest(s,s.structures[0]);visit(s,MOONBELL);assert.ok(takeMoonbell(s).error);assert.equal(s.inventory.moonbell,1);
});
test('the garden reward is a date invitation; the date requires walking to Olga at the overlook',()=>{
 const s=freshState();s.olga={step:1,active:true};piece(s,'planter').plant='moonbell';visit(s,OLGA_HOME);const reward=completeOlga(s);assert.match(reward.text,/date/);assert.equal(s.olga.step,2);assert.deepEqual(olgaPosition(s),OLGA_HOME);
 assert.ok(acceptOlga(s).success);assert.equal(olgaPosition(s).x,PICNIC.x+36);assert.ok(completeOlga(s).error);visit(s,olgaPosition(s));assert.ok(completeOlga(s).success);assert.equal(s.olga.step,3);assert.equal(s.inventory.relic,1);assert.ok(completeOlga(s).error);assert.deepEqual(olgaPosition(s),OLGA_HOME);
});
test('Olga needs two real connected rooms with separate beds, enclosure, a window and a roof',()=>{
 const s=freshState();furnishedHouse(s);const room=findOlgaRoom(s);assert.ok(room);assert.equal(room.floors,4);
 for(const kind of ['bed','roof','window','door','wall']){
  const copy=structuredClone(s);const target=kind==='bed'?room.bed:kind==='door'?room.door:kind==='roof'?copy.structures.find(p=>p.kind==='roof'&&p.x===1944):kind==='wall'?copy.structures.find(p=>p.kind==='wall'&&p.y===2184&&p.x===1896):copy.structures.find(p=>p.kind==='window');copy.structures=copy.structures.filter(p=>p.id!==target.id);assert.equal(findOlgaRoom(copy),null,'missing '+kind);
 }
 const scattered=structuredClone(s);scattered.structures.filter(p=>p.kind==='bed').forEach(p=>p.x+=500);assert.equal(findOlgaRoom(scattered),null);
});
test('the room layout can be built through normal placement and Olga moves in only after final acceptance',()=>{
 const s=freshState(),blueprint=freshState();const pieces=furnishedHouse(blueprint);for(const n of NATURAL_NODES)s.depleted[n.id]=true;
 for(const p of pieces){s.packed[p.kind]=(s.packed[p.kind]||0)+1;s.player={x:p.x+110,y:p.y+110};assert.ok(placeStructure(s,p.kind,p.x,p.y,p.rotation).structure,p.kind+' '+p.x+','+p.y);}
 s.olga.step=3;visit(s,OLGA_HOME);assert.ok(completeOlga(s).error);acceptOlga(s);assert.ok(completeOlga(s).success);assert.equal(s.olga.step,4);assert.equal(worldNodes(s).filter(n=>n.person==='olga').length,1);assert.notDeepEqual(olgaPosition(s),OLGA_HOME);assert.ok(completeOlga(s).error);
});
test('crowbar requires local forge crafting and pickup, opens the hatch permanently and is kept',()=>{
 const s=freshState(),forge=piece(s,'forge');grant(s,{ingots:4,logs:2});visit(s,BUNKER_ENTRY);assert.ok(enterBunker(s).error);assert.ok(startJob(s,forge.id,'crowbar',1,0).error);
 visit(s,forge);assert.ok(startJob(s,forge.id,'crowbar',1,0).job);assert.equal(s.inventory.ingots,0);tickWorkstations(s,9000);visit(s,BUNKER_ENTRY);assert.ok(enterBunker(s).error);visit(s,forge);assert.equal(collectStation(s,forge.id,9000).output.crowbar,1);
 visit(s,BUNKER_ENTRY);assert.ok(enterBunker(s).success);assert.equal(s.scene,'bunker');assert.equal(s.inventory.crowbar,1);assert.ok(s.bunker.open);assert.equal(nearStructure(s,forge),false);assert.ok(placeStructure(s,'floor',180,490).error);
 visit(s,BUNKER_NODES[0]);assert.ok(leaveBunker(s).success);assert.equal(s.scene,'woods');assert.equal(s.region,zoneAt(s.player.x,s.player.y));s.inventory.crowbar=0;assert.ok(enterBunker(s).success);
});
test('the original bunker rooms still connect their caches, hermit and exit',()=>{
 const s=freshState();s.scene='bunker';assert.ok(terrainBlocked(s,50,100));assert.ok(terrainBlocked(s,406,200));assert.ok(!terrainBlocked(s,406,300));assert.ok(!terrainBlocked(s,650,364));
 const queue=[[180,490]],seen=new Set(['180,490']);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy]of [[10,0],[-10,0],[0,10],[0,-10]]){const xx=x+dx,yy=y+dy,key=xx+','+yy;if(!seen.has(key)&&!terrainBlocked(s,xx,yy)){seen.add(key);queue.push([xx,yy]);}}}
 for(const n of BUNKER_NODES.filter(n=>['bunker-exit','hermit','bunker-tools','bunker-pantry','bunker-archive','bunker-growtray'].includes(n.id)))assert.ok(queue.some(([x,y])=>Math.hypot(x-n.x,y-n.y)<65),n.id+' reachable');
});
test('bunker caches cannot be looted remotely or twice; grow trays replenish daily and salvage has uses',()=>{
 const s=freshState(),cache=BUNKER_NODES.find(n=>n.type==='bunkercache');visit(s,cache);assert.ok(lootBunker(s,cache.id).error);s.scene='bunker';const result=lootBunker(s,cache.id);assert.deepEqual(result.reward,BUNKER_CACHES[cache.cache].reward);const count=s.inventory.scrap;assert.ok(lootBunker(s,cache.id).already);assert.equal(s.inventory.scrap,count);
 const tray=BUNKER_NODES.find(n=>n.type==='growtray');assert.ok(lootBunker(s,tray.id).error);visit(s,tray);assert.equal(lootBunker(s,tray.id).reward.glowcaps,3);assert.ok(lootBunker(s,tray.id).error);s.day++;assert.equal(lootBunker(s,tray.id).reward.glowcaps,3);
 assert.equal(RECIPE_BY_ID['reclaim-iron'].output.ingots,3);assert.deepEqual(RECIPE_BY_ID['kit-lantern'].cost,{scrap:1,copper:2,glowcaps:1});
});
test('hermit cycles funny dialogue without accepting or awarding quests',()=>{
 const s=freshState();assert.ok(hermitSaying(s).error);s.scene='bunker';visit(s,BUNKER_NODES.find(n=>n.person==='hermit'));const lines=new Set();for(let i=0;i<HERMIT_LINES.length;i++)lines.add(hermitSaying(s).text);assert.equal(lines.size,HERMIT_LINES.length);assert.equal(hermitSaying(s).text,HERMIT_LINES[0]);assert.deepEqual(s.accepted,{});assert.deepEqual(s.helped,{});
});
test('save/resume persists story, garden, interior, caches and hermit dialogue',()=>{
 const s=freshState();furnishedHouse(s);s.olga.step=3;visit(s,OLGA_HOME);acceptOlga(s);completeOlga(s);piece(s,'planter').plant='moonbell';s.moonbellFound=true;grant(s,{crowbar:1});visit(s,BUNKER_ENTRY);enterBunker(s);const n=BUNKER_NODES.find(n=>n.type==='bunkercache');visit(s,n);lootBunker(s,n.id);visit(s,BUNKER_NODES.find(n=>n.person==='hermit'));hermitSaying(s);
 let value;const storage={setItem:(k,v)=>value=v,getItem:()=>value};saveState(s,storage);const loaded=loadState(storage);assert.deepEqual(loaded.olga,s.olga);assert.deepEqual(loaded.bunker,s.bunker);assert.equal(loaded.scene,'bunker');assert.deepEqual(loaded.player,s.player);assert.ok(loaded.structures.some(p=>p.plant==='moonbell'));assert.equal(loaded.moonbellFound,true);assert.ok(worldNodes(loaded).every(n=>BUNKER_NODES.includes(n)));
});
