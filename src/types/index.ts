export interface VibeSegment {
    id: string;
    name: string;
    coordinates: [number, number][];
    scores: {
        greenery: number;
        architecture: number;
        light: number;
        scale: number;
    };
    labels: string[];
    description: string;
}
