'use server';
/**
 * @fileOverview An AI agent that suggests relevant IT controls based on the asset type and risk profile.
 *
 * - suggestControlsBasedOnAssetProfile - A function that suggests relevant IT controls based on the asset type and risk profile.
 * - SuggestControlsBasedOnAssetProfileInput - The input type for the suggestControlsBasedOnAssetProfile function.
 * - SuggestControlsBasedOnAssetProfileOutput - The return type for the suggestControlsBasedOnAssetProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestControlsBasedOnAssetProfileInputSchema = z.object({
  assetType: z.string().describe('The type of the asset (e.g., server, application, database, endpoint).'),
  riskProfile: z.string().describe('The risk profile of the asset (e.g., critical, high, medium, low).'),
});
export type SuggestControlsBasedOnAssetProfileInput = z.infer<typeof SuggestControlsBasedOnAssetProfileInputSchema>;

const SuggestControlsBasedOnAssetProfileOutputSchema = z.object({
  suggestedControls: z.array(z.string()).describe('An array of suggested IT controls based on the asset type and risk profile.'),
});
export type SuggestControlsBasedOnAssetProfileOutput = z.infer<typeof SuggestControlsBasedOnAssetProfileOutputSchema>;

export async function suggestControlsBasedOnAssetProfile(input: SuggestControlsBasedOnAssetProfileInput): Promise<SuggestControlsBasedOnAssetProfileOutput> {
  return suggestControlsBasedOnAssetProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestControlsBasedOnAssetProfilePrompt',
  input: {schema: SuggestControlsBasedOnAssetProfileInputSchema},
  output: {schema: SuggestControlsBasedOnAssetProfileOutputSchema},
  prompt: `You are an expert IT security advisor. Based on the asset type and risk profile provided, suggest relevant IT controls.

Asset Type: {{{assetType}}}
Risk Profile: {{{riskProfile}}}

Suggested Controls:`,
});

const suggestControlsBasedOnAssetProfileFlow = ai.defineFlow(
  {
    name: 'suggestControlsBasedOnAssetProfileFlow',
    inputSchema: SuggestControlsBasedOnAssetProfileInputSchema,
    outputSchema: SuggestControlsBasedOnAssetProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
