'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSynthStore } from '@/lib/store';

function ParticleSphereMesh() {
    const pointsRef = useRef<THREE.Points>(null!);
    const analyzer = useSynthStore(state => state.analyzer);

    // Initial sphere positions
    const count = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            pos[i * 3] = Math.cos(theta) * Math.sin(phi);
            pos[i * 3 + 1] = Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = Math.cos(phi);
        }
        return pos;
    }, [count]);

    const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

    useFrame((state, delta) => {
        if (!pointsRef.current || !analyzer) return;

        let data: Float32Array;
        try {
            const val = analyzer.getValue();
            if (val instanceof Float32Array) {
                // Ensure data is finite and clamped (Tone analyzer returns dBs: -Infinity to 0)
                data = val.map(v => isFinite(v) ? v : -100);
            } else {
                return;
            }
        } catch (e) {
            return;
        }

        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const fftIdx = i % data.length;

            // Normalize amplitude from dB (-100 to 0) to linear (0 to 1)
            // Then apply scaling for visual effect
            const rawValue = data[fftIdx];
            const amplitude = (Math.max(-100, Math.min(0, rawValue)) + 100) / 1000;

            const ox = originalPositions[i3];
            const oy = originalPositions[i3 + 1];
            const oz = originalPositions[i3 + 2];

            const noise = Math.sin(time + ox * 10) * 0.05;
            const displacement = 1 + amplitude + noise;

            posArray[i3] = ox * displacement;
            posArray[i3 + 1] = oy * displacement;
            posArray[i3 + 2] = oz * displacement;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y += delta * 0.1;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#ff4d00"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

export default function ParticleSphere() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-full h-full bg-black/20" />;
    }

    return (
        <div className="w-full h-full bg-black/20">
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <ParticleSphereMesh />
            </Canvas>
        </div>
    );
}
