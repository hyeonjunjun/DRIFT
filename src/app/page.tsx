'use client';

import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import SynthEngine from '@/components/synth-engine';
import dynamic from 'next/dynamic';
import TextureInput, { TextureInputHandle } from '@/components/interface/TextureInput';
import InertiaMeter from '@/components/interface/InertiaMeter';
import TerminalOutput from '@/components/interface/TerminalOutput';
import CameraInput, { CameraInputHandle } from '@/components/camera-input';
const ParticleSphere = dynamic(() => import('@/components/interface/ParticleSphere'), { ssr: false });
import RecordButton from '@/components/interface/RecordButton';
import { useSynthStore } from '@/lib/store';
import { Settings, Play, Square, Camera, Activity, Cpu, Wifi, BatteryMedium, AlertTriangle, RefreshCcw, Info } from 'lucide-react';

export default function Home() {
  const textureRef = useRef<TextureInputHandle>(null);
  const { params, isAnalyzing, setIsAnalyzing, isPlaying, setIsPlaying, setParams } = useSynthStore();
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [telemetry, setTelemetry] = useState({ load: 14, tps: 60 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        load: Math.floor(10 + Math.random() * 12),
        tps: Math.floor(58 + Math.random() * 4)
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const captureAndAnalyze = async () => {
    setError(null);
    await Tone.start();

    if (!textureRef.current) return;
    const imageSrc = await textureRef.current.getCapture();

    if (!imageSrc) {
      setError("NO_SOURCE_FOUND // PLEASE_UPLOAD_OR_CAPTURE");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!res.ok) throw new Error("NETWORK_FAILURE // Gemini API Timeout");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setParams(data);
      setIsPlaying(true);
      setShowInstructions(false);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "ANALYSIS_FAILED // PLEASE_RETRY");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayback = async () => {
    await Tone.start();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#f0f0f0] font-mono select-none crt-overlay">
      <SynthEngine />

      {/* Persistent Status Bar */}
      <div className="h-6 border-b border-[#333] flex items-center justify-between px-3 text-[9px] text-gray-500 bg-[#0a0a0a] z-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-bold">
            <Cpu size={10} className="text-[#ff4d00]" />
            LOAD: {telemetry.load}%
          </span>
          <span className="flex items-center gap-1 font-bold">
            <Wifi size={10} />
            LINK: ACTIVE
          </span>
          <span className="flex items-center gap-1 font-bold">
            <Activity size={10} />
            TPS: {telemetry.tps}
          </span>
        </div>
        {error ? (
          <div className="flex items-center gap-2 text-[#ff4d00] animate-pulse">
            <AlertTriangle size={10} /> {error}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-[#ff4d00] font-bold">MODE: {isAnalyzing ? "ANALYZING" : "IDLE"}</span>
            <span className="flex items-center gap-1">100% <BatteryMedium size={10} /></span>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Left Panel: Texture/Input */}
        <div className="flex-grow md:w-3/5 border-r border-[#333] flex flex-col relative z-10 bg-[#0a0a0a]/50">
          <div className="p-3 border-b border-[#333] flex justify-between items-center bg-[#111]/80 backdrop-blur-md">
            <span className="text-[10px] tracking-widest text-[#ff4d00] flex items-center gap-2 font-bold">
              <Camera size={12} /> TEXTURE_DECOMPOSITION_UNIT
            </span>
            <div className="flex gap-2">
              {error && (
                <button onClick={() => setError(null)} className="text-[9px] hover:text-[#ff4d00] flex items-center gap-1 uppercase">
                  <RefreshCcw size={10} /> Clear_Error
                </button>
              )}
              <div className="w-2 h-2 bg-[#ff4d00]" />
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center p-6 relative">
            <div className={`w-full max-w-2xl aspect-video border border-[#333] bg-black shadow-2xl relative transition-all duration-500 ${isAnalyzing ? 'scale-[1.02] border-[#ff4d00]' : ''}`}>
              <TextureInput
                ref={textureRef}
                isAnalyzing={isAnalyzing}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />

              {showInstructions && !isAnalyzing && !selectedImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30 p-8 text-center pointer-events-none">
                  <div className="max-w-xs space-y-4">
                    <Info className="mx-auto text-[#ff4d00]" size={32} />
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Hardware Offline</h2>
                    <p className="text-[10px] text-gray-400 leading-relaxed uppercase">Drop a texture file or activate thermal sensor to begin analysis.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-[#333] bg-[#0d0d0d]">
            <button
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className={`w-full h-20 font-bold text-xl transition-all border border-transparent disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-4 ${isAnalyzing ? 'bg-[#ff4d00] text-white animate-pulse' : 'bg-[#f0f0f0] text-[#0a0a0a] hover:bg-[#ff4d00] hover:text-white'}`}
              style={{ borderRadius: '0' }}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="animate-spin" size={24} /> DECOMPOSING...
                </>
              ) : (
                <>
                  <RefreshCcw size={24} /> {params ? 'RE-SCAN_ARCHIVE' : 'ANALYZE_TEXTURE'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Controls/Parameters */}
        <div className="w-full md:w-2/5 flex flex-col bg-[#111]/40 backdrop-blur-xl z-20">
          <div className="p-3 border-b border-[#333] flex justify-between items-center bg-[#111]/80 backdrop-blur-md">
            <span className="text-[10px] tracking-widest text-gray-400 flex items-center gap-2 font-bold uppercase">
              <Settings size={12} className="text-[#ff4d00]" /> Synth_Profile_V1.0.4
            </span>
            <span className="text-[8px] text-[#333] font-bold">LFO_SYNC: ON</span>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-8 flex flex-col gap-8">

            <div className="h-48 border border-[#333] bg-black/60 relative overflow-hidden">
              <ParticleSphere />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InertiaMeter
                label="Oscillator"
                value={params ? 0.8 : 0}
                displayValue={params?.oscillator_type || '---'}
              />
              <InertiaMeter
                label="Distortion"
                value={params?.distortion_amount || 0}
                displayValue={params ? `${(params.distortion_amount * 100).toFixed(0)}%` : '---'}
              />
              <InertiaMeter
                label="Filter Hz"
                value={params ? (params.filter_cutoff / 10000) : 0}
                displayValue={params?.filter_cutoff || '---'}
              />
              <InertiaMeter
                label="BPM"
                value={params ? (params.bpm - 60) / 120 : 0}
                displayValue={params?.bpm || '---'}
              />
            </div>

            <section className="space-y-3">
              <span className="text-[9px] text-[#ff4d00] uppercase font-bold tracking-widest">Metadata readout</span>
              <div className="border border-[#333] bg-black/60 relative overflow-hidden min-h-[120px] flex flex-col">
                {/* Ambient Terminal Log */}
                <div className="absolute inset-0 z-0">
                  <TerminalOutput />
                </div>

                {/* Decorative scanning line */}
                {isAnalyzing && <div className="absolute inset-0 h-1 bg-[#ff4d00]/40 animate-scan z-20 blur-[1px]" />}

                <div className="relative z-10 p-5 flex-grow flex items-center">
                  <p className="text-[11px] leading-relaxed text-gray-400 font-bold uppercase tracking-tight bg-black/40 backdrop-blur-[2px] p-2 border-l-2 border-[#ff4d00]">
                    {params?.texture_description || "Awaiting hardware capture for surface analysis. point sensor at target matter to begin decomposition process."}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-[#ff4d00] uppercase font-bold tracking-widest">16-Step Grid</span>
                <span className={`text-[8px] font-bold ${isPlaying ? 'text-[#ff4d00]' : 'text-gray-600'}`}>
                  {isPlaying ? 'TRANSPORT_RUNNING' : 'TRANSPORT_HALTED'}
                </span>
              </div>
              <div className="h-10 flex gap-[2px]">
                {(params?.sequencer_pattern || Array(16).fill(0)).map((val, i) => (
                  <div
                    key={i}
                    className={`flex-grow border border-[#222] ${val === 1 ? 'bg-[#ff4d00]' : 'bg-black/90'} ${isPlaying ? 'animate-[pulse_2s_infinite]' : ''}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-[#333] bg-[#0d0d0d]">
            <button
              onClick={togglePlayback}
              disabled={!params}
              className={`w-full h-16 border-2 flex items-center justify-center gap-3 font-bold text-sm tracking-widest transition-all active:scale-[0.98] disabled:opacity-30 ${isPlaying ? 'border-[#ff4d00] text-[#ff4d00] bg-[#ff4d00]/5 hover:bg-[#ff4d00]/10' : 'border-[#444] text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
              style={{ borderRadius: '0' }}
            >
              {isPlaying ? (
                <>
                  <Square size={18} fill="currentColor" /> TERMINATE_SEQUENCE
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" /> INITIATE_SEQUENCE
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Docked App Bar */}
      <footer className="h-10 border-t border-[#333] bg-[#050505] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-[#ff4d00] animate-ping' : 'bg-green-500 opacity-50'}`} />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">surface<span className="text-[#ff4d00]">.wav</span></span>
          <div className="ml-4">
            <RecordButton />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-[8px] text-gray-600 font-bold tracking-widest">
          {['Archive', 'Samples', 'Telemetry', 'Hardware'].map(m => (
            <span key={m} className="hover:text-[#ff4d00] cursor-pointer transition-colors uppercase">{m}</span>
          ))}
        </div>
        <div className="text-[8px] text-gray-700 font-bold uppercase tracking-wider">
          Node_115_A // Flash-V1.5
        </div>
      </footer>
    </div>
  );
}
