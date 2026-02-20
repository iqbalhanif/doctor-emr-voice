/**
 * Groq AI Service for Medical SOAP Parsing, Translation & TTS
 * Models: 
 * - llama-3.1-8b-instant (Text Generation & Translation)
 * - whisper-large-v3 (Speech-to-Text)
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const parseWithGroq = async (transcript) => {
    if (!transcript || !transcript.trim()) {
        throw new Error("Transcript is empty");
    }

    const systemPrompt = `
You are an expert medical scribe assistant. Your task is to extract and structure a doctor's voice transcript into a SOAP (Subjective, Objective, Assessment, Plan) format.

Rx Rules:
1. Output MUST be valid JSON only. No markdown, no intro/outro text.
2. Structure: { "subjective": "...", "objective": "...", "assessment": "...", "plan": "..." }
3. If a section is missing, use an empty string.
4. Clean up the text: remove filler words (e.g., "uh", "anu", "kayaknya"), fix grammar, and make it professional.
5. Language: Maintain the original language (Indonesian) but use standard medical terminology where appropriate.

Example Input: "Pasien datang mengeluh sakit kepala sejak 2 hari lalu. Tensi 120/80. Diagnosa tension headache. Kasih paracetamol 3x1."
Example Output: { "subjective": "Pasien mengeluh sakit kepala sejak 2 hari yang lalu.", "objective": "Tekanan darah 120/80 mmHg.", "assessment": "Tension Headache", "plan": "Paracetamol 3x1 tablet." }
`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: transcript }
                ],
                temperature: 0.2, // Low temperature for consistent formatting
                response_format: { type: "json_object" } // Force JSON mode
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from Groq");
        }

        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error("JSON Parse Error:", content);
            throw new Error("Failed to parse AI response as JSON");
        }

    } catch (error) {
        console.error("Groq Service Error:", error);
        throw error;
    }
};

export const transcribeAudio = async (audioBlob) => {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', 'whisper-large-v3');
        formData.append('temperature', '0');
        formData.append('response_format', 'json');

        // Auto-detect language or default to ID if needed, but Whisper is good at auto-detect
        // formData.append('language', 'id'); 

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq Whisper Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Audio Transcription Error:", error);
        throw error;
    }
};

export const translateText = async (text, sourceLang, targetLang) => {
    if (!text || !text.trim()) return "";

    // Map language codes to full names for better prompting
    const langMap = {
        'id': 'Indonesian',
        'en': 'English',
        'zh-CN': 'Mandarin Chinese (Simplified)',
        'es': 'Spanish',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'fr': 'French'
    };

    const sourceName = langMap[sourceLang] || sourceLang;
    const targetName = langMap[targetLang] || targetLang;

    const systemPrompt = `You are a professional medical translator. Translate the following text from ${sourceName} to ${targetName}.
    Rules:
    1. Maintain accuracy of medical terms.
    2. Output ONLY the translated text. No headers, no intro, no markdown.
    `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                temperature: 0.3,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Translation Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim();

    } catch (error) {
        console.error("Translation Service Error:", error);
        throw error;
    }
};
