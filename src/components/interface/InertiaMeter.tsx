'use client';

import { useMemo } from 'react';

interface InertiaMeterProps {
    label: string;
    value: number; // 0 to 1
    displayValue: string | number;
    color?: string;
}

export default function InertiaMeter({ label, value, displayValue, color = "#ff4d00" }: InertiaMeterProps) {
    // Rotation for the needle: -45deg to 45deg
    const rotation = useMemo(() => {
        const clamped = Math.max(0, Math.min(1, value));
        return (clamped * 90) - 45;
    }, [value]);

    return (
        <div className="border border-[#333] p-4 bg-black/60 shadow-inner group hover:border-gray-500 transition-colors relative overflow-hidden">
            {/* Background Arch */}
            <div className="flex flex-col items-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold tracking-[0.2em] block mb-4 self-start">{label}</span>

                <div className="relative w-24 h-12 overflow-hidden mb-2">
                    {/* SVG Arch */}
                    <svg viewBox="0 0 100 50" className="w-full h-full opacity-30">
                        <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            stroke={color}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="1 3"
                        />
                        {/* Scale Ticks */}
                        {[0, 22.5, 45, 67.5, 90].map((tick, i) => {
                            const angle = (tick - 45) * (Math.PI / 180);
                            const x1 = 50 + Math.sin(angle) * 35;
                            const y1 = 50 - Math.cos(angle) * 35;
                            const x2 = 50 + Math.sin(angle) * 45;
                            const y2 = 50 - Math.cos(angle) * 45;
                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" />;
                        })}
                    </svg>

                    {/* The Needle */}
                    <div
                        className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-[#ff4d00] origin-bottom transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
                        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff4d00] rounded-full shadow-[0_0_8px_#ff4d00]" />
                    </div>
                </div>

                <span className="text-lg font-bold uppercase block leading-none text-[#ff4d00] font-mono tracking-tighter">
                    {displayValue}
                </span>
            </div>

            {/* Corner Decorative Dots */}
            <div className="absolute top-1 right-1 w-1 h-1 bg-[#222]" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#222]" />
        </div>
    );
}
