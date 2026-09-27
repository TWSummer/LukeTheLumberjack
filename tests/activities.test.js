import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,loadState,saveState,SAVE_KEY,startJob,cancelJob,collectStation,rest,consumeBerry,maxCraftable,packStructure,placeStructure,moveStructure} from '../src/state.js';
import {BUILDABLES,RECIPE_BY_ID,placementBlock,worldNodes} from '../src/construction.js';
import {FITNESS,RACE,SWIFTNESS} from '../src/activity-data.js';
import {beginTraining,tickTraining,maxStamina,movementBudget,spendMovement,recoverStamina,takeSwiftness,plantSwiftness,hasSwiftness,sprintSpeed,startRace,tickRace,settleRace,walterPosition} from '../src/activities.js';
import {CAMP,NATURAL_NODES,terrainBlocked} from '../src/world.js';
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
const add=(s,kind,id=kind)=>{const o={id,kind,x:CAMP.x+300,y:CAMP.y+200,rotation:0,jobs:[]};s.structures.push(o);s.player={x:o.x,y:o.y+55};return o;};
const supplied=()=>{const s=freshState();for(const k of Object.keys(s.inventory))s.inventory[k]=100;s.inventory.swiftness=0;return s;};
const readyRace=(cap=100,flower=false)=>{const s=supplied();s.maxStamina=cap;s.energy=cap;s.player={x:RACE.west,y:RACE.playerY};if(flower)add(s,'planter').plant='swiftness';s.player={x:RACE.west,y:RACE.playerY};return s;};
function run(s,fps){assert.ok(startRace(s).success);for(let i=0;i<fps*20&&s.race.active;i++){const dt=1/fps,previous={...s.player};if(s.race.active.phase==='running'){const m=movementBudget(s,dt,true);s.player.x+=m.distance*s.race.active.direction;const sprinted=spendMovement(s,m,m.distance);if(!sprinted)recoverStamina(s,dt);}tickRace(s,dt,previous);}assert.equal(s.race.active,null);return s.race.last;}

