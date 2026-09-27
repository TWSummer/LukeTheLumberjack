export const FITNESS={start:25,max:100,trainingGain:1,trainingCost:3,trainingSeconds:3,walkSpeed:205,sprintSpeed:290,sprintDrain:8,recovery:1.4,windedRecovery:5,flowerBoost:1.05};
// This lane uses the naturally clear northern boundary, without regenerating old resource IDs.
export const RACE={west:500,east:2900,playerY:84,runnerY:57,top:42,bottom:112,speed:296,countdown:3};
export const SWIFTNESS={id:'swiftness-flower',type:'swiftness',x:4435,y:2390};
export const RACE_MARKERS=[
 {id:'race-west',type:'raceflag',x:RACE.west,y:100,side:'west'},
 {id:'race-east',type:'raceflag',x:RACE.east,y:100,side:'east'},
 {id:'race-sign',type:'sign',x:490,y:550,label:'NORTH · WALTER’S BOUNDARY DASH\nTHE WORLD’S FASTEST 80-YEAR-OLD'}
];
export const freshRace=()=>({side:'west',wins:0,losses:0,active:null,last:null});

export function walterPosition(s){
 const a=s.race.active;
 if(a)return {x:a.start+a.direction*a.distance,y:RACE.runnerY};
 return {x:RACE[s.race.side],y:RACE.runnerY};
}
