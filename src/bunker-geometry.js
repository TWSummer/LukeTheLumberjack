import {BUNKER_FLOORS,BUNKER_WALLS,BUNKER_RESOURCES,BUNKER_GATES,BUNKER_ROOMS,BUNKER_POOLS} from './bunker-data.js';
export const bunkerInactive=(s,n)=>n.type==='bunkerresource'&&(!!s.bunker.cleared?.[n.id]||s.bunker.mined?.[n.id]===s.day);
const inRect=(x,y,r,pad=0)=>x>r.x-pad&&x<r.x+r.w+pad&&y>r.y-pad&&y<r.y+r.h+pad;
export const bunkerFootprint=n=>({x:n.x-n.w/2,y:n.y-n.h/2,w:n.w,h:n.h});
export function bunkerBlocked(s,x,y,pad=9,ignoreId=null){
 // Keep every corner on walkable ground, including the joining return tunnel.
 for(const dx of [-pad,pad])for(const dy of [-pad,pad])if(!BUNKER_FLOORS.some(r=>inRect(x+dx,y+dy,r,.01)))return true;
 if(BUNKER_WALLS.some(r=>inRect(x,y,r,pad)))return true;
 if(!s.bunker.drained&&BUNKER_POOLS.some(r=>inRect(x,y,r,pad)))return true;
 if(BUNKER_GATES.some(n=>n.id!==ignoreId&&!s.bunker[n.flag]&&inRect(x,y,bunkerFootprint(n),pad)))return true;
 return BUNKER_RESOURCES.some(n=>n.id!==ignoreId&&!bunkerInactive(s,n)&&inRect(x,y,bunkerFootprint(n),pad));
}
export function canReachBunker(s,n){
 if(s.scene!=='bunker'||!n)return false;
 const dx=n.x-s.player.x,dy=n.y-s.player.y,distance=Math.hypot(dx,dy);if(distance>110)return false;
 const steps=Math.ceil(distance/6);
 for(let i=1;i<steps;i++)if(bunkerBlocked(s,s.player.x+dx*i/steps,s.player.y+dy*i/steps,0,n.id))return false;
 return true;
}
export const bunkerRoomAt=(x,y)=>BUNKER_ROOMS.find(r=>inRect(x,y,r));
