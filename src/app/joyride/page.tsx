"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Wind, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function JoyridePage() {
    const routes = [
        { title: "Canyon Curves", duration: "45 mins", curvature: "High", light: "Golden Hour" },
        { title: "Coastal Drift", duration: "1.2 hours", curvature: "Flowing", light: "Bright" },
        { title: "The Quiet Way", duration: "30 mins", curvature: "Low", light: "Muted" }
    ];

    return (
        <main className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
            {/* Visual Narrative Side */}
            <section className="flex-1 relative bg-[#1A1A1A] p-12 md:p-24 flex flex-col justify-end text-white overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="relative z-10 flex flex-col gap-6 max-w-xl">
                    <Link href="/" className="text-accent hover:underline font-sans text-xs tracking-widest uppercase mb-4">
                        ← Return to Micro
                    </Link>
                    <h1 className="text-7xl font-serif leading-tight">The Joyride</h1>
                    <p className="text-lg opacity-80 font-sans leading-relaxed">
                        Driving by design. We optimize for the radius of the turn and the quality of the light, not the speed of the arrival.
                    </p>
                    <div className="flex gap-6 mt-8">
                        <div className="flex items-center gap-2 opacity-60">
                            <Navigation className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded border border-white/20">Meso Scale</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                            <Wind className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded border border-white/20">Road Curvature</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Route Selection Side */}
            <section className="w-full md:w-[500px] border-l border-border bg-background p-12 flex flex-col gap-12 overflow-y-auto">
                <header>
                    <h2 className="text-3xl font-serif mb-2">Select Your Path</h2>
                    <p className="text-muted-foreground font-sans text-sm">Curated driving segments with "High Vibe" data.</p>
                </header>

                <div className="flex flex-col gap-6">
                    {routes.map((route, i) => (
                        <motion.div
                            key={route.title}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl border border-border hover:border-accent hover:bg-muted/50 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-serif">{route.title}</h3>
                                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {route.duration}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Curvature</span>
                                    <span className="text-sm font-sans">{route.curvature}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Best Light</span>
                                    <span className="text-sm font-sans">{route.light}</span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-foreground text-background rounded-xl font-sans text-sm flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                                Begin Navigation <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-auto p-6 bg-muted rounded-2xl border border-border">
                    <h4 className="flex items-center gap-2 font-serif mb-2 text-sm italic">
                        <Eye className="w-4 h-4" /> Concierge Note
                    </h4>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                        These routes are pre-calculated for the Silver Lake demo area. Real-time visual scoring is pending sensor integration.
                    </p>
                </div>
            </section>
        </main>
    );
}
