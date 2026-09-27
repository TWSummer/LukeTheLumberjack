export const ITEMS={
 swiftness:{name:'Flower of swiftness cutting',short:'Swiftness'},
 crowbar:{name:'Forged crowbar',short:'Crowbar'},moonbell:{name:'Moonbell cutting',short:'Moonbell'},scrap:{name:'Machine scrap',short:'Scrap'},copper:{name:'Copper wire',short:'Copper'},glowcaps:{name:'Lantern-cap cultures',short:'Lantern caps'},
 logs:{name:'Wood',short:'Wood'},stone:{name:'Stone',short:'Stone'},fiber:{name:'Wild fiber',short:'Fiber'},berries:{name:'Blueberries',short:'Berries'},mushrooms:{name:'Chanterelles',short:'Mushrooms'},ore:{name:'Iron ore',short:'Ore'},planks:{name:'Timber planks',short:'Planks'},rope:{name:'Twisted cord',short:'Cord'},ingots:{name:'Iron ingots',short:'Iron'},coal:{name:'Charcoal',short:'Coal'},steel:{name:'Steel',short:'Steel'},hardwood:{name:'Heartwood',short:'Heartwood'},crystal:{name:'Quartz crystals',short:'Quartz'},sap:{name:'Maple sap',short:'Sap'},relic:{name:'Woodland keepsakes',short:'Keepsakes'},tap:{name:'Maple tapping kit',short:'Tap kit'}
};
export const AXE_TIERS=[
 {name:'Rusty hand axe',damage:1,interval:.55,tier:0},
 {name:'Honed woodsman’s axe',damage:4,interval:.43,tier:1},
 {name:'Iron felling axe',damage:14,interval:.34,tier:2},
 {name:'Steel splitting axe',damage:45,interval:.26,tier:3},
 {name:'Millwright’s logging saw',damage:140,interval:.20,tier:4}
];
export const PICK_TIERS=[
 {name:'Stone pickaxe',damage:3,interval:.5,tier:0},
 {name:'Iron pickaxe',damage:12,interval:.38,tier:1},
 {name:'Steel pickaxe',damage:40,interval:.28,tier:2},
 {name:'Prospector’s pickaxe',damage:110,interval:.22,tier:3}
];
export const AXES=AXE_TIERS.map(t=>t.name);
export const TREE_TIERS=[
 {name:'Tiny sapling',hp:8,logs:1,size:.34},
 {name:'Young pine',hp:20,logs:6,size:.57},
 {name:'Mature pine',hp:70,logs:24,size:.88},
 {name:'Old hardwood',hp:180,logs:65,hardwood:8,size:1.18},
 {name:'Ancient white pine',hp:420,logs:120,hardwood:20,size:1.65}
];
export const ROCK_TIERS=[
 {name:'Soft fieldstone',hp:12,stone:6},
 {name:'Iron-bearing boulder',hp:42,stone:12,ore:6},
 {name:'Dense iron outcrop',hp:140,stone:30,ore:20},
 {name:'Quartz seam',hp:330,stone:60,ore:30,crystal:8}
];
export const REGIONS={
 bunker:{name:'The Abandoned Bunker',description:'Someone has made a home beneath the woods.',x:2100,y:890,color:'#7b8e88'},
 home:{name:'Pine Hollow',description:'A tent, a clearing, and room to make a life.',x:1120,y:3020,color:'#a5b47c'},
 estate:{name:'Whitmore’s Plot',description:'Everett calls it a modest country retreat.',x:620,y:3510,color:'#adba82'},
 ridge:{name:'Hemlock Ridge',description:'Stone outcrops and Jo’s open-air workshop.',x:1550,y:1150,color:'#929f80'},
 brook:{name:'Mosswater Brook',description:'Mara’s garden and the old river crossing.',x:2780,y:2730,color:'#a2b57d'},
 sugarbush:{name:'The Old Sugarbush',description:'Maple groves, mushrooms, and Nell’s kettle.',x:4550,y:3000,color:'#b7ad76'},
 mill:{name:'The Forgotten Mill',description:'Ancient timber and a millwright’s lost designs.',x:4820,y:1050,color:'#91a582'}
};
export const PEOPLE={
 walter:{name:'Walter “Lightning” Whitcomb',role:'World’s fastest 80-year-old · north boundary track',shirt:'#af7050',hair:'#e0dfd0'},
 olga:{name:'Olga',role:'Gardener · the lost orchard',shirt:'#6b82a0',hair:'#e5bf65'},
 hermit:{name:'Gerald “Abandoned” Moss',role:'Resident hermit · involuntary tour guide',shirt:'#82775b',hair:'#c4c2a5'},
 everett:{name:'Everett Whitmore',role:'Neighbor. Unfortunately.',shirt:'#546d61',hair:'#746450'},
 mara:{name:'Mara Finch',role:'Forest steward · Mosswater Brook',shirt:'#b58248',hair:'#653e2f'},
 jo:{name:'Jo Bell',role:'Toolmaker · Hemlock Ridge',shirt:'#567780',hair:'#bbb8a0'},
 nell:{name:'Nell Cooper',role:'Maple keeper · The Old Sugarbush',shirt:'#9b6553',hair:'#585247'}
};
export const SIDE_QUESTS={
 mara:{name:'A patch worth protecting',person:'Mara',place:'Mosswater Brook',request:{berries:8,fiber:12},reward:{rope:6,berries:8},perk:'Foraging yields twice as much.',quote:'Everett wants a paved trail through my seedlings. Help me mark a gentler path? Eight blueberries for the survey crew—me—and twelve bundles of fiber.',thanks:'A trail around the seedlings. Imagine that. Come closer: I’ll show you where the best berries hide.'},
 jo:{name:'A handle on things',person:'Jo',place:'Hemlock Ridge',request:{planks:12,rope:4},reward:{ingots:8},perk:'Every workstation crafts 25% faster.',quote:'I fix tools. Occasionally terrible ideas. Twelve planks and four cords would mend the village tool library. I could show you a few tricks in return.',thanks:'Honest wood, honest work. Here’s some iron. And here’s how to stop wasting time at a workbench.'},
 nell:{name:'The sweet spot',person:'Nell',place:'The Old Sugarbush',request:{mushrooms:8,sap:4},reward:{steel:6,berries:20},perk:'Blueberries restore twice as much stamina.',quote:'Eight chanterelles and four jars of maple sap. We’ll feed the whole neighborhood. Yes, even Everett. I’ve got old steel pans you can melt down.',thanks:'The sap goes on pancakes. The mushrooms go in supper. Stay for a plate—and take this family recipe for the road.'}
};
export const DISCOVERIES={
 overlook:{name:'The heron overlook',x:2420,y:620,text:'A heron stands so still that you mistake it for a branch. For a minute, nothing needs doing.',reward:{berries:12,rope:4}},
 orchard:{name:'The lost orchard',x:550,y:1920,text:'An abandoned orchard. Someone scratched “For whoever comes next” into a wooden box.',reward:{planks:12,ingots:4}},
 circle:{name:'The stone circle',x:480,y:670,text:'Old quarry stones form a circle. Inside: a prospector’s notebook and a pouch of quartz.',reward:{crystal:6,ore:12}},
 camp:{name:'The surveyor’s camp',x:2700,y:3830,text:'A torn map marks a grove across the river. The pencilled note says: “You should see the size of these trees.”',reward:{planks:16,rope:6}},
 mill:{name:'The millwright’s chest',x:4900,y:1120,text:'“A house keeps the weather out. A home lets people in.” Beneath the note lie plans for a logging saw and a precision pickaxe.',reward:{steel:8,hardwood:16},blueprint:true},
 grove:{name:'The giant’s grove',x:5520,y:2110,text:'White pines tower over the moss. A forgotten cache holds tools left for the next careful pair of hands.',reward:{steel:6,crystal:6}}
};
export const RECIPES=[
 {id:'reclaim-steel',name:'Reclaim high-grade steel',group:'materials',icon:'scrap',stations:['forge'],cost:{scrap:3,coal:1},output:{steel:2},duration:5,bunkerPlan:true,desc:'The survey vault’s engineering plans turn old machine parts into two steel.'},
 {id:'crowbar',name:'Forged crowbar',group:'tools',icon:'crowbar',stations:['forge'],cost:{ingots:4,logs:2},output:{crowbar:1},duration:8,desc:'Pry open the abandoned bunker north of the ridge’s eastern trail. Kept in your backpack after use.'},
 {id:'reclaim-iron',name:'Reclaim machine scrap',group:'materials',icon:'scrap',stations:['kiln'],cost:{scrap:1},output:{ingots:3},duration:4,desc:'Salvage from the bunker becomes three iron ingots.'},
 {id:'planks',name:'Timber planks',group:'materials',icon:'planks',stations:['workbench','sawmill'],cost:{logs:1},output:{planks:2},duration:3,desc:'Two planks per log; six at a sawmill.'},
 {id:'rope',name:'Twisted cord',group:'materials',icon:'rope',stations:['workbench'],cost:{fiber:3},output:{rope:1},duration:3,desc:'Cord for tools, furniture, and bridges.'},
 {id:'ingots',name:'Iron ingot',group:'materials',icon:'ingots',stations:['kiln'],cost:{ore:2,logs:1},output:{ingots:1},duration:5,desc:'Turn raw ore into useful metal.'},
 {id:'coal',name:'Charcoal',group:'materials',icon:'ore',stations:['kiln'],cost:{logs:3},output:{coal:3},duration:5,desc:'A hotter-burning fuel for steel.'},
 {id:'steel',name:'Steel',group:'materials',icon:'ingots',stations:['forge'],cost:{ingots:2,coal:2},output:{steel:1},duration:6,desc:'Strong enough for old growth and dense rock.'},
 {id:'tap',name:'Maple tapping kit',group:'tools',icon:'sap',stations:['workbench'],cost:{ingots:2,planks:4},output:{tap:1},duration:6,desc:'Carry it to harvest sap from sugar maples.'},
 {id:'axe1',name:'Hone your rusty axe',group:'tools',icon:'axe',stations:['sharpener'],cost:{stone:6,logs:4},tool:'axe',level:1,duration:8,desc:'4× swing power. Fells young pines: 6 wood each.'},
 {id:'axe2',name:'Iron felling axe',group:'tools',icon:'axe',stations:['forge'],cost:{ingots:6,planks:8},tool:'axe',level:2,duration:12,desc:'14× swing power. Mature pines: 24 wood each.'},
 {id:'axe3',name:'Steel splitting axe',group:'tools',icon:'axe',stations:['forge'],cost:{steel:8,planks:16},tool:'axe',level:3,duration:14,desc:'45× swing power. Old hardwoods: 65 wood + heartwood.'},
 {id:'axe4',name:'Millwright’s logging saw',group:'tools',icon:'sawmill',stations:['sawbench'],cost:{steel:12,hardwood:20,crystal:3},tool:'axe',level:4,duration:18,discovery:'mill',desc:'140× swing power. Ancient trees: 120 wood in three quick cuts.'},
 {id:'pick0',name:'Stone pickaxe',group:'tools',icon:'pickaxe',stations:['workbench'],cost:{logs:5,stone:6,rope:1},tool:'pick',level:0,duration:6,desc:'Mine fieldstone. Your first proper mining tool.'},
 {id:'pick1',name:'Iron pickaxe',group:'tools',icon:'pickaxe',stations:['forge'],cost:{ingots:4,planks:6},tool:'pick',level:1,duration:10,desc:'Mine iron-bearing boulders for stone and ore.'},
 {id:'pick2',name:'Steel pickaxe',group:'tools',icon:'pickaxe',stations:['forge'],cost:{steel:6,planks:10},tool:'pick',level:2,duration:12,desc:'Crack dense iron outcrops. Much more ore, much less effort.'},
 {id:'pick3',name:'Prospector’s pickaxe',group:'tools',icon:'pickaxe',stations:['sawbench'],cost:{steel:10,hardwood:12,crystal:3},tool:'pick',level:3,duration:16,discovery:'mill',desc:'Mine quartz seams: 60 stone, 30 ore, 8 quartz.'}
];
export function itemIcon(type) {
  let art = '';
  const colors = {logs:'#977048',planks:'#c8a26b',stone:'#97a095'};
  if(type==='pickaxe') art='<path fill="#947348" d="m8 33-4-3L24 3l4 3Z"/><path fill="#aab9ab" d="m3 10 10-7 13 1 8 8-14-5-8 2Z"/>'; else if(type==='logs') art='<path fill="#785637" d="m5 12 13-7 11 8-13 8Z"/><path fill="#a97f50" d="m5 12 11 9v10L5 22Z"/><path fill="#bc9461" d="m16 21 13-8v10l-13 8Z"/><path fill="#dbb97c" d="m18 22 8-5v5l-8 5Z"/><path fill="#89663f" d="m20 22 4-3v3l-4 2Z"/><path fill="#c8a26a" d="m8 10 5-3 11 8-5 3Z"/>';
  else if(type==='stone') art='<path fill="#7a887c" d="m4 25 2-13 11-7 11 8 2 11-12 6Z"/><path fill="#a7b0a0" d="m6 12 11-7 6 9-9 7Z"/><path fill="#909c8e" d="m14 21 9-7 5-1 2 11-12 6Z"/><path fill="#b6bcac" d="m10 11 6-3 4 6-7 3Z"/>';
  else if(type==='fiber') art='<path fill="#5e794a" d="m14 30-3-18-7-7 2 13 8 12Zm3 0L25 8l-8 5-2 17Z"/><path fill="#9ca85a" d="m15 30-2-23 5-6 2 17-5 12Zm4-4 10-12-7 1-3 11Z"/><path fill="#c8b573" d="m8 21 14 2-2 5-10-2Z"/>';
  else if(type==='berries') art='<path fill="#63834f" d="m16 16-9-7 9 1 3-7 7 1-6 12Z"/><g fill="#5d6d8e"><circle cx="11" cy="20" r="6"/><circle cx="22" cy="20" r="6"/><circle cx="17" cy="27" r="6"/></g><g fill="#94a2b7"><circle cx="9" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><circle cx="15" cy="25" r="2"/></g>';
  else if(type==='mushrooms') art='<path fill="#e0cca0" d="M13 15h7l3 14H11Z"/><path fill="#d59d4c" d="m3 17 5-9 8-5 9 5 5 9-13 4Z"/><path fill="#f0c679" d="m8 12 7-6 7 3-6 1-5 4Z"/>';
  else if(type==='ore') art='<path fill="#827b69" d="m4 24 2-12 12-6 11 10-2 13-16 2Z"/><path fill="#b78359" d="m7 16 8-6 6 5-7 7Z"/><path fill="#a86d49" d="m19 21 6-5 2 8-7 4Z"/><path fill="#cfaa77" d="m9 15 5-3 2 4-4 3Z"/>';
  else if(type==='planks') art='<path fill="#927046" d="m3 18 19-11 9 7v13L12 33l-9-7Z"/><path fill="#cda56f" d="m3 11 19-10 9 7-19 11Z"/><path fill="#a98250" d="M3 11v7l9 7v-6Zm0 11v5l9 6v-6Z"/><path fill="#dbb77c" d="m12 19 19-11v7L12 25Zm0 9 19-10v7l-19 9Z"/><path fill="#ab8753" d="m16 19 12-7v2l-12 7Zm0 10 11-6v2l-11 6Z"/>';
  else if(type==='rope') art='<path fill="none" stroke="#ad9964" stroke-width="4" d="M13 29C-1 9 31 0 28 15 25 30 7 29 9 17S31 8 24 24c-3 7-8 6-8 6"/><path fill="none" stroke="#d7c58d" stroke-width="1.5" d="M13 29C-1 9 31 0 28 15 25 30 7 29 9 17S31 8 24 24"/>';
  else if(type==='ingots') art='<path fill="#738985" d="m4 21 4-12 14-5 7 11v9l-16 7Z"/><path fill="#b0bdb0" d="m8 9 14-5 7 11-16 7Z"/><path fill="#90a59a" d="m13 22 16-7v9l-16 7Z"/><path fill="#d0d6c0" d="m10 11 11-4 3 4-12 5Z"/>';
  else if(type==='sap') art='<path fill="#8b7955" d="M12 3h11v5H12Z"/><path fill="#ced4b0" d="m12 8-4 6v15l4 3h12l4-3V14l-5-6Z"/><path fill="#c19242" d="M10 17h16v11l-3 2H13l-3-2Z"/><path fill="#e8d38a" d="M12 18h3v9h-3Z"/>';
  else if(type==='axe') art='<path fill="#967144" d="m7 32-4-3L22 2l4 3Z"/><path fill="#bbc0a6" d="m17 5 7-3 9 6-5 10-13-4Z"/><path fill="#8b7756" d="m17 5 7-3 4 7-5 5-8-1Z"/><path fill="#b08554" d="m17 7 5-2 2 5-5 2Z"/>';
  else if(type==='sharpener') art='<path fill="#967a4e" d="M8 19h5v13H8Zm16 0h5v13h-5ZM5 20h27v5H5Z"/><circle fill="#a4af97" cx="18" cy="13" r="11"/><circle fill="#74826c" cx="18" cy="13" r="4"/><path fill="#d4d7bd" d="M10 9h3v8h-3Z"/>';
  else if(type==='forge') art='<path fill="#917349" d="M9 24h18v9H9Z"/><path fill="#7d9185" d="M2 6h29l3 5-12 5v7l5 3H9l5-4v-8L2 10Z"/><path fill="#bdcaba" d="M3 5h28v4H3Z"/>';
  else if(type==='wall'||type==='window') art=`<path fill="#af8b54" d="M3 5h30v27H3Z"/><path fill="#d1b37b" d="M3 5h30v4H3Zm0 8h30v4H3Zm0 8h30v4H3Z"/>${type==='window'?'<path fill="#655338" d="M11 11h16v15H11Z"/><path fill="#b1c8b8" d="M13 13h12v11H13Z"/><path fill="#e2c48b" d="M18 13h2v11h-2Z"/>':''}`;
  else if(type==='door') art='<path fill="#a2814d" d="M4 4h28v29h-6V10H10v23H4Z"/><path fill="#d3b77c" d="M4 4h28v5H4Z"/><path fill="#77694a" d="M13 13h10v20H13Z"/>';
  else if(type==='roof') art='<path fill="#56734f" d="m2 16 16-13 16 13v14l-16-10L2 30Z"/><path fill="#8a9f68" d="M2 16 18 3v17L2 30Z"/><path fill="#b1bf84" d="m4 17 12-9v3L4 20Zm0 7 12-9v3L4 27Z"/>';
  else if(type==='bed') art='<path fill="#8b7145" d="M5 10h26v23h-4v-4H9v4H5Z"/><path fill="#e4d7b1" d="M8 6h20v10H8Z"/><path fill="#9b684b" d="M8 15h20v13H8Z"/><path fill="#c9a475" d="M8 23h20v5H8Z"/>';
  else if(type==='fence') art='<path fill="#967847" d="M5 3h5v30H5Zm21 0h5v30h-5Z"/><path fill="#cdb07a" d="M2 10h32v5H2Zm0 12h32v5H2Z"/>';
  else if(type==='workbench'||type==='sawmill'||type==='table') art=`<path fill="#795c3c" d="M5 16h4v15H5Zm20 0h4v15h-4ZM9 23h16v4H9Z"/><path fill="#c29b65" d="M2 12h30v7H2Z"/><path fill="#e0b779" d="m2 12 6-5h20l4 5Z"/>${type==='sawmill'?'<circle fill="#a4aa92" cx="18" cy="10" r="8"/><circle fill="#677666" cx="18" cy="10" r="3"/>':''}${type==='table'?'<path fill="#9f6346" d="M14 9h6v10h-6Z"/>':''}`;
  else if(type==='kiln') art='<path fill="#87917d" d="M9 5h17v9l5 8v10H3V22l6-8Z"/><path fill="#b0b59e" d="M12 5h6v13H7l4-5Z"/><path fill="#465544" d="M10 22h14v10H10Z"/><path fill="#d29446" d="m13 31 1-7 4 3 3-5 1 9Z"/>';
  else if(type==='bridge') art='<path fill="#8f764d" d="M2 9h3v22H2Zm27 0h3v22h-3ZM8 3h3v24H8Zm16 0h3v26h-3Z"/><path fill="#c6a36d" d="m1 24 12-13h13l7 8-12 13Z"/><path fill="#735b3a" d="m5 21 16 8v2L3 23Zm5-5 16 8-2 2-16-8Zm5-4 15 8-2 2-15-8Z"/>';
  else if(type==='cabin') art='<path fill="#b18b56" d="M5 15h25v17H5Z"/><path fill="#5e7353" d="M1 17 17 2l17 15Z"/><path fill="#7d5d3d" d="M15 21h8v11h-8Z"/><path fill="#e2cb80" d="M7 20h6v6H7Z"/><path fill="#8f9e7a" d="m5 13 12-11 12 11Z"/>';
  else art='<path fill="#bca36b" d="m17 2 5 8 10 4-5 9-10 9-10-9-5-9 10-4Z"/><circle fill="#7c8c6b" cx="17" cy="17" r="7"/>';
  if(type==='crowbar')art='<path d="M9 30 25 9l-1-5h-5l-4 5m-6 21-4 1" fill="none" stroke="#738b8e" stroke-width="5"/>';
  if(type==='moonbell'||type==='glowcaps')art='<path d="M18 31V12M18 26l-9-7m9 3 9-7" stroke="#658156" stroke-width="3"/><path d="m7 15 4-8 7 3 7-5 6 10-8 4-6-4-4 5Z" fill="#b6cdea"/><circle cx="18" cy="13" r="4" fill="#f2e3b1"/>';
  if(type==='scrap'||type==='copper')art='<path d="m6 27 4-19 15-3 5 16-10 10Z" fill="#849b91"/><path d="m10 26 14-12-5-4-6 9 13 7" fill="none" stroke="#ca9662" stroke-width="4"/>';
  if(type==='pullupbar')art='<path d="M7 32V9m22 23V9" stroke="#9b764c" stroke-width="6"/><path d="M4 7h28" stroke="#a8b9b1" stroke-width="5"/>';
  if(type==='swiftness')art='<path d="M18 32V12m0 11-9-7m9 3 8-7" stroke="#61844f" stroke-width="3"/><path d="m18 3 4 8 9-3-5 8 6 5-10 1-3 8-3-8-10-2 8-4-3-8 7 3Z" fill="#e6b956"/><circle cx="19" cy="16" r="4" fill="#fff0ad"/>';
  return `<span class="item-icon"><svg viewBox="0 0 36 36" aria-hidden="true">${art}</svg></span>`;
}
export function portraitSVG(person='luke') {
  const p=PEOPLE[person]; const shirt=p?.shirt||'#95523a';
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#bdd0a1" d="M0 0h64v64H0Z"/><path fill="#8aab70" d="m0 41 13-17 13 17Z"/><path fill="${shirt}" d="M7 64V53l13-9h25l13 9v11Z"/><path fill="#422d25" opacity=".24" d="M15 49h5v15h-5Zm14-4h5v19h-5Zm15 0h5v19h-5ZM8 54h49v4H8Z"/><path fill="#bf956f" d="M26 37h14v13l-7 6-7-6Z"/><path fill="#e2b98e" d="M17 21q0-16 16-16t16 16v15L40 47H26L17 36Z"/>${person==='luke'?'<path fill="#403e33" d="m17 30 5 3 3 7 8 3 8-3 5-7 3-3v9L40 49H26l-9-10Z"/><path fill="#897353" d="M27 34h12v3H27Z"/>':`<path fill="${p?.hair||'#6d6045'}" d="M15 21V13L24 3h20l8 13v17h-5V20L33 14l-13 7v11h-5Z"/>`}${person==='olga'?'<path fill="#e7c471" d="M14 19h7v29l-7 4Zm31-1h7v34l-8-6Z"/>':person==='hermit'?'<path fill="#c6c5ab" d="m17 33 10 5 12 1 10-7-2 20-14 10-13-10Z"/>':''}<path fill="#5c5040" d="M21 24h8v2h-8Zm16 0h8v2h-8Z"/><path fill="#476367" d="M24 28h4v3h-4Zm14 0h4v3h-4Z"/><path fill="#bc916b" d="m32 28-2 7h6v-2h-3Z"/><path fill="#946b56" d="M29 39h8v2h-8Z"/><path fill="#f0c89e" d="M21 16q0-8 9-9v3q-5 0-6 6Z"/></svg>`;
}

export function random(seed) { let n=seed; return ()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;}; }
