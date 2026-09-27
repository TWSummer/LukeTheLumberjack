import test from 'node:test';
import {recoverStamina} from '../src/activities.js';
import assert from 'node:assert/strict';
import {AXE_TIERS,TREE_TIERS,PICK_TIERS,ROCK_TIERS,DISCOVERIES,SIDE_QUESTS} from '../src/data.js';
import {WORLD,CAMP,BRIDGE,NATURAL_NODES,terrainBlocked,zoneAt,riverX} from '../src/world.js';
import {BUILDABLES,ALL_RECIPES,RECIPE_BY_ID,worldNodes,bounds,placementBlock} from '../src/construction.js';
import {freshState,SAVE_KEY,loadState,saveState,grant,getStructure,startJob,tickWorkstations,collectStation,cancelJob,placeStructure,moveStructure,packStructure,strike,gather,resourceBlock,rest,toolAtBench,repairBridge,discover,turnInQuest,consumeBerry,jobDuration} from '../src/state.js';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
function visit(s,n){s.player={x:n.x,y:n.y+(n.kind?bounds(n).h/2+22:38)};s.region=zoneAt(s.player.x,s.player.y);}
function supplied(){const s=freshState();for(const k of Object.keys(s.inventory))s.inventory[k]=500;return s;}
function clear(s){for(const n of NATURAL_NODES)if(['tree','rock','loose','fiber','berries','mushrooms','sap'].includes(n.type))s.depleted[n.id]=true;}
function place(s,kind,x=1608,y=3192){s.player={x:x-85,y:y+70};s.packed[kind]=(s.packed[kind]||0)+1;clear(s);const result=placeStructure(s,kind,x,y);assert.equal(result.error,undefined,result.error);return result.structure;}
function make(s,o,id,count=1){visit(s,o);const started=startJob(s,o.id,id,count,0);assert.equal(started.error,undefined,started.error);tickWorkstations(s,1000000);const result=collectStation(s,o.id,1000000);assert.equal(result.error,undefined,result.error);return result;}

