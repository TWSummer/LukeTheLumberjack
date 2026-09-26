import {AXE_TIERS,PICK_TIERS} from './data.js';
import {BUNKER_NODES,BUNKER_NOTES} from './bunker-data.js';
import {bunkerInactive,canReachBunker,bunkerRoomAt} from './bunker-geometry.js';
import {grant,spend,toolAtBench} from './state.js';

export function bunkerResourceBlock(s,n){
 if(!n||n.type!=='bunkerresource'||!BUNKER_NODES.includes(n))return 'Find a salvage pile or mineral seam.';
 if(bunkerInactive(s,n))return 'This deposit has already been cleared.';
 if(!canReachBunker(s,n))return 'Get closer on this side of the passage.';
 const tiers=n.tool==='axe'?AXE_TIERS:PICK_TIERS;
 if(s[n.tool]<0)return 'Bring a pickaxe from your workbench.';
 if(s[n.tool]<n.tier)return 'Requires '+tiers[n.tier].name+'.';
 if(toolAtBench(s,n.tool))return 'Collect your tool from its workstation first.';
 if(s.energy<.65)return 'Take a breather or eat berries [F].';
 return null;
}
export function strikeBunker(s,n){
 const error=bunkerResourceBlock(s,n);if(error)return {error};
 const gear=(n.tool==='axe'?AXE_TIERS:PICK_TIERS)[s[n.tool]];s.equipped=n.tool;s.energy=Math.max(0,s.energy-.65);
 s.bunker.damage[n.id]=(s.bunker.damage[n.id]||0)+gear.damage;
 if(s.bunker.damage[n.id]<n.hp)return {remaining:n.hp-s.bunker.damage[n.id],hp:n.hp};
 delete s.bunker.damage[n.id];
 if(n.kind==='ore'||n.kind==='crystal')s.bunker.mined[n.id]=s.day;else s.bunker.cleared[n.id]=true;
 grant(s,n.reward);return {reward:n.reward,remaining:0,hp:n.hp,opened:n.barrier};
}
export function bunkerAction(s,id){
 const n=BUNKER_NODES.find(n=>n.id===id);if(!canReachBunker(s,n))return {error:'Walk up to it through an open passage.'};
 if(n.type==='bunkernote'){s.bunker.read[n.note]=true;return {text:BUNKER_NOTES[n.note].text};}
 if(n.type==='bunkergarden'){
  if(s.bunker.gardenDay===s.day)return {error:'Let the garden recover until tomorrow.'};
  s.bunker.gardenDay=s.day;const reward={glowcaps:5,fiber:6};grant(s,reward);return {reward,text:'The sunless garden has kept growing all these years. You take a few cultures and leave the roots intact.'};
 }
 if(n.type==='bunkergate'){
  if(s.bunker[n.flag])return {text:n.flag==='drained'?'The water is gone. You can walk through the exposed passage.':'The passage is open. Walk through whenever you like.'};
  if(n.flag==='shortcut'){
   if(s.player.x<n.x)return {error:'The release wheel is on the barracks side. Find a route through the machine shop.'};
   s.bunker.shortcut=true;return {changed:true,text:'The release wheel turns. A tunnel leads straight back to Gerald’s quarters—your new shortcut to the surface.'};
  }
  return {text:n.flag==='power'?'The archive door has no power. Repair the generator in the hall to the west with 6 scrap and 4 copper wire.':'Dark water covers the steps. Restore the generator, then operate the controls in the pumpworks to drain the lower passages.'};
 }
 if(n.action==='power'){
  if(s.bunker.power)return {text:'The generator hums. The archive door is open, and the drainage pumps have power.'};
  if(!spend(s,{scrap:6,copper:4}))return {error:'Repair needs 6 machine scrap and 4 copper wire. Search lockers or chop supply crates.'};
  s.bunker.power=true;return {changed:true,text:'With a clatter and a thoroughly unnecessary spark, the generator catches. Warm lights return. The archive blast door slides open; the drainage controls are live.'};
 }
 if(n.action==='drained'){
  if(s.bunker.drained)return {text:'The gauges are steady. The cistern and garden stairs remain dry.'};
  if(!s.bunker.power)return {error:'Restore the generator one floor north before starting the pumps.'};
  s.bunker.drained=true;return {changed:true,text:'Pipes groan, then settle into a low whistle. The water recedes from the lower passages. Quarry tunnels and blue-lit crystal galleries wait beyond.'};
 }
 return {error:'There is nothing to operate here.'};
}
export function visitBunkerRoom(s){
 if(s.scene!=='bunker')return null;const room=bunkerRoomAt(s.player.x,s.player.y);if(!room||s.bunker.rooms[room.id])return null;
 s.bunker.rooms[room.id]=true;return room;
}
