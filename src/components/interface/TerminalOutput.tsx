'use client';

import { useState, useEffect, useRef } from 'react';

interface LogEntry {
    id: number;
    text: string;
    type: 'info' | 'warn' | 'success';
}

const MESSAGES = [
    "INIT_DECOMPOSITION_PROTOCOL",
    "SCANNING_SURFACE_GEOMETRY",
    "EXTRACTING_PHASE_DATA",
    "ANALYZING_MACRO_TEXTURE",
    "FREQUENCY_MAPPING_ACTIVE",
    "SYNTH_NODE_01_CONNECTED",
    "LFO_SYNC_ESTABLISHED",
    "BUFFER_READY",
    "THERMAL_READOUT_STABLE",
    "DECOMPOSING_MATTER_TO_SINE",
    "OSC_BANK_A_INIT",
    "FILTER_RESONANCE_CALIBRATED",
];

export default function TerminalOutput() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const counter = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = {
                id: counter.current++,
                text: `${MESSAGES[Math.floor(Math.random() * MESSAGES.length)]} // ${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
                type: Math.random() > 0.8 ? 'warn' : 'info'
            } as LogEntry;

            setLogs(prev => [...prev.slice(-15), newLog]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div ref={scrollRef} className="h-24 overflow-y-auto px-4 py-2 font-mono scrollbar-hide opacity-40 select-none pointer-events-none">
            {logs.map(log => (
                <div key={log.id} className={`text-[7px] leading-tight flex gap-2 ${log.type === 'warn' ? 'text-[#ff4d00]' : 'text-gray-500'}`}>
                    <span>[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="uppercase">{log.text}</span>
                </div>
            ))}
        </div>
    );
}
