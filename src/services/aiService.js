/**
 * AI Service for Translation
 * Handles communication with Google Gemini API
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
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
            throw new Error(errData.error?.message || 'Gemini API Error');
        }

        const data = await response.json();
        const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!translatedText) throw new Error("No translation returned");

        return translatedText.trim();

    } catch (error) {
        console.error("Gemini Translation Failed:", error);
        throw error;
    }
};
