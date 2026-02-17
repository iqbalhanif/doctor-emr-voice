/**
 * AI Service for Translation
 * Uses Google Translate (Unofficial Free API)
 */

const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';

// Language code mapping (Google Translate uses ISO 639-1 codes)
const LANG_MAP = {
    'Indonesia': 'id',
    'English': 'en',
    'Mandarin': 'zh-CN'
};

export const translateWithGoogle = async (text, sourceLang, targetLang) => {
    if (!text || !text.trim()) throw new Error("Text is required");

    const sourceLangCode = LANG_MAP[sourceLang] || 'id';
    const targetLangCode = LANG_MAP[targetLang] || 'en';

    try {
        const params = new URLSearchParams({
            client: 'gtx',
            sl: sourceLangCode,
            tl: targetLangCode,
            dt: 't',
            q: text
        });

        const response = await fetch(`${GOOGLE_TRANSLATE_API}?${params}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Google Translate Error: ${response.status}`);
        }

        const data = await response.json();

        // Google Translate returns nested arrays: [[["translated text", "original text"]]]
        if (!data || !data[0] || !data[0][0] || !data[0][0][0]) {
            throw new Error("No translation returned");
        }

        // Combine all translation segments
        const translatedText = data[0].map(item => item[0]).join('');

        return translatedText.trim();

    } catch (error) {
        console.error("Google Translate Failed:", error);
        throw error;
    }
};
