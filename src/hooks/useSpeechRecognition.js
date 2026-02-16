import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = (language = 'id-ID') => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Browser tidak mendukung Web Speech API.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech error:", event.error);
            if (event.error === 'not-allowed') {
                setError('Akses mikrofon ditolak.');
            }
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [language]);

    const startListening = useCallback(() => {
        setError(null);
        recognitionRef.current?.start();
    }, []);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return { isListening, transcript, startListening, stopListening, resetTranscript, error };
};
