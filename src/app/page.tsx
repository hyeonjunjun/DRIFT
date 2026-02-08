'use client';

import { useState, useRef } from 'react';
import * as Tone from 'tone';
import SynthEngine from '@/components/synth-engine';
import CameraInput, { CameraInputHandle } from '@/components/camera-input';
import Visualizer from '@/components/interface/Visualizer';
import { useSynthStore } from '@/lib/store';
import { Settings, Play, Square, Camera, Activity } from 'lucide-react';

export default function Home() {
  const cameraRef = useRef<CameraInputHandle>(null);
  const { params, isAnalyzing, setIsAnalyzing, isPlaying, setIsPlaying, setParams } = useSynthStore();

  const captureAndAnalyze = async () => {
    // 1. Initialize Audio Context immediately on interaction
    await Tone.start();

    if (!cameraRef.current) return;
    const imageSrc = cameraRef.current.getScreenshot();

    if (!imageSrc) return;

    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setParams(data);
      setIsPlaying(true); // Auto-start sequence
    } catch (e) {
      console.error(e);
      alert('Failed to analyze texture. Check console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayback = async () => {
    await Tone.start();
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Grid Texture */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <SynthEngine />

      {/* Header */}
      <header className="z-10 w-full max-w-lg flex justify-between items-end border-b border-[#333] pb-4 font-mono">
        <div>
          <h1 className="text-2xl tracking-tighter font-bold text-[#f0f0f0]">
            surface<span className="text-[#ff4d00]">.wav</span>
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Matter to Music Converter</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-mono">V.1.0 // LAB-04</div>
          <div className="text-[10px] text-[#ff4d00] animate-pulse">SYSTEM_ACTIVE</div>
        </div>
      </header>

      {/* Main Interface */}
      <div className="z-10 w-full max-lg:max-w-md lg:max-w-4xl grid lg:grid-cols-2 gap-6">

        {/* Left Column: Visual Input */}
        <section className="border border-[#333] bg-[#111] p-1 relative flex flex-col gap-4">
          {/* Decorative corner screws */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />

          <div className="p-4 flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                <Camera size={12} className="text-[#ff4d00]" /> VISUAL_INPUT_STREAM
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-[#333]" />
                <div className="w-1 h-1 bg-[#333]" />
                <div className="w-1 h-1 bg-[#ff4d00]" />
              </div>
            </div>

            <CameraInput ref={cameraRef} isAnalyzing={isAnalyzing} />

            <button
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className="w-full h-16 bg-[#f0f0f0] text-[#0a0a0a] font-bold text-lg hover:bg-[#ff4d00] hover:text-white transition-all border border-transparent disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3 font-mono"
              style={{ borderRadius: '0' }}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="animate-spin" /> PROCESSING...
                </>
              ) : (
                <>
                  <Activity /> CAPTURE_&_SYNTHESIZE
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column: Audio & Readout */}
        <section className="border border-[#333] bg-[#111] p-1 relative flex flex-col gap-4">
          {/* Decorative corner screws */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-[#333] bg-[#0a0a0a]" />

          <div className="p-4 flex flex-col gap-4 flex-grow h-full justify-between">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                <Settings size={12} className="text-[#ff4d00]" /> SYNTH_PARAMETERS
              </span>
              <span className="text-[10px] text-gray-600 font-mono">SEQ_01</span>
            </div>

            {/* Output Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono flex-grow">
              <div className="col-span-2">
                <Visualizer />
              </div>
              <div className="border border-[#333] p-3 bg-black flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Oscillator</span>
                <span className="text-[#ff4d00] text-sm font-bold uppercase">{params?.oscillator_type || "---"}</span>
              </div>
              <div className="border border-[#333] p-3 bg-black flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Distortion</span>
                <span className="text-[#ff4d00] text-sm font-bold">{(params?.distortion_amount || 0).toFixed(2)}</span>
              </div>
              <div className="border border-[#333] p-3 bg-black flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Filter Cutoff</span>
                <span className="text-[#ff4d00] text-sm font-bold">{params?.filter_cutoff || "---"} Hz</span>
              </div>
              <div className="border border-[#333] p-3 bg-black flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Tempo</span>
                <span className="text-[#ff4d00] text-sm font-bold">{params?.bpm || "---"} BPM</span>
              </div>
              <div className="col-span-2 border border-[#333] p-3 bg-black">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Texture Description</span>
                <p className="text-[#f0f0f0] text-[11px] leading-tight mt-1 line-clamp-2">
                  {params?.texture_description || "Awaiting visual data input..."}
                </p>
              </div>
            </div>

            {/* Pattern Visualization */}
            <div className="border border-[#333] p-2 bg-[#0a0a0a] min-h-[40px] flex gap-[2px]">
              {(params?.sequencer_pattern || Array(16).fill(0)).map((val, i) => (
                <div
                  key={i}
                  className={`flex-grow border border-[#222] ${val === 1 ? 'bg-[#ff4d00]' : 'bg-[#111]'} transition-colors`}
                />
              ))}
            </div>

            <button
              onClick={togglePlayback}
              className={`w-full h-12 border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all ${isPlaying ? 'border-[#ff4d00] text-[#ff4d00] bg-[#ff4d00]/10' : 'border-[#333] text-gray-400'}`}
              style={{ borderRadius: '0' }}
            >
              {isPlaying ? (
                <>
                  <Square size={14} fill="currentColor" /> STOP_AUDIO_ENGINE
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> START_AUDIO_ENGINE
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      <footer className="z-10 text-[9px] text-gray-600 font-mono text-center mt-4">
        HARDWARE ACCELERATED // GEMINI 1.5 FLASH // TONE.JS V14 // NO_RADIUS_ZONE
      </footer>
    </main>
  );
}
