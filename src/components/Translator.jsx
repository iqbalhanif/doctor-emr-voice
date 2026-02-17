import React, { useState, useEffect } from 'react';
import { Languages, ArrowRightLeft, Volume2, Sparkles, Copy, Check, Mic, Trash2, Settings } from 'lucide-react';
import { LANGUAGES, mockTranslate, speakText } from '../utils/translationUtils';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translateWithGoogle } from '../services/aiService';

const Translator = () => {
    const [sourceLang, setSourceLang] = useState('ID');

    // Debugging version
    console.log("Translator Component Loaded - Version: v2-fix-import");
    const [targetLang, setTargetLang] = useState('EN');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [copied, setCopied] = useState(false);

    // MyMemory doesn't need API Key - remove all related state



    // Voice Input Hook
    const { isListening, transcript, startListening, stopListening, resetTranscript, error } = useSpeechRecognition(LANGUAGES[sourceLang].code);

    // Live Voice Transcription
    useEffect(() => {
        if (transcript) {
            setInputText(prev => prev + (prev ? ' ' : '') + transcript);
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(outputText);
        setOutputText(inputText);
    };

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        setIsTranslating(true);
        try {
            // Use Google Translate (Free, No Key Required)
            const result = await translateWithGoogle(
                inputText,
                LANGUAGES[sourceLang].name,
                LANGUAGES[targetLang].name
            );
            setOutputText(result);
        } catch (error) {
            console.error("Translation error", error);
            alert(`Translation Error: ${error.message}`);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSpeak = () => {
        if (outputText) {
            speakText(outputText, LANGUAGES[targetLang].code);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
            // Optional: Auto-translate on stop?
            // setTimeout(handleTranslate, 500); 
        } else {
            startListening();
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Languages className="text-medical-blue" /> AI Medical Translator
                    </h1>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Terjemahan suara instan.</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1">
                            <Sparkles size={10} /> GOOGLE TRANSLATE
                        </span>
                    </div>
                </div>
            </div>



            <div className="flex flex-col gap-6">
                {/* Language Controls */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dari Bahasa</label>
                        <div className="relative">
                            <select
                                value={sourceLang}
                                onChange={(e) => setSourceLang(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-medical-blue font-bold"
                            >
                                {Object.entries(LANGUAGES).map(([key, lang]) => (
                                    <option key={key} value={key}>{lang.flag} {lang.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSwapLanguages}
                        className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors mt-6"
                    >
                        <ArrowRightLeft size={20} />
                    </button>

                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ke Bahasa</label>
                        <div className="relative">
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-medical-blue font-bold"
                            >
                                {Object.entries(LANGUAGES).map(([key, lang]) => (
                                    <option key={key} value={key}>{lang.flag} {lang.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Interaction Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input / Mic Area */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input</span>
                            <button
                                onClick={() => {
                                    setInputText('');
                                    setOutputText('');
                                }}
                                disabled={!inputText}
                                className={`transition-colors p-1 ${inputText
                                    ? 'text-slate-400 hover:text-red-500 cursor-pointer'
                                    : 'text-slate-200 cursor-not-allowed'
                                    }`}
                                title="Hapus Input"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <textarea
                            className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 text-xl text-slate-700 placeholder:text-slate-300 mb-6"
                            placeholder="Tekan tombol mikrofon dan mulai bicara..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />

                        <div className="flex flex-col items-center justify-end mt-auto">
                            <button
                                onClick={toggleListening}
                                className={`group relative flex items-center justify-center w-20 h-20 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${isListening
                                    ? 'bg-red-500 ring-4 ring-red-200'
                                    : 'bg-medical-blue hover:bg-indigo-600'
                                    }`}
                            >
                                {isListening ? (
                                    <div className="w-8 h-8 bg-white rounded-sm animate-pulse" />
                                ) : (
                                    <Mic size={32} className="text-white" />
                                )}
                            </button>
                            <p className="mt-4 text-sm font-medium text-slate-400">
                                {isListening ? 'Sedang mendengarkan...' : 'Ketuk untuk bicara'}
                            </p>
                            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                        </div>
                    </div>

                    {/* Output Area */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col h-[400px] relative overflow-hidden">
                        {isTranslating && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-2xl">
                                <div className="flex flex-col items-center gap-3">
                                    <Sparkles className="animate-spin text-medical-blue" size={32} />
                                    <span className="text-sm font-medium text-slate-500">Menerjemahkan...</span>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto">
                            {outputText ? (
                                <p className="text-2xl text-slate-800 leading-relaxed font-medium">{outputText}</p>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-300 italic">
                                    Terjemahan akan muncul di sini...
                                </div>
                            )}
                        </div>

                        <div className="pt-6 mt-auto border-t border-slate-200 flex justify-between items-center">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSpeak}
                                    disabled={!outputText}
                                    className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-medical-blue hover:border-medical-blue rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <Volume2 size={24} />
                                </button>
                                <button
                                    onClick={handleCopy}
                                    disabled={!outputText}
                                    className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-500 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {copied ? <Check size={24} /> : <Copy size={24} />}
                                </button>
                            </div>

                            <button
                                onClick={handleTranslate}
                                disabled={!inputText || isTranslating}
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Terjemahkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Translator;
