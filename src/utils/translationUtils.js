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
    'sakit': 'sick',
    'kepala': 'head',
    'sakit kepala': 'headache',
    'darah': 'blood',
    'tinggi': 'high',
    'darah tinggi': 'high blood pressure',
    'tekanan': 'pressure',
    'gula': 'sugar',
    'gula darah': 'blood sugar',
    'resep': 'prescription',
    'obat': 'medicine',
    'istirahat': 'rest',
    'pasien': 'patient',
    'dokter': 'doctor',
    'rumah': 'house',
    'sakit': 'hospital',
    'rumah sakit': 'hospital',
    'perawat': 'nurse',
    'suntik': 'injection',
    'infus': 'IV drip',
    'operasi': 'surgery',
    'diagnosa': 'diagnosis',
    'gejala': 'symptoms',
    'mual': 'nausea',
    'muntah': 'vomit',
    'pusing': 'dizzy',
    'lemas': 'weak',
    'nyeri': 'pain',
    'dada': 'chest',
    'sesak': 'shortness of breath',
    'napas': 'breath',
    'lambung': 'stomach',
    'jantung': 'heart',
    'paru-paru': 'lungs',

    // Pronouns & Basic Words
    'saya': 'i',
    'kamu': 'you',
    'anda': 'you',
    'dia': 'he/she',
    'mereka': 'they',
    'kita': 'we',
    'ini': 'this',
    'itu': 'that',
    'ada': 'have',
    'adalah': 'is',
    'dari': 'from',
    'ke': 'to',
    'di': 'at',
    'dan': 'and',
    'atau': 'or',
    'tapi': 'but',
    'karena': 'because',
    'bagaimana': 'how',
    'siapa': 'who',
    'apa': 'what',
    'kapan': 'when',
    'dimana': 'where',

    // Common Verbs
    'makan': 'eat',
    'minum': 'drink',
    'tidur': 'sleep',
    'duduk': 'sit',
    'berdiri': 'stand',
    'berjalan': 'walk',
    'bicara': 'speak',
    'merasa': 'feel',
    'datang': 'come',
    'pulang': 'go home',
    'mau': 'want',
    'bisa': 'can',
    'harus': 'must',

    // Greetings & Common Phrases
    'halo': 'hello',
    'hai': 'hi',
    'pagi': 'morning',
    'siang': 'afternoon',
    'sore': 'afternoon',
    'malam': 'night',
    'nama': 'name',
    'umur': 'age',
    'tahun': 'years',

    // Chinese (Simplified) Mappings (Basics)
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
    'selamat sore': 'good afternoon',
    'selamat malam': 'good evening',
    'terima kasih': 'thank you',
    'sama sama': 'you are welcome',
    'sakit apa': 'what is wrong',
    'keluhan apa': 'what is your complaint',
    'sudah berapa lama': 'how long has it been',
    'berapa umur': 'how old are you',
    'semoga lekas sembuh': 'get well soon',
    'tidak apa-apa': 'it is okay',

    // Reverse
    'my name is': 'nama saya',
    'how are you': 'apa kabar',
    'good morning': 'selamat pagi',
};

// Simple direct mapping for demo purposes (ZH)
const ZH_DICTIONARY = {
    // Medical
    'fever': '发烧 (fā shāo)',
    'cough': '咳嗽 (ké sou)',
    'cold': '感冒 (gǎn mào)',
    'headache': '头痛 (tóu tòng)',
    'high_blood_pressure': '高血压 (gāo xuè yā)',
    'blood_sugar': '血糖 (xuè táng)',
    'patient': '病人 (bìng rén)',
    'doctor': '医生 (yī shēng)',
    'hospital': '医院 (yī yuàn)',
    'medicine': '药 (yào)',
    'prescription': '处方 (chǔ fāng)',
    'injection': '打针 (dǎ zhēn)',
    'pain': '痛 (tòng)',

    // Common
    'good_morning': '早上好 (zǎo shang hǎo)',
    'good_afternoon': '下午好 (xià wǔ hǎo)',
    'good_evening': '晚上好 (wǎn shàng hǎo)',
    'thank_you': '谢谢 (xiè xie)',
    'you_are_welcome': '不客气 (bù kè qi)',
    'hello': '你好 (nǐ hǎo)',
    'my_name_is': '我的名字是 (wǒ de míng zì shì)',
    'how_are_you': '你好吗 (nǐ hǎo ma)',
    'i': '我 (wǒ)',
    'you': '你 (nǐ)',
    'is': '是 (shì)',
};

/**
 * Mocks an AI translation by replacing known words from the dictionary.
 * In a real app, this would call an API like OpenAI or Google Translate.
 */
export const mockTranslate = async (text, targetLang) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let processedText = text.toLowerCase();

            // 1. Handle Phrases First
            const phrases = Object.keys(PHRASE_DICTIONARY).sort((a, b) => b.length - a.length);
            const placeholders = {};
            let placeholderCount = 0;

            phrases.forEach(phrase => {
                if (processedText.includes(phrase)) {
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
                if (w.startsWith('__PH_')) return w;

                const clean = w.replace(/[:.,?!]/g, '');
                const punctuation = w.slice(clean.length);
                // Try literal lookup or keep original
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
                // Heuristic: Check if the English result contains keys from ZH_DICTIONARY
                // Normalize keys (e.g. "good morning" -> "good_morning" or direct match)

                let zhResult = finalResult;
                // We iterate over ZH keys and replace matches in the English string
                const zhKeys = Object.keys(ZH_DICTIONARY).sort((a, b) => b.length - a.length);

                zhKeys.forEach(key => {
                    // Handle spaces vs underscores
                    const searchPhrase = key.replace(/_/g, ' ');
                    if (zhResult.toLowerCase().includes(searchPhrase)) {
                        // Case insensitive replace
                        const regex = new RegExp(searchPhrase, 'gi');
                        zhResult = zhResult.replace(regex, ZH_DICTIONARY[key]);
                    }
                });

                resolve(zhResult);
                return;
            }

            // Capitalize first letter
            if (finalResult.length > 0) {
                finalResult = finalResult.charAt(0).toUpperCase() + finalResult.slice(1);
            }

            resolve(finalResult);
        }, 1000);
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

    // Strip parenthetical text (like Pinyin) for cleaner speech
    const cleanText = text.replace(/\s*\([^)]*\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
};
