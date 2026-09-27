import {ITEMS,AXE_TIERS,PICK_TIERS,TREE_TIERS,ROCK_TIERS,SIDE_QUESTS,DISCOVERIES} from './data.js';
import {BUILDABLES,RECIPE_BY_ID,BRIDGE_COST,nearStructure,placementBlock,houseProgress} from './construction.js';
import {CAMP,BRIDGE,WORLD,zoneAt} from './world.js';
import {BUNKER,freshBunker} from './bunker-data.js';
import {FITNESS,RACE,freshRace} from './activity-data.js';
import {maxStamina} from './activities.js';

export const SAVE_KEY='luke-open-world-v4';
export function freshState(){return {version:4,scene:'woods',stats:{qualityTrees:0},olga:{step:0,active:false,loggingStart:0},moonbellFound:false,bunker:freshBunker(),day:1,maxStamina:FITNESS.start,energy:FITNESS.start,winded:false,training:null,swiftnessFound:false,race:freshRace(),inventory:Object.fromEntries(Object.keys(ITEMS).map(k=>[k,0])),packed:{},axe:0,pick:-1,equipped:'axe',structures:[{id:'tent',kind:'tent',x:CAMP.x,y:CAMP.y,rotation:0,region:'home',jobs:[]}],nextId:1,player:{x:CAMP.x+70,y:CAMP.y+110},region:'home',depleted:{},damage:{},visited:{home:true},accepted:{},helped:{},discovered:{},bridge:false,sound:false,finished:false};}
export function saveState(s,storage){try{storage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function loadState(storage){
 const s=freshState();try{const serialized=storage.getItem(SAVE_KEY),raw=JSON.parse(serialized);if(raw?.version!==4)return s;
  // Preserve the original save before adding bunker fields. A blocked backup write must not reset progress.
  if(raw.bunker?.expansion!==1)try{const key=SAVE_KEY+'-before-bunker-expansion';if(!storage.getItem(key))storage.setItem(key,serialized);}catch{}
  for(const k of ['inventory','packed','depleted','damage','visited','accepted','helped','discovered'])if(raw[k]&&typeof raw[k]==='object'&&!Array.isArray(raw[k]))s[k]={...s[k],...raw[k]};
  for(const k of Object.keys(ITEMS))s.inventory[k]=Math.max(0,Math.floor(Number(s.inventory[k])||0));
  for(const k of Object.keys(s.packed))s.packed[k]=BUILDABLES[k]?Math.max(0,Math.floor(Number(s.packed[k])||0)):0;
  s.axe=Math.min(4,Math.max(0,Math.floor(Number(raw.axe)||0)));s.pick=Math.min(3,Math.max(-1,Math.floor(Number(raw.pick)??-1)));if(!Number.isFinite(s.pick))s.pick=-1;
  s.day=Math.max(1,Math.floor(Number(raw.day)||1));
  s.maxStamina=Math.max(FITNESS.start,Math.min(FITNESS.max,Math.floor(Number(raw.maxStamina)||FITNESS.start)));
  if(raw.maxStamina===undefined)try{const key=SAVE_KEY+'-before-stamina-training';if(!storage.getItem(key))storage.setItem(key,serialized);}catch{}
  s.energy=Math.max(0,Math.min(s.maxStamina,(Number(raw.energy)||0)*(raw.maxStamina===undefined?FITNESS.start/100:1)));s.winded=!!raw.winded;
  s.swiftnessFound=!!raw.swiftnessFound;
  if(raw.race){const r=raw.race;s.race.side=r.side==='east'?'east':'west';for(const k of ['wins','losses'])s.race[k]=Math.max(0,Math.floor(Number(r[k])||0));if(r.last)s.race.last={won:!!r.last.won,forfeit:!!r.last.forfeit,margin:Math.max(0,Number(r.last.margin)||0)};
   const a=r.active;if(a&&[RACE.west,RACE.east].includes(a.start)&&a.direction===(a.start===RACE.west?1:-1)&&['countdown','running'].includes(a.phase)&&[a.countdown,a.elapsed,a.distance].every(Number.isFinite))s.race.active={start:a.start,direction:a.direction,phase:a.phase,countdown:Math.max(0,Math.min(RACE.countdown,a.countdown)),elapsed:Math.max(0,a.elapsed),distance:Math.max(0,Math.min(RACE.east-RACE.west,a.distance))};
  }
  s.bridge=!!raw.bridge;s.sound=!!raw.sound;s.finished=!!raw.finished;s.equipped=raw.equipped==='pick'?'pick':'axe';
  if(Number.isFinite(raw.player?.x)&&Number.isFinite(raw.player?.y))s.player={x:Math.max(40,Math.min(WORLD.width-40,raw.player.x)),y:Math.max(40,Math.min(WORLD.height-40,raw.player.y))};s.region=zoneAt(s.player.x,s.player.y);
  s.stats.qualityTrees=Math.max(0,Math.floor(Number(raw.stats?.qualityTrees)||0));
  if(raw.olga&&Number.isInteger(raw.olga.step)&&raw.olga.step>=0&&raw.olga.step<=4)s.olga={...s.olga,...raw.olga,active:!!raw.olga.active,loggingStart:Math.max(0,Number(raw.olga.loggingStart)||0)};
  s.moonbellFound=!!raw.moonbellFound;
  if(raw.bunker){for(const k of ['open','power','drained','shortcut','blueprint'])s.bunker[k]=!!raw.bunker[k];for(const k of ['looted','cleared','damage','mined','read','rooms'])if(raw.bunker[k]&&typeof raw.bunker[k]==='object'&&!Array.isArray(raw.bunker[k]))s.bunker[k]={...s.bunker[k],...raw.bunker[k]};for(const k of ['harvestDay','gardenDay','saying'])s.bunker[k]=Math.max(0,Math.floor(Number(raw.bunker[k])||0));}
  if(raw.scene==='bunker'&&s.bunker.open){s.scene='bunker';s.region='bunker';s.player={x:Math.max(40,Math.min(BUNKER.width-40,s.player.x)),y:Math.max(40,Math.min(BUNKER.height-40,s.player.y))};}
  const seen=new Set();s.structures=(raw.structures||[]).filter(o=>o&&BUILDABLES[o.kind]&&Number.isFinite(o.x)&&Number.isFinite(o.y)&&typeof o.id==='string'&&!seen.has(o.id)&&(seen.add(o.id),true)).map(o=>({...o,rotation:Math.round((o.rotation||0)/90)*90,jobs:(o.jobs||[]).filter(j=>RECIPE_BY_ID[j.recipe]?.stations.includes(o.kind)&&Number.isFinite(j.readyAt)).map(j=>{const r=RECIPE_BY_ID[j.recipe],count=r.tool?1:validCraftCount(j.count)?j.count:1;return {...j,count,output:jobOutput(r,o,count),status:j.status==='ready'?'ready':'working'};})}));
  if(!s.structures.some(o=>o.id==='tent'))s.structures.unshift(freshState().structures[0]);s.nextId=Math.max(1,Number(raw.nextId)||1,...s.structures.map(o=>(Number(o.id.replace('placed-',''))||0)+1));
 }catch{return freshState();}return s;
}
export const getStructure=(s,id)=>s.structures.find(o=>o.id===id);
export const toolAtBench=(s,tool)=>s.structures.find(o=>o.jobs.some(j=>RECIPE_BY_ID[j.recipe]?.tool===tool));
export const affordable=(s,cost)=>Object.entries(cost).every(([k,n])=>(s.inventory[k]||0)>=n);
export const scaledCost=(cost,count=1)=>Object.fromEntries(Object.entries(cost).map(([k,v])=>[k,v*count]));
export function grant(s,reward){for(const [k,n]of Object.entries(reward))s.inventory[k]=(s.inventory[k]||0)+n;}
export function spend(s,cost){if(!affordable(s,cost))return false;for(const [k,n]of Object.entries(cost))s.inventory[k]-=n;return true;}
export function jobOutput(r,station,count=1){return r.id==='planks'?{planks:(station.kind==='sawmill'?6:2)*count}:scaledCost(r.output||{},count);}
export function jobDuration(s,r,count=1){return r.duration*count*(s.helped.jo?.75:1);}
export const validCraftCount=count=>Number.isSafeInteger(count)&&count>=1;
export function maxCraftable(s,r){if(!r)return 0;return Math.max(0,Math.min(r.tool?1:Number.MAX_SAFE_INTEGER,Math.floor(Number.MAX_SAFE_INTEGER/(r.duration*1000)),...Object.entries(r.cost).map(([k,n])=>Math.floor((s.inventory[k]||0)/n))));}
export function recipeBlock(s,r,stationId,count=1){
 const station=getStructure(s,stationId);if(!r||!station||!r.stations.includes(station.kind))return 'Use the appropriate workstation.';
 if(!nearStructure(s,station))return 'Walk up to this workstation.';
 if(station.jobs.length)return 'Collect or cancel this station’s job first.';
 if(!validCraftCount(count)||!Number.isSafeInteger(Math.ceil(jobDuration(s,r,count)*1000)))return 'Choose a positive whole number.';
 if(r.tool&&count!==1)return 'Service one tool at a time.';
 if(r.bunkerPlan&&!s.bunker.blueprint)return 'Find the salvage engineer’s plans in the bunker survey vault.';
 if(r.discovery&&!s.discovered[r.discovery])return 'Find the millwright’s chest across the river.';
 if(r.tool){if(s[r.tool]>=r.level)return 'Already equipped';if(s[r.tool]!==r.level-1)return 'Requires the previous tool tier.';if(toolAtBench(s,r.tool))return 'Your tool is at another bench.';}
 if(!affordable(s,scaledCost(r.cost,count)))return 'More materials needed';return null;
}
export function startJob(s,id,recipeId,count=1,now=Date.now()){
 const r=RECIPE_BY_ID[recipeId],error=recipeBlock(s,r,id,count);if(error)return {error};const station=getStructure(s,id);spend(s,scaledCost(r.cost,count));const job={recipe:r.id,count,startedAt:now,readyAt:now+jobDuration(s,r,count)*1000,status:'working',output:jobOutput(r,station,count)};station.jobs.push(job);return {job};
}
export function tickWorkstations(s,now=Date.now()){const ready=[];for(const o of s.structures)for(const j of o.jobs)if(j.status!=='ready'&&j.readyAt<=now){j.status='ready';ready.push(o);}return ready;}
export function collectStation(s,id,now=Date.now()){
 const o=getStructure(s,id);if(!nearStructure(s,o))return {error:'Return to this station to collect.'};tickWorkstations(s,now);const ready=o.jobs.filter(j=>j.status==='ready');if(!ready.length)return {error:'Work is still in progress.'};const output={},kits={};let tool=null;
 for(const j of ready){const r=RECIPE_BY_ID[j.recipe];if(r.tool){s[r.tool]=Math.max(s[r.tool],r.level);s.equipped=r.tool;tool=r.tool;}else if(r.kit){s.packed[r.kit]=(s.packed[r.kit]||0)+j.count;kits[r.kit]=(kits[r.kit]||0)+j.count;}else for(const [k,n]of Object.entries(j.output))output[k]=(output[k]||0)+n;}
 grant(s,output);o.jobs=o.jobs.filter(j=>j.status!=='ready');return {output,kits,tool};
}
export function cancelJob(s,id,now=Date.now()){
 const o=getStructure(s,id);if(!nearStructure(s,o))return {error:'Return to this workstation.'};tickWorkstations(s,now);const jobs=o.jobs.filter(j=>j.status==='working');if(!jobs.length)return {error:'Collect finished work instead.'};for(const j of jobs)grant(s,scaledCost(RECIPE_BY_ID[j.recipe].cost,j.count));o.jobs=o.jobs.filter(j=>j.status==='ready');return {success:true};
}
export function placeStructure(s,kind,x,y,rotation=0){
 const error=placementBlock(s,kind,x,y,rotation);if(error)return {error};if(!(s.packed[kind]>0))return {error:'Craft and collect this building kit at a workstation first.'};
 s.packed[kind]--;const structure={id:'placed-'+s.nextId++,kind,x,y,rotation,region:zoneAt(x,y),jobs:[]};s.structures.push(structure);return {structure};
}
export function moveStructure(s,id,x,y,rotation=0){const o=getStructure(s,id);if(!o||BUILDABLES[o.kind].fixed)return {error:'This landmark stays here.'};if(!nearStructure(s,o))return {error:'Return to this piece.'};if(o.jobs.length)return {error:'Collect or cancel the work first.'};const error=placementBlock(s,o.kind,x,y,rotation,id);if(error)return {error};Object.assign(o,{x,y,rotation,region:zoneAt(x,y)});return {structure:o};}
export function packStructure(s,id){const o=getStructure(s,id);if(!o||BUILDABLES[o.kind].fixed)return {error:'Your tent stays here.'};if(!nearStructure(s,o))return {error:'Walk up to this piece.'};if(o.jobs.length)return {error:'Collect or cancel the work first.'};if(['moonbell','swiftness'].includes(o.plant))grant(s,{[o.plant]:1});s.packed[o.kind]=(s.packed[o.kind]||0)+1;s.structures=s.structures.filter(n=>n.id!==id);return {kind:o.kind};}
export function resourceBlock(s,n){
 if(s.scene==='bunker')return 'These resources grow in the woods above.';
 if(!n||s.depleted[n.id])return 'Find a fresh resource.';if(Math.hypot(n.x-s.player.x,n.y-s.player.y)>110)return 'Move closer.';
 if(n.type==='tree'||n.type==='rock'){
  const tool=n.type==='tree'?'axe':'pick',tiers=tool==='axe'?AXE_TIERS:PICK_TIERS;
  if(s[tool]<0)return 'Craft a stone pickaxe at your workbench.';
  if(toolAtBench(s,tool))return 'Collect your tool from its workstation first.';
  if(s[tool]<n.tier)return 'Requires '+tiers[n.tier].name+'.';
  if(s.energy<.65)return 'Take a breather or eat berries [F].';
 }if(n.type==='sap'&&!s.inventory.tap)return 'Craft a tapping kit at a workbench.';return null;
}
export function strike(s,n){
 if(!['tree','rock'].includes(n?.type))return {error:'Face a tree or a rock.'};const error=resourceBlock(s,n);if(error)return {error};
 const tool=n.type==='tree'?'axe':'pick',gear=(tool==='axe'?AXE_TIERS:PICK_TIERS)[s[tool]],def=(tool==='axe'?TREE_TIERS:ROCK_TIERS)[n.tier];s.equipped=tool;s.energy=Math.max(0,s.energy-.65);s.damage[n.id]=(s.damage[n.id]||0)+gear.damage;
 if(s.damage[n.id]<def.hp)return {damage:gear.damage,remaining:def.hp-s.damage[n.id],hp:def.hp};
 const reward=tool==='axe'?{logs:def.logs,...(def.hardwood?{hardwood:def.hardwood}:{})}:{stone:def.stone,ore:def.ore||1,...(def.crystal?{crystal:def.crystal}:{})};s.depleted[n.id]=true;delete s.damage[n.id];if(tool==='axe'&&n.tier>=1)s.stats.qualityTrees++;grant(s,reward);return {reward,remaining:0,hp:def.hp};
}
export function gather(s,n){const error=resourceBlock(s,n);if(error)return {error};const mult=s.helped.mara?2:1;const reward=({loose:{stone:3},fiber:{fiber:3*mult},berries:{berries:3*mult},mushrooms:{mushrooms:2*mult},sap:{sap:2}})[n.type];if(!reward)return {error:'Use Space to chop or mine.'};s.depleted[n.id]=true;grant(s,reward);return {reward};}
export function discover(s,n){if(s.scene==='bunker'||n?.type!=='discovery'||Math.hypot(n.x-s.player.x,n.y-s.player.y)>110)return {error:'Walk closer to investigate.'};const d=DISCOVERIES[n.discovery];if(s.discovered[n.discovery])return {text:d.text,already:true};s.discovered[n.discovery]=true;grant(s,d.reward);grant(s,{relic:1});return {text:d.text,reward:d.reward,blueprint:!!d.blueprint};}
export function repairBridge(s){if(s.scene==='bunker')return {error:'Return to the river crossing.'};if(s.bridge)return {error:'The bridge is already repaired.'};if(Math.hypot(s.player.x-BRIDGE.x,s.player.y-BRIDGE.y)>210)return {error:'Bring the materials to the river crossing.'};if(!spend(s,BRIDGE_COST))return {error:'Bring 24 planks and 6 cord.'};s.bridge=true;return {success:true};}
export function turnInQuest(s,person,npc){const q=SIDE_QUESTS[person];if(!q||!s.accepted[person]||s.helped[person])return {error:'There is no active request.'};if(s.scene==='bunker'||!npc||Math.hypot(npc.x-s.player.x,npc.y-s.player.y)>110)return {error:'Return to your neighbor.'};if(!spend(s,q.request))return {error:'Gather the requested items first.'};grant(s,q.reward);s.helped[person]=true;return {success:true};}
export function consumeBerry(s){if(s.race.active)return {error:'No snacks during a race. Walter insists on a fair start.'};if(!s.inventory.berries)return {error:'Gather some blueberries first.'};if(s.energy>=maxStamina(s))return {error:'Your stamina is already full.'};s.inventory.berries--;const amount=Math.min(maxStamina(s)-s.energy,s.helped.nell?44:22);s.energy+=amount;if(s.energy>=FITNESS.windedRecovery)s.winded=false;return {amount};}
export function rest(s,site,now=Date.now()){if(!site||!nearStructure(s,site)||!['tent','bed','campfire'].includes(site.kind))return {error:'Rest at your tent, bed, or campfire.'};if(s.race.active)return {error:'Finish your race before resting.'};s.day++;s.energy=maxStamina(s);s.winded=false;s.depleted={};s.damage={};for(const o of s.structures)for(const j of o.jobs)j.readyAt=Math.min(j.readyAt,now);tickWorkstations(s,now);return {success:true};}
export function gatheringReady(s){return houseProgress(s).complete&&Object.values(s.helped).filter(Boolean).length>=3;}
