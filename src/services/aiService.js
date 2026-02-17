/**
 * AI Service for Translation
 * Handles communication with Google Gemini API
 */

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';

// List of models to try in order of preference (Newest/Fastest -> Legacy)
const MODELS = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro'
];

export const translateWithGemini = async (text, sourceLang, targetLang, apiKey) => {
    if (!apiKey) throw new Error("API Key is required");

    const prompt = `
    You are a professional medical translator. 
    Translate the following text from ${sourceLang} to ${targetLang}.
    
    Rules:
    1. Maintain professional medical terminology.
    2. Output ONLY the translated text. No explanations, no markdown, no quotes.
    3. If the input is Chinese, return Simplified Chinese.
    4. If the input is not a complete sentence, translate it as a phrase.

    Input Text:
    "${text}"
    `;

    // Try models sequentially
    let lastError = null;

    for (const model of MODELS) {
        try {
            console.log(`Attempting translation with model: ${model}`);
            const response = await fetch(`${BASE_URL}${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                // If it's a "Not Found" or "Not Supported" error, continue to next model
                // Otherwise (e.g. Quota exceeded, Invalid Key), throw immediately
                if (response.status === 404 || response.status === 400) {
                    console.warn(`Model ${model} failed:`, errData.error?.message);
                    lastError = new Error(errData.error?.message);
                    continue;
                }
                throw new Error(errData.error?.message || 'Gemini API Error');
            }

            const data = await response.json();
            const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!translatedText) throw new Error("No translation returned");

            return translatedText.trim();

        } catch (error) {
            // Keep track of the error but continue if it's not a critical API failure 
            // (Actually for network errors we might want to stop, but let's try next model just in case)
            console.warn(`Error with ${model}:`, error);
            lastError = error;
        }
    }

    // If we get here, all models failed
    console.error("All Gemini models failed.");
    throw lastError || new Error("All AI models failed to respond.");
};
