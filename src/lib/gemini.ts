import { GoogleGenerativeAI } from '@google/generative-ai';

export function getGeminiModel() {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        // If we're in a browser or build environment without the key, 
        // we return a null model or handle it gracefully. 
        // At build time, we just need to not throw.
        if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
            console.warn('Warning: GOOGLE_API_KEY is missing during build.');
        }
        // We'll throw only if someone actually tries to use it in a real request
        throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}
