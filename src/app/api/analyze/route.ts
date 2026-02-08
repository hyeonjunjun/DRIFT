import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { SynthParamsSchema } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        const { image } = await req.json(); // Expecting base64 string
        const base64Data = image.split(',')[1];

        const prompt = `
      Analyze the texture in this image. Convert its physical properties into audio synthesizer parameters.
      - Rough/Rusty textures = Sawtooth/Square waves, High Distortion.
      - Smooth/Soft textures = Sine/Triangle waves, Low Distortion, High Reverb.
      - Chaotic/Busy textures = Fast BPM, Complex Pattern.
      - Organized/Grid textures = Slow BPM, Steady Pattern.

      Return ONLY a JSON object strictly matching this schema:
      {
        "oscillator_type": "sine" | "square" | "sawtooth" | "triangle",
        "distortion_amount": float (0.0 to 1.0),
        "filter_cutoff": int (100 to 10000),
        "resonance": float (0 to 10),
        "bpm": int (60 to 180),
        "sequencer_pattern": [array of 16 integers, either 0 or 1],
        "texture_description": "short string description"
      }
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
