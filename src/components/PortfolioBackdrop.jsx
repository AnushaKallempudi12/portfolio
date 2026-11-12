"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, RoundedBox, Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

const BLUE = "#78aaff";
const CYAN = "#80d9e8";
const nodes = [
  [-1.45, 0.85, 0], [-1.45, 0.15, 0], [-1.45, -0.55, 0],
  [-0.55, 1.12, 0.12], [-0.55, 0.52, 0.12], [-0.55, -0.12, 0.12], [-0.55, -0.78, 0.12],
  [0.38, 0.85, 0], [0.38, 0.18, 0], [0.38, -0.5, 0],
  [1.25, 0.55, 0.1], [1.25, -0.2, 0.1]
];
const edges = [[0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],[2,6],[3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,8],[6,9],[7,10],[8,10],[8,11],[9,11]];

function NetworkCore({reducedMotion}) {
  const pulse = useRef([]);
  useFrame((state) => {
    if (reducedMotion) return;
    pulse.current.forEach((mesh, i) => {
      if (mesh) mesh.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4 + i * .7) * .13);
    });
  });
  return <group position={[0, 0, .2]}>
    {edges.map(([a,b],i)=><Line key={i} points={[nodes[a],nodes[b]]} color={i%4===0?CYAN:"#4775b7"} transparent opacity={.38} lineWidth={1}/>)}
    {nodes.map(([x,y,z],i)=><mesh key={i} ref={el=>pulse.current[i]=el} position={[x,y,z]}>
      <sphereGeometry args={[(i===4||i===8)? .09 : .055,16,16]}/>
      <meshStandardMaterial color={i===4||i===8?CYAN:BLUE} emissive={i===4||i===8?CYAN:BLUE} emissiveIntensity={.55} roughness={.3}/>
    </mesh>)}
  </group>;
}

function ProjectPanel({position,title,accent=BLUE,kind="bars"}) {
  return <group position={position}>
    <RoundedBox args={[1.32,.92,.09]} radius={.055} smoothness={3}>
      <meshPhysicalMaterial color="#101e32" metalness={.48} roughness={.28} transparent opacity={.88}/>
    </RoundedBox>
    <mesh position={[0,.31,.052]}><boxGeometry args={[1.04,.012,.012]}/><meshBasicMaterial color={accent}/></mesh>
    <Text position={[-.48,.37,.07]} fontSize={.075} color="#b9cbe5" anchorX="left">{title}</Text>
    {kind==="bars" ? [0.2,.38,.27,.53,.42].map((h,i)=><mesh key={i} position={[-.38+i*.18,-.13+h/2,.07]}>
      <boxGeometry args={[.09,h,.025]}/><meshStandardMaterial color={i===3?CYAN:accent} emissive={accent} emissiveIntensity={.18}/>
    </mesh>) : kind==="code" ? Array.from({length:5},(_,i)=><mesh key={i} position={[-.28+(i%2)*.22,.13-i*.13,.07]}>
      <boxGeometry args={[.38-(i%3)*.08,.025,.018]}/><meshBasicMaterial color={i===1?CYAN:accent} transparent opacity={.8}/>
    </mesh>) : <group>
      <Line points={[[-.48,-.24,.08],[-.12,.08,.08],[.18,-.02,.08],[.46,.22,.08]]} color={CYAN} lineWidth={2}/>
      {[[-.48,-.24,.09],[-.12,.08,.09],[.18,-.02,.09],[.46,.22,.09]].map((p,i)=><mesh key={i} position={p}><sphereGeometry args={[.045,12,12]}/><meshBasicMaterial color={CYAN}/></mesh>)}
    </group>}
  </group>;
}

function Scene({reducedMotion}) {
  const root=useRef();
  const scroll=useRef(0);
  const pointer=useRef({x:0,y:0});
  const target=useRef({x:0,y:0});
  useEffect(()=>{
    let raf=0;
    const readScroll=()=>{raf=0;const max=document.documentElement.scrollHeight-window.innerHeight;scroll.current=max>0?window.scrollY/max:0;};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(readScroll);};
    const onPointer=(e)=>{target.current.x=(e.clientX/window.innerWidth-.5)*2;target.current.y=(e.clientY/window.innerHeight-.5)*2;};
    readScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onScroll,{passive:true});
    window.addEventListener("pointermove",onPointer,{passive:true});
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll);window.removeEventListener("pointermove",onPointer);};
  },[]);
  useFrame((state,delta)=>{
    if(!root.current||reducedMotion)return;
    pointer.current.x+=(target.current.x-pointer.current.x)*.035;
    pointer.current.y+=(target.current.y-pointer.current.y)*.035;
    const p=scroll.current;
    root.current.rotation.y+=(pointer.current.x*.12+Math.sin(state.clock.elapsedTime*.12)*.035-root.current.rotation.y)*Math.min(1,delta*2);
    root.current.rotation.x+=(-pointer.current.y*.055-root.current.rotation.x)*Math.min(1,delta*2);
    root.current.position.y+=((p-.5)*.72+Math.sin(state.clock.elapsedTime*.25)*.045-root.current.position.y)*Math.min(1,delta*1.4);
    root.current.rotation.z+=(p*.16-root.current.rotation.z)*Math.min(1,delta*1.2);
  });
  return <group ref={root} position={[1.15,0,0]}>
    <Float speed={reducedMotion?0:.45} rotationIntensity={reducedMotion?0:.018} floatIntensity={reducedMotion?0:.08}>
      <NetworkCore reducedMotion={reducedMotion}/>
    </Float>
    <ProjectPanel position={[-2.7,.82,-.15]} title="CODECOACH" accent={CYAN} kind="code"/>
    <ProjectPanel position={[2.5,.78,-.25]} title="ML / ANALYTICS" accent={BLUE} kind="bars"/>
    <ProjectPanel position={[-2.45,-1.05,-.2]} title="LIFESYNC" accent={BLUE} kind="bars"/>
    <ProjectPanel position={[2.45,-1.05,-.18]} title="NAAVIA AI" accent={CYAN} kind="route"/>
    <Line points={[[-2.05,.25,0],[-1.6,.25,.05]]} color={CYAN} transparent opacity={.6}/>
    <Line points={[[1.55,.2,.05],[2.05,.2,0]]} color={BLUE} transparent opacity={.6}/>
    <Line points={[[-1.8,-.6,0],[-1.45,-.6,.05]]} color={BLUE} transparent opacity={.45}/>
    <Line points={[[1.55,-.55,.05],[2.05,-.55,0]]} color={CYAN} transparent opacity={.45}/>
  </group>;
}

export default function PortfolioBackdrop() {
  const [reducedMotion,setReducedMotion]=useState(false);
  useEffect(()=>{
    const query=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReducedMotion(query.matches);
    update();query.addEventListener?.("change",update);
    return()=>query.removeEventListener?.("change",update);
  },[]);
  return <div className="portfolio-backdrop" aria-hidden="true">
    <Canvas camera={{position:[0,0,8.8],fov:38}} dpr={[1,1.35]} gl={{alpha:true,antialias:true}}>
      <ambientLight intensity={1.25}/>
      <directionalLight position={[3,4,5]} intensity={1.9} color="#c6dcff"/>
      <pointLight position={[-3,-1,3]} intensity={1.25} color="#397fff"/>
      <pointLight position={[3,1,2]} intensity={1.1} color="#55c8df"/>
      <Scene reducedMotion={reducedMotion}/>
    </Canvas>
  </div>;
}
