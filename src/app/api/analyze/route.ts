import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { SynthParamsSchema } from '@/lib/schemas';

export const maxDuration = 60; // Increase timeout for Gemini analysis

export async function POST(req: Request) {
    try {
        const { image } = await req.json(); // Expecting base64 string
        const base64Data = image.split(',')[1];

        const model = getGeminiModel();
        const prompt = `
            ACTIVATE: Texture Decomposition Protocol
            ANALYSIS: Physical matter -> Synth Engine params.
            - Rough/Jagged: Sawtooth/Square, High Distortion.
            - Smooth/Organic: Sine/Triangle, Null Distortion, High Reverb.
            - High Entropy: High BPM, Aggressive Sequence.
            - Low Entropy: Low BPM, Stable Sequence.

            REQUIRED_JSON_FORMAT:
            {
              "oscillator_type": "sine"|"square"|"sawtooth"|"triangle",
              "distortion_amount": 0.0-1.0,
              "filter_cutoff": 100-10000,
              "resonance": 0-10,
              "bpm": 60-180,
              "sequencer_pattern": [16 binary integers],
              "texture_description": "string"
            }
            RESPONSE: JSON_ONLY
        `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const responseText = result.response.text();
        // Clean code blocks if Gemini wraps in markdown
        const jsonString = responseText.replace(/```json|```/g, '').trim();

        const parsedData = JSON.parse(jsonString);

        // Validate with Zod
        const validatedData = SynthParamsSchema.parse(parsedData);

        return NextResponse.json(validatedData);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to analyze texture" }, { status: 500 });
    }
}
