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
    // Chinese (Simplified)
    'fever': 'fā shāo', // Pinyin or characters? Let's use characters for display
    'cough': 'ké sou',
    'cold': 'gǎn mào',
    // Let's just map English keys to Chinese values for simplicity in mock
    // In real app, we'd use Google Translate API

    // Common Phrases
    'selamat pagi': 'good morning',
    'terima kasih': 'thank you',
    'bagaimana kabarnya': 'how are you',

    // Reverse mappings (handled by simple lookup in mock)
};

// Simple direct mapping for demo purposes
const ZH_DICTIONARY = {
    'fever': '发烧 (fā shāo)',
    'cough': '咳嗽 (ké sou)',
    'cold': '感冒 (gǎn mào)',
    'headache': '头痛 (tóu tòng)',
    'high_blood_pressure': '高血压 (gāo xuè yā)', // slight key normalization needed?
    'blood_sugar': '血糖 (xuè táng)',
    'patient': '病人 (bìng rén)',
    'doctor': '医生 (yī shēng)',
    'hospital': '医院 (yī yuàn)',
    'good_morning': '早上好 (zǎo shang hǎo)',
    'thank_you': '谢谢 (xiè xie)'
};

/**
 * Mocks an AI translation by replacing known words from the dictionary.
 * In a real app, this would call an API like OpenAI or Google Translate.
 */
export const mockTranslate = async (text, targetLang) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const words = text.toLowerCase().split(' ');
            const translatedWords = words.map(word => {
                // Strip punctuation
                const cleanWord = word.replace(/[:.,?!]/g, '');
                const punctuation = word.slice(cleanWord.length);

                // Simple lookup
                const translation = MOCK_DICTIONARY[cleanWord] || cleanWord;
                return translation + punctuation;
            });
            resolve(translatedWords.join(' '));
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
