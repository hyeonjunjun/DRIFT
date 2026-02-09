'use client';

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useSynthStore } from '@/lib/store';

export default function SynthEngine() {
    const { params, isPlaying } = useSynthStore();

    // Refs to hold Tone.js instances so they persist across renders
    const synthRef = useRef<Tone.MonoSynth | null>(null);
    const distortionRef = useRef<Tone.Distortion | null>(null);
    const filterRef = useRef<Tone.Filter | null>(null);
    const sequenceRef = useRef<Tone.Sequence | null>(null);
    const reverbRef = useRef<Tone.Reverb | null>(null);

    // 1. Initialize Audio Context (Run once)
    useEffect(() => {
        // Chain: Synth -> Distortion -> Filter -> Reverb -> Master
        const reverb = new Tone.Reverb(2.5).toDestination(); // Industrial reverb
        const filter = new Tone.Filter(1000, "lowpass").connect(reverb);
        const distortion = new Tone.Distortion(0).connect(filter);
        const synth = new Tone.MonoSynth({
            oscillator: { type: "square" },
            envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 1 },
        }).connect(distortion);

        // Analysis Node for Three.js
        const analyzer = new Tone.Analyser("fft", 256);
        const recorder = new Tone.Recorder();
        Tone.getDestination().connect(analyzer);
        Tone.getDestination().connect(recorder);

        synthRef.current = synth;
        distortionRef.current = distortion;
        filterRef.current = filter;
        reverbRef.current = reverb;

        // Provide nodes to the state
        useSynthStore.getState().setAnalyzer(analyzer);
        useSynthStore.getState().setRecorder(recorder);

        return () => {
            synth.dispose();
            distortion.dispose();
            filter.dispose();
            reverb.dispose();
            analyzer.dispose();
            recorder.dispose();
            sequenceRef.current?.dispose();
        };
    }, []);

    // 2. Handle Play/Stop
    useEffect(() => {
        if (isPlaying) {
            Tone.getTransport().start();
        } else {
            Tone.getTransport().stop();
        }
    }, [isPlaying]);

    // 3. Update Audio Params when AI returns new data (Morphing)
    useEffect(() => {
        if (!params || !synthRef.current) return;

        const {
            oscillator_type,
            distortion_amount,
            filter_cutoff,
            bpm,
            sequencer_pattern,
            resonance
        } = params;

        // Smoothly Morph Nodes
        synthRef.current.oscillator.type = oscillator_type;
        distortionRef.current!.distortion = distortion_amount;

        // Using rampTo for musical transitions
        filterRef.current!.frequency.rampTo(filter_cutoff, 2);
        filterRef.current!.Q.rampTo(resonance, 2);
        Tone.getTransport().bpm.rampTo(bpm, 2);

        // Update Sequencer
        if (sequenceRef.current) sequenceRef.current.dispose();

        sequenceRef.current = new Tone.Sequence(
            (time, note) => {
                if (note === 1) {
                    const pitch = Math.random() > 0.8 ? "C3" : "C2";
                    synthRef.current?.triggerAttackRelease(pitch, "8n", time);
                }
            },
            sequencer_pattern,
            "16n"
        ).start(0);

    }, [params]);

    return null; // Headless component
}
