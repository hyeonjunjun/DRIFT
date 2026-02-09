'use client';

import { useState } from 'react';
import { Download, Disc, StopCircle } from 'lucide-react';
import { useSynthStore } from '@/lib/store';

export default function RecordButton() {
    const [isRecording, setIsRecording] = useState(false);
    const recorder = useSynthStore(state => state.recorder);

    const startRecording = async () => {
        if (!recorder) return;
        setIsRecording(true);
        recorder.start();
    };

    const stopRecording = async () => {
        if (!recorder) return;
        setIsRecording(false);
        const recording = await recorder.stop();
        const url = URL.createObjectURL(recording);
        const anchor = document.createElement("a");
        anchor.download = `surface_${Date.now()}.wav`;
        anchor.href = url;
        anchor.click();
    };

    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!recorder}
            className={`flex items-center gap-2 px-3 py-1 border text-[9px] font-bold tracking-widest transition-all ${isRecording
                    ? 'bg-[#ff4d00] text-white border-[#ff4d00] animate-pulse'
                    : 'border-[#333] text-gray-400 hover:border-[#ff4d00] hover:text-[#ff4d00]'
                }`}
        >
            {isRecording ? (
                <>
                    <StopCircle size={12} /> STOP_REC
                </>
            ) : (
                <>
                    <Disc size={12} /> RECORD_WAV
                </>
            )}
        </button>
    );
}
