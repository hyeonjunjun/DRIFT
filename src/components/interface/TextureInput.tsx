'use client';

import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Upload, Camera, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import CameraInput, { CameraInputHandle } from '@/components/camera-input';

interface TextureInputProps {
    onImageSelect: (image: string | null) => void;
    isAnalyzing: boolean;
    selectedImage: string | null;
}

export interface TextureInputHandle {
    getCapture: () => Promise<string | null>;
}

const TextureInput = forwardRef<TextureInputHandle, TextureInputProps>(({ onImageSelect, isAnalyzing, selectedImage }, ref) => {
    const [mode, setMode] = useState<'upload' | 'camera'>('upload');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<CameraInputHandle>(null);

    useImperativeHandle(ref, () => ({
        getCapture: async () => {
            if (mode === 'camera') {
                const shot = cameraRef.current?.getScreenshot();
                if (shot) return await compressImage(shot);
                return null;
            }
            return selectedImage;
        }
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const compressImage = (base64Str: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 768;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
        });
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const result = e.target?.result as string;
            const compressed = await compressImage(result);
            onImageSelect(compressed);
        };
        reader.readAsDataURL(file);
    };

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    }, []);

    const clearSelection = () => {
        onImageSelect(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex flex-col h-full bg-black/40 border border-[#333] overflow-hidden">
            {/* Target Selector Header */}
            <div className="flex items-center justify-between p-2 border-b border-[#333] bg-[#111]/80 backdrop-blur-md">
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('upload')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'upload' ? 'bg-[#ff4d00] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Local_File
                    </button>
                    <button
                        onClick={() => setMode('camera')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'camera' ? 'bg-[#ff4d00] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Sensor_Stream
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-[#ff4d00] animate-pulse' : 'bg-gray-700'}`} />
                    <span className="text-[9px] text-gray-600 font-mono">STATUS: {mode.toUpperCase()}</span>
                </div>
            </div>

            {/* Main Interaction Area */}
            <div className="flex-grow relative">
                {mode === 'camera' ? (
                    <CameraInput ref={cameraRef} isAnalyzing={isAnalyzing} />
                ) : (
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`w-full h-full flex flex-col items-center justify-center p-8 transition-all duration-300 relative ${isDragging ? 'bg-[#ff4d00]/10 border-2 border-dashed border-[#ff4d00]' : 'bg-transparent'}`}
                    >
                        {selectedImage ? (
                            <div className="relative w-full h-full group bg-[#050505]">
                                {/* Blueprint Background Grid */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ff4d00' stroke-width='1'%3E%3Cpath d='M40 40V0H0v40h40zM39 39H1V1h38v38z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                                <img
                                    src={selectedImage}
                                    alt="Texture preview"
                                    className="w-full h-full object-contain grayscale contrast-125 opacity-80 border border-[#444] relative z-10"
                                />
                                <div className="absolute inset-0 bg-[#ff4d00]/5 pointer-events-none mix-blend-overlay" />

                                {/* Image Overlays */}
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/90 border border-[#333] text-[8px] text-[#ff4d00] font-bold uppercase">
                                    RAW_FILE_PREVIEW
                                </div>

                                {!isAnalyzing && (
                                    <button
                                        onClick={clearSelection}
                                        className="absolute top-2 right-2 p-1 bg-black/90 border border-[#333] text-gray-500 hover:text-[#ff4d00] transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}

                                {isAnalyzing && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                                        <RefreshCw className="text-[#ff4d00] animate-spin mb-4" size={32} />
                                        <span className="text-[10px] text-[#ff4d00] font-bold tracking-[0.2em] animate-pulse">DECOMPOSING_SURFACE...</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="flex flex-col items-center gap-4 cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-16 h-16 border border-[#333] flex items-center justify-center group-hover:border-[#ff4d00] transition-colors relative">
                                    <Upload size={24} className="text-gray-600 group-hover:text-[#ff4d00] transition-colors" />
                                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#333] group-hover:border-[#ff4d00]" />
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#333] group-hover:border-[#ff4d00]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Drop_Texture_Source</p>
                                    <p className="text-[8px] text-gray-700 uppercase tracking-tighter">or click to browse local archive</p>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                )}

                {/* Viewport frame decorative elements */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#ff4d00]/30 pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#ff4d00]/30 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#ff4d00]/30 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#ff4d00]/30 pointer-events-none" />
            </div>

            {/* Footer Info */}
            <div className="p-2 border-t border-[#333] bg-[#0d0d0d] flex justify-between items-center text-[7px] text-gray-600 font-mono">
                <span>X_COORD: 0.00 | Y_COORD: 0.00</span>
                <span>RESOLUTION: {selectedImage ? "DETECTED" : "NULL"}</span>
            </div>
        </div>
    );
});

TextureInput.displayName = 'TextureInput';

export default TextureInput;
