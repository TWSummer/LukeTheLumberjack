// Rooms are floor components separated by walls/doors, not counts across the map.
// A doorway must connect Olga's enclosed room to another room containing Luke's bed.
export function findOlgaRoom(s){
 const floors=s.structures.filter(o=>o.kind==='floor'),edges=s.structures.filter(o=>['wall','window','door'].includes(o.kind));
 const beds=s.structures.filter(o=>o.kind==='bed'),roofs=s.structures.filter(o=>o.kind==='roof');
 const directions=[[48,0],[-48,0],[0,48],[0,-48]];
 const near=(a,b,t=4)=>Math.abs(a-b)<=t;
 const floorAt=(x,y)=>floors.find(f=>near(f.x,x)&&near(f.y,y));
 const edgeAt=(f,dx,dy)=>edges.find(e=>near(e.x,f.x+dx/2)&&near(e.y,f.y+dy/2)&&((e.rotation||0)%180===(dx?90:0)));
 const connections=new Map(floors.map(f=>[f.id,directions.map(([dx,dy])=>({floor:floorAt(f.x+dx,f.y+dy),edge:edgeAt(f,dx,dy)}))]));
 const visited=new Set(),rooms=[];
 for(const start of floors){if(visited.has(start.id))continue;const room=[],queue=[start];visited.add(start.id);while(queue.length){const f=queue.pop();room.push(f);for(const c of connections.get(f.id))if(c.floor&&!c.edge&&!visited.has(c.floor.id)){visited.add(c.floor.id);queue.push(c.floor);}}rooms.push(room);}
 const inside=(piece,room)=>room.some(f=>Math.abs(piece.x-f.x)<24&&Math.abs(piece.y-f.y)<24);
 const enclosed=room=>room.every(f=>connections.get(f.id).every(c=>c.edge||c.floor&&room.includes(c.floor)));
 for(const room of rooms){
  const bed=beds.find(b=>inside(b,room));if(room.length<4||!bed||!enclosed(room))continue;
  if(!room.every(f=>roofs.some(r=>near(r.x,f.x)&&near(r.y,f.y))))continue;
  if(!room.some(f=>connections.get(f.id).some(c=>c.edge?.kind==='window')))continue;
  for(const f of room)for(const c of connections.get(f.id)){
   if(c.edge?.kind!=='door'||!c.floor||room.includes(c.floor))continue;
   const other=rooms.find(r=>r.includes(c.floor));
   if(other&&enclosed(other)&&beds.some(b=>b.id!==bed.id&&inside(b,other)))return {bed,door:c.edge,floors:room.length};
  }
 }
 return null;
}
