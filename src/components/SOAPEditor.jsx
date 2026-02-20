import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Copy, Save, Sparkles, FileText, ArrowRight, Bot, Zap, Activity, Waves } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { parseFullTranscript } from '../utils/soapParser';
import { parseWithGroq, transcribeAudio } from '../services/groqService';

const EXAMPLE_SCRIPT = "Keluhan utama pasien datang dengan batuk pilek sejak 3 hari yang lalu disertai demam ringan. Objektif suhu tubuh 37.8 derajat celcius, tekanan darah 110 per 70, tenggorokan terlihat kemerahan. Assessment diagnosa ISPA atau Infeksi Saluran Pernapasan Akut. Plan berikan paracetamol 500mg 3 kali sehari dan istirahat yang cukup selama 2 hari.";

const SOAPSection = ({ title, value, onChange, isActive, onFocus }) => (
    <div
        className={`p-4 rounded-xl border transition-all duration-300 ${isActive
            ? 'bg-white border-medical-blue ring-2 ring-medical-blue/20 shadow-sm'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
        onClick={onFocus}
    >
        <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'text-medical-blue' : 'text-slate-500'}`}>
                {title}
            </h3>
        </div>
        <textarea
            className="w-full bg-transparent border-none resize-none focus:ring-0 text-slate-700 leading-relaxed min-h-[100px]"
            placeholder={`Data ${title.toLowerCase()}...`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const SOAPEditor = () => {
    const [mode, setMode] = useState('raw'); // 'raw' or 'parsed'
    const [rawText, setRawText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [useAI, setUseAI] = useState(true); // Default to True for Groq
    const [sttMode, setSttMode] = useState('whisper'); // 'stream' (WebSpeech) or 'whisper' (Groq Whisper)

    const [soapData, setSoapData] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    // Web Speech API Hook
    const { isListening: isWebSpeechListening, transcript, startListening: startWebSpeech, stopListening: stopWebSpeech, resetTranscript, error: webSpeechError } = useSpeechRecognition();

    // Audio Recorder Hook (Whisper)
    const { isRecording: isWhisperRecording, recordingTime, startRecording: startWhisper, stopRecording: stopWhisper } = useAudioRecorder();

    const isListening = sttMode === 'stream' ? isWebSpeechListening : isWhisperRecording;

    // Real-time transcript update for Web Speech
    useEffect(() => {
        if (transcript && sttMode === 'stream') {
            setRawText(prev => prev + ' ' + transcript);
            resetTranscript();
        }
    }, [transcript, resetTranscript, sttMode]);

    const handleToggleRecording = async () => {
        if (isListening) {
            // STOP RECORDING
            if (sttMode === 'stream') {
                stopWebSpeech();
                // Auto-process option could go here, but we let user click "Prosess AI"
            } else {
                // Whisper Mode
                setIsProcessing(true);
                const audioBlob = await stopWhisper();
                if (audioBlob) {
                    try {
                        const text = await transcribeAudio(audioBlob);
                        setRawText(prev => (prev ? prev + ' ' : '') + text);
                    } catch (err) {
                        alert("Gagal mentranskripsi audio. Silakan coba lagi.");
                    }
                }
                setIsProcessing(false);
            }
        } else {
            // START RECORDING
            if (sttMode === 'stream') {
                startWebSpeech();
            } else {
                startWhisper();
            }
        }
    };

    const handleProcessAI = async () => {
        setIsProcessing(true);
        try {
            let parsed;
            if (useAI) {
                // Use Groq AI
                parsed = await parseWithGroq(rawText);
            } else {
                // Use Rule-Based Parser
                parsed = parseFullTranscript(rawText);
            }
            setSoapData(parsed);
            setMode('parsed'); // Switch to view result
        } catch (error) {
            console.error("Processing Error:", error);
            alert("Gagal memproses dengan AI. Beralih ke mode manual.");
            // Fallback
            const fallback = parseFullTranscript(rawText);
            setSoapData(fallback);
            setMode('parsed');
        } finally {
            setIsProcessing(false);
        }
    };

    const loadExample = () => {
        setRawText(EXAMPLE_SCRIPT);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pasien: Ahmad Santoso (L/45)</h1>
                    <p className="text-slate-500">RM-2024-0012 • 14 Okt 2024 • Poli Umum</p>
                </div>

                <div className="flex flex-col gap-2 align-end">
                    <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-semibold text-slate-400">INPUT SUARA:</span>
                        <button
                            onClick={() => setSttMode(sttMode === 'stream' ? 'whisper' : 'stream')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${sttMode === 'whisper'
                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                                : 'bg-orange-100 text-orange-700 ring-1 ring-orange-200'
                                }`}
                        >
                            {sttMode === 'whisper' ? <Activity size={14} /> : <Waves size={14} />}
                            {sttMode === 'whisper' ? 'High Accuracy (Rekam)' : 'Live Stream (Cepat)'}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-semibold text-slate-400">PARSING:</span>
                        {/* Model Toggle */}
                        <button
                            onClick={() => setUseAI(!useAI)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${useAI
                                ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {useAI ? <Bot size={14} /> : <Zap size={14} />}
                            {useAI ? 'GROQ AI (Llama 3)' : 'Legacy Logic'}
                        </button>
                    </div>

                    {webSpeechError && sttMode === 'stream' && <span className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full text-right">{webSpeechError}</span>}
                </div>
            </div>

            {isProcessing ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 h-[300px]">
                    <Sparkles className="animate-spin text-medical-blue mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700">
                        {isWhisperRecording ? 'Mentranskripsi Audio...' : (useAI ? 'Memproses dengan AI Groq...' : 'Memproses Catatan Medis...')}
                    </h3>
                    <p className="text-slate-500">
                        {isWhisperRecording
                            ? 'Mengirim audio ke Groq Whisper untuk akurasi maksimal...'
                            : (useAI ? 'Analisis konteks medis & format SOAP otomatis' : 'Menghapus kata sambung & menyusun SOAP')}
                    </p>
                </div>
            ) : (
                <>
                    {/* RAW INPUT MODE */}
                    <div className={`transition-all duration-500 ${mode === 'raw' ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <Mic size={20} className="text-medical-blue" />
                                    {sttMode === 'whisper' ? 'Rekaman Suara (High Accuracy)' : 'Live Transkripsi'}
                                </h2>
                                <div className="flex gap-2">
                                    <button onClick={loadExample} className="text-xs font-medium text-slate-500 hover:text-medical-blue underline">
                                        Muat Contoh Script
                                    </button>
                                </div>
                            </div>

                            <textarea
                                className="w-full min-h-[200px] p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-1 focus:ring-medical-blue/50 transition-all resize-y text-lg leading-relaxed text-slate-700"
                                placeholder={sttMode === 'whisper'
                                    ? "Tekan tombol rekam, bicara, lalu stop. Teks akan muncul di sini..."
                                    : "Mulai bicara... Teks akan muncul di sini secara real-time."}
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                            />

                            <div className="flex justify-center items-center mt-8">
                                <button
                                    onClick={handleToggleRecording}
                                    className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-white transition-all duration-300 shadow-xl transform hover:scale-105 ${isListening
                                        ? 'bg-red-500 hover:bg-red-600 pr-6 pl-6'
                                        : 'bg-medical-blue hover:bg-indigo-600'
                                        }`}
                                >
                                    {isListening ? (
                                        <>
                                            <div className="w-3 h-3 bg-white rounded-sm animate-pulse" />
                                            <span className="text-lg">
                                                Stop {sttMode === 'whisper' ? `(${formatTime(recordingTime)})` : '& Proses AI'}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Mic size={24} className="group-hover:animate-bounce" />
                                            <span className="text-lg">{rawText ? 'Lanjutkan Rekam' : 'Mulai Rekam'}</span>
                                        </>
                                    )}
                                </button>

                                {/* Manual Process Button if text exists but not recording */}
                                {!isListening && rawText && (
                                    <button
                                        onClick={handleProcessAI}
                                        className="absolute right-6 flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Sparkles size={18} /> Proses {useAI ? 'AI' : 'Manual'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PARSED RESULT */}
                    {mode === 'parsed' && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-slate-500">
                                <ArrowRight size={16} />
                                <span className="text-sm font-medium uppercase tracking-wider">
                                    Hasil Ekstraksi SOAP {useAI ? '(Llama 3 AI)' : '(Rule Based)'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <SOAPSection
                                    title="Subjektif (S)"
                                    value={soapData.subjective}
                                    onChange={(v) => setSoapData({ ...soapData, subjective: v })}
                                />
                                <SOAPSection
                                    title="Objektif (O)"
                                    value={soapData.objective}
                                    onChange={(v) => setSoapData({ ...soapData, objective: v })}
                                />
                                <SOAPSection
                                    title="Assessment (A)"
                                    value={soapData.assessment}
                                    onChange={(v) => setSoapData({ ...soapData, assessment: v })}
                                />
                                <SOAPSection
                                    title="Plan (P)"
                                    value={soapData.plan}
                                    onChange={(v) => setSoapData({ ...soapData, plan: v })}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => setMode('raw')}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-medical-blue font-medium"
                                >
                                    <FileText size={18} /> Edit Raw
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">
                                    <Copy size={18} /> Salin Teks
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium shadow-md">
                                    <Save size={18} /> Simpan ke EMR
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SOAPEditor;
