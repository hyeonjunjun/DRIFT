'use client';

import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function Visualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);
    const animationRef = useRef<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

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

            // Create phosphor trail by not clearing fully
            ctx.fillStyle = "rgba(10, 10, 10, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const sliceWidth = canvas.width / values.length;
            let x = 0;
            const centerY = canvas.height / 2;

            // DRAW FILL (Half-Fill effect from center line)
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 77, 0, 0.15)";
            ctx.moveTo(0, centerY);

            for (let i = 0; i < values.length; i++) {
                const v = values[i];
                const y = (v + 1) / 2 * canvas.height;
                ctx.lineTo(x, y);
                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, centerY);
            ctx.closePath();
            ctx.fill();

            // DRAW STROKE (The Waveform line)
            x = 0;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ff4d00";
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#ff4d00";

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
            ctx.shadowBlur = 0;

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            analyser.dispose();
        };
    }, []);

    return (
        <div className={`w-full transition-all duration-500 ease-in-out border border-[#333] bg-black overflow-hidden relative group hover:border-[#ff4d00]/30 ${isExpanded ? 'h-96' : 'h-32'}`}>
            <canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
            <div className="absolute top-2 left-2 text-[8px] text-[#ff4d00] font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
                <div className="w-1 h-1 bg-[#ff4d00] animate-pulse rounded-full" />
                OSC_STREAM_ANALYSIS
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute top-2 right-2 p-1.5 border border-[#333] bg-black/80 hover:bg-[#ff4d00]/10 hover:border-[#ff4d00] transition-colors group/btn"
                title={isExpanded ? "Collapse" : "Expand"}
            >
                {isExpanded ? (
                    <Minimize2 size={12} className="text-[#ff4d00]" />
                ) : (
                    <Maximize2 size={12} className="text-gray-500 group-hover/btn:text-[#ff4d00]" />
                )}
            </button>
        </div>
    );
}
