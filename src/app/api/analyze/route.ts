import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { SynthParamsSchema } from '@/lib/schemas';

export const maxDuration = 60; // Increase timeout for Gemini analysis

export async function POST(req: Request) {
    console.log('[API] ========== NEW ANALYSIS REQUEST ==========');
    const startTime = Date.now();

    try {
        const { image } = await req.json();
        console.log('[API] Image received, size:', image.length, 'bytes');

        const base64Data = image.split(',')[1];
        console.log('[API] Base64 data extracted, size:', base64Data.length, 'bytes');

        console.log('[API] Initializing Gemini model...');
        const model = getGeminiModel();
        console.log('[API] Model initialized successfully');

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

        console.log('[API] Sending request to Gemini API...');
        const geminiStartTime = Date.now();

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const geminiDuration = Date.now() - geminiStartTime;
        console.log(`[API] Gemini API responded in ${geminiDuration}ms`);

        const responseText = result.response.text();
        console.log('[API] Raw response:', responseText.substring(0, 200) + '...');

        // Clean code blocks if Gemini wraps in markdown
        const jsonString = responseText.replace(/```json|```/g, '').trim();

        const parsedData = JSON.parse(jsonString);
        console.log('[API] JSON parsed successfully');

        // Validate with Zod
        const validatedData = SynthParamsSchema.parse(parsedData);
        console.log('[API] Data validated successfully');

        const totalDuration = Date.now() - startTime;
        console.log(`[API] ========== REQUEST COMPLETE (${totalDuration}ms) ==========`);

        return NextResponse.json(validatedData);
    } catch (error) {
        const totalDuration = Date.now() - startTime;
        console.error(`[API] ========== ERROR (${totalDuration}ms) ==========`);
        console.error("[API] Gemini API Error:", error);
        return NextResponse.json({
            error: "Failed to analyze texture",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
