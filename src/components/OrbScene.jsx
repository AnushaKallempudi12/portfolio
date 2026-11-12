"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Sparkles } from "@react-three/drei";
import { useRef } from "react";

function Core(){
  const mesh=useRef();
  useFrame((state,delta)=>{if(mesh.current){mesh.current.rotation.y+=delta*.12;mesh.current.rotation.x=Math.sin(state.clock.elapsedTime*.18)*.12;}});
  return <Float speed={1.1} rotationIntensity={.22} floatIntensity={.38}>
    <mesh ref={mesh} scale={1.65}>
      <icosahedronGeometry args={[1,5]}/>
      <MeshDistortMaterial color="#477fe0" roughness={.2} metalness={.72} distort={.34} speed={1.35} envMapIntensity={1.8}/>
    </mesh>
    <mesh scale={2.08} rotation={[.5,.3,.15]}>
      <torusGeometry args={[1,.003,12,180]}/>
      <meshBasicMaterial color="#80baff" transparent opacity={.55}/>
    </mesh>
    <mesh scale={2.34} rotation={[1.1,.5,.7]}>
      <torusGeometry args={[1,.002,8,180]}/>
      <meshBasicMaterial color="#7ed9ec" transparent opacity={.3}/>
    </mesh>
  </Float>;
}
export default function OrbScene(){
  return <Canvas camera={{position:[0,0,6.2],fov:38}} dpr={[1,1.6]} gl={{alpha:true,antialias:true}}>
    <ambientLight intensity={1.1}/>
    <directionalLight position={[4,4,5]} intensity={2.2} color="#b8d4ff"/>
    <pointLight position={[-4,-2,2]} intensity={3} color="#347cff"/>
    <Core/>
    <Sparkles count={85} scale={6} size={1.5} speed={.22} color="#a6d8ff"/>
    <Environment preset="city"/>
  </Canvas>;
}