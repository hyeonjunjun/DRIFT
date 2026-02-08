'use client';

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function Visualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const analyser = new Tone.Analyser("waveform", 256);
        Tone.getDestination().connect(analyser);
        analyserRef.current = analyser;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            const values = analyser.getValue() as Float32Array;
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#ff4d00";

            const sliceWidth = canvas.width / values.length;
            let x = 0;

            for (let i = 0; i < values.length; i++) {
                const v = values[i];
                const y = (v + 1) / 2 * canvas.height;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.stroke();
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            analyser.dispose();
        };
    }, []);

    return (
        <div className="w-full h-12 border border-[#333] bg-black overflow-hidden relative">
            <canvas ref={canvasRef} width={400} height={50} className="w-full h-full" />
            <div className="absolute top-1 left-1 text-[8px] text-[#ff4d00] font-mono uppercase tracking-widest opacity-50">OSC_STREAM</div>
        </div>
    );
}
