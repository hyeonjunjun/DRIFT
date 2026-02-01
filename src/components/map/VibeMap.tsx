"use client";

import React, { useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import { VibeSegment } from '@/types';

interface VibeMapProps {
    segments: VibeSegment[];
    mapboxToken: string;
}

export default function VibeMap({ segments, mapboxToken }: VibeMapProps) {
    const [viewState, setViewState] = useState({
        longitude: -74.0039,
        latitude: 40.7351,
        zoom: 16
    });
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');

    const toggleStyle = () => {
        setMapStyle(prev =>
            prev.includes('light')
                ? 'mapbox://styles/mapbox/satellite-streets-v12'
                : 'mapbox://styles/mapbox/light-v11'
        );
    };

    const geojson = {
        type: 'FeatureCollection',
        features: segments.map(s => ({
            type: 'Feature',
            properties: {
                id: s.id,
                name: s.name,
                intensity: (s.scores.greenery + s.scores.architecture + s.scores.light + s.scores.scale) / 40,
                ...s.scores
            },
            geometry: {
                type: 'LineString',
                coordinates: s.coordinates
            }
        }))
    };

    return (
        <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-sm border border-border/50 bg-muted/20">
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle={mapStyle}
                mapboxAccessToken={mapboxToken}
            >
                <Source id="vibe-paths" type="geojson" data={geojson as any}>
                    {/* Glowing effect base */}
                    <Layer
                        id="vibe-lines-glow"
                        type="line"
                        layout={{
                            'line-join': 'round',
                            'line-cap': 'round'
                        }}
                        paint={{
                            'line-width': 12,
                            'line-color': '#D4A373',
                            'line-opacity': 0.2,
                            'line-blur': 12
                        }}
                    />
                    {/* Core line */}
                    <Layer
                        id="vibe-lines"
                        type="line"
                        layout={{
                            'line-join': 'round',
                            'line-cap': 'round'
                        }}
                        paint={{
                            'line-width': 4,
                            'line-color': '#D4A373',
                            'line-opacity': ['get', 'intensity']
                        }}
                    />
                </Source>
                <NavigationControl position="bottom-right" showCompass={false} />
            </Map>

            <button
                onClick={toggleStyle}
                className="absolute bottom-4 left-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-md border border-border/50 rounded-full shadow-sm text-xs font-medium uppercase tracking-widest hover:bg-white transition-colors text-foreground/80 hover:text-foreground"
            >
                {mapStyle.includes('light') ? 'Satellite' : 'Map'}
            </button>
        </div>
    );
}
