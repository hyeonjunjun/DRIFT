import axios from 'axios';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export interface MapboxRoute {
    geometry: string;
    duration: number;
    distance: number;
}

export const getDirections = async (
    coordinates: [number, number][],
    profile: 'walking' | 'driving' | 'cycling' = 'walking'
): Promise<MapboxRoute | null> => {
    const coordsString = coordinates.map(c => c.join(',')).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordsString}?alternatives=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
        const response = await axios.get(url);
        if (response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                geometry: route.geometry,
                duration: route.duration,
                distance: route.distance,
            };
        }
        return null;
    } catch (error) {
        console.error("Mapbox Directions Error:", error);
        return null;
    }
};
