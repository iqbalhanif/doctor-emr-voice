import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Copy, Save, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { parseFullTranscript } from '../utils/soapParser';

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
    const [soapData, setSoapData] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    const { isListening, transcript, startListening, stopListening, resetTranscript, error } = useSpeechRecognition();

    // Update raw text when transcript changes
    useEffect(() => {
        if (transcript) {
            setRawText(prev => prev + (prev ? ' ' : '') + transcript);
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    const handleProcessAI = () => {
        const parsed = parseFullTranscript(rawText);
        setSoapData(parsed);
        setMode('parsed');
    };

    const loadExample = () => {
        setRawText(EXAMPLE_SCRIPT);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pasien: Ahmad Santoso (L/45)</h1>
                    <p className="text-slate-500">RM-2024-0012 • 14 Okt 2024 • Poli Umum</p>
                </div>

                <div className="flex items-center gap-3">
                    {error && <span className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">{error}</span>}
                </div>
            </div>

            {/* RAW INPUT MODE */}
            <div className={`transition-all duration-500 ${mode === 'raw' ? 'opacity-100' : 'opacity-100'}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Mic size={20} className="text-medical-blue" /> Rekaman Suara
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={loadExample} className="text-xs font-medium text-slate-500 hover:text-medical-blue underline">
                                Muat Contoh Script
                            </button>
                        </div>
                    </div>

                    <textarea
                        className="w-full min-h-[200px] p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-1 focus:ring-medical-blue/50 transition-all resize-y text-lg leading-relaxed text-slate-700"
                        placeholder="Tekan tombol mikrofon dan mulai berbicara secara natural. Sebutkan kata kunci seperti 'Subjektif', 'Objektif', 'Assessment', atau 'Plan' untuk memisahkan bagian."
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                    />

                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-medical-blue'
                                }`}
                        >
                            {isListening ? <><MicOff size={20} /> Stop Rekam</> : <><Mic size={20} /> Mulai Rekam</>}
                        </button>

                        <button
                            onClick={handleProcessAI}
                            disabled={!rawText}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md transform hover:-translate-y-0.5 ${!rawText
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'
                                }`}
                        >
                            <Sparkles size={18} /> Proses AI
                        </button>
                    </div>
                </div>
            </div>

            {/* PARSED RESULT */}
            {mode === 'parsed' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex items-center gap-2 mb-4 text-slate-500">
                        <ArrowRight size={16} /> <span className="text-sm font-medium uppercase tracking-wider">Hasil Ekstraksi SOAP</span>
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
        </div>
    );
};

export default SOAPEditor;
