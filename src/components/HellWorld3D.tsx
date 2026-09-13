import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {hellAudio} from '../engine/hellAudio';

export type HellScenePhase='wake'|'arrival'|'choice'|'portal'|'guide'|'launch';
type Props={phase:HellScenePhase;reducedMotion:boolean;onBeat?:(beat:string)=>void};
type DemonRig={root:THREE.Group;head:THREE.Group;upperJaw:THREE.Group;lowerJaw:THREE.Group;eyes:THREE.Mesh[];body:THREE.Group;portal:THREE.Mesh};
const m=(color:number,metalness=.1,roughness=.8,emissive=0,intensity=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:intensity});
function createPythosura(scale=1):DemonRig{
 const root=new THREE.Group();root.scale.setScalar(scale);const body=new THREE.Group();const skin=m(0x0d0a0f,.28,.68,0x21050a,.22);
 for(let i=0;i<9;i++){const seg=new THREE.Mesh(new THREE.CapsuleGeometry(.62,1.12,6,12),skin);seg.position.set(Math.sin(i*.62)*.62,1.22+i*.5,-2.45-i*.42);seg.rotation.x=Math.PI/2;seg.rotation.z=-Math.sin(i*.7)*.08;body.add(seg)}root.add(body);
 const head=new THREE.Group();head.position.set(0,5.65,-6.25);const skull=new THREE.Mesh(new THREE.SphereGeometry(1.52,32,20),skin);skull.scale.set(1.2,1,1.16);head.add(skull);
 const eyeMat=m(0xff432b,.1,.32,0xff1c00,7);const eyeL=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),eyeMat);eyeL.position.set(-.6,.15,1.4);const eyeR=eyeL.clone();eyeR.position.x=.6;head.add(eyeL,eyeR);
 const hornMat=m(0x32242a,.25,.55,0x13050b,.2);const hornL=new THREE.Mesh(new THREE.ConeGeometry(.33,1.55,12),hornMat);hornL.position.set(-1.02,1.3,.04);hornL.rotation.z=-.48;const hornR=hornL.clone();hornR.position.x=1.02;hornR.rotation.z=.48;head.add(hornL,hornR);
 const upperJaw=new THREE.Group();upperJaw.position.set(0,-.16,1.04);const upper=new THREE.Mesh(new THREE.BoxGeometry(2.02,.48,1.12),skin);upper.position.z=.12;upperJaw.add(upper);
 const lowerJaw=new THREE.Group();lowerJaw.position.set(0,-.84,.98);const lower=new THREE.Mesh(new THREE.BoxGeometry(1.9,.4,1.05),skin);lower.position.z=.12;lowerJaw.add(lower);
 for(const x of[-.72,-.36,0,.36,.72]){const fang=new THREE.Mesh(new THREE.ConeGeometry(.09,.5,8),m(0xd3c9c5,.05,.36,0x2a1414,.1));fang.position.set(x,-.5,1.02);fang.rotation.x=Math.PI;upperJaw.add(fang)}head.add(upperJaw,lowerJaw);
 const portal=new THREE.Mesh(new THREE.CircleGeometry(1.28,64),m(0x19000d,.1,.3,0xff2400,5));portal.position.set(0,-.48,1.44);head.add(portal);const light=new THREE.PointLight(0xff4b25,12,18,2);light.position.set(0,1.1,2);head.add(light);const rim=new THREE.Mesh(new THREE.TorusGeometry(1.1,.065,10,48),m(0x8c1820,.2,.4,0xff1d00,8));rim.position.set(0,-.48,1.46);head.add(rim);root.add(head);
 return{root,head,upperJaw,lowerJaw,eyes:[eyeL,eyeR],body,portal}
}
function rock(scene:THREE.Scene,x:number,z:number,s:number){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),m(0x171219,.15,.96,0x21060a,.1));r.position.set(x,s*.35,z);r.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2);scene.add(r)}
function torch(scene:THREE.Scene,x:number,z:number){const g=new THREE.Group();const stick=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,1.2,8),m(0x2c1c18,.05,.95));stick.position.y=.6;g.add(stick);const flame=new THREE.Mesh(new THREE.ConeGeometry(.18,.56,8),m(0xff4b25,.05,.35,0xff1f00,7));flame.position.y=1.42;g.add(flame);const l=new THREE.PointLight(0xff5b2a,2.3,7,2);l.position.y=1.6;g.add(l);g.position.set(x,0,z);scene.add(g)}
function embers(scene:THREE.Scene){const n=280,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*28;p[i*3+1]=Math.random()*8;p[i*3+2]=-Math.random()*34}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xff693b,size:.045,transparent:true,opacity:.85})))}
export function HellWorld3D({phase,reducedMotion,onBeat}:Props){
 const host=useRef<HTMLDivElement|null>(null),phaseRef=useRef(phase);phaseRef.current=phase;
 useEffect(()=>{const el=host.current;if(!el)return;const scene=new THREE.Scene();scene.background=new THREE.Color(0x020105);scene.fog=new THREE.FogExp2(0x08040a,.045);const camera=new THREE.PerspectiveCamera(56,1,.1,100);camera.position.set(0,1.1,4.2);camera.lookAt(0,1.6,-9);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;el.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0x2b172d,0x030106,.55));const red=new THREE.PointLight(0xff291b,4.2,26,2);red.position.set(-3,6,-10);scene.add(red);const orange=new THREE.PointLight(0xff7a3c,3.4,18,2);orange.position.set(6,2,-18);scene.add(orange);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),m(0x08070b,.05,.98,0x150207,.12));floor.rotation.x=-Math.PI/2;floor.position.y=-.03;floor.position.z=-11;scene.add(floor);const lava=new THREE.Mesh(new THREE.PlaneGeometry(30,9),m(0x50130c,.05,1,0xff2909,1.2));lava.rotation.x=-Math.PI/2;lava.position.set(0,.01,-24);scene.add(lava);
 for(let i=0;i<38;i++)rock(scene,(Math.random()-.5)*30,-3-Math.random()*34,.3+Math.random()*1.5);for(let i=0;i<9;i++)torch(scene,(i%2?-1:1)*(3.5+Math.random()*2.8),-5-i*3.8);embers(scene);
 const pyth=createPythosura();pyth.root.visible=false;scene.add(pyth.root);const mini=createPythosura(.2);mini.root.visible=false;scene.add(mini.root);const distant=new THREE.Group();for(let i=0;i<7;i++){const d=createPythosura(.12);d.root.position.set((Math.random()-.5)*18,.15,-15-Math.random()*17);d.root.rotation.y=Math.random()*Math.PI;distant.add(d.root)}scene.add(distant);
 let raf=0,last=performance.now(),beatLast='';const resize=()=>{const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};window.addEventListener('resize',resize);resize();const beat=(v:string)=>{if(v!==beatLast){beatLast=v;onBeat?.(v)}};
 const loop=(now:number)=>{const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000,p=phaseRef.current;pyth.root.visible=p==='arrival'||p==='choice'||p==='portal';mini.root.visible=p==='guide';
  if(p==='wake'){camera.position.lerp(new THREE.Vector3(0,.82,3.6),.035);camera.lookAt(0,1.2,-10);red.intensity=2.1;beat('wake')}
  if(p==='arrival'||p==='choice'){pyth.root.visible=true;pyth.root.position.z=-.8;pyth.root.position.y=reducedMotion?1.35:-5.6+Math.min(1,((t%3.3)/2.15))**.6*7;pyth.root.rotation.y=Math.sin(t*.35)*.09;pyth.head.rotation.y=Math.sin(t*.55)*.14;camera.position.x=reducedMotion?0:Math.sin(t*17)*.04;camera.position.y=1.25+(reducedMotion?0:Math.sin(t*10)*.018);camera.lookAt(0,3.05,-5);if(p==='arrival'&&pyth.root.position.y>.9)beat('emerge')}
  if(p==='portal'){pyth.root.visible=true;pyth.root.position.set(0,1.15,-1.1);const open=.55+.45*(.5+.5*Math.sin(t*1.5));pyth.upperJaw.rotation.x=-.18-open*.13;pyth.lowerJaw.rotation.x=.25+open*.4;pyth.portal.scale.setScalar(.65+open*.42);camera.position.lerp(new THREE.Vector3(0,1.32,2.45),.025);camera.lookAt(0,3.1,-4.7);beat('portal')}
  if(p==='guide'){mini.root.visible=true;mini.root.position.set(1.25,.75,-2.2);mini.root.rotation.y=-.55+Math.sin(t*1.8)*.08;mini.root.rotation.z=Math.sin(t*2)*.05;camera.position.lerp(new THREE.Vector3(.14,1.3,2.75),.03);camera.lookAt(.2,1.45,-4);beat('guide')}
  if(p==='launch'){pyth.root.visible=false;mini.root.visible=false;camera.position.lerp(new THREE.Vector3(0,1.55,-3.3),.025);camera.lookAt(0,1.55,-10);beat('launch')}
  distant.children.forEach((d,i)=>{d.position.y=Math.sin(t*.45+i)*.04;d.rotation.y+=dt*.035});if(!reducedMotion){camera.position.x+=Math.sin(t*.73)*.002;camera.position.y+=Math.sin(t*.81)*.0012}renderer.render(scene,camera);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
 return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);renderer.dispose();renderer.domElement.remove()}
 },[reducedMotion,onBeat]);return <div ref={host} className="hell-world-3d" aria-hidden="true"/>}
