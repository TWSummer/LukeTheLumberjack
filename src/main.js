import {ITEMS,AXE_TIERS,PICK_TIERS,TREE_TIERS,ROCK_TIERS,REGIONS,DISCOVERIES,PEOPLE,itemIcon,portraitSVG} from './data.js';
import {freshState,loadState,saveState,getStructure,toolAtBench,tickWorkstations,resourceBlock,strike,gather,discover,consumeBerry} from './state.js';
import {BUILDABLES,worldNodes,bounds,solidStructure,pointInBounds,nearStructure,naturalRadius} from './construction.js';
import {BRIDGE,CAMP,terrainBlocked,zoneAt,nodeName} from './world.js';
import {Renderer,drawMap} from './renderer.js';
import {createUI} from './ui.js';
import {BUNKER,BUNKER_CACHES} from './story-data.js';
import {bunkerInactive,canReachBunker,bunkerRoomAt} from './bunker-geometry.js';
import {bunkerResourceBlock,strikeBunker,visitBunkerRoom} from './bunker.js';
import {createTouchControls} from './touch-controls.js';
const $=s=>document.querySelector(s);
let storage;try{storage=localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error();}};}
const state=loadState(storage),keys=new Set();let nodes=worldNodes(state),nearest=null,targetId=null,last=0,uiTimer=0,saveTimer=0,swingCooldown=0,actionTime=0,clickDestination=null,lastError='',errorAt=0,lastSaved=true,bannerTimer,touch=null,autoHarvestId=null,worldPointer=null;
const renderer=new Renderer($('#world'),state,nodes);
const ui=createUI(state,renderer,{changed,toast,clearKeys:stopInput,playSound,controls:()=>touch});
function stopInput(){keys.clear();clickDestination=null;autoHarvestId=null;worldPointer=null;touch?.reset();}
$('#portrait').innerHTML=portraitSVG();$('#axe-icon').innerHTML=itemIcon('axe');$('#pick-icon').innerHTML=itemIcon('pickaxe');$('#kit-icon').innerHTML=itemIcon('workbench');$('#berry-icon').innerHTML=itemIcon('berries');
function persist(){lastSaved=saveState(state,storage);$('#save-status').textContent=lastSaved?'Saved locally':'Saving unavailable';}
function changed(rebuild=false){if(rebuild){nodes=worldNodes(state);renderer.nodes=nodes;targetId=null;nearest=null;ensurePlayerSpace();}persist();updateHUD();}
function toast(message,type=''){if(type==='error'&&message===lastError&&Date.now()-errorAt<1700)return;if(type==='error'){lastError=message;errorAt=Date.now();}const el=document.createElement('div');el.className='toast '+type;el.textContent=message;$('#toast-stack').append(el);while($('#toast-stack').children.length>3)$('#toast-stack').firstChild.remove();setTimeout(()=>el.remove(),4000);}
function banner(text){clearTimeout(bannerTimer);$('#discovery-banner').textContent=text;$('#discovery-banner').hidden=false;bannerTimer=setTimeout(()=>$('#discovery-banner').hidden=true,6500);}
function blocked(x,y){if(terrainBlocked(state,x,y))return true;return nodes.some(n=>{if(state.depleted[n.id]||Math.abs(n.x-x)>180||Math.abs(n.y-y)>180)return false;if(n.type==='structure')return solidStructure(n)&&pointInBounds(x,y,bounds(n),9);if(['tree','rock','mansion','ruin','workshop','sap','cottage'].includes(n.type)){const radius=['mansion','ruin','cottage'].includes(n.type)?75:n.type==='workshop'?36:n.type==='tree'?11+n.tier*5:n.type==='sap'?13:19+n.tier*7;return Math.hypot(n.x-x,n.y-y)<radius+8;}return false;});}
function ensurePlayerSpace(){if(!blocked(state.player.x,state.player.y))return;const p={...state.player};for(let r=16;r<260;r+=16)for(let i=0;i<24;i++){const x=p.x+Math.cos(i*Math.PI/12)*r,y=p.y+Math.sin(i*Math.PI/12)*r;if(!blocked(x,y)){state.player={x,y};return;}}state.player=state.scene==='bunker'?{...BUNKER.spawn}:{x:CAMP.x+70,y:CAMP.y+110};}
function distance(n){if(n.type==='structure'){const b=bounds(n);return Math.hypot(Math.max(0,Math.abs(n.x-state.player.x)-b.w/2),Math.max(0,Math.abs(n.y-state.player.y)-b.h/2));}return Math.hypot(n.x-state.player.x,n.y-state.player.y);}
function nearby(){return nodes.filter(n=>!state.depleted[n.id]&&!bunkerInactive(state,n)&&(state.scene!=='bunker'||canReachBunker(state,n))&&!['mansion','ruin','workshop','kettle','cottage','picnic'].includes(n.type)&&distance(n)<(n.type==='crossing'?210:n.type==='structure'?78:110)).map(n=>({n,score:distance(n)+(n.type==='structure'&&BUILDABLES[n.kind].layer?40:0)+((n.x-state.player.x)*renderer.facing<0?14:0)})).sort((a,b)=>a.score-b.score).map(p=>p.n);}
function selectTarget(){const list=nearby();nearest=list.find(n=>n.id===targetId)||list[0]||null;if(targetId&&!list.some(n=>n.id===targetId))targetId=null;renderer.nearest=nearest;}
function targetHTML(n){
 if(!n)return '';if(n.type==='structure'){const o=getStructure(state,n.id),d=BUILDABLES[n.kind];return `<strong>${d.name}</strong><small><kbd>E</kbd>${o.jobs.some(j=>j.status==='ready')?'Collect finished work':o.jobs.length?'Check work in progress':d.station?'Craft here':n.kind==='bed'?'Rest / arrange':'Arrange / use'}</small>`;}
 if(n.type==='bunkerresource'){const error=bunkerResourceBlock(state,n);return '<strong>'+n.name+'</strong><small class="'+(error?'locked':'')+'">'+(error||'<kbd>HOLD SPACE</kbd>'+(n.tool==='axe'?'Chop / salvage':'Mine'))+(n.barrier?' · opens a passage':'')+'</small>';}
 if(['bunkergate','bunkercontrol','bunkernote','bunkergarden'].includes(n.type))return '<strong>'+n.name+'</strong><small><kbd>E</kbd>'+({bunkergate:state.bunker[n.flag]?'Inspect open passage':n.flag==='shortcut'?'Release from the barracks side':n.flag==='drained'?'Inspect flooded passage':'Inspect blast door',bunkercontrol:n.action==='power'?(state.bunker.power?'Generator running':'Repair · 6 scrap + 4 copper'):(state.bunker.drained?'Pumps running':'Drain the lower passages'),bunkernote:'Read the old records',bunkergarden:'Gather living cultures'})[n.type]+'</small>';
 if(['bunker','bunkerexit','bunkercache','growtray','rareplant'].includes(n.type)){const label=({bunker:'Abandoned bunker',bunkerexit:'Stairs to the woods',bunkercache:BUNKER_CACHES[n.cache]?.name,growtray:'Lantern-cap grow tray',rareplant:'Silver-blue moonbell'})[n.type];return '<strong>'+label+'</strong><small><kbd>E</kbd>'+({bunker:state.bunker.open?'Enter the bunker':'Pry open · requires a forged crowbar',bunkerexit:'Climb out',bunkercache:state.bunker.looted[n.cache]?'Inspect searched cache':'Search for salvage',growtray:'Gather living lantern caps',rareplant:state.moonbellFound?'A cutting is already yours':'Take a cutting for your garden'})[n.type]+'</small>';}
 if(n.type==='crossing')return `<strong>Mosswater crossing</strong><small><kbd>E</kbd>${state.bridge?'A way to the eastern woods':'Repair bridge · 24 planks + 6 cord'}</small>`;
 if(n.type==='npc')return `<strong>${PEOPLE[n.person].name}</strong><small><kbd>E</kbd>Talk · ${n.person==='olga'&&state.olga.step===4?'At home with Luke':n.person==='olga'&&state.olga.step===2&&state.olga.active?'Your picnic date':PEOPLE[n.person].role}</small>`;
 if(n.type==='tree'||n.type==='rock'){const def=(n.type==='tree'?TREE_TIERS:ROCK_TIERS)[n.tier],error=resourceBlock(state,n);return `<strong>${nodeName(n)}</strong><small class="${error?'locked':''}">${error||'<kbd>HOLD SPACE</kbd>'+(n.type==='tree'?'Chop':'Mine')} · ${n.type==='tree'?def.logs+' wood':def.stone+' stone'+(def.ore?' + '+def.ore+' ore':' + traces of ore')}</small>`;}
 return `<strong>${n.type==='discovery'?DISCOVERIES[n.discovery].name:n.type==='sign'?'Woodland trail sign':nodeName(n)}</strong><small><kbd>E</kbd>${n.type==='discovery'?'Investigate':n.type==='sign'?'Read the trail markers':'Gather'}</small>`;
}
function updateHUD(){
 $('#location-kicker').textContent=state.scene==='bunker'?'HEMLOCK RIDGE · UNDERGROUND':'MASSACHUSETTS · EARLY AUTUMN';
 $('#minimap').setAttribute('aria-label',state.scene==='bunker'?'Bunker floor plan with your position':'World map with your position');
 $('#energy-fill').style.width=state.energy+'%';$('#energy-label').textContent='Stamina '+Math.floor(state.energy)+' / 100';$('#location-name').textContent=state.scene==='bunker'?(bunkerRoomAt(state.player.x,state.player.y)?.name||'Service tunnels'):REGIONS[state.region].name;$('#day-label').textContent='Day '+state.day+' · '+Math.round(state.player.x)+', '+Math.round(state.player.y);
 $('#supplies').innerHTML=['logs','stone','fiber'].map(k=>`<span title="${ITEMS[k].name}">${itemIcon(k)}${state.inventory[k]}</span>`).join('');$('#berry-count').textContent=state.inventory.berries+' berries';
 $('#axe-button').classList.toggle('active',state.equipped==='axe');$('#pick-button').classList.toggle('active',state.equipped==='pick');$('#equipped-name').textContent=toolAtBench(state,state.equipped)?'Tool at the workstation':state.equipped==='axe'?AXE_TIERS[state.axe].name:state.pick<0?'No pickaxe · make one at a workbench':PICK_TIERS[state.pick].name;
 $('#kits-button').title='Packed building kits [V] · '+Object.values(state.packed).reduce((a,n)=>a+n,0)+' packed';
 const html=targetHTML(nearest);$('#target-info').hidden=!nearest||!!ui.placement||!!ui.modal;if($('#target-info').innerHTML!==html)$('#target-info').innerHTML=html;
 renderer.touchMode=!!touch?.enabled;touch?.update(nearest,autoHarvestId);drawMap($('#minimap'),state,true);
}
function rewards(reward){return Object.entries(reward).map(([k,n])=>'+'+n+' '+ITEMS[k].short).join(' · ');}
function useResource(preferredId=null){
 const choices=nearby().filter(n=>['tree','rock','bunkerresource'].includes(n.type)),n=preferredId?choices.find(n=>n.id===preferredId):choices.find(n=>n.id===nearest?.id)||choices[0];if(!n)return false;
 const underground=n.type==='bunkerresource',tool=underground?n.tool:n.type==='tree'?'axe':'pick',result=underground?strikeBunker(state,n):strike(state,n);
 if(result.error){toast(result.error,'error');swingCooldown=.6;return false;}
 targetId=n.id;renderer.action={node:n};actionTime=.23;const gear=(tool==='axe'?AXE_TIERS:PICK_TIERS)[state[tool]];swingCooldown=gear.interval;
 renderer.burst(n.x,n.y,tool==='axe'?'#d0a76b':'#bec5a8',result.reward?20:5);playSound(tool==='axe'?'chop':'mine');
 if(result.reward){toast(rewards(result.reward),'reward');if(result.opened)banner('Passage cleared. You can walk through.');if(autoHarvestId===n.id)autoHarvestId=null;targetId=null;selectTarget();persist();}updateHUD();return true;
}
function cycleTarget(){autoHarvestId=null;clickDestination=null;const list=nearby(),i=list.findIndex(n=>n.id===nearest?.id);if(list.length)targetId=list[(i+1)%list.length].id;selectTarget();updateHUD();}
function toggleHarvest(){
 if(ui.modal||ui.placement)return;
 if(autoHarvestId){autoHarvestId=null;updateHUD();return;}
 if(!nearest||!['tree','rock','bunkerresource'].includes(nearest.type))return;
 clickDestination=null;autoHarvestId=nearest.id;targetId=nearest.id;
 if(swingCooldown===0&&!useResource(autoHarvestId))autoHarvestId=null;
 updateHUD();
}
function zoomBy(delta){renderer.zoom=Math.max(.75,Math.min(1.8,renderer.zoom+delta));}
function interact(n=nearest){
 if(!n||ui.modal||ui.placement)return;
 if(['bunker','bunkerexit','bunkercache','growtray','rareplant','bunkergate','bunkercontrol','bunkernote','bunkergarden'].includes(n.type)){ui.showStoryNode(n);return;}
 if(n.type==='bunkerresource'){const error=bunkerResourceBlock(state,n);toast(error||'Hold Space to '+(n.tool==='axe'?'cut this apart.':'mine this deposit.'),error?'error':'');return;}
 if(n.type==='structure'){ui.showStation(n.id);return;}if(n.type==='crossing'){ui.showBridge();return;}if(n.type==='npc'){ui.showPerson(n);return;}
 if(n.type==='sign'){ui.open('sign','Follow your curiosity.','The trails connect. The space between them is yours too.',`<p class="speech">${n.label.replaceAll('\n','<br>')}</p><p class="note">Open the map to see where you stand, then follow the trail.</p>`,'small');return;}
 if(n.type==='discovery'){const result=discover(state,n);if(result.error)return toast(result.error,'error');ui.open('discovery',DISCOVERIES[n.discovery].name,result.already?'A story you found.':'A little further from ordinary.',`<p class="speech">${result.text}</p>${result.reward?'<p class="note">Found '+rewards(result.reward)+'.</p>':''}${result.blueprint?'<p class="note">New designs: Millwright’s logging saw and Prospector’s pickaxe. Make them at a precision tool bench.</p>':''}`,'small');changed();return;}
 if(['tree','rock'].includes(n.type)){const error=resourceBlock(state,n);toast(error||'Hold Space to '+(n.type==='tree'?'chop this tree.':'mine this rock.'),error?'error':'');return;}
 const result=gather(state,n);if(result.error)return toast(result.error,'error');toast(rewards(result.reward),'reward');playSound('gather');targetId=null;changed();
}
function eat(){const result=consumeBerry(state);if(result.error)toast(result.error,'error');else{toast('A handful of blueberries · +'+result.amount+' stamina');changed();}}
$('#axe-button').onclick=()=>{state.equipped='axe';updateHUD();};$('#pick-button').onclick=()=>{state.equipped='pick';updateHUD();};$('#bag-button').onclick=()=>{ui.cancelPlacement();ui.showBag('items');};$('#kits-button').onclick=()=>{ui.cancelPlacement();ui.showBag('kits');};$('#food-button').onclick=eat;$('#map-button').onclick=()=>{ui.cancelPlacement();ui.showMap();};$('#journal-button').onclick=()=>{ui.cancelPlacement();ui.showJournal();};$('#help-button').onclick=()=>{ui.cancelPlacement();ui.showHelp();};$('#settings-button').onclick=()=>{ui.cancelPlacement();ui.showSettings();};
document.addEventListener('keydown',e=>{
 if(ui.modal){ui.menuKey(e);return;}if(ui.placementKey(e))return;
 const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' ','shift'].includes(k)){e.preventDefault();keys.add(k);clickDestination=null;autoHarvestId=null;if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k))targetId=null;}
 if(e.repeat)return;
 if(k==='e'){e.preventDefault();interact();}else if(k==='tab'){e.preventDefault();cycleTarget();}
 else if(k==='1'||k==='2'){state.equipped=k==='1'?'axe':'pick';updateHUD();}else if(k==='b'){ui.cancelPlacement();ui.showBag('items');}else if(k==='v'){ui.cancelPlacement();ui.showBag('kits');}else if(k==='f')eat();else if(k==='m'){ui.cancelPlacement();ui.showMap();}else if(k==='j'){ui.cancelPlacement();ui.showJournal();}else if(k==='h'||k==='?'){ui.cancelPlacement();ui.showHelp();}else if(k==='escape'){ui.cancelPlacement();ui.showSettings();}else if(k==='='||k==='+')renderer.zoom=Math.min(1.8,renderer.zoom+.1);else if(k==='-')renderer.zoom=Math.max(.75,renderer.zoom-.1);
});
document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{stopInput();persist();});window.addEventListener('pagehide',()=>{stopInput();persist();});window.addEventListener('resize',stopInput);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopInput();persist();}});
function worldTap(e){
 if(ui.modal)return;const p=renderer.toWorld(e.clientX,e.clientY);if(ui.placement){ui.point(p);return;}
 const n=nearby().sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
 if(n&&Math.hypot(n.x-p.x,n.y-p.y)<70){
  const wasWorking=autoHarvestId;autoHarvestId=null;targetId=n.id;clickDestination=null;selectTarget();
  if(touch?.enabled&&['tree','rock','bunkerresource'].includes(n.type)){if(wasWorking!==n.id)toggleHarvest();else updateHUD();}else interact(n);
 }else{autoHarvestId=null;targetId=null;clickDestination=p;}
}
$('#world').addEventListener('pointerdown',e=>{
 if(ui.modal||e.button!==0||worldPointer)return;e.preventDefault();$('#world').focus({preventScroll:true});
 if(!touch?.enabled&&e.pointerType==='mouse'){worldTap(e);return;}
 worldPointer={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};$('#world').setPointerCapture(e.pointerId);
 if(ui.placement)ui.point(renderer.toWorld(e.clientX,e.clientY));
});
$('#world').addEventListener('pointermove',e=>{if(e.pointerId!==worldPointer?.id)return;if(Math.hypot(e.clientX-worldPointer.x,e.clientY-worldPointer.y)>12)worldPointer.moved=true;if(ui.placement)ui.point(renderer.toWorld(e.clientX,e.clientY));});
$('#world').addEventListener('pointerup',e=>{if(e.pointerId!==worldPointer?.id)return;const tap=!worldPointer.moved;worldPointer=null;if(tap)worldTap(e);});
for(const name of ['pointercancel','lostpointercapture'])$('#world').addEventListener(name,e=>{if(e.pointerId===worldPointer?.id)worldPointer=null;});
$('#world').addEventListener('contextmenu',e=>e.preventDefault());
touch=createTouchControls({storage,move:()=>{clickDestination=null;autoHarvestId=null;targetId=null;},reset:()=>{clickDestination=null;autoHarvestId=null;worldPointer=null;},interact:()=>interact(),work:toggleHarvest,next:cycleTarget,zoom:zoomBy});
let audioContext;
function playSound(type){if(!state.sound)return;try{audioContext??=new AudioContext();audioContext.resume();const osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;osc.type=type==='build'?'sine':'triangle';osc.frequency.setValueAtTime(type==='build'?640:type==='chop'?135:type==='mine'?370:800,now);osc.frequency.exponentialRampToValueAtTime(type==='build'?880:70,now+.12);gain.gain.setValueAtTime(.06,now);gain.gain.exponentialRampToValueAtTime(.001,now+.18);osc.connect(gain).connect(audioContext.destination);osc.start(now);osc.stop(now+.2);}catch{}}
function frame(now){const dt=Math.min((now-last)/1000||0,.04);last=now;saveTimer+=dt;uiTimer+=dt;swingCooldown=Math.max(0,swingCooldown-dt);actionTime=Math.max(0,actionTime-dt);if(!actionTime)renderer.action=null;renderer.walking=false;
 if(!ui.modal){
  let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
  let strength=1;if(!dx&&!dy&&(touch.movement.x||touch.movement.y)){dx=touch.movement.x;dy=touch.movement.y;strength=Math.min(1,Math.hypot(dx,dy));}
  if(!dx&&!dy&&clickDestination&&!ui.placement){dx=clickDestination.x-state.player.x;dy=clickDestination.y-state.player.y;if(Math.hypot(dx,dy)<10){clickDestination=null;dx=dy=0;}}
  if(dx||dy){const length=Math.hypot(dx,dy),speed=(keys.has('shift')||touch.running?290:205)*dt*strength;dx=dx/length*speed;dy=dy/length*speed;const old={...state.player};if(!blocked(state.player.x+dx,state.player.y))state.player.x+=dx;if(!blocked(state.player.x,state.player.y+dy))state.player.y+=dy;renderer.walking=Math.hypot(old.x-state.player.x,old.y-state.player.y)>.1;if(dx)renderer.facing=dx>0?1:-1;if(!renderer.walking)clickDestination=null;}
  const region=state.scene==='bunker'?'bunker':zoneAt(state.player.x,state.player.y);if(region!==state.region){state.region=region;state.visited[region]=true;banner(REGIONS[region].name+' · '+REGIONS[region].description);persist();}
  const entered=visitBunkerRoom(state);if(entered){banner(entered.name+' · '+entered.hint);persist();}
  selectTarget();if(autoHarvestId&&!nearby().some(n=>n.id===autoHarvestId))autoHarvestId=null;
  if((keys.has(' ')||autoHarvestId)&&!ui.placement&&swingCooldown===0){if(!useResource(keys.has(' ')?null:autoHarvestId))autoHarvestId=null;}
  if(!keys.has(' ')&&!autoHarvestId&&!renderer.action)state.energy=Math.min(100,state.energy+dt*1.4);
  if(ui.placement)ui.updatePlacement();
 }
 if(uiTimer>.22){uiTimer=0;const ready=tickWorkstations(state);if(ready.length){for(const station of ready)toast(BUILDABLES[station.kind].name+': ready to collect.');persist();ui.refreshStation();}ui.updateTimers();updateHUD();}
 if(saveTimer>5){saveTimer=0;persist();}renderer.draw(dt);requestAnimationFrame(frame);
}
tickWorkstations(state);ensurePlayerSpace();selectTarget();updateHUD();persist();$('#world').focus({preventScroll:true});if(!Object.keys(state.depleted).length&&state.day===1)banner(touch.enabled?'Tap the ground or use the stick to walk. Chop, gather, build, or meet the neighbors. Help is in the pause menu.':'No rush. No required path. Explore, make a home, meet the neighbors. H shows the controls.');requestAnimationFrame(frame);
