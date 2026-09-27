import {FITNESS,RACE,SWIFTNESS,walterPosition} from './activity-data.js';
import {nearStructure,bounds,solidStructure} from './construction.js';

export const maxStamina=s=>s.maxStamina??FITNESS.start;
export const hasSwiftness=s=>s.structures.some(o=>o.kind==='planter'&&o.plant==='swiftness');
export const sprintSpeed=s=>FITNESS.sprintSpeed*(hasSwiftness(s)?FITNESS.flowerBoost:1);

// Split the final sprint frame at exhaustion, making the result frame-rate independent.
export function movementBudget(s,dt,running){
 const sprintSeconds=running&&!s.winded?Math.min(dt,s.energy/FITNESS.sprintDrain):0;
 return {distance:sprintSeconds*sprintSpeed(s)+(dt-sprintSeconds)*FITNESS.walkSpeed,cost:sprintSeconds*FITNESS.sprintDrain,sprinting:sprintSeconds>0};
}
export function spendMovement(s,motion,actualDistance){
 const fraction=motion.distance>0?Math.min(1,actualDistance/motion.distance):0;
 s.energy=Math.max(0,s.energy-motion.cost*fraction);
 if(s.energy<.00001){s.energy=0;s.winded=true;}
 return motion.sprinting&&fraction>0;
}
export function recoverStamina(s,dt){s.energy=Math.min(maxStamina(s),s.energy+FITNESS.recovery*dt);if(s.energy>=FITNESS.windedRecovery)s.winded=false;}
export function beginTraining(s,id){
 const bar=s.structures.find(o=>o.id===id);
 if(bar?.kind!=='pullupbar'||!nearStructure(s,bar))return {error:'Walk up to your pull-up bar.'};
 if(s.race.active)return {error:'Finish your race first.'};
 if(s.training)return {error:'Finish this pull-up first.'};
 if(maxStamina(s)>=FITNESS.max)return {error:'Maximum stamina reached: 100. Walter looks almost concerned.'};
 if(s.energy<FITNESS.trainingCost)return {error:'Rest or eat berries before another pull-up.'};
 s.energy-=FITNESS.trainingCost;s.training={id,elapsed:0};return {success:true};
}
export function tickTraining(s,dt){
 const t=s.training;if(!t)return null;
 if(!nearStructure(s,s.structures.find(o=>o.id===t.id))){s.training=null;return null;}
 t.elapsed+=dt;if(t.elapsed<FITNESS.trainingSeconds)return null;
 s.maxStamina=Math.min(FITNESS.max,maxStamina(s)+FITNESS.trainingGain);s.training=null;
 return {maxStamina:s.maxStamina};
}
export function takeSwiftness(s){
 if(s.scene==='bunker'||Math.hypot(s.player.x-SWIFTNESS.x,s.player.y-SWIFTNESS.y)>110)return {error:'Walk up to the golden flower.'};
 if(s.swiftnessFound)return {already:true};
 s.swiftnessFound=true;s.inventory.swiftness=(s.inventory.swiftness||0)+1;return {success:true};
}
export function plantSwiftness(s,id){
 const p=s.structures.find(o=>o.id===id);
 if(p?.kind!=='planter'||!nearStructure(s,p))return {error:'Return to your woodland planter.'};
 if(p.plant)return {error:'This planter is already growing a flower.'};
 if(!s.inventory.swiftness)return {error:'Find the golden flower along the trail north of Nell’s maple grove.'};
 s.inventory.swiftness--;p.plant='swiftness';return {success:true};
}

export {walterPosition} from './activity-data.js';
export function startRace(s){
 if(s.race.active)return {error:'You already have a race underway.'};
 const p=walterPosition(s);
 if(s.scene==='bunker'||Math.hypot(s.player.x-p.x,s.player.y-p.y)>110)return {error:'Meet Walter at his starting flag.'};
 if(s.inventory.logs<1)return {error:'Bring 1 wood for your wager. Walter puts up 1 wood too.'};
 if(s.structures.some(o=>{const b=bounds(o);return solidStructure(o)&&b.right>RACE.west-20&&b.left<RACE.east+20&&b.top<RACE.bottom+10&&b.bottom>RACE.top-10;}))return {error:'Move the furniture off the race lane first. Walter refuses to hurdle a house.'};
 const direction=s.race.side==='west'?1:-1;
 s.inventory.logs--;s.player={x:p.x,y:RACE.playerY};s.energy=maxStamina(s);s.winded=false;
 s.race.active={start:p.x,direction,phase:'countdown',countdown:RACE.countdown,elapsed:0,distance:0};
 return {success:true};
}
export function settleRace(s,won,margin=0,forfeit=false){
 const a=s.race.active;if(!a)return null;
 if(won){s.inventory.logs+=2;s.race.wins++;}else s.race.losses++;
 s.race.last={won,margin,forfeit};s.race.side=a.direction===1?'east':'west';s.race.active=null;
 return s.race.last;
}
export function tickRace(s,dt,previous){
 const a=s.race.active;if(!a||dt<=0)return null;
 if(a.phase==='countdown'){a.countdown=Math.max(0,a.countdown-dt);if(!a.countdown)a.phase='running';return null;}
 if(s.scene==='bunker'||s.player.y<RACE.top-12||s.player.y>RACE.bottom+12||s.player.x<RACE.west-100||s.player.x>RACE.east+100)return settleRace(s,false,0,true);
 const length=RACE.east-RACE.west,old=a.distance;
 const before=(previous.x-a.start)*a.direction,after=(s.player.x-a.start)*a.direction;
 const lukeFinish=after>=length&&after>before?dt*Math.max(0,length-before)/(after-before):Infinity;
 const walterFinish=(length-old)/RACE.speed;
 a.distance=Math.min(length,old+RACE.speed*dt);a.elapsed+=dt;
 if(lukeFinish<=dt||walterFinish<=dt){
  const won=lukeFinish<walterFinish;
  const margin=won?(length-old-RACE.speed*lukeFinish)/RACE.speed:Math.max(0,length-(before+(after-before)*walterFinish/dt))/sprintSpeed(s);
  return settleRace(s,won,margin);
 }
 return null;
}
