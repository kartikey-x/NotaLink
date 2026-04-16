import type { AIAction } from './aiActions';
export const transformText = async (
  selectedText: string,
  action: AIAction
): Promise<string> => {
  
  // Prepare the prompt instructions
  let promptInstructions = "You are a helpful writing assistant. Return ONLY the transformed text, nothing else. No conversational filler.\n\n";
  
  if (action.id === 'summarize') {
    promptInstructions += "Summarize the following text to be as concise as possible:\n\n";
  } else if (action.id === 'punchy') {
    promptInstructions += "Rewrite the following text to be punchy, impactful, and energetic:\n\n";
  } else if (action.id === 'grammar') {
    promptInstructions += "Fix any grammar, spelling, and punctuation errors in the following text. Do not change the meaning:\n\n";
  }

  const finalPrompt = promptInstructions + selectedText;

  try {
    // ⚠️ Replace this with your actual Gemini API Key (it should start with "AIza...")
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    // The correct Gemini API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Gemini requires this specific JSON structure
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: finalPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text from Gemini's response structure
    return data.candidates[0].content.parts[0].text.trim();

  } catch (error) {
    console.error("AI Service Error:", error);
    return selectedText; // Fallback to original text if the API fails
  }
};