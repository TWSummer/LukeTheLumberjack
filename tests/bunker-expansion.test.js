import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {freshState,loadState,saveState,SAVE_KEY,grant,rest,startJob,collectStation} from '../src/state.js';
import {NATURAL_NODES,terrainBlocked} from '../src/world.js';
import {BUNKER_NODES,BUNKER_RESOURCES,BUNKER_GATES,BUNKER_ROOMS,BUNKER_CACHES,BUNKER_NOTES} from '../src/bunker-data.js';
import {bunkerBlocked,canReachBunker,bunkerInactive} from '../src/bunker-geometry.js';
import {strikeBunker,bunkerResourceBlock,bunkerAction,visitBunkerRoom} from '../src/bunker.js';
import {lootBunker} from '../src/stories.js';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
const legacyJSON=fs.readFileSync(new URL('./fixtures/bunker-v4-save.json',import.meta.url),'utf8');
const node=id=>BUNKER_NODES.find(n=>n.id===id);
const inside=()=>{const s=freshState();s.scene='bunker';s.region='bunker';s.bunker.open=true;s.player={x:180,y:490};return s;};
const stand=(s,n,dx=0,dy=65)=>{s.player={x:n.x+dx,y:n.y+dy};};
function clear(s,n){s.energy=100;while(!bunkerInactive(s,n)){const r=strikeBunker(s,n);assert.equal(r.error,undefined,n.name);}}
function flood(s){const queue=[[180,490]],seen=new Set(['180,490']);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy]of [[10,0],[-10,0],[0,10],[0,-10]]){const xx=x+dx,yy=y+dy,key=xx+','+yy;if(!seen.has(key)&&!bunkerBlocked(s,xx,yy)){seen.add(key);queue.push([xx,yy]);}}}return queue;}
function accessible(s,points,n){const before=s.player;const yes=points.some(([x,y])=>{if(Math.hypot(x-n.x,y-n.y)>100)return false;s.player={x,y};return canReachBunker(s,n);});s.player=before;return yes;}

