"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, Compass, Coffee, Info } from 'lucide-react';
import Link from 'next/link';
import VibeMap from '@/components/map/VibeMap';
import { useVibeAgent } from '@/hooks/useVibeAgent';
import { VibeSegment } from '@/types';
import westVillageData from '@/lib/vibe-graph/west-village.json';

export default function Home() {
  const { segments, query, curate, isCurating, conciergeNote, activeLabels } = useVibeAgent(westVillageData as VibeSegment[]);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    curate(searchInput);
  };

  return (
    <main className="relative flex h-screen w-full flex-col md:flex-row overflow-hidden">
      {/* Left Sidebar: Context & Search */}
      <section className="z-10 w-full md:w-[450px] bg-background border-r border-border p-8 flex flex-col gap-12 overflow-y-auto">
        <header>
          <h1 className="text-4xl font-serif text-foreground mb-2">DRIFT</h1>
          <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">Fractal Navigation Engine</p>
        </header>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="I want a quiet, historic walk..."
            className="w-full bg-muted border border-border rounded-xl px-12 py-4 font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-foreground text-background rounded-lg px-3 py-1 text-xs font-sans hover:opacity-90 transition-opacity"
          >
            Curate
          </button>
        </form>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-serif text-xl">Current Curation</h2>
            <span className="text-xs font-sans text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {segments.length} segments found
            </span>
          </div>

          <AnimatePresence>
            {conciergeNote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-accent/5 p-4 rounded-xl border border-accent/20"
              >
                <p className="text-sm font-serif italic text-foreground leading-relaxed">
                  "{conciergeNote}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4">
            {segments.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-4 rounded-xl border border-transparent hover:border-accent/20 hover:bg-muted/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <h3 className="font-serif text-lg">{s.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm font-sans leading-relaxed mb-3">
                  {s.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.labels.map(L => (
                    <span key={L} className="text-[10px] font-sans uppercase tracking-wider text-accent border border-accent/30 px-2 py-0.5 rounded-full">
                      {L}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className="mt-auto pt-8 border-t border-border flex flex-col gap-6">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex gap-4">
              <Link href="/odyssey" title="The Odyssey">
                <Compass className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              </Link>
              <Link href="/joyride" title="The Joyride">
                <MapIcon className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              </Link>
              <Coffee className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
            </div>
            <p className="text-[10px] tracking-widest uppercase">West Village Prototype v1.0</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/odyssey" className="flex flex-col gap-1 p-3 rounded-xl bg-muted/50 border border-transparent hover:border-accent/20 transition-all">
              <span className="text-[8px] uppercase tracking-widest text-muted-foreground">Switch to Macro</span>
              <span className="text-xs font-serif">The Odyssey</span>
            </Link>
            <Link href="/joyride" className="flex flex-col gap-1 p-3 rounded-xl bg-muted/50 border border-transparent hover:border-accent/20 transition-all">
              <span className="text-[8px] uppercase tracking-widest text-muted-foreground">Switch to Meso</span>
              <span className="text-xs font-serif">The Joyride</span>
            </Link>
          </div>
        </footer>
      </section>

      {/* Main Area: Map */}
      <section className="flex-1 relative bg-muted">
        <VibeMap
          segments={segments}
          mapboxToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}
        />

        {/* Curation Overlay */}
        <AnimatePresence>
          {isCurating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-12 text-center"
            >
              <div className="max-w-md">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <h2 className="text-3xl font-serif mb-4 italic">Curating...</h2>
                </motion.div>
                <p className="text-muted-foreground font-sans animate-pulse">
                  {activeLabels.length > 0
                    ? `Aligning with ${activeLabels.join(', ')}...`
                    : "Finding a path with better light and historic soul."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Legend/Overlay */}
        <div className="absolute top-6 right-6 z-10 hidden md:block">
          <div className="bg-background/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl max-w-[200px]">
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Info className="w-3 h-3" /> Vibe Intensity
            </h4>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full w-2/3 bg-accent rounded-full" />
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Higher intensity indicates a more "intentional" pedestrian experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