test('craft arbitrary quantities with exact material custody, duration, output, save/resume and refunds',()=>{
 for(const count of [7,23,99]){const s=supplied(),o=add(s,'workbench'),r=RECIPE_BY_ID.planks;const result=startJob(s,o.id,r.id,count,1000);assert.ok(result.job);assert.equal(s.inventory.logs,100-r.cost.logs*count);assert.equal(result.job.readyAt,1000+r.duration*count*1000);const mem=storage();saveState(s,mem);const resumed=loadState(mem);assert.equal(resumed.structures.at(-1).jobs[0].count,count);assert.equal(collectStation(resumed,o.id,result.job.readyAt).output.planks,2*count);assert.equal(resumed.inventory.planks,100+2*count);assert.ok(collectStation(resumed,o.id).error);assert.ok(cancelJob(s,o.id,1001).success);assert.equal(s.inventory.logs,100);assert.ok(cancelJob(s,o.id,1001).error);}
});
test('quantity maximum uses the limiting ingredient; invalid quantities and multiple tool upgrades are rejected',()=>{
 const s=supplied(),o=add(s,'workbench'),r=RECIPE_BY_ID['kit-pullupbar'];s.inventory.logs=19;s.inventory.ingots=4;assert.equal(maxCraftable(s,r),4);assert.ok(startJob(s,o.id,r.id,5).error);assert.ok(startJob(s,o.id,r.id,4).job);assert.equal(s.inventory.logs,11);assert.equal(s.inventory.ingots,0);assert.equal(collectStation(s,o.id,Infinity).kits.pullupbar,4);
 for(const count of [0,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,'7'])assert.ok(startJob(s,o.id,'planks',count).error);
 assert.ok(startJob(s,o.id,'pick0',2).error);assert.equal(BUILDABLES.pullupbar.cost.logs,2);assert.equal(BUILDABLES.pullupbar.cost.ingots,1);
});
test('new adventures start at 25; existing progress and an exact backup survive the stamina rebalance',()=>{
 const s=supplied();s.energy=72;delete s.maxStamina;delete s.race;delete s.swiftnessFound;s.axe=3;s.bridge=true;s.olga.step=2;add(s,'planter').plant='moonbell';const mem=storage(),raw=JSON.stringify(s);mem.setItem(SAVE_KEY,raw);const loaded=loadState(mem);assert.equal(loaded.maxStamina,25);assert.equal(loaded.energy,18);assert.equal(loaded.axe,3);assert.equal(loaded.bridge,true);assert.deepEqual(loaded.structures,s.structures);assert.equal(loaded.olga.step,2);assert.equal(mem.getItem(SAVE_KEY+'-before-stamina-training'),raw);saveState(loaded,mem);assert.deepEqual(loadState(mem),loaded);assert.equal(mem.getItem(SAVE_KEY+'-before-stamina-training'),raw);
 const denied=loadState({getItem:k=>k===SAVE_KEY?raw:null,setItem:()=>{throw Error('full');}});assert.equal(denied.axe,3);assert.equal(freshState().energy,25);
});
test('sprint drain follows actual movement, exhausts consistently, and recovery respects trained capacity',()=>{
 for(const fps of [30,60,144]){const s=freshState();let distance=0;for(let i=0;i<fps*4;i++){const m=movementBudget(s,1/fps,true);distance+=m.distance;spendMovement(s,m,m.distance);}assert.ok(Math.abs(distance-(25/8*290+(4-25/8)*205))<.001);assert.equal(s.energy,0);assert.equal(s.winded,true);recoverStamina(s,3);assert.equal(s.winded,true);recoverStamina(s,1);assert.equal(s.winded,false);recoverStamina(s,100);assert.equal(s.energy,25);}
 const s=freshState(),m=movementBudget(s,1,true);assert.equal(spendMovement(s,m,0),false);assert.equal(s.energy,25);spendMovement(s,m,m.distance/2);assert.equal(s.energy,21);assert.equal(movementBudget(s,1,false).cost,0);
});
test('pull-ups require a nearby crafted bar, consume stamina, take real time, cap at 100 and persist',()=>{
 const s=supplied(),bar=add(s,'pullupbar');s.energy=25;assert.ok(beginTraining(s,'missing').error);assert.ok(beginTraining(s,bar.id).success);assert.equal(s.energy,22);assert.ok(beginTraining(s,bar.id).error);assert.equal(tickTraining(s,2.9),null);assert.equal(s.maxStamina,25);assert.equal(tickTraining(s,.1).maxStamina,26);assert.equal(tickTraining(s,100),null);
 s.maxStamina=99;assert.ok(beginTraining(s,bar.id).success);tickTraining(s,3);assert.equal(s.maxStamina,100);assert.ok(beginTraining(s,bar.id).error);
 const mem=storage();saveState(s,mem);assert.equal(loadState(mem).maxStamina,100);s.maxStamina=30;beginTraining(s,bar.id);s.player.x+=500;assert.equal(tickTraining(s,3),null);assert.equal(s.training,null);assert.equal(s.maxStamina,30);assert.ok(beginTraining(s,bar.id).error);
 s.player={x:bar.x,y:bar.y};s.energy=2;assert.ok(beginTraining(s,bar.id).error);s.energy=10;beginTraining(s,bar.id);saveState(s,mem);assert.equal(loadState(mem).training,null);assert.equal(loadState(mem).energy,7);
});
test('berries and rest refill only the trained maximum, including Nell’s food bonus',()=>{
 const s=freshState();s.inventory.berries=3;s.energy=4;assert.equal(consumeBerry(s).amount,21);assert.ok(consumeBerry(s).error);assert.equal(s.inventory.berries,2);s.maxStamina=60;s.energy=1;s.helped.nell=true;assert.equal(consumeBerry(s).amount,44);s.player={...CAMP};assert.ok(rest(s,s.structures[0]).success);assert.equal(s.energy,60);
});
test('swiftness is discovered once and only an actually planted flower boosts sprinting; packing returns the cutting',()=>{
 const s=freshState();assert.ok(takeSwiftness(s).error);s.player={...SWIFTNESS};assert.ok(takeSwiftness(s).success);assert.ok(takeSwiftness(s).already);assert.equal(s.inventory.swiftness,1);assert.equal(sprintSpeed(s),290);const planter=add(s,'planter');assert.ok(plantSwiftness(s,planter.id).success);assert.equal(s.inventory.swiftness,0);assert.ok(hasSwiftness(s));assert.equal(sprintSpeed(s),304.5);assert.ok(plantSwiftness(s,planter.id).error);const mem=storage();saveState(s,mem);assert.ok(hasSwiftness(loadState(mem)));assert.ok(moveStructure(s,planter.id,planter.x+96,planter.y,0).structure);assert.ok(hasSwiftness(s));s.player={x:planter.x,y:planter.y+45};assert.ok(packStructure(s,planter.id).kind);assert.equal(s.inventory.swiftness,1);assert.equal(hasSwiftness(s),false);const moon=add(s,'planter','moon');moon.plant='moonbell';assert.ok(plantSwiftness(s,moon.id).error);assert.equal(s.inventory.swiftness,1);assert.equal(moon.plant,'moonbell');
});
test('the full-trained unboosted sprint narrowly loses, while a trained planted-flower sprint narrowly wins at multiple frame rates',()=>{
 for(const fps of [30,60,144]){const normal=readyRace(100);assert.equal(run(normal,fps).won,false);assert.ok(normal.race.last.margin>.15&&normal.race.last.margin<.2);assert.equal(normal.inventory.logs,99);const swift=readyRace(100,true);assert.equal(run(swift,fps).won,true);assert.ok(swift.race.last.margin>.2&&swift.race.last.margin<.25);assert.equal(swift.inventory.logs,101);assert.equal(run(readyRace(25,true),fps).won,false);}
});
test('races accept unlimited rematches in either direction, escrow one wood, pay once, and survive save/resume',()=>{
 const s=readyRace(100,true);for(let i=0;i<5;i++){s.player={...walterPosition(s)};assert.equal(run(s,60).won,true);assert.equal(s.inventory.logs,101+i);assert.equal(s.race.wins,i+1);assert.equal(settleRace(s,true),null);}
 s.player={...walterPosition(s)};assert.ok(startRace(s).success);const before=s.inventory.logs;assert.ok(startRace(s).error);assert.equal(s.inventory.logs,before);assert.ok(consumeBerry(s).error);tickRace(s,1,s.player);const mem=storage();saveState(s,mem);const resumed=loadState(mem);assert.deepEqual(resumed.race,s.race);assert.equal(resumed.inventory.logs,before);tickRace(resumed,3,resumed.player);resumed.player.y=200;assert.equal(tickRace(resumed,1/60,resumed.player).forfeit,true);assert.equal(resumed.inventory.logs,before);assert.equal(resumed.race.losses,1);
});
test('race entry needs a nearby Walter, wager, and a clear course; new builds cannot obstruct it',()=>{
 const s=readyRace();s.inventory.logs=0;assert.ok(startRace(s).error);s.inventory.logs=1;s.player.x=1000;assert.ok(startRace(s).error);s.player.x=RACE.west;assert.ok(placementBlock(s,'workbench',500,100));s.structures.push({id:'old-home',kind:'wall',x:600,y:84,jobs:[]});assert.ok(startRace(s).error);assert.equal(s.inventory.logs,1);s.structures.pop();assert.ok(startRace(s).success);assert.equal(s.inventory.logs,0);
 const world=worldNodes(freshState());assert.equal(world.filter(n=>n.person==='walter').length,1);assert.ok(world.some(n=>n.id===SWIFTNESS.id));for(let x=500;x<=2900;x+=5){assert.equal(terrainBlocked(s,x,84),false);for(const n of NATURAL_NODES.filter(n=>['tree','rock'].includes(n.type)))assert.ok(Math.hypot(n.x-x,n.y-84)>((n.type==='tree'?11+n.tier*5:19+n.tier*7)+8));}
});