test('fresh open-world state starts at the tent, ignores earlier saves, and has no instant blueprints',()=>{
 const s=freshState();assert.equal(s.structures.length,1);assert.equal(s.structures[0].kind,'tent');assert.equal(s.pick,-1);assert.equal(s.axe,0);assert.deepEqual(s.packed,{});assert.ok(Object.values(s.inventory).every(n=>n===0));
 const store=memory();store.setItem(SAVE_KEY,JSON.stringify({version:2,inventory:{logs:999}}));assert.equal(loadState(store).inventory.logs,0);
});
test('world is continuous and much larger, with all regions and tiers represented',()=>{
 assert.equal(WORLD.width*WORLD.height,25200000);assert.ok(NATURAL_NODES.length>600);
 for(const region of ['home','estate','ridge','brook','sugarbush','mill'])assert.ok(NATURAL_NODES.some(n=>n.region===region));
 for(let tier=0;tier<5;tier++)assert.ok(NATURAL_NODES.some(n=>n.type==='tree'&&n.tier===tier));
 for(let tier=0;tier<4;tier++)assert.ok(NATURAL_NODES.some(n=>n.type==='rock'&&n.tier===tier));
});
test('river blocks the full world and a repaired bridge provides the only walkable crossing',()=>{
 const s=freshState();for(let y=40;y<WORLD.height-40;y+=40)assert.ok(terrainBlocked(s,riverX(y),y));
 grant(s,{planks:24,rope:6});assert.ok(repairBridge(s).error);s.player={x:BRIDGE.x-150,y:BRIDGE.y};assert.ok(repairBridge(s).success);assert.equal(s.inventory.planks,0);
 for(let x=BRIDGE.x-180;x<=BRIDGE.x+180;x+=2)assert.equal(terrainBlocked(s,x,BRIDGE.y),false,'Walking over repaired boards must be possible');
 assert.ok(terrainBlocked(s,riverX(BRIDGE.y+150),BRIDGE.y+150));assert.ok(repairBridge(s).error);
});
test('fresh axe only cuts tiny trees, and partially chopped trees retain damage',()=>{
 const s=freshState(),small=NATURAL_NODES.find(n=>n.type==='tree'&&n.tier===0),big=NATURAL_NODES.find(n=>n.type==='tree'&&n.tier===1);visit(s,big);assert.match(strike(s,big).error,/Honed/);assert.equal(s.inventory.logs,0);
 visit(s,small);for(let i=0;i<7;i++)assert.equal(strike(s,small).reward,undefined);assert.equal(s.damage[small.id],7);assert.equal(strike(s,small).reward.logs,1);assert.ok(s.depleted[small.id]);assert.ok(strike(s,small).error);
});
test('tool tiers unlock larger trees and improve yield and speed by a substantial margin',()=>{
 const s=freshState();let firstTime,lastTime;
 for(let tier=0;tier<5;tier++){s.axe=tier;const n={id:'tree-'+tier,type:'tree',tier,x:1000,y:1000};visit(s,n);let hits=0,result;do{result=strike(s,n);assert.equal(result.error,undefined);hits++;}while(!result.reward);assert.equal(result.reward.logs,TREE_TIERS[tier].logs);if(tier===0)firstTime=hits*AXE_TIERS[tier].interval;if(tier===4)lastTime=hits*AXE_TIERS[tier].interval;}
 assert.ok(TREE_TIERS[4].logs/TREE_TIERS[0].logs>=100);assert.ok(lastTime<firstTime/5);
});
test('mining requires a pickaxe; loose stones bootstrap it; soft fieldstone yields starter iron',()=>{
 const s=freshState(),loose=NATURAL_NODES.find(n=>n.type==='loose'),rock=NATURAL_NODES.find(n=>n.type==='rock'&&n.tier===0);visit(s,rock);assert.match(strike(s,rock).error,/pickaxe/);assert.ok(gather(s,rock).error);visit(s,loose);assert.equal(gather(s,loose).reward.stone,3);
 s.pick=0;visit(s,rock);let result;for(let i=0;i<4;i++)result=strike(s,rock);assert.equal(result.reward.stone,6);assert.equal(result.reward.ore,1);
 const dense={id:'dense',type:'rock',tier:2,x:1000,y:1000};visit(s,dense);assert.match(strike(s,dense).error,/Steel pickaxe/);
});
test('tent crafts a kit, deducts materials at start, and cannot grant it until local pickup',()=>{
 const s=freshState(),tent=s.structures[0];grant(s,{logs:6,stone:4,fiber:2});visit(s,tent);assert.ok(startJob(s,tent.id,'kit-workbench',1,0).job);assert.equal(s.inventory.logs,0);tickWorkstations(s,10000);assert.equal(s.packed.workbench,undefined);
 s.player={x:2200,y:1000};assert.ok(collectStation(s,tent.id,10000).error);visit(s,tent);assert.equal(collectStation(s,tent.id,10000).kits.workbench,1);assert.equal(s.packed.workbench,1);assert.ok(collectStation(s,tent.id,10000).error);
});
test('buildings require collected kits; placement cancellation or invalid terrain costs nothing',()=>{
 const s=supplied();clear(s);s.player={x:1510,y:3260};assert.match(placeStructure(s,'workbench',1608,3192).error,/kit/);s.packed.workbench=1;assert.ok(placeStructure(s,'workbench',riverX(3000),3000).error);assert.equal(s.packed.workbench,1);
 assert.ok(placeStructure(s,'workbench',1608,3192).structure);assert.equal(s.packed.workbench,0);assert.equal(s.inventory.logs,500);
});
test('two workstations run independent jobs and keep separate finished goods',()=>{
 const s=supplied(),a=place(s,'workbench'),b=place(s,'workbench',1776,3192);visit(s,a);startJob(s,a.id,'planks',5,0);visit(s,b);startJob(s,b.id,'rope',1,0);tickWorkstations(s,999999);
 assert.equal(s.inventory.planks,500);assert.equal(s.inventory.rope,500);collectStation(s,b.id,999999);assert.equal(s.inventory.rope,501);assert.equal(s.inventory.planks,500);visit(s,a);collectStation(s,a.id,999999);assert.equal(s.inventory.planks,510);
});
test('crafting and output collection require the correct nearby station',()=>{
 const s=supplied(),bench=place(s,'workbench');visit(s,bench);assert.ok(startJob(s,bench.id,'axe1').error);s.player={x:5000,y:500};assert.ok(startJob(s,bench.id,'planks').error);assert.ok(collectStation(s,bench.id).error);assert.ok(startJob(s,'tent','kit-workbench').error);
});
test('axe upgrades reserve the tool, finish at the station, and equip only on pickup',()=>{
 const s=supplied(),bench=place(s,'sharpener'),tree={id:'tiny',type:'tree',tier:0,x:1660,y:3230};visit(s,bench);startJob(s,bench.id,'axe1',1,0);assert.ok(toolAtBench(s,'axe'));visit(s,tree);assert.ok(strike(s,tree).error);tickWorkstations(s,10000);assert.equal(s.axe,0);visit(s,bench);collectStation(s,bench.id,10000);assert.equal(s.axe,1);assert.equal(toolAtBench(s,'axe'),undefined);assert.ok(startJob(s,bench.id,'axe1').error);
});
test('pickaxe and axe can be serviced independently, but a tool cannot be in two jobs',()=>{
 const s=supplied(),bench=place(s,'workbench'),sharp=place(s,'sharpener',1776,3192),sharp2=place(s,'sharpener',1944,3192);visit(s,bench);startJob(s,bench.id,'pick0',1,0);visit(s,sharp);assert.ok(startJob(s,sharp.id,'axe1',1,0).job);visit(s,sharp2);assert.ok(startJob(s,sharp2.id,'axe1').error);visit(s,bench);collectStation(s,bench.id,10000);assert.equal(s.pick,0);
});
test('working or ready stations cannot move or pack; cancelled jobs refund exactly once',()=>{
 const s=supplied(),bench=place(s,'workbench');visit(s,bench);const logs=s.inventory.logs;startJob(s,bench.id,'planks',5,0);assert.ok(packStructure(s,bench.id).error);assert.ok(moveStructure(s,bench.id,1704,3192).error);assert.ok(cancelJob(s,bench.id,1).success);assert.equal(s.inventory.logs,logs);assert.ok(cancelJob(s,bench.id,2).error);startJob(s,bench.id,'planks',1,0);tickWorkstations(s,10000);assert.ok(cancelJob(s,bench.id,10000).error);assert.ok(packStructure(s,bench.id).error);
 collectStation(s,bench.id,10000);assert.equal(packStructure(s,bench.id).kind,'workbench');assert.equal(s.packed.workbench,1);
});
test('saving and sleeping keep output at stations and preserve world positions',()=>{
 const s=supplied(),bench=place(s,'workbench');visit(s,bench);startJob(s,bench.id,'planks',10,0);const store=memory();saveState(s,store);const loaded=loadState(store);assert.equal(loaded.player.x,s.player.x);assert.equal(loaded.structures.length,2);assert.ok(rest(loaded,bench).error);visit(loaded,loaded.structures[0]);assert.ok(rest(loaded,loaded.structures[0],1).success);assert.equal(loaded.inventory.planks,500);assert.equal(loaded.structures[1].jobs[0].status,'ready');
});
test('floor and roof layers allow furniture and do not regrow trees inside structures',()=>{
 const s=supplied();place(s,'floor');place(s,'bed');place(s,'roof');assert.equal(s.structures.length,4);assert.ok(placementBlock(s,'floor',1608,3192));visit(s,s.structures[0]);rest(s,s.structures[0]);assert.ok(worldNodes(s).filter(n=>n.type==='tree').every(n=>!pointNear(n,1608,3192,24)));
 function pointNear(n,x,y,r){return Math.abs(n.x-x)<r&&Math.abs(n.y-y)<r;}
});
test('discoveries reward exploration once and unlock advanced recipes independently of quests',()=>{
 const s=supplied(),mill=NATURAL_NODES.find(n=>n.discovery==='mill'),bench=place(s,'sawbench');s.axe=3;visit(s,bench);assert.match(startJob(s,bench.id,'axe4').error,/chest/);visit(s,mill);assert.ok(discover(s,mill).blueprint);const steel=s.inventory.steel;assert.ok(discover(s,mill).already);assert.equal(s.inventory.steel,steel);visit(s,bench);assert.ok(startJob(s,bench.id,'axe4',1,0).job);assert.deepEqual(s.helped,{});
});
test('neighbor rewards and perks are optional, useful, and cannot be claimed remotely or twice',()=>{
 const s=supplied(),npc=NATURAL_NODES.find(n=>n.person==='mara');s.accepted.mara=true;assert.ok(turnInQuest(s,'mara',npc).error);visit(s,npc);assert.ok(turnInQuest(s,'mara',npc).success);assert.ok(turnInQuest(s,'mara',npc).error);const plant=NATURAL_NODES.find(n=>n.type==='fiber');visit(s,plant);assert.equal(gather(s,plant).reward.fiber,6);
 const r=RECIPE_BY_ID.planks,normal=jobDuration(s,r);s.helped.jo=true;assert.equal(jobDuration(s,r),normal*.75);s.maxStamina=100;s.energy=1;s.helped.nell=true;assert.equal(consumeBerry(s).amount,44);
});
test('every recipe has a physical producer, valid ingredients, and no chapter gate',()=>{
 for(const r of ALL_RECIPES){assert.ok(r.stations.length);for(const id of r.stations)assert.ok(BUILDABLES[id].station);for(const item of Object.keys(r.cost))assert.ok(item in freshState().inventory);assert.ok(!('chapter' in r));}
 assert.ok(RECIPE_BY_ID['kit-workbench'].stations.includes('tent'));assert.ok(RECIPE_BY_ID['kit-forge'].stations.includes('workbench'));
});
test('workshop production can unlock every axe and pick tier without neighbor quest rewards',()=>{
 const s=supplied();const stations={};let x=1608;for(const kind of ['workbench','sharpener','kiln','forge','sawmill','sawbench']){stations[kind]=place(s,kind,x,3192);x+=168;}
 make(s,stations.workbench,'pick0');make(s,stations.sharpener,'axe1');make(s,stations.kiln,'ingots',10);make(s,stations.kiln,'coal',10);make(s,stations.forge,'axe2');make(s,stations.forge,'pick1');make(s,stations.forge,'steel',10);make(s,stations.forge,'axe3');make(s,stations.forge,'pick2');
 const mill=NATURAL_NODES.find(n=>n.discovery==='mill');visit(s,mill);discover(s,mill);make(s,stations.sawbench,'axe4');make(s,stations.sawbench,'pick3');assert.equal(s.axe,4);assert.equal(s.pick,3);assert.deepEqual(s.helped,{});
});
test('starter materials can be gathered with the initial equipment to make the first workbench',()=>{
 const s=freshState();for(const type of ['tree','loose','fiber']){const item={tree:'logs',loose:'stone',fiber:'fiber'}[type],required={logs:6,stone:4,fiber:2}[item];for(const n of NATURAL_NODES.filter(n=>n.type===type&&(type!=='tree'||n.tier===0)&&Math.hypot(n.x-CAMP.x,n.y-CAMP.y)<550)){visit(s,n);if(type==='tree'){while(!s.depleted[n.id]){if(s.energy<.65)recoverStamina(s,1);assert.equal(strike(s,n).error,undefined);}}else gather(s,n);if(s.inventory[item]>=required)break;}assert.ok(s.inventory[item]>=required,item+' must be available near camp');}
 make(s,s.structures[0],'kit-workbench');assert.equal(s.packed.workbench,1);assert.equal(s.axe,0);assert.equal(s.pick,-1);
});

test('collected tool becomes the active tool and malformed saves do not crash startup',()=>{
 const s=supplied(),bench=place(s,'workbench');make(s,bench,'pick0');assert.equal(s.equipped,'pick');assert.equal(loadState({getItem:()=>'{bad json'}).version,4);assert.equal(saveState(s,{setItem:()=>{throw Error('Unavailable');}}),false);
});

