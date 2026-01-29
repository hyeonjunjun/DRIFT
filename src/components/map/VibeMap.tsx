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
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-sm border border-border">
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={mapboxToken}
            >
                <Source id="vibe-paths" type="geojson" data={geojson as any}>
                    <Layer
                        id="vibe-lines"
                        type="line"
                        paint={{
                            'line-width': 6,
                            'line-color': '#D4A373',
                            'line-opacity': ['get', 'intensity'],
                            'line-blur': 4
                        }}
                    />
                    <Layer
                        id="vibe-lines-glow"
                        type="line"
                        paint={{
                            'line-width': 12,
                            'line-color': '#D4A373',
                            'line-opacity': ['*', ['get', 'intensity'], 0.2],
                            'line-blur': 10
                        }}
                    />
                </Source>
                <NavigationControl position="bottom-right" />
            </Map>
        </div>
    );
}
