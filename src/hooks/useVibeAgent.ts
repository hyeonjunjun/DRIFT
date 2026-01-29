"use client";

import { useState, useMemo } from 'react';
import { VibeSegment } from '@/types';

export function useVibeAgent(allSegments: VibeSegment[]) {
    const [query, setQuery] = useState('');
    const [isCurating, setIsCurating] = useState(false);

    const filteredSegments = useMemo(() => {
        if (!query) return allSegments;

        // Simulation of Gemini reasoning:
        // In a real app, this would be an API call to Gemini 3.
        const keywords = query.toLowerCase().split(' ');

        return allSegments.filter(s => {
            const content = (s.name + s.description + s.labels.join(' ')).toLowerCase();
            return keywords.some(k => content.includes(k));
        });
    }, [query, allSegments]);

    const curate = async (newQuery: string) => {
        setIsCurating(true);
        setQuery(newQuery);
        // Simulate "Intentional" latency for the concierge feel
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsCurating(false);
    };

    return {
        query,
        curate,
        isCurating,
        segments: filteredSegments
    };
}
