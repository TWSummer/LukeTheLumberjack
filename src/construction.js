import {RECIPES} from './data.js';
import {WORLD,NATURAL_NODES,BRIDGE,isWater} from './world.js';
import {BUNKER_NODES,OLGA_HOME,PICNIC} from './story-data.js';
import {RACE,SWIFTNESS,RACE_MARKERS,walterPosition} from './activity-data.js';

export const BUILDABLES={
 pullupbar:{name:'Woodland pull-up bar',icon:'pullupbar',size:[64,24],cost:{logs:2,ingots:1},desc:'Train here: each three-second pull-up costs 3 stamina and adds 1 maximum stamina, up to 100.'},
 lantern:{name:'Bunker glow lantern',icon:'glowcaps',size:[20,20],cost:{scrap:1,copper:2,glowcaps:1},desc:'A gentle pool of light, grown from bunker lantern caps. Arrange it in your home or garden.'},
 tent:{name:'Luke’s tent',icon:'cabin',size:[150,80],station:true,fixed:true,desc:'A borrowed tent and a few hand tools. Assemble your first workbench here.'},
 workbench:{name:'Woodland workbench',icon:'workbench',size:[64,32],station:true,cost:{logs:6,stone:4,fiber:2},stations:['tent','workbench'],desc:'Make planks, cord, a pickaxe, house pieces, and more workstations.'},
 sharpener:{name:'Sharpening bench',icon:'sharpener',size:[48,32],station:true,cost:{logs:6,stone:8},desc:'A fresh edge makes young pines possible. Leave your axe, then collect it.'},
 sawmill:{name:'Hand-cranked sawmill',icon:'sawmill',size:[80,40],station:true,cost:{planks:12,stone:8,rope:3},desc:'Six planks from every log. Make a second mill to run another job.'},
 kiln:{name:'Stone kiln',icon:'kiln',size:[48,40],station:true,cost:{stone:16,logs:10},desc:'Smelt iron or burn wood into charcoal.'},
 forge:{name:'Toolsmith’s forge',icon:'forge',size:[64,40],station:true,cost:{stone:16,planks:8,ingots:2},desc:'Forge axes, pickaxes, and steel.'},
 sawbench:{name:'Precision tool bench',icon:'sawmill',size:[80,40],station:true,cost:{steel:4,planks:20,rope:4},desc:'Build the logging saw and prospector’s pick from the millwright’s plans.'},
 floor:{name:'Timber floor',icon:'planks',size:[48,48],layer:'floor',cost:{planks:2},desc:'Join tiles into any floor plan.'},
 wall:{name:'Timber wall',icon:'wall',size:[48,8],cost:{planks:2,logs:1},desc:'Rotate and join to frame a room.'},
 window:{name:'Window wall',icon:'window',size:[48,8],cost:{planks:2,rope:1},desc:'A little light and a view of the trees.'},
 door:{name:'Doorway',icon:'door',size:[48,8],passable:true,cost:{planks:2,rope:1},desc:'Walk straight through your own front door.'},
 roof:{name:'Shingled roof',icon:'roof',size:[48,48],layer:'roof',cost:{planks:2,fiber:2},desc:'Roof tiles fade as Luke walks underneath.'},
 bed:{name:'Woodland bed',icon:'bed',size:[32,40],cost:{planks:4,fiber:6,rope:1},desc:'Sleep wherever you choose to settle.'},
 fence:{name:'Split-rail fence',icon:'fence',size:[48,8],cost:{logs:2},desc:'Mark a garden or frame a yard.'},
 campfire:{name:'Stone-ring campfire',icon:'kiln',size:[36,32],cost:{stone:4,logs:2},stations:['tent','workbench'],desc:'Rest beside a fire deep in the woods.'},
 planter:{name:'Woodland planter',icon:'fiber',size:[40,24],cost:{planks:2,fiber:2},desc:'Grow a moonbell or a flower of swiftness. Moving keeps the flower; packing returns its cutting.'},
 festival:{name:'The long table',icon:'table',size:[96,40],cost:{planks:24,ingots:4,sap:8},desc:'A place for every friend you make. Gather when you’ve helped all three neighbors.'}
};
export const ALL_RECIPES=[...RECIPES,...Object.entries(BUILDABLES).filter(([,d])=>!d.fixed).map(([kind,d])=>({id:'kit-'+kind,name:d.name+' kit',group:d.station?'workstations':'house',icon:d.icon,stations:d.stations||['workbench'],cost:d.cost,kit:kind,duration:d.station?8:2,desc:d.desc}))];
export const RECIPE_BY_ID=Object.fromEntries(ALL_RECIPES.map(r=>[r.id,r]));
export const BRIDGE_COST={planks:24,rope:6};
export const RESOURCE_TYPES=new Set(['tree','rock','loose','fiber','berries','mushrooms','sap']);
export function bounds(o){let [w,h]=BUILDABLES[o.kind]?.size||[32,32];if((o.rotation||0)%180===90)[w,h]=[h,w];return {left:o.x-w/2,right:o.x+w/2,top:o.y-h/2,bottom:o.y+h/2,w,h};}
export function intersects(a,b,gap=0){return a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap;}
export function pointInBounds(x,y,b,pad=0){return x>b.left-pad&&x<b.right+pad&&y>b.top-pad&&y<b.bottom+pad;}
export function solidStructure(o){const d=BUILDABLES[o.kind];return d&&!d.layer&&!d.passable;}
export function nearStructure(s,o){if(!o||s.scene==='bunker')return false;const b=bounds(o);return Math.hypot(Math.max(0,Math.abs(s.player.x-o.x)-b.w/2),Math.max(0,Math.abs(s.player.y-o.y)-b.h/2))<78;}
export function naturalRadius(n){return n.type==='tree'?12+n.tier*6:n.type==='rock'?21+n.tier*7:['mansion','ruin','cottage'].includes(n.type)?105:n.type==='bunker'?85:n.type==='workshop'?50:n.type==='sap'?20:20;}
export function naturalBounds(n){const r=naturalRadius(n);return {left:n.x-r,right:n.x+r,top:n.y-r,bottom:n.y+r};}
export function olgaPosition(s){const o=s.olga;if(o?.step===2&&o.active)return {...PICNIC,x:PICNIC.x+36,y:PICNIC.y+30};if(o?.step===4){const bed=s.structures.find(b=>b.id===o.bedId);return bed?{x:bed.x+48,y:bed.y+48}:o.home||OLGA_HOME;}return OLGA_HOME;}
export function worldNodes(s){if(s.scene==='bunker')return BUNKER_NODES;return [...NATURAL_NODES.filter(n=>!RESOURCE_TYPES.has(n.type)||!s.structures.some(o=>intersects(bounds(o),naturalBounds(n)))),SWIFTNESS,...RACE_MARKERS,{id:'walter',type:'npc',person:'walter',...walterPosition(s)},{id:'olga',type:'npc',person:'olga',...olgaPosition(s)},...s.structures.map(o=>({...o,type:'structure',structureId:o.id}))];}
export function placementBlock(s,kind,x,y,rotation=0,ignoreId=null){
 if(s.scene==='bunker')return 'Gerald lives here. Build in the woods above.';
 const d=BUILDABLES[kind];if(!d||d.fixed)return 'Choose a packed building kit.';
 if(![x,y,rotation].every(Number.isFinite))return 'Choose solid ground.';
 if(Math.hypot(x-s.player.x,y-s.player.y)>310)return 'Walk closer to this spot.';
 const b=bounds({kind,x,y,rotation});
 if(b.right>RACE.west-60&&b.left<RACE.east+60&&b.top<RACE.bottom+18&&b.bottom>RACE.top-18)return 'Keep Walter’s race lane clear.';
 if(b.left<50||b.top<50||b.right>WORLD.width-50||b.bottom>WORLD.height-50)return 'Leave room at the edge of the woods.';
 for(let xx=b.left;xx<=b.right;xx+=8)for(let yy=b.top;yy<=b.bottom;yy+=8)if(isWater(xx,yy))return 'Choose dry ground.';
 if(Math.abs(x-BRIDGE.x)<200&&Math.abs(y-BRIDGE.y)<105)return 'Keep the crossing clear.';
 if(Math.hypot(x-SWIFTNESS.x,y-SWIFTNESS.y)<70)return 'Leave room for the wild swiftness flower.';
 for(const n of worldNodes(s)){
  if(n.type==='structure'||n.type==='crossing'||s.depleted[n.id])continue;
  if(intersects(b,naturalBounds(n),3))return RESOURCE_TYPES.has(n.type)?'Clear this resource first.':'Leave room around people and landmarks.';
 }
 for(const o of s.structures){
  if(o.id===ignoreId)continue;const other=BUILDABLES[o.kind];
  if((d.layer||other.layer)&&d.layer!==other.layer)continue;
  const a=bounds(o);if(!intersects(b,a))continue;
  const edges=['wall','window','door','fence'];
  if(edges.includes(kind)&&edges.includes(o.kind)&&Math.min(b.right,a.right)-Math.max(b.left,a.left)<=8&&Math.min(b.bottom,a.bottom)-Math.max(b.top,a.top)<=8)continue;
  return 'There’s already a piece here.';
 }
 if(solidStructure({kind})&&pointInBounds(s.player.x,s.player.y,b,12))return 'Step aside before placing this.';
 return null;
}
export function snapPoint(p,snap=true){return snap?{x:Math.round(p.x/24)*24,y:Math.round(p.y/24)*24}:{x:Math.round(p.x),y:Math.round(p.y)};}
export function houseProgress(s){
 const count=k=>s.structures.filter(o=>o.kind===k).length;
 return {floors:count('floor'),walls:count('wall')+count('window'),beds:count('bed'),complete:count('floor')>=4&&count('bed')>0&&count('door')>0&&count('wall')+count('window')>=4};
}
