/**
 * AI Service for Translation
 * Uses MyMemory Translation API (Free, No API Key Required)
 * API Docs: https://mymemory.translated.net/doc/spec.php
 */

const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

// Language code mapping (MyMemory uses ISO 639-1 codes)
const LANG_MAP = {
    'Indonesia': 'id',
    'English': 'en',
    'Mandarin': 'zh-CN'
};

export const translateWithMyMemory = async (text, sourceLang, targetLang) => {
    if (!text || !text.trim()) throw new Error("Text is required");

    const sourceLangCode = LANG_MAP[sourceLang] || 'id';
    const targetLangCode = LANG_MAP[targetLang] || 'en';

    try {
        const params = new URLSearchParams({
            q: text,
            langpair: `${sourceLangCode}|${targetLangCode}`
        });

        const response = await fetch(`${MYMEMORY_API_URL}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`MyMemory API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails || 'Translation failed');
        }

        const translatedText = data.responseData?.translatedText;

        if (!translatedText) throw new Error("No translation returned");

        return translatedText.trim();

    } catch (error) {
        console.error("MyMemory Translation Failed:", error);
        throw error;
    }
};
