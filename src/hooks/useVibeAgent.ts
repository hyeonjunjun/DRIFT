"use client";

import { useState, useMemo } from 'react';
import { VibeSegment } from '@/types';

export function useVibeAgent(allSegments: VibeSegment[]) {
    const [query, setQuery] = useState('');
    const [isCurating, setIsCurating] = useState(false);
    const [conciergeNote, setConciergeNote] = useState<string | null>(null);
    const [activeLabels, setActiveLabels] = useState<string[]>([]);

    const filteredSegments = useMemo(() => {
        if (!query) return allSegments;
        // For now, still using simple keyword matching, but in a real app, 
        // we would use the weights from Gemini to sort/filter the graph more intelligently.
        const keywords = query.toLowerCase().split(' ');
        return allSegments.filter(s => {
            const content = (s.name + s.description + s.labels.join(' ')).toLowerCase();
            return keywords.some(k => content.includes(k));
        });
    }, [query, allSegments]);

    const curate = async (newQuery: string) => {
        setIsCurating(true);
        setQuery(newQuery);

        try {
            const response = await fetch('/api/vibe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intent: newQuery }),
            });

            if (response.ok) {
                const data = await response.json();
                setConciergeNote(data.concierge_note);
                setActiveLabels(data.labels);
            }
        } catch (error) {
            console.error("Vibe Curation Error:", error);
        } finally {
            // Keep the intentional delay for the "Concierge" feel
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsCurating(false);
        }
    };

    return {
        query,
        curate,
        isCurating,
        segments: filteredSegments,
        conciergeNote,
        activeLabels
    };
}
