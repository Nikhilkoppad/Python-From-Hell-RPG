import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {hellAudio} from '../engine/hellAudio';

export type HellScenePhase='wake'|'arrival'|'portal'|'guide'|'launch';

type Props={phase:HellScenePhase;reducedMotion:boolean;onBeat?:(beat:string)=>void};

type DemonRig={root:THREE.Group;head:THREE.Group;upperJaw:THREE.Group;lowerJaw:THREE.Group;eyes:THREE.Mesh[];body:THREE.Group;mini?:THREE.Group;portal:THREE.Mesh};

function mat(color:number,metalness=.1,roughness=.8,emissive=0x000000,intensity=0){return new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:intensity})}

function createPythosura(scale=1):DemonRig{
 const root=new THREE.Group();root.scale.setScalar(scale);
 const body=new THREE.Group();
 const skin=mat(0x0d0b10,.28,.68,0x160306,.25);
 for(let i=0;i<8;i++){
  const seg=new THREE.Mesh(new THREE.CapsuleGeometry(.62,1.15,6,12),skin);seg.position.set(Math.sin(i*.62)*.62,1.25+i*.55,-2.7-i*.42);seg.rotation.z=-Math.sin(i*.7)*.1;seg.rotation.x=Math.PI/2;body.add(seg)
 }
 root.add(body);
 const head=new THREE.Group();head.position.set(0,5.7,-6.5);
 const skull=new THREE.Mesh(new THREE.SphereGeometry(1.55,32,20),skin);skull.scale.set(1.22,1,1.15);head.add(skull);
 const brow=mat(0x1b1015,.2,.65,0x25060b,.35);
 const browL=new THREE.Mesh(new THREE.BoxGeometry(.95,.18,.35),brow);browL.position.set(-.7,.55,1.16);browL.rotation.z=.12;head.add(browL);
 const browR=browL.clone();browR.position.x=.7;browR.rotation.z=-.12;head.add(browR);
 const eyeMat=mat(0xff432b,.1,.32,0xff1c00,7);
 const eyeL=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),eyeMat);eyeL.position.set(-.6,.2,1.4);const eyeR=eyeL.clone();eyeR.position.x=.6;head.add(eyeL,eyeR);
 const hornMat=mat(0x32242a,.25,.55,0x13050b,.25);
 const hornL=new THREE.Mesh(new THREE.ConeGeometry(.34,1.5,12),hornMat);hornL.position.set(-1.02,1.35,.05);hornL.rotation.z=-.48;const hornR=hornL.clone();hornR.position.x=1.02;hornR.rotation.z=.48;head.add(hornL,hornR);
 const upperJaw=new THREE.Group();upperJaw.position.set(0,-.18,1.05);
 const upper=new THREE.Mesh(new THREE.BoxGeometry(2.05,.5,1.18),skin);upper.position.z=.15;upperJaw.add(upper);
 const lowerJaw=new THREE.Group();lowerJaw.position.set(0,-.9,.96);
 const lower=new THREE.Mesh(new THREE.BoxGeometry(1.92,.42,1.08),skin);lower.position.z=.15;lowerJaw.add(lower);
 for(const x of [-.72,-.36,0,.36,.72]){const fang=new THREE.Mesh(new THREE.ConeGeometry(.095,.52,8),mat(0xd5c7c2,.05,.38,0x2a1414,.15));fang.position.set(x,-.55,1.05);fang.rotation.x=Math.PI;upperJaw.add(fang)}
 head.add(upperJaw,lowerJaw);root.add(head);
 const portal=new THREE.Mesh(new THREE.CircleGeometry(1.35,64),mat(0x19000d,.1,.3,0xff2400,5));portal.position.set(0,-.55,1.45);portal.scale.set(1,1,.1);head.add(portal);
 const point=new THREE.PointLight(0xff4a24,12,18,2);point.position.set(0,1.1,2);head.add(point);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(1.1,.07,10,48),mat(0x8c151d,.2,.4,0xff1d00,8));rim.position.set(0,-.5,1.5);head.add(rim);
 return{root,head,upperJaw,lowerJaw,eyes:[eyeL,eyeR],body,portal}
}

function makeRock(scene:THREE.Scene,x:number,z:number,s:number){const g=new THREE.DodecahedronGeometry(s,0);const m=mat(0x161318,.15,.96,0x25070a,.12);const mesh=new THREE.Mesh(g,m);mesh.position.set(x,s*.35,z);mesh.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2);scene.add(mesh)}
function makeTorch(scene:THREE.Scene,x:number,z:number){const group=new THREE.Group();const stick=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,1.2,8),mat(0x2b1b17,.05,.95));stick.position.y=.65;group.add(stick);const flame=new THREE.Mesh(new THREE.ConeGeometry(.18,.55,8),mat(0xff5a22,.05,.4,0xff2600,6));flame.position.y=1.45;group.add(flame);const light=new THREE.PointLight(0xff5a22,2.4,7,2);light.position.y=1.6;group.add(light);group.position.set(x,0,z);scene.add(group)}
function createEmb( scene:THREE.Scene){const count=260;const arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*26;arr[i*3+1]=Math.random()*7;arr[i*3+2]=-Math.random()*32}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(arr,3));const p=new THREE.PointsMaterial({color:0xff6a39,size:.045,transparent:true,opacity:.8});scene.add(new THREE.Points(g,p))}

