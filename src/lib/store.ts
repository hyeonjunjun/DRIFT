import { create } from 'zustand';
import { SynthParams } from './schemas';

interface SynthState {
    params: SynthParams | null;
    isPlaying: boolean;
    isAnalyzing: boolean;
    setParams: (params: SynthParams) => void;
    setIsPlaying: (playing: boolean) => void;
    setIsAnalyzing: (analyzing: boolean) => void;
}

export const useSynthStore = create<SynthState>((set) => ({
    params: null,
    isPlaying: false,
    isAnalyzing: false,
    setParams: (params) => set({ params }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
}));
