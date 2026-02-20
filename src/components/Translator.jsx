import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, ArrowRightLeft, Copy, RotateCcw, Sparkles, Languages } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { transcribeAudio, translateText } from '../services/groqService';

const Translator = () => {
    const [sourceLang, setSourceLang] = useState('id'); // Default Source: Indonesian
    const [targetLang, setTargetLang] = useState('en'); // Default Target: English
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Audio Recorder Hook (Whisper)
    const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder();

    const handleToggleRecording = async () => {
        if (isRecording) {
            // STOP RECORDING
            setIsProcessing(true);
            const audioBlob = await stopRecording();
            if (audioBlob) {
                try {
                    // 1. Transcribe with Whisper
                    const text = await transcribeAudio(audioBlob);
                    setInputText(text);

                    // 2. Auto-Translate
                    await handleTranslate(text);
                } catch (err) {
                    console.error(err);
                    alert("Gagal memproses audio. Silakan coba lagi.");
                }
            }
            setIsProcessing(false);
        } else {
            // START RECORDING
            startRecording();
        }
    };

    const handleTranslate = async (textToTranslate = inputText) => {
        if (!textToTranslate.trim()) return;

        setIsProcessing(true);
        try {
            const result = await translateText(textToTranslate, sourceLang, targetLang);
            setTranslatedText(result);
        } catch (error) {
            console.error(error);
            alert("Gagal menerjemahkan.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSpeak = (text, lang) => {
        if (!text) return;

        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Language Mapping
        const langMap = {
            'id': 'id-ID',
            'en': 'en-US',
            'zh-CN': 'zh-CN',
            'ar': 'ar-SA'
        };
        utterance.lang = langMap[lang] || 'en-US';

        // Optional: Select voice based on lang if needed, but browser default is usually fine
        window.speechSynthesis.speak(utterance);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(translatedText);
        setTranslatedText(inputText);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
                    <Languages className="text-medical-blue" />
                    AI Medical Translator
                </h1>
                <p className="text-slate-500 mt-2">Powered by Groq (Whisper + Llama 3)</p>
            </div>

            {/* Language Selectors */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center justify-between gap-4">
                <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-medical-blue/20 outline-none font-medium"
                >
                    <option value="id">Indonesian</option>
                    <option value="en">English (US)</option>
                    <option value="zh-CN">Chinese (Mandarin)</option>
                    <option value="ar">Arabic</option>
                </select>

                <button
                    onClick={handleSwapLanguages}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-medical-blue"
                >
                    <ArrowRightLeft size={20} />
                </button>

                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-medical-blue/20 outline-none font-medium"
                >
                    <option value="en">English (US)</option>
                    <option value="id">Indonesian</option>
                    <option value="zh-CN">Chinese (Mandarin)</option>
                    <option value="ar">Arabic</option>
                </select>
            </div>

            {/* Input Area */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Source */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Input ({sourceLang})</span>
                        {inputText && (
                            <button onClick={() => setInputText('')} className="text-slate-400 hover:text-red-500">
                                <RotateCcw size={16} />
                            </button>
                        )}
                    </div>

                    <textarea
                        className="flex-1 w-full resize-none border-none focus:ring-0 text-lg leading-relaxed text-slate-700 bg-transparent placeholder:text-slate-300"
                        placeholder="Ketik atau rekam suara..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                        <button
                            onClick={() => handleSpeak(inputText, sourceLang)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-medical-blue transition-colors disabled:opacity-50"
                            disabled={!inputText}
                        >
                            <Volume2 size={20} />
                        </button>

                        <button
                            onClick={handleToggleRecording}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-md hover:shadow-lg ${isRecording
                                    ? 'bg-red-500 animate-pulse'
                                    : 'bg-medical-blue hover:bg-indigo-600'
                                }`}
                        >
                            {isRecording ? (
                                <>
                                    <MicOff size={18} /> Stop ({formatTime(recordingTime)})
                                </>
                            ) : (
                                <>
                                    <Mic size={18} /> Rekam
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Target */}
                <div className="bg-slate-50 rounded-2xl shadow-inner border border-slate-200 p-6 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-medical-blue uppercase tracking-wider">Output ({targetLang})</span>
                        {translatedText && (
                            <button className="text-slate-400 hover:text-medical-blue">
                                <Copy size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 w-full overflow-y-auto">
                        {isProcessing ? (
                            <div className="flex items-center gap-3 text-slate-400 animate-pulse mt-10">
                                <Sparkles size={20} />
                                <span>Sedang memproses dengan AI...</span>
                            </div>
                        ) : (
                            <p className="text-xl leading-relaxed text-slate-800 font-medium">
                                {translatedText || <span className="text-slate-300 italic">Terjemahan akan muncul di sini...</span>}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/50">
                        <button
                            onClick={() => handleSpeak(translatedText, targetLang)}
                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-medical-blue transition-colors disabled:opacity-50"
                            disabled={!translatedText}
                        >
                            <Volume2 size={20} />
                        </button>

                        <button
                            onClick={() => handleTranslate()}
                            disabled={!inputText || isProcessing}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                        >
                            Terjemahkan Ulang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Translator;
