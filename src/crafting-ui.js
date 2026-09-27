import {ITEMS,itemIcon} from './data.js';
import {getStructure,maxCraftable,recipeBlock,scaledCost,jobOutput,jobDuration,startJob,validCraftCount} from './state.js';

const names=output=>Object.entries(output).map(([k,n])=>`${n.toLocaleString()} ${ITEMS[k]?.short||k}`).join(' · ');
const duration=seconds=>{const total=Math.ceil(seconds),h=Math.floor(total/3600),m=Math.floor(total%3600/60),sec=total%60;return [h?`${h}h`:'',m?`${m}m`:'',sec?`${sec}s`:''].filter(Boolean).join(' ')||'0s';};
export function showCraftRecipe(s,id,r,{open,showStation,changed,toast,playSound}){
 const $=q=>document.querySelector(q),station=getStructure(s,id);
 const maximum=maxCraftable(s,r);
 open('recipe',r.name,r.desc,`<button id="recipe-back" class="secondary">← Back to workstation</button><section class="craft-preview">${itemIcon(r.icon)}${r.tool?'<p>Your equipped tool is left at this bench until you collect it. Tools are upgraded one at a time.</p>':`<label class="quantity-label" for="craft-quantity">${r.kit?'Number of kits':'Crafting runs'}</label><div class="quantity-picker"><button id="quantity-less" class="secondary" aria-label="Craft one fewer">−</button><input id="craft-quantity" type="number" inputmode="numeric" min="1" step="1" value="1" data-focus><button id="quantity-more" class="secondary" aria-label="Craft one more">+</button><button id="quantity-max" class="secondary" ${maximum?'':'disabled'}>Max</button></div><p class="quantity-hint">${maximum.toLocaleString()} ${r.kit?'kits':'runs'} possible with your materials. Type any whole number.</p>`}<div id="craft-summary" aria-live="polite"></div><button id="craft-start" class="primary" ${r.tool?'data-focus':''}>Start crafting</button><p class="note">Materials leave your backpack when you start. This station works independently while you explore. Return here to collect the result.</p></section>`,'small');
 const input=$('#craft-quantity');
 const count=()=>r.tool?1:Number(input.value);
 function update(){
  const n=count(),valid=validCraftCount(n),block=recipeBlock(s,r,id,n);
  $('#craft-summary').innerHTML=valid?`<div class="craft-output"><strong>${r.tool?'Tool upgrade':r.kit?`${n.toLocaleString()} ${n===1?'kit':'kits'}`:names(jobOutput(r,station,n))}</strong><span>${duration(jobDuration(s,r,n))}</span></div><div class="cost">${Object.entries(scaledCost(r.cost,n)).map(([k,v])=>`<span class="${s.inventory[k]<v?'missing':''}">${v.toLocaleString()} ${ITEMS[k].short} <small>(${s.inventory[k].toLocaleString()} held)</small></span>`).join('')}</div>${block?`<p class="craft-error">${block}</p>`:''}`:'<p class="craft-error">Enter a whole number of at least 1.</p>';
  $('#craft-start').disabled=!!block;
  if(input){$('#quantity-less').disabled=valid&&n<=1;$('#quantity-more').disabled=valid&&n>=Number.MAX_SAFE_INTEGER;}
 }
 if(input){input.oninput=update;$('#quantity-less').onclick=()=>{input.value=Math.max(1,(validCraftCount(count())?count():1)-1);update();};$('#quantity-more').onclick=()=>{input.value=(validCraftCount(count())?count():0)+1;update();};$('#quantity-max').onclick=()=>{input.value=maxCraftable(s,r);update();};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(!e.repeat)$('#craft-start').click();}};}
 $('#recipe-back').onclick=()=>showStation(id,true);
 $('#craft-start').onclick=()=>{const result=startJob(s,id,r.id,count());if(result.error)return toast(result.error,'error');changed();showStation(id,true);playSound('build');};
 update();
}
