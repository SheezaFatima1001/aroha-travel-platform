import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generates a jagged mountain-ridge silhouette as an extruded shape
function Ridge({ z, color, amplitude, seed, speed = 0.02 }) {
  const mesh = useRef();

  const geometry = useMemo(() => {
    const points = [];
    const segments = 24;
    let rand = seed;
    const pseudoRandom = () => {
      rand = (rand * 9301 + 49297) % 233280;
      return rand / 233280;
    };
    points.push(new THREE.Vector2(-20, -6));
    for (let i = 0; i <= segments; i++) {
      const x = -18 + (i / segments) * 36;
      const y = pseudoRandom() * amplitude - amplitude / 2 + 1;
      points.push(new THREE.Vector2(x, y));
    }
    points.push(new THREE.Vector2(20, -6));

    const shape = new THREE.Shape(points);
    return new THREE.ShapeGeometry(shape);
  }, [amplitude, seed]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.15 - 1.5;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, -1.5, z]}>
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function Stars({ count = 400 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 12;
      arr[i * 3 + 2] = -Math.random() * 20 - 5;
    }
    return arr;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#EDE7DD" size={0.05} transparent opacity={0.5} />
    </points>
  );
}

function ScrollCamera({ scrollRef }) {
  useFrame(({ camera }) => {
    const progress = scrollRef.current;
    camera.position.y = 1.5 - progress * 3;
    camera.position.z = 10 - progress * 4;
    camera.lookAt(0, -1 - progress * 1.5, -5);
  });
  return null;
}

export default function HeroScene({ scrollRef, lite = false }) {
  return (
    <Canvas
      dpr={lite ? [1, 1.2] : [1, 2]}
      camera={{ position: [0, 1.5, 10], fov: 45 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#060A12']} />
        {!lite && <Stars count={250} />}
        <ScrollCamera scrollRef={scrollRef} />
        <Ridge z={-14} color="#0B1220" amplitude={3.5} seed={11} speed={0.015} />
        <Ridge z={-9} color="#0F1B2E" amplitude={4.5} seed={42} speed={0.02} />
        <Ridge z={-4} color="#16273F" amplitude={5.5} seed={7} speed={0.025} />
        <Ridge z={0} color="#1E3350" amplitude={6.5} seed={99} speed={0.03} />
      </Suspense>
    </Canvas>
  );
}
