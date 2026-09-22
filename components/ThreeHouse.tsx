"use client";

import { ContactShadows, Environment, Float, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

function House({ active, onActive }: { active: string; onActive: (value: string) => void }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.12 - 0.18, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.035, 0.035);
  });

  const label = (name: string, position: [number, number, number]) => (
    <Html position={position} center distanceFactor={8}>
      <button className={`house-label ${active === name ? "active" : ""}`} onClick={() => onActive(name)}>{name}</button>
    </Html>
  );

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      <mesh position={[0, -0.75, 0]} receiveShadow>
        <boxGeometry args={[7.5, 0.16, 5.3]} />
        <meshStandardMaterial color="#d8d0c2" roughness={0.88} />
      </mesh>
      <mesh position={[-1.45, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 1.6, 3.3]} />
        <meshStandardMaterial color="#d8d0c4" roughness={0.64} />
      </mesh>
      <mesh position={[1.25, 0.15, -0.2]} castShadow>
        <boxGeometry args={[1.7, 1.85, 2.9]} />
        <meshStandardMaterial color="#7a4c31" roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, 1.48, -0.35]} castShadow>
        <boxGeometry args={[4.5, 1.25, 2.35]} />
        <meshStandardMaterial color="#eee7da" roughness={0.75} />
      </mesh>
      <mesh position={[-0.25, 0.2, 1.68]}>
        <boxGeometry args={[2.5, 1.25, 0.035]} />
        <meshPhysicalMaterial color="#9eb6b2" metalness={0.05} roughness={0.12} transmission={0.62} transparent opacity={0.72} />
      </mesh>
      <mesh position={[-0.25, 1.18, 1.01]}>
        <boxGeometry args={[3.5, 0.035, 1.3]} />
        <meshStandardMaterial color="#b98c63" roughness={0.45} />
      </mesh>
      <mesh position={[2.35, -0.57, 0.95]}>
        <boxGeometry args={[2.2, 0.12, 1.8]} />
        <meshPhysicalMaterial color="#688d90" roughness={0.2} metalness={0.05} />
      </mesh>
      {[[-2.7, -0.25, 1.75], [2.9, -0.24, -1.35], [2.8, -0.24, 2.0]].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <mesh castShadow><cylinderGeometry args={[0.08, 0.13, 0.7, 8]} /><meshStandardMaterial color="#5a4536" /></mesh>
          <mesh position={[0, 0.55, 0]} castShadow><sphereGeometry args={[0.48, 12, 12]} /><meshStandardMaterial color="#75806b" roughness={0.9} /></mesh>
        </group>
      ))}
      {label("LIVING", [-0.8, 0.1, 2.0])}
      {label("LIGHT", [-0.2, 1.95, 0.5])}
      {label("LANDSCAPE", [2.9, 0.1, 2.05])}
      {label("MATERIAL", [1.25, 0.8, 1.32])}
    </group>
  );
}

export default function ThreeHouse() {
  const [active, setActive] = useState("LIVING");
  return (
    <div className="three-house" aria-label="Interactive architectural model">
      <Canvas camera={{ position: [7, 4, 8], fov: 36 }} dpr={[1, 1.5]} shadows>
        <color attach="background" args={["#ded8cd"]} />
        <fog attach="fog" args={["#ded8cd", 11, 22]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 8, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={null}>
          <Float speed={0.65} rotationIntensity={0.025} floatIntensity={0.08}>
            <House active={active} onActive={setActive} />
          </Float>
          <Environment preset="apartment" />
          <ContactShadows position={[0, -1.05, 0]} opacity={0.28} scale={14} blur={2.2} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3.1} maxPolarAngle={Math.PI / 2.15} />
      </Canvas>
      <p className="three-caption">{active === "LIVING" ? "Open rooms, framed by landscape." : active === "LIGHT" ? "Deep overhangs temper the Pune sun." : active === "LANDSCAPE" ? "Native planting softens every threshold." : "Stone, wood and glass in quiet balance."}</p>
    </div>
  );
}
