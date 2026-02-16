// Keywords to trigger field switching (simple state machine)
const COMMANDS = {
    subjective: ['subjektif', 'keluhan', 's:'],
    objective: ['objektif', 'pemeriksaan', 'fisik', 'o:'],
    assessment: ['assesment', 'asesment', 'diagnosa', 'a:'],
    plan: ['plan', 'rencana', 'terapi', 'p:'],
};

export const parseTranscript = (text, currentSection) => {
    const lowerText = text.toLowerCase().trim();

    // Check for commands
    for (const [section, keywords] of Object.entries(COMMANDS)) {
        if (keywords.some(k => lowerText.startsWith(k))) {
            // Return new section and text without the keyword
            const keyword = keywords.find(k => lowerText.startsWith(k));
            const cleanText = text.slice(keyword.length).trim();
            return { action: 'SWITCH', section, text: cleanText };
        }
    }

    return { action: 'APPEND', text };
};

const STOP_WORDS = new Set([
    'yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu', 'pada', 'untuk', 'adalah',
    'sebagai', 'dengan', 'dalam', 'atas', 'karena', 'jika', 'namun', 'tetapi',
    'atau', 'pun', 'juga', 'sudah', 'telah', 'sedang', 'akan', 'bisa', 'dapat',
    'harus', 'oleh', 'serta', 'lalu', 'kemudian', 'saat', 'ketika', 'sehingga',
    'agar', 'supaya', 'seperti', 'tersebut', 'apakah', 'bagaimana'
]);

const cleanText = (text) => {
    return text
        .split(' ')
        .filter(word => !STOP_WORDS.has(word.toLowerCase().replace(/[:.,]/g, '')))
        .join(' ');
};

export const parseFullTranscript = (text) => {
    const result = {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    };

    const lowerText = text.toLowerCase();
    const words = text.split(/\s+/);
    let buffer = [];
    let currentSection = 'subjective';

    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[:.,]/g, '');
        let newSection = null;

        if (COMMANDS.subjective.includes(cleanWord)) newSection = 'subjective';
        else if (COMMANDS.objective.includes(cleanWord)) newSection = 'objective';
        else if (COMMANDS.assessment.includes(cleanWord)) newSection = 'assessment';
        else if (COMMANDS.plan.includes(cleanWord)) newSection = 'plan';

        if (newSection) {
            if (buffer.length > 0) {
                const sectionText = buffer.join(' ');
                // Append cleaned text
                result[currentSection] += (result[currentSection] ? ' ' : '') + cleanText(sectionText);
                buffer = [];
            }
            currentSection = newSection;
        } else {
            buffer.push(word);
        }
    });

    // Dump remaining buffer
    if (buffer.length > 0) {
        const sectionText = buffer.join(' ');
        result[currentSection] += (result[currentSection] ? ' ' : '') + cleanText(sectionText);
    }

    return result;
};
