import {OLGA_QUESTS,MOONBELL,BUNKER_ENTRY,BUNKER,BUNKER_NODES,BUNKER_CACHES,HERMIT_LINES} from './story-data.js';
import {getStructure,grant} from './state.js';
import {olgaPosition,nearStructure} from './construction.js';
import {findOlgaRoom} from './rooms.js';
import {zoneAt} from './world.js';
import {canReachBunker} from './bunker-geometry.js';

const nearby=(s,n,scene='woods')=>s.scene===scene&&Math.hypot(s.player.x-n.x,s.player.y-n.y)<=110;
const atOlga=s=>nearby(s,olgaPosition(s));
export function acceptOlga(s){
 if(!atOlga(s))return {error:'Talk to Olga in person.'};
 if(s.olga.active||s.olga.step>=4)return {error:'You already have her answer in your journal.'};
 s.olga.active=true;if(s.olga.step===0)s.olga.loggingStart=s.stats.qualityTrees;
 return {success:true};
}
export function olgaStatus(s){
 const o=s.olga;
 if(o.step===0){const count=Math.max(0,s.stats.qualityTrees-o.loggingStart);return {ready:count>=3,detail:Math.min(3,count)+' / 3 young or larger trees felled since accepting.'};}
 if(o.step===1){const ready=s.structures.some(p=>p.kind==='planter'&&p.plant==='moonbell');return {ready,detail:ready?'A moonbell is blooming in your garden.':s.inventory.moonbell?'Cutting found. Use E at your placed planter to plant it.':'Find the moonbell south of the giant’s grove, on the eastern bank.'};}
 if(o.step===2)return {ready:o.active&&atOlga(s),detail:o.active?'Olga is waiting by the heron overlook. Walk there for your date.':'Olga has invited you on a date. Talk to her to accept.'};
 if(o.step===3){const room=findOlgaRoom(s);return {ready:!!room,room,detail:room?'A furnished, roofed room is ready for Olga. Tell her at the orchard.':'Two enclosed rooms, joined by a doorway, with a bed in each. Her room: 4+ floor tiles, matching roofs, and a window.'};}
 return {ready:false,detail:'Olga lives with you. Visit her at home whenever you like.'};
}
export function completeOlga(s){
 if(!atOlga(s))return {error:'Return to Olga to share the moment.'};
 const o=s.olga,q=OLGA_QUESTS[o.step];if(!q||!o.active)return {error:'Talk to Olga and accept her invitation first.'};
 const status=olgaStatus(s);if(!status.ready)return {error:status.detail};
 if(o.step===3){o.bedId=status.room.bed.id;o.home={x:status.room.door.x,y:status.room.door.y+45};}
 grant(s,q.reward);o.step++;o.active=false;return {success:true,text:q.thanks,reward:q.reward};
}
export function takeMoonbell(s){
 if(!nearby(s,MOONBELL))return {error:'Walk closer to the moonbell.'};
 if(s.moonbellFound)return {error:'You already took a cutting. Leave the parent plant growing.'};
 s.moonbellFound=true;grant(s,{moonbell:1});return {success:true};
}
export function plantMoonbell(s,id){
 const p=getStructure(s,id);if(p?.kind!=='planter'||!nearStructure(s,p))return {error:'Use a planter in your garden.'};
 if(p.plant)return {error:'This planter is already blooming.'};
 if(!s.inventory.moonbell)return {error:'Find a moonbell cutting in the eastern woods first.'};
 s.inventory.moonbell--;p.plant='moonbell';return {success:true};
}
export function enterBunker(s){
 if(!nearby(s,BUNKER_ENTRY))return {error:'Walk to the bunker hatch.'};
 if(!s.bunker.open&&!s.inventory.crowbar)return {error:'Craft a crowbar at your forge, then collect it and bring it here.'};
 s.bunker.open=true;s.scene='bunker';s.region='bunker';s.visited.bunker=true;s.player={...BUNKER.spawn};return {success:true};
}
export function leaveBunker(s){
 const exit=BUNKER_NODES.find(n=>n.type==='bunkerexit');if(!canReachBunker(s,exit))return {error:'Walk back to the entrance stairs.'};
 s.scene='woods';s.player={x:BUNKER_ENTRY.x,y:BUNKER_ENTRY.y+100};s.region=zoneAt(s.player.x,s.player.y);return {success:true};
}
export function lootBunker(s,id){
 const n=BUNKER_NODES.find(n=>n.id===id);if(!n||!canReachBunker(s,n))return {error:'Walk up to the bunker supplies.'};
 if(n.type==='growtray'){
  if(s.bunker.harvestDay===s.day)return {error:'The lantern caps need until tomorrow to regrow.'};
  s.bunker.harvestDay=s.day;grant(s,{glowcaps:3});return {reward:{glowcaps:3},text:'Three living lantern-cap cultures. Gerald insists they have names. You decide not to ask.'};
 }
 const cache=BUNKER_CACHES[n.cache];if(!cache)return {error:'There are no supplies here.'};
 if(s.bunker.looted[n.cache])return {already:true,text:'You have already searched this '+cache.name.toLowerCase()+'.'};
 s.bunker.looted[n.cache]=true;if(cache.blueprint)s.bunker.blueprint=true;grant(s,cache.reward);return {reward:cache.reward,text:cache.text,blueprint:!!cache.blueprint};
}
export function hermitSaying(s){
 const npc=BUNKER_NODES.find(n=>n.person==='hermit');if(!canReachBunker(s,npc))return {error:'Gerald is inside the bunker.'};
 const text=HERMIT_LINES[s.bunker.saying%HERMIT_LINES.length];s.bunker.saying++;return {text};
}
