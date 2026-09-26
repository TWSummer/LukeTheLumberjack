import test from 'node:test';
import assert from 'node:assert/strict';
import {stickVector,bindJoystick} from '../src/touch-controls.js';

class Stick extends EventTarget {
 constructor(){super();this.captured=new Set();this.style={setProperty:()=>{}};this.classList={add:()=>{},remove:()=>{}};}
 getBoundingClientRect(){return {left:0,top:0,width:124,height:124};}
 setPointerCapture(id){this.captured.add(id);}
 hasPointerCapture(id){return this.captured.has(id);}
 releasePointerCapture(id){this.captured.delete(id);this.send('lostpointercapture',id);}
 send(type,pointerId=1,clientX=110,clientY=62,button=0){const e=new Event(type,{cancelable:true});Object.assign(e,{pointerId,clientX,clientY,button});this.dispatchEvent(e);return e;}
}
function setup(){const element=new Stick();let movement={x:0,y:0};const control=bindJoystick(element,v=>movement=v);return {element,control,get movement(){return movement;}};}

test('thumbstick has a dead zone, fine movement, and equal maximum cardinal/diagonal speed',()=>{
 assert.deepEqual(stickVector(4,4),{x:0,y:0});
 const fine=stickVector(20,0);assert.ok(fine.x>0&&fine.x<1);assert.equal(fine.y,0);
 for(const [x,y] of [[1000,0],[0,-1000],[1000,1000],[-1000,-1000]]){
  const v=stickVector(x,y);assert.ok(Math.abs(Math.hypot(v.x,v.y)-1)<1e-10);
  assert.equal(Math.sign(v.x),Math.sign(x));assert.equal(Math.sign(v.y),Math.sign(y));
 }
});

test('a second finger cannot steal or release the movement pointer',()=>{
 const h=setup();h.element.send('pointerdown');assert.equal(h.movement.x,1);
 h.element.send('pointerdown',2,0,62);h.element.send('pointermove',2,0,62);h.element.send('pointerup',2);
 assert.equal(h.movement.x,1);assert.equal(h.element.hasPointerCapture(1),true);
 h.element.send('pointermove',1,62,12);assert.equal(h.movement.y,-1);
 h.element.send('pointerup',1);assert.deepEqual(h.movement,{x:0,y:0});assert.equal(h.element.captured.size,0);
});

test('release, cancellation, lost capture, and menu/background reset all stop motion',()=>{
 for(const event of ['pointerup','pointercancel','lostpointercapture','reset']){
  const h=setup();h.element.send('pointerdown');assert.equal(h.movement.x,1);
  if(event==='reset')h.control.reset();else h.element.send(event);
  assert.deepEqual(h.movement,{x:0,y:0},event);assert.equal(h.element.captured.size,0);
  h.element.send('pointermove',1);assert.deepEqual(h.movement,{x:0,y:0},'Late move cannot resume a cancelled gesture');
  h.element.send('pointerdown',3,12,62);assert.equal(h.movement.x,-1,'Next gesture works');
 }
});

test('right clicks and movements without an active pointer do not walk Luke',()=>{
 const h=setup();h.element.send('pointermove');h.element.send('pointerdown',1,110,62,2);
 assert.deepEqual(h.movement,{x:0,y:0});assert.equal(h.element.captured.size,0);
});