export function HellWorld3D({phase,reducedMotion,onBeat}:Props){
 const mount=useRef<HTMLDivElement|null>(null);const phaseRef=useRef(phase);phaseRef.current=phase;
 useEffect(()=>{
  const host=mount.current;if(!host)return;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x030206);scene.fog=new THREE.FogExp2(0x06030a,.045);
  const camera=new THREE.PerspectiveCamera(52,1,.1,80);camera.position.set(0,1.45,3.8);camera.lookAt(0,2.1,-8);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.appendChild(renderer.domElement);
  const ambient=new THREE.HemisphereLight(0x281321,0x050207,.55);scene.add(ambient);
  const red=new THREE.PointLight(0xff2f1a,4.5,24,2);red.position.set(-2,5,-9);scene.add(red);
  const orange=new THREE.PointLight(0xff8a42,3.2,18,2);orange.position.set(6,2,-15);scene.add(orange);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),mat(0x09070b,.05,.98,0x180207,.15));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;floor.position.z=-9;scene.add(floor);
  const lava=new THREE.Mesh(new THREE.PlaneGeometry(24,6),new THREE.MeshStandardMaterial({color:0x45120d,emissive:0xff2b0a,emissiveIntensity:1.35,roughness:1}));lava.rotation.x=-Math.PI/2;lava.position.set(0,.015,-20);scene.add(lava);
  for(let i=0;i<32;i++)makeRock(scene,(Math.random()-.5)*28,-2-Math.random()*30,.35+Math.random()*1.35);
  for(let i=0;i<9;i++)makeTorch(scene,(i%2?1:-1)*(3.5+Math.random()*3),-5-i*3.4);
  createEmb(scene);
  const pyth=createPythosura(1);pyth.root.visible=false;scene.add(pyth.root);
  const mini=createPythosura(.22);mini.root.position.set(1.45,.75,-2.6);mini.root.rotation.y=-.45;mini.root.visible=false;scene.add(mini.root);pyth.mini=mini.root;
  const distant=new THREE.Group();for(let i=0;i<8;i++){const c=createPythosura(.12);c.root.position.set((Math.random()-.5)*16,.2,-14-Math.random()*14);c.root.rotation.y=Math.random()*Math.PI;c.root.visible=true;distant.add(c.root)}scene.add(distant);
  let raf=0;let last=performance.now();let beatSent='';
  const onResize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();renderer.setSize(w,Math.max(1,h),false)};window.addEventListener('resize',onResize);onResize();
  const emit=(beat:string)=>{if(beat===beatSent)return;beatSent=beat;onBeat?.(beat)};
  const animate=(now:number)=>{const dt=Math.min(.05,(now-last)/1000);last=now;const p=phaseRef.current;t=now/1000;
    const t=now/1000;
    pyth.root.visible=['arrival','portal'].includes(p);mini.root.visible=p==='guide';
    if(p==='wake'){camera.position.lerp(new THREE.Vector3(0,.95,3.4),.035);camera.lookAt(0,1.4,-10);pyth.root.visible=false;red.intensity=2.2;emit('dark')}
    if(p==='arrival'){pyth.root.visible=true;const targetY=1.5;const emerge=reducedMotion?targetY:Math.min(targetY,-5.4+Math.pow(Math.min(1,(t%3)/2.1),.55)*7);pyth.root.position.y=emerge;pyth.root.position.z=-.8;pyth.root.rotation.y=Math.sin(t*.35)*.08;pyth.head.rotation.y=Math.sin(t*.5)*.12;if(emerge>0&&beatSent!=='rise'){hellAudio.quake();hellAudio.roar();emit('rise')}camera.position.x=Math.sin(t*16)*.035;camera.position.y=1.35+Math.sin(t*11)*.025;camera.lookAt(0,3.0,-5)}
    if(p==='portal'){pyth.root.visible=true;pyth.root.position.set(0,1.2,-1.2);pyth.root.rotation.y=Math.sin(t*.4)*.08;const open=.15+.85*(.5+.5*Math.sin(t*1.2));pyth.upperJaw.rotation.x=-.14-open*.14;pyth.lowerJaw.rotation.x=.2+open*.34;pyth.portal.scale.setScalar(.55+open*.45);if(beatSent!=='portal'){hellAudio.portal();emit('portal')}}
    if(p==='guide'){camera.position.lerp(new THREE.Vector3(.18,1.35,2.9),.03);camera.lookAt(.2,1.6,-4);mini.root.position.y=.65+Math.sin(t*3)*.04;mini.root.rotation.y=-.55+Math.sin(t*1.8)*.08;mini.root.visible=true;emit('guide')}
    if(p==='launch'){camera.position.lerp(new THREE.Vector3(0,1.55,-3.4),.028);camera.lookAt(0,1.6,-10);pyth.root.visible=false;mini.root.visible=false;emit('launch')}
    distant.children.forEach((g,i)=>{g.position.y=Math.sin(t*.5+i)*.035;g.rotation.y+=dt*.04});
    scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.material instanceof THREE.MeshStandardMaterial&&o.material.emissiveIntensity>2){o.material.emissiveIntensity=2.5+Math.sin(t*3+o.id)*.8}});
    if(!reducedMotion){camera.position.x+=Math.sin(t*.7)*.0025;camera.position.y+=Math.sin(t*.9)*.0015}
    renderer.render(scene,camera);raf=requestAnimationFrame(animate)
  };
  let t=0; // local declaration for TS-friendly closure
  raf=requestAnimationFrame(animate);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',onResize);renderer.dispose();renderer.domElement.remove()}
 },[reducedMotion,onBeat]);
 return <div ref={mount} className="hell-world-3d" aria-hidden="true"/>;
}
