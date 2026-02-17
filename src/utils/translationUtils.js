export const LANGUAGES = {
    ID: { code: 'id-ID', name: 'Indonesia', flag: '🇮🇩' },
    EN: { code: 'en-US', name: 'English', flag: '🇺🇸' },
    ZH: { code: 'zh-CN', name: 'Mandarin', flag: '🇨🇳' }
};

// Mock Translation Database
const MOCK_DICTIONARY = {
    // Medical Terms
    'demam': 'fever',
    'batuk': 'cough',
    'pilek': 'cold',
    'sakit kepala': 'headache',
    'darah tinggi': 'high blood pressure',
    'gula darah': 'blood sugar',
    'resep': 'prescription',
    'obat': 'medicine',
    'istirahat': 'rest',
    'pasien': 'patient',
    'dokter': 'doctor',
    'rumah sakit': 'hospital',
    'saya': 'i',
    'halo': 'hello',
    'nama': 'name',
    'kamu': 'you',
    'adalah': 'is',
    'dari': 'from',

    // Chinese (Simplified)
    'fever': 'fā shāo',
    'cough': 'ké sou',
    'cold': 'gǎn mào',
};

// Phrase Dictionary for better context
const PHRASE_DICTIONARY = {
    'nama saya': 'my name is',
    'apa kabar': 'how are you',
    'selamat pagi': 'good morning',
    'selamat siang': 'good afternoon',
    'terima kasih': 'thank you',
    'sakit apa': 'what is wrong',
    'sudah berapa lama': 'how long has it been',

    // Reverse
    'my name is': 'nama saya',
    'how are you': 'apa kabar',
    'good morning': 'selamat pagi',
};

// Simple direct mapping for demo purposes (ZH)
const ZH_DICTIONARY = {
    'fever': '发烧 (fā shāo)',
    'cough': '咳嗽 (ké sou)',
    'cold': '感冒 (gǎn mào)',
    'headache': '头痛 (tóu tòng)',
    'high blood pressure': '高血压 (gāo xuè yā)',
    'blood sugar': '血糖 (xuè táng)',
    'patient': '病人 (bìng rén)',
    'doctor': '医生 (yī shēng)',
    'hospital': '医院 (yī yuàn)',
    'good morning': '早上好 (zǎo shang hǎo)',
    'thank you': '谢谢 (xiè xie)',
    'hello': '你好 (nǐ hǎo)',
    'my name is': '我的名字是 (wǒ de míng zì shì)',
    'how are you': '你好吗 (nǐ hǎo ma)',
};

/**
 * Mocks an AI translation by replacing known words from the dictionary.
 * In a real app, this would call an API like OpenAI or Google Translate.
 */
export const mockTranslate = async (text, targetLang) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let processedText = text.toLowerCase();

            // 1. Handle Phrases First (Simple replacement)
            // Sort phrases by length (longest first) to avoid partial replacements
            const phrases = Object.keys(PHRASE_DICTIONARY).sort((a, b) => b.length - a.length);

            // Temporary placeholder to avoid re-translating parts of phrases
            const placeholders = {};
            let placeholderCount = 0;

            phrases.forEach(phrase => {
                if (processedText.includes(phrase)) {
                    // Check if target is ZH, we need to map via EN first usually or have direct ZH phrases
                    // For simplicity, we map to EN first, then to ZH if needed
                    const translation = PHRASE_DICTIONARY[phrase];
                    const key = `__PH_${placeholderCount}__`;
                    placeholders[key] = translation;
                    processedText = processedText.replace(new RegExp(phrase, 'g'), key);
                    placeholderCount++;
                }
            });

            // 2. Handle Individual Words
            const words = processedText.split(' ');
            const translatedWords = words.map(w => {
                if (w.startsWith('__PH_')) return w; // Skip placeholders

                const clean = w.replace(/[:.,?!]/g, '');
                const punctuation = w.slice(clean.length);
                const translation = MOCK_DICTIONARY[clean] || clean;
                return translation + punctuation;
            });

            let finalResult = translatedWords.join(' ');

            // 3. Restore Placeholders
            Object.keys(placeholders).forEach(key => {
                finalResult = finalResult.replace(key, placeholders[key]);
            });

            // 4. Handle Target Language (if Chinese)
            if (targetLang === 'zh-CN') {
                // Now finalResult is mostly English (from phrases and word-mapping)
                // We try to map this English text to Chinese
                // This is a double-mock (ID -> EN -> ZH) for simplicity
                const enWords = finalResult.split(' ');
                const zhWords = enWords.map(w => {
                    // Check full phrase match in ZH dict first?
                    // Ideally we should process phrases again for ZH but let's do simple word/phrase lookup
                    const clean = w.replace(/[:.,?!]/g, '');
                    let zh = ZH_DICTIONARY[clean];

                    // Try looking up the whole phrase "my name is" if it was preserved?
                    // Since we split by space, "my name is" became "my" "name" "is".
                    // This simple logic fails for multi-word ZH mappings unless we did it earlier.

                    // BETTER APPROACH FOR ZH:
                    // Check if the whole English sentence (or parts) matches ZH_DICTIONARY keys
                });

                // Let's redo ZH logic: 
                // We have `finalResult` which is English.
                // We check ZH_DICTIONARY for matches in `finalResult`

                let zhResult = finalResult;
                const zhPhrases = Object.keys(ZH_DICTIONARY).sort((a, b) => b.length - a.length);

                zhPhrases.forEach(enPhrase => {
                    if (zhResult.includes(enPhrase)) {
                        zhResult = zhResult.replace(new RegExp(enPhrase, 'g'), ZH_DICTIONARY[enPhrase]);
                    }
                });

                // Capitalize first letter isn't needed for Chinese but good for consistency
                resolve(zhResult);
                return;
            }

            // Capitalize first letter
            if (finalResult.length > 0) {
                finalResult = finalResult.charAt(0).toUpperCase() + finalResult.slice(1);
            }

            resolve(finalResult);
        }, 1000); // Simulate network latency
    });
};

/**
 * Uses the Web Speech API to speak text.
 */
export const speakText = (text, langCode) => {
    if (!window.speechSynthesis) {
        console.error('Browser does not support TTS');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
};
