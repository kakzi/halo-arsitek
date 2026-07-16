'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useRenderStrategy } from '@/shared/three/performance-monitor';

// Particle component forming an abstract architectural shape
function ParticleShape() {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;
  
  // Generate particles in a wireframe-like cubic/architectural structure
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Abstract house/building shape
      let x, y, z;
      
      const part = Math.random();
      if (part < 0.4) {
        // Walls (box)
        x = (Math.random() - 0.5) * 4;
        y = (Math.random() - 0.5) * 2 - 0.5;
        z = (Math.random() - 0.5) * 3;
      } else if (part < 0.7) {
        // Roof (pyramid/prism shape)
        x = (Math.random() - 0.5) * 4;
        y = Math.random() * 2 + 0.5;
        // z gets narrower as y goes up
        const width = 1.5 - ((y - 0.5) / 2) * 1.5;
        z = (Math.random() - 0.5) * width * 2;
      } else {
        // Floating ambient particles
        x = (Math.random() - 0.5) * 8;
        y = (Math.random() - 0.5) * 6;
        z = (Math.random() - 0.5) * 8;
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      sizes[i] = Math.random() * 0.05 + 0.01;
    }
    
    return [positions, sizes];
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      // Slow auto-rotation
      ref.current.rotation.y += delta * 0.1;
      
      // Mouse interaction (gentle orbit)
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.02;
      ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} sizes={sizes}>
      <PointMaterial
        transparent
        color="#94A3B8" // Slate gray accent
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function HeroScene() {
  const strategy = useRenderStrategy();

  if (strategy === 'static-fallback') {
    return (
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80")' }}
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 2]} // Support high DPI displays but limit to 2 for performance
      gl={{ antialias: false, alpha: true }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#0A0A0A']} />
        <ambientLight intensity={0.5} />
        <ParticleShape />
      </Suspense>
    </Canvas>
  );
}
