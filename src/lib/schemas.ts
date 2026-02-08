import { z } from 'zod';

export const SynthParamsSchema = z.object({
    oscillator_type: z.enum(['sine', 'square', 'sawtooth', 'triangle']),
    distortion_amount: z.number().min(0).max(1), // 0 = Clean, 1 = Industrial Noise
    filter_cutoff: z.number().min(100).max(10000), // Hz
    bpm: z.number().min(60).max(180),
    resonance: z.number().min(0).max(10),
    // A 16-step pattern: 1 = hit, 0 = rest
    sequencer_pattern: z.array(z.number().min(0).max(1)).length(16),
    texture_description: z.string(), // Just for UI feedback
});

export type SynthParams = z.infer<typeof SynthParamsSchema>;
