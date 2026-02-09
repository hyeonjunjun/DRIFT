import { create } from 'zustand';
import { SynthParams } from './schemas';
import * as Tone from 'tone';

interface SynthState {
    params: SynthParams | null;
    isPlaying: boolean;
    isAnalyzing: boolean;
    analyzer: Tone.Analyser | null;
    recorder: Tone.Recorder | null;
    history: SynthParams[];
    setParams: (params: SynthParams) => void;
    setIsPlaying: (playing: boolean) => void;
    setIsAnalyzing: (analyzing: boolean) => void;
    setAnalyzer: (analyzer: Tone.Analyser) => void;
    setRecorder: (recorder: Tone.Recorder) => void;
}

export const useSynthStore = create<SynthState>((set) => ({
    params: null,
    isPlaying: false,
    isAnalyzing: false,
    analyzer: null,
    recorder: null,
    history: [],
    setParams: (params) => set((state) => {
        const newHistory = [params, ...state.history].slice(0, 10);
        return { params, history: newHistory };
    }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setAnalyzer: (analyzer) => set({ analyzer }),
    setRecorder: (recorder) => set({ recorder }),
}));
