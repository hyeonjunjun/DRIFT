'use client';

import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Webcam from 'react-webcam';

interface CameraInputProps {
    onCapture?: (image: string) => void;
    isAnalyzing: boolean;
}

export interface CameraInputHandle {
    getScreenshot: () => string | null;
}

const CameraInput = forwardRef<CameraInputHandle, CameraInputProps>(({ isAnalyzing }, ref) => {
    const webcamRef = useRef<Webcam>(null);

    useImperativeHandle(ref, () => ({
        getScreenshot: () => {
            return webcamRef.current?.getScreenshot() || null;
        }
    }));

    return (
        <div className="relative aspect-video bg-black border border-[#333] overflow-hidden">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover opacity-80 contrast-125 grayscale"
                videoConstraints={{ facingMode: "environment" }}
            />
            {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-[#ff4d00] animate-pulse font-mono z-20">
                    ANALYZING_TEXTURE...
                </div>
            )}
            {/* Viewport frame */}
            <div className="absolute inset-0 border border-[#333] pointer-events-none z-10" />
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#ff4d00] pointer-events-none z-10" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#ff4d00] pointer-events-none z-10" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#ff4d00] pointer-events-none z-10" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#ff4d00] pointer-events-none z-10" />
        </div>
    );
});

CameraInput.displayName = 'CameraInput';

export default CameraInput;
