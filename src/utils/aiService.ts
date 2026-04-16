import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIAction } from './aiActions';

export const transformText = async (
  selectedText: string,
  action: AIAction
): Promise<string> => {
  // 1. Check for the API Key first
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  // 2. Prepare the prompt instructions
  let promptInstructions =
    'You are a helpful writing assistant. Return ONLY the transformed text, nothing else. No conversational filler.\n\n';

  if (action.id === 'summarize') {
    promptInstructions +=
      'Summarize the following text to be as concise as possible:\n\n';
  } else if (action.id === 'punchy') {
    promptInstructions +=
      'Rewrite the following text to be punchy, impactful, and energetic:\n\n';
  } else if (action.id === 'grammar') {
    promptInstructions +=
      'Fix any grammar, spelling, and punctuation errors in the following text. Do not change the meaning:\n\n';
  }

  const finalPrompt = promptInstructions + selectedText;

  try {
    // 3. Initialize the SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 4. Get the fast flash model
    // New code:
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 5. Generate the content
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
      generationConfig: {
        temperature: 0.7,
      },
    });

    // 6. Return the text cleanly
    return result.response.text().trim();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error; // Re-throw so the UI can catch and handle it
  }
};