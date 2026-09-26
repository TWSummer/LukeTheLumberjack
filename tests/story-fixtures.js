// Explicit fixtures for automated rules checks and the isolated browser playtest.
export function furnishedHouse(s,x=1800,y=2208){
 const pieces=[];const add=(kind,dx,dy,rotation=0)=>pieces.push({id:'placed-'+s.nextId++,kind,x:x+dx,y:y+dy,rotation,region:'home',jobs:[]});
 for(let col=0;col<4;col++)for(let row=0;row<2;row++){add('floor',col*48,row*48);add('roof',col*48,row*48);}
 for(let col=0;col<4;col++){add('wall',col*48,-24);add(col===1?'door':'wall',col*48,72);}
 for(let row=0;row<2;row++){add('wall',-24,row*48,90);add(row===0?'window':'wall',168,row*48,90);add(row===0?'door':'wall',72,row*48,90);}
 add('bed',0,48);add('bed',144,48);s.structures.push(...pieces);return pieces;
}