test('existing version-4 saves retain inventory, tools, home, jobs, quests, location and previous bunker loot',()=>{
 const storage=memory();storage.setItem(SAVE_KEY,legacyJSON);const before=JSON.parse(legacyJSON),s=loadState(storage);
 assert.equal(SAVE_KEY,'luke-open-world-v4');assert.equal(s.version,4);
 for(const key of Object.keys(before).filter(k=>k!=='bunker'))assert.deepEqual(s[key],before[key],key+' preserved');
 for(const [k,v]of Object.entries(before.bunker))assert.deepEqual(s.bunker[k],v,k+' preserved');
 assert.equal(s.bunker.expansion,1);assert.deepEqual(s.bunker.cleared,{});assert.equal(s.bunker.power,false);assert.ok(!terrainBlocked(s,s.player.x,s.player.y));
 assert.equal(storage.getItem(SAVE_KEY+'-before-bunker-expansion'),legacyJSON);assert.equal(storage.getItem(SAVE_KEY),legacyJSON);
 stand(s,node('bunker-tools'));assert.ok(lootBunker(s,'bunker-tools').already);assert.equal(s.inventory.scrap,before.inventory.scrap);
 saveState(s,storage);const again=loadState(storage);assert.deepEqual(again,s);assert.equal(storage.getItem(SAVE_KEY+'-before-bunker-expansion'),legacyJSON);
});
test('backup failure does not reset an otherwise valid old save, and surface node IDs never move',()=>{
 const s=loadState({getItem:k=>k===SAVE_KEY?legacyJSON:null,setItem:()=>{throw Error('Storage full');}});assert.equal(s.day,14);assert.equal(s.inventory.logs,137);
 const expected=fs.readFileSync(new URL('./fixtures/world-v4-hash.txt',import.meta.url),'utf8');assert.equal(createHash('sha256').update(JSON.stringify(NATURAL_NODES)).digest('hex'),expected);
});
test('every formerly walkable position in the entrance rooms remains walkable',()=>{
 const s=inside(),oldWalls=[{x:396,y:84,w:20,h:176},{x:396,y:344,w:20,h:252},{x:416,y:354,w:190,h:20},{x:700,y:354,w:106,h:20}];
 for(let x=110;x<796;x+=20)for(let y=100;y<586;y+=20){if(oldWalls.some(b=>x>b.x-9&&x<b.x+b.w+9&&y>b.y-9&&y<b.y+b.h+9))continue;assert.equal(bunkerBlocked(s,x,y),false,'legacy floor '+x+','+y);}
});
test('the service barricade blocks entry, takes real swings, gives salvage once and stays cleared after rest',()=>{
 const s=inside(),n=node('service-barricade');stand(s,n,-85,0);assert.ok(bunkerBlocked(s,n.x,n.y));const first=strikeBunker(s,n);assert.equal(first.remaining,15);assert.equal(s.bunker.damage[n.id],1);assert.equal(s.stats.qualityTrees,0);
 clear(s,n);assert.equal(s.inventory.scrap,4);assert.equal(s.inventory.logs,8);assert.equal(bunkerBlocked(s,n.x,n.y),false);assert.ok(strikeBunker(s,n).error);assert.equal(s.inventory.scrap,4);
 s.scene='woods';stand(s,s.structures[0],0,70);assert.ok(rest(s,s.structures[0]).success);s.scene='bunker';assert.equal(bunkerBlocked(s,n.x,n.y),false);
});
test('bunker chopping/mining respect tool tiers, custody, stamina, proximity and walls',()=>{
 const s=inside(),rubble=node('barracks-rubble');stand(s,rubble,0,-80);assert.match(bunkerResourceBlock(s,rubble),/pickaxe/);s.pick=0;assert.equal(strikeBunker(s,rubble).remaining,27);
 s.energy=0;assert.match(bunkerResourceBlock(s,rubble),/breather/);s.energy=100;s.structures.push({id:'service-pick',kind:'forge',x:1000,y:2800,jobs:[{recipe:'pick1'}]});assert.match(bunkerResourceBlock(s,rubble),/workstation/);s.structures.pop();
 const quartz=node('deep-quartz-0');stand(s,quartz,80,0);assert.match(bunkerResourceBlock(s,quartz),/Prospector/);s.pick=3;assert.ok(!strikeBunker(s,quartz).error);
 s.player={x:180,y:490};assert.ok(strikeBunker(s,quartz).error);s.player={x:440,y:230};assert.equal(canReachBunker(s,{id:'across-wall',x:370,y:230}),false);
});
test('repairing power and running pumps opens actual doors and drains collision, with costs charged once',()=>{
 const s=inside();assert.ok(bunkerAction(s,'generator-panel').error);stand(s,node('pump-panel'));assert.match(bunkerAction(s,'pump-panel').error,/generator/);
 stand(s,node('generator-panel'));assert.ok(bunkerAction(s,'generator-panel').error);grant(s,{scrap:6,copper:4});assert.ok(bunkerBlocked(s,2312,300));assert.ok(bunkerAction(s,'generator-panel').changed);assert.equal(s.inventory.scrap,0);assert.equal(bunkerBlocked(s,2312,300),false);assert.ok(!bunkerAction(s,'generator-panel').changed);assert.equal(s.inventory.scrap,0);
 assert.ok(bunkerBlocked(s,1960,1272));assert.ok(bunkerBlocked(s,2000,1500));stand(s,node('pump-panel'));assert.ok(bunkerAction(s,'pump-panel').changed);assert.equal(bunkerBlocked(s,1960,1272),false);assert.equal(bunkerBlocked(s,2000,1500),false);
});
test('the shortcut opens from the barracks side and remains bidirectional',()=>{
 const s=inside(),door=node('return-bulkhead');stand(s,door,-65,0);assert.match(bunkerAction(s,door.id).error,/barracks/);stand(s,door,65,0);assert.ok(bunkerAction(s,door.id).changed);assert.equal(bunkerBlocked(s,door.x,door.y),false);stand(s,door,-65,0);assert.ok(bunkerAction(s,door.id).text);
});
test('expanded map has useful branches and every room, cache and control is reachable after its barriers open',()=>{
 const s=inside();let reachable=flood(s);assert.equal(accessible(s,reachable,node('bunker-machinist')),false);assert.ok(accessible(s,reachable,node('service-barricade')));
 s.bunker.cleared['service-barricade']=true;reachable=flood(s);assert.ok(accessible(s,reachable,node('bunker-machinist')));assert.ok(accessible(s,reachable,node('generator-pallets')));assert.ok(accessible(s,reachable,node('barracks-rubble')));
 for(const n of BUNKER_RESOURCES)s.bunker.cleared[n.id]=true;reachable=flood(s);assert.equal(accessible(s,reachable,node('bunker-vault')),false,'the flooded lower passages cannot be bypassed');
 s.bunker.power=true;s.bunker.drained=true;s.bunker.shortcut=true;reachable=flood(s);
 for(const n of BUNKER_NODES)assert.ok(accessible(s,reachable,n),'reachable: '+n.id);
 for(const r of BUNKER_ROOMS)assert.ok(reachable.some(([x,y])=>x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h),r.id);
 assert.ok(reachable.length>30000,'substantially more ground to explore');
});
test('mineral seams replenish on a new day, while shipping crates and barricades do not',()=>{
 const s=inside();s.pick=3;s.axe=4;const ore=node('bunker-ore-0');stand(s,ore,80,0);clear(s,ore);assert.equal(s.inventory.ore,4);assert.ok(strikeBunker(s,ore).error);
 const crate=node('salvage-0');stand(s,crate,0,70);clear(s,crate);s.day++;assert.ok(!bunkerInactive(s,ore));assert.ok(bunkerInactive(s,crate));stand(s,ore,80,0);clear(s,ore);assert.equal(s.inventory.ore,8);
});
test('notes, machinery, ore damage and map discoveries persist on resume; new caches do not reset old ones',()=>{
 const s=inside();stand(s,node('bunker-note-repairs'));assert.ok(bunkerAction(s,'bunker-note-repairs').text);assert.ok(visitBunkerRoom(s));assert.equal(visitBunkerRoom(s),null);
 s.pick=0;stand(s,node('barracks-rubble'),0,-80);strikeBunker(s,node('barracks-rubble'));s.bunker.looted.tools=true;s.bunker.power=true;s.bunker.drained=true;s.bunker.shortcut=true;s.bunker.cleared['service-barricade']=true;
 const store=memory();saveState(s,store);const loaded=loadState(store);assert.deepEqual(loaded.bunker,s.bunker);assert.deepEqual(loaded.player,s.player);assert.equal(loaded.bunker.looted.machinist,undefined);assert.equal(loaded.bunker.damage['barracks-rubble'],3);
});
test('survey vault plans unlock a useful physical forge recipe; bonus supplies and plans are claimed only once',()=>{
 const s=inside(),forge={id:'test-forge',kind:'forge',x:1100,y:3100,rotation:0,jobs:[]};s.structures.push(forge);s.scene='woods';stand(s,forge);grant(s,{scrap:6,coal:2});assert.match(startJob(s,forge.id,'reclaim-steel',1,0).error,/plans/);
 s.scene='bunker';stand(s,node('bunker-vault'));assert.ok(lootBunker(s,'bunker-vault').blueprint);assert.equal(s.inventory.steel,16);assert.ok(lootBunker(s,'bunker-vault').already);assert.equal(s.inventory.steel,16);
 s.scene='woods';stand(s,forge);assert.ok(startJob(s,forge.id,'reclaim-steel',1,0).job);assert.equal(s.inventory.steel,16);assert.equal(collectStation(s,forge.id,10000).output.steel,2);assert.equal(s.inventory.steel,18);
});
