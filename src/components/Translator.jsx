import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Volume2, Sparkles, Copy, Check } from 'lucide-react';
import { LANGUAGES, mockTranslate, speakText } from '../utils/translationUtils';

const Translator = () => {
    const [sourceLang, setSourceLang] = useState('ID');
    const [targetLang, setTargetLang] = useState('EN');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [copied, setCopied] = useState(false);

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
            const result = await mockTranslate(inputText, LANGUAGES[targetLang].code);
            setOutputText(result);
        } catch (error) {
            console.error("Translation error", error);
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

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Languages className="text-medical-blue" /> AI Medical Translator
                </h1>
                <p className="text-slate-500">Terjemahan instan untuk komunikasi dokter-pasien.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Controls */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 px-3 font-bold text-slate-700">
                            <span className="text-2xl">{LANGUAGES[sourceLang].flag}</span>
                            {LANGUAGES[sourceLang].name}
                        </div>
                        <button
                            onClick={handleSwapLanguages}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        >
                            <ArrowRightLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2 px-3 font-bold text-slate-700">
                            <span className="text-2xl">{LANGUAGES[targetLang].flag}</span>
                            {LANGUAGES[targetLang].name}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[400px]">
                    {/* Source Input */}
                    <div className="p-6">
                        <textarea
                            className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-lg text-slate-700 placeholder:text-slate-400"
                            placeholder="Masukkan teks di sini..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </div>

                    {/* Target Output */}
                    <div className="p-6 bg-slate-50/50 relative">
                        {isTranslating ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                <div className="flex flex-col items-center gap-3">
                                    <Sparkles className="animate-spin text-medical-blue" size={32} />
                                    <span className="text-sm font-medium text-slate-500">Menerjemahkan...</span>
                                </div>
                            </div>
                        ) : null}

                        {outputText ? (
                            <div className="h-full flex flex-col justify-between">
                                <p className="text-lg text-slate-800 leading-relaxed">{outputText}</p>

                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200/50">
                                    <button
                                        onClick={handleSpeak}
                                        className="p-2 text-slate-500 hover:text-medical-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Dengarkan (TTS)"
                                    >
                                        <Volume2 size={20} />
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                        title="Salin Teks"
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 italic">
                                Hasil terjemahan akan muncul di sini...
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={handleTranslate}
                        disabled={!inputText.trim() || isTranslating}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${!inputText.trim() || isTranslating
                                ? 'bg-slate-400 cursor-not-allowed hidden'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                    >
                        <Sparkles size={18} /> Terjemahkan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Translator;
