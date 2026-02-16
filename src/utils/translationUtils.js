export const LANGUAGES = {
    ID: { code: 'id-ID', name: 'Indonesia', flag: '🇮🇩' },
    EN: { code: 'en-US', name: 'English', flag: '🇺🇸' }
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
    // Common Phrases
    'selamat pagi': 'good morning',
    'terima kasih': 'thank you',
    'bagaimana kabarnya': 'how are you',
    // Reverse
    'fever': 'demam',
    'cough': 'batuk',
    'cold': 'pilek',
    'headache': 'sakit kepala',
    'high blood pressure': 'darah tinggi',
    'blood sugar': 'gula darah',
    'prescription': 'resep',
    'medicine': 'obat',
    'rest': 'istirahat',
    'patient': 'pasien',
    'doctor': 'dokter',
    'hospital': 'rumah sakit',
    'good morning': 'selamat pagi',
    'thank you': 'terima kasih',
    'how are you': 'bagaimana kabarnya'
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
