// Keep the original entrance, residents and cache IDs stable for version-4 saves.
export const BUNKER={width:3700,height:2040,spawn:{x:180,y:490}};
export function freshBunker(){return {open:false,looted:{},harvestDay:0,gardenDay:0,saying:0,cleared:{},damage:{},mined:{},read:{},rooms:{intake:true},power:false,drained:false,shortcut:false,blueprint:false,expansion:1};}
export const BUNKER_ROOMS=[
 {id:'intake',name:'Entrance quarters',x:94,y:84,w:712,h:512,color:'#73847a'},
 {id:'workshop',name:'Machine shop',x:924,y:84,w:676,h:576,color:'#7b806f',hint:'Crates hide spare parts. Two routes lead onward.'},
 {id:'generator',name:'Generator hall',x:1624,y:84,w:676,h:576,color:'#657a78',hint:'A broken generator waits for scrap and copper.'},
 {id:'archive',name:'Records archive',x:2324,y:84,w:676,h:576,color:'#77818b',hint:'The records remember why this place was sealed.'},
 {id:'barracks',name:'Forgotten barracks',x:924,y:684,w:676,h:576,color:'#877c69',hint:'A release wheel opens a shortcut home.'},
 {id:'pumpworks',name:'Pumpworks',x:1624,y:684,w:676,h:576,color:'#627d7a',hint:'Restore power, then drain the lower passages.'},
 {id:'garden',name:'The sunless garden',x:2324,y:684,w:676,h:576,color:'#647b62',hint:'Life found a way beneath the concrete.'},
 {id:'quarry',name:'Buried quarry',x:924,y:1284,w:676,h:652,color:'#827967',hint:'Old extraction tunnels meet rich iron seams.'},
 {id:'cistern',name:'The whispering cistern',x:1624,y:1284,w:676,h:652,color:'#597572',hint:'Follow the exposed pipe toward the blue light.'},
 {id:'crystal',name:'Crystal galleries',x:2324,y:1284,w:676,h:652,color:'#687d8b',hint:'Bring a better pick for the deep quartz.'},
 {id:'vault',name:'Survey vault',x:3114,y:1384,w:492,h:476,color:'#7e7d6c',hint:'Someone left useful plans for the next pair of hands.'}
];
export const BUNKER_FLOORS=[
 {x:94,y:84,w:712,h:512},{x:806,y:244,w:118,h:112},
 {x:600,y:596,w:100,h:420},{x:650,y:904,w:274,h:112},
 {x:924,y:84,w:2076,h:1852},{x:3000,y:1544,w:114,h:112},
 {x:3114,y:1384,w:492,h:476}
];
export const BUNKER_POOLS=[{x:1900,y:1380,w:225,h:390}];
const vertical=(x,from,to,gaps)=>{const out=[];let y=from;for(const [a,b]of gaps){if(a>y)out.push({x,y,w:24,h:a-y});y=b;}if(y<to)out.push({x,y,w:24,h:to-y});return out;};
const horizontal=(y,from,to,gaps)=>vertical(y,from,to,gaps).map(b=>({x:b.y,y:b.x,w:b.h,h:b.w}));
export const BUNKER_WALLS=[
 {x:70,y:60,w:760,h:24},...horizontal(596,70,830,[[600,700]]),{x:70,y:60,w:24,h:560},
 ...vertical(806,60,620,[[244,356]]),{x:396,y:84,w:20,h:176},{x:396,y:344,w:20,h:252},
 {x:416,y:354,w:190,h:20},{x:700,y:354,w:106,h:20},
 ...vertical(900,60,1960,[[244,356],[904,1016]]),...vertical(3000,60,1960,[[1544,1656]]),
 {x:900,y:60,w:2124,h:24},{x:900,y:1936,w:2124,h:24},
 ...[1600,2300].flatMap(x=>vertical(x,84,1936,[[244,356],[904,1016],[1544,1656]])),
 ...[660,1260].flatMap(y=>horizontal(y,924,3000,[[1204,1316],[1904,2016],[2604,2716]])),
 ...vertical(3090,1360,1884,[[1544,1656]]),{x:3090,y:1360,w:540,h:24},{x:3090,y:1860,w:540,h:24},{x:3606,y:1360,w:24,h:524}
];
export const BUNKER_CACHES={
 tools:{name:'Maintenance locker',x:195,y:165,reward:{scrap:12,copper:8},text:'Behind a row of lonely coat hooks: machine scrap and coils of copper wire. Enough to give your workshop a second life.'},
 pantry:{name:'Emergency pantry',x:700,y:150,reward:{scrap:8,glowcaps:6},text:'The canned peas have become a historical document. The sealed grow-tray, however, still has living lantern-cap cultures.'},
 archive:{name:'Civil defense archive',x:740,y:490,reward:{copper:8,relic:2},text:'A map labelled “YOU ARE PROBABLY HERE.” Beneath it: copper wire, two enamel badges, and a very stern biscuit inventory.'},
 machinist:{name:'Machinist’s tool chest',x:1440,y:170,reward:{scrap:16,copper:8,ingots:4},text:'A neatly oiled box, under a very dusty bench. Its owner labelled every spanner. Even the wrong spanner.'},
 bunks:{name:'Footlocker 12',x:1110,y:1110,reward:{berries:18,rope:8,planks:12},text:'Pressed flowers, a sealed tin of dried berries, and a letter: “When we get out, let’s build something with windows.”'},
 turbines:{name:'Turbine spares',x:2180,y:550,reward:{scrap:18,copper:12,coal:10},text:'A crated turbine bearing weighs about as much as Everett’s ego. You take the useful smaller pieces.'},
 records:{name:'Archivist’s strongbox',x:2810,y:160,reward:{relic:3,steel:8},text:'The last entry reads: “Evacuation complete. One man refused. Claimed he had only just got the kettle on.”'},
 seedbank:{name:'Sealed seed bank',x:2810,y:1100,reward:{glowcaps:12,fiber:24,berries:20},text:'The last gardeners kept the cultures alive on emergency lamps. A few careful cuttings will give them another home.'},
 prospector:{name:'Quarry survey chest',x:1070,y:1810,reward:{ore:24,crystal:6,steel:6},text:'A geologist’s note: “Quartz to the east. Strange whistling in the cistern. Probably Gerald.”'},
 divers:{name:'Dry diving bell',x:2190,y:1790,reward:{copper:16,scrap:18},text:'A brass plaque promises “ONLY SLIGHTLY LEAKY.” The stores inside stayed dry. A rare victory for advertising.'},
 vault:{name:'The salvage engineer’s plans',x:3500,y:1490,reward:{steel:16,crystal:12,relic:3},blueprint:true,text:'Plans for reclaiming high-grade steel from machine scrap. Beneath them: “Nothing here is useless. Some things just need a new purpose.” You can now reclaim steel at your own forge.'}
};
export const BUNKER_NOTES={
 welcome:{name:'Maintenance route board',x:736,y:238,text:'EAST: machine shop, generator, archive. SOUTH: barracks and pumpworks. LOWER LEVEL: quarry and cistern. Someone has added: “Bring an axe. And a pick. And realistic expectations.”'},
 repairs:{name:'Chief engineer’s checklist',x:1190,y:450,text:'Generator repair: 6 machine scrap + 4 copper wire. Start it at the panel in the generator hall. Clear the northern pallet stack with a honed axe, or take a pick through the southern service rubble. Both routes reach the generator.'},
 power:{name:'A grease-stained wiring diagram',x:1830,y:470,text:'Main power runs the archive door and drainage pumps. The pump controls are one floor south. The pump operator’s final note: “Do NOT reverse the flow. We are underground enough already.”'},
 garden:{name:'The gardener’s last page',x:2480,y:810,text:'The lamps failed. The roots found cracks. The caps started to glow. We thought we were keeping this garden alive. I think it might have been the other way around.'},
 quarry:{name:'Old quarry markings',x:1370,y:1470,text:'The newest concrete was poured around older tunnels. Copper salvage in the cistern. Quartz farther east. The survey vault is behind a stack of thick shipping timbers—an iron axe should do it.'},
 water:{name:'A message on the pipe',x:1780,y:1730,text:'IF YOU HEAR WHISTLING: it is the pipes. IF THE PIPES ASK FOR TEA: it is Gerald.'},
 final:{name:'Postcard never sent',x:3270,y:1760,text:'“I thought I was building a place to wait out the world. Now I think I was building a place to start again.” No signature. On the back, a drawing of a small house with a very large garden.'}
};
const resource=(id,name,kind,tool,tier,hp,x,y,w,h,reward,barrier=false)=>({id,type:'bunkerresource',name,kind,tool,tier,hp,x,y,w,h,reward,barrier});
export const BUNKER_RESOURCES=[
 resource('service-barricade','Collapsed service shelves','timber','axe',0,16,862,300,40,112,{logs:8,scrap:4},true),
 resource('generator-pallets','Heavy shipping pallets','timber','axe',1,36,1612,300,24,112,{logs:18,scrap:8},true),
 resource('barracks-rubble','Service tunnel cave-in','rubble','pick',0,30,1260,672,112,24,{stone:18,ore:3},true),
 resource('quarry-rubble','Collapsed quarry arch','rubble','pick',1,72,1260,1272,112,24,{stone:35,ore:12},true),
 resource('quarry-timbers','Rotten mine supports','timber','axe',1,40,1612,1600,24,112,{logs:20,scrap:5},true),
 resource('vault-timbers','Reinforced shipping crates','timber','axe',2,100,3058,1600,36,112,{hardwood:16,scrap:12},true),
 ...[[1110,185],[1430,510],[1140,850],[1450,1090],[1790,180],[2170,840],[2450,530],[2810,870],[1770,1520],[2840,1790]].map(([x,y],i)=>resource('salvage-'+i,i%2?'Crated machine parts':'Broken supply crates','crate','axe',i<4?0:1,i<4?12:24,x,y,52,42,{scrap:6+i%4,copper:3,logs:4})),
 ...[[1070,1430],[1450,1780],[1150,1630],[1830,1810],[2460,1730],[2790,1470]].map(([x,y],i)=>resource('bunker-ore-'+i,i<2?'Soft iron rubble':i<4?'Iron-bearing seam':'Dense bunker ore','ore','pick',i<2?0:i<4?1:2,[18,18,48,48,135,135][i],x,y,64,52,{stone:12+i*4,ore:4+i*4})),
 ...[[2480,1430],[2820,1790],[2640,1850]].map(([x,y],i)=>resource('deep-quartz-'+i,'Deep quartz cluster','crystal','pick',3,300,x,y,68,54,{crystal:12,ore:20,stone:30}))
];
export const BUNKER_GATES=[
 {id:'archive-door',type:'bunkergate',name:'Archive blast door',x:2312,y:300,w:24,h:112,flag:'power'},
 {id:'flooded-sump',type:'bunkergate',name:'Flooded cistern stairs',x:1960,y:1272,w:112,h:24,flag:'drained'},
 {id:'flooded-east',type:'bunkergate',name:'Submerged connecting passage',x:2312,y:1600,w:24,h:112,flag:'drained'},
 {id:'flooded-garden',type:'bunkergate',name:'Flooded garden stairwell',x:2660,y:1272,w:112,h:24,flag:'drained'},
 {id:'return-bulkhead',type:'bunkergate',name:'Emergency return bulkhead',x:912,y:960,w:24,h:112,flag:'shortcut'}
];
export const BUNKER_NODES=[
 {id:'bunker-exit',type:'bunkerexit',x:180,y:545},{id:'hermit',type:'npc',person:'hermit',x:550,y:470},
 ...Object.entries(BUNKER_CACHES).map(([cache,d])=>({id:'bunker-'+cache,type:'bunkercache',cache,x:d.x,y:d.y})),
 {id:'bunker-growtray',type:'growtray',x:530,y:150},
 ...BUNKER_RESOURCES,...BUNKER_GATES,
 ...Object.entries(BUNKER_NOTES).map(([note,d])=>({id:'bunker-note-'+note,type:'bunkernote',note,name:d.name,x:d.x,y:d.y})),
 {id:'generator-panel',type:'bunkercontrol',name:'Emergency generator',action:'power',x:1960,y:220},
 {id:'pump-panel',type:'bunkercontrol',name:'Drainage pump controls',action:'drained',x:1950,y:940},
 {id:'garden-cultures',type:'bunkergarden',name:'Living lantern-cap beds',x:2670,y:980}
];
