'use server';

import { suggestControlsBasedOnAssetProfile, type SuggestControlsBasedOnAssetProfileInput } from '@/ai/flows/suggest-controls-based-on-asset-profile';
import { z } from 'zod';

const SuggestionSchema = z.object({
  assetType: z.string().min(1, 'Asset type is required'),
  riskProfile: z.string().min(1, 'Risk profile is required'),
});

type State = {
  suggestions?: string[];
  message?: string | null;
  errors?: {
    assetType?: string[];
    riskProfile?: string[];
  }
}

export async function getSuggestions(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = SuggestionSchema.safeParse({
    assetType: formData.get('assetType'),
    riskProfile: formData.get('riskProfile'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
    };
  }

  try {
    const result = await suggestControlsBasedOnAssetProfile(validatedFields.data as SuggestControlsBasedOnAssetProfileInput);
    return { suggestions: result.suggestedControls, message: null };
  } catch (error) {
    return { message: 'An error occurred while fetching suggestions.' };
  }
}
