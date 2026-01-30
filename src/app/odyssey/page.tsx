"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Map as MapIcon, ChevronRight, Wind, Mountain, Sunset, Info } from 'lucide-react';
import Link from 'next/link';

interface Theme {
    id: string;
    title: string;
    tagline: string;
    description: string;
    color: string;
    image: string;
    metrics: {
        scenery: number;
        solitude: number;
        culture: number;
    };
}

const THEMES: Theme[] = [
    {
        id: "peaks",
        title: "Twin Peaks Vibe",
        tagline: "The Fog of the Northwest",
        description: "Navigate through misty pine forests, roadside diners that serve 'damn fine coffee', and the eerie silence of the Douglas firs.",
        color: "bg-[#2D3E2E]",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
        metrics: { scenery: 9, solitude: 10, culture: 7 }
    },
    {
        id: "desert",
        title: "Desert Brutalism",
        tagline: "Sharp Edges, Golden Sands",
        description: "A trip defined by harsh shadows, modernist structures rising from the dust, and the infinite horizon of the Mojave.",
        color: "bg-[#D4A373]",
        image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=800",
        metrics: { scenery: 10, solitude: 8, culture: 6 }
    },
    {
        id: "neon",
        title: "Neon Noir",
        tagline: "Liquid Light & Industry",
        description: "Follow the violet glow of rain-slicked city boundaries, where the industrial past meets a digital future.",
        color: "bg-[#1A1B26]",
        image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800",
        metrics: { scenery: 6, solitude: 4, culture: 9 }
    }
];

export default function OdysseyPage() {
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

    return (
        <main className="min-h-screen bg-background flex flex-col relative overflow-x-hidden transition-colors duration-700">
            {/* Dynamic Background Tint */}
            <div
                className={`fixed inset-0 opacity-5 pointer-events-none transition-colors duration-1000 ${selectedTheme?.color || 'bg-background'}`}
            />

            <nav className="p-8 pb-0 z-20">
                <Link href="/" className="text-accent hover:underline font-sans text-xs tracking-widest uppercase flex items-center gap-2">
                    ← Back to the Stroll
                </Link>
            </nav>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Section: Selection & Grid */}
                <section className="flex-1 p-8 md:p-16 flex flex-col gap-12 z-10">
                    <header className="flex flex-col gap-4">
                        <h1 className="text-7xl font-serif text-foreground leading-tight">The Odyssey</h1>
                        <p className="text-xl text-muted-foreground font-sans max-w-xl leading-relaxed">
                            Macro navigation for the long road. We curate the path through the soul of the landscape based on your current frequency.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {THEMES.map((theme) => (
                            <motion.div
                                key={theme.id}
                                layoutId={theme.id}
                                onClick={() => setSelectedTheme(theme)}
                                className={`group relative overflow-hidden rounded-3xl border ${selectedTheme?.id === theme.id ? 'border-accent shadow-2xl' : 'border-border'} bg-card cursor-pointer transition-all hover:border-accent/50`}
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${theme.image})` }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-6">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-sans mb-1 block">{theme.tagline}</span>
                                        <h3 className="text-2xl font-serif text-white">{theme.title}</h3>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {!selectedTheme && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-12 p-8 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center gap-4 bg-muted/20"
                        >
                            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                            <div>
                                <h4 className="font-serif text-lg">Select a Frequency</h4>
                                <p className="text-sm text-muted-foreground font-sans">Each odyssey is pre-scored for maximum emotional resonance.</p>
                            </div>
                        </motion.div>
                    )}
                </section>

                {/* Right Section: Thematic Detail (Curator) */}
                <AnimatePresence mode="wait">
                    {selectedTheme && (
                        <motion.section
                            key={selectedTheme.id}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="w-full md:w-[450px] border-l border-border bg-background p-8 md:p-12 z-20 flex flex-col gap-10 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]"
                        >
                            <div className="flex justify-between items-center">
                                <button onClick={() => setSelectedTheme(null)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                                    Close Detail
                                </button>
                                <Info className="w-4 h-4 text-muted-foreground" />
                            </div>

                            <div>
                                <h2 className="text-4xl font-serif mb-4">{selectedTheme.title}</h2>
                                <p className="text-muted-foreground font-sans leading-relaxed text-sm italic">
                                    "{selectedTheme.description}"
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Vibe Composition</h4>
                                {[
                                    { label: "Scenery", val: selectedTheme.metrics.scenery, icon: <Mountain className="w-3 h-3" /> },
                                    { label: "Solitude", val: selectedTheme.metrics.solitude, icon: <Wind className="w-3 h-3" /> },
                                    { label: "Culture", val: selectedTheme.metrics.culture, icon: <Sunset className="w-3 h-3" /> }
                                ].map(m => (
                                    <div key={m.label} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="flex items-center gap-2 font-sans">{m.icon} {m.label}</span>
                                            <span className="font-mono text-[10px]">{m.val}/10</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${m.val * 10}%` }}
                                                className="h-full bg-accent"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-5 bg-foreground text-background rounded-2xl font-serif text-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 active:bg-[#333]"
                                >
                                    Map this Odyssey <ChevronRight className="w-5 h-5" />
                                </motion.button>
                                <motion.p
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="text-[10px] text-center text-muted-foreground uppercase tracking-widest"
                                >
                                    AI Curated for golden hour arrivals
                                </motion.p>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            <footer className="p-8 md:p-16 pt-0 mt-8 border-t border-border flex items-center justify-between text-muted-foreground z-10">
                <div className="flex gap-4">
                    <Compass className="w-5 h-5" />
                    <Sparkles className="w-5 h-5" />
                    <MapIcon className="w-5 h-5" />
                </div>
                <p className="text-[10px] tracking-widest uppercase">DRIFT ENGINE v1.0.4-macro</p>
            </footer>
        </main>
    );
}
