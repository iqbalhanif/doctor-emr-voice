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

export const parseFullTranscript = (text) => {
    const result = {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    };

    const lowerText = text.toLowerCase();

    // Find indices of keywords
    // We look for the first occurrence of any keyword group
    const findIndex = (keywordGroups) => {
        let index = -1;
        let matchLength = 0;

        for (const keywords of keywordGroups) {
            for (const k of keywords) {
                const idx = lowerText.indexOf(k);
                // We want the earliest occurrence that hasn't been found before? 
                // Actually, simple REGEX approach might be better for "Split by delimiter"
            }
        }
    };

    // Simpler Regex Approach: Split the text by known headers
    // 1. Normalize text
    // 2. We need to identify sections. 
    // Let's iterate through the text and see which section we are in.

    let currentSection = 'subjective'; // Default start

    // We will split by words and check triggers
    // This is a naive but effective parser for the "Demo"

    const words = text.split(' ');
    let buffer = [];

    words.forEach(word => {
        const lowerWord = word.toLowerCase().replace(/[:.,]/g, ''); // strip punctuation for check

        let newSection = null;

        // Check if this word triggers a section switch
        if (COMMANDS.subjective.includes(lowerWord)) newSection = 'subjective';
        else if (COMMANDS.objective.includes(lowerWord)) newSection = 'objective';
        else if (COMMANDS.assessment.includes(lowerWord)) newSection = 'assessment';
        else if (COMMANDS.plan.includes(lowerWord)) newSection = 'plan';

        if (newSection) {
            // Dump buffer to current section
            if (buffer.length > 0) {
                result[currentSection] += (result[currentSection] ? ' ' : '') + buffer.join(' ');
                buffer = [];
            }
            currentSection = newSection;
        } else {
            buffer.push(word);
        }
    });

    // Dump remaining
    if (buffer.length > 0) {
        result[currentSection] += (result[currentSection] ? ' ' : '') + buffer.join(' ');
    }

    return result;
};


