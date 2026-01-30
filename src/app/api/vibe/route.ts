import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel, VIBE_SYSTEM_PROMPT } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
    try {
        const { intent } = await req.json();

        if (!intent) {
            return NextResponse.json({ error: "Intent is required" }, { status: 400 });
        }

        const model = getGeminiModel();
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: VIBE_SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to curate the vibes for DRIFT." }],
                },
            ],
        });

        const result = await chat.sendMessage(`User Intent: "${intent}"`);
        const responseText = result.response.text();

        // Clean up the response if it contains markdown code blocks
        const cleanedJson = responseText.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanedJson);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to process vibe reasoning", details: error.message }, { status: 500 });
    }
}
