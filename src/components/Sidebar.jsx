import React from 'react';
import { Stethoscope, Mic, FileText, Settings, User, Languages } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
    return (
        <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
            <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-700">
                <div className="bg-medical-blue p-2 rounded-lg shrink-0">
                    <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl hidden lg:block tracking-tight">MediVoice</span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2">
                <NavItem
                    icon={<FileText />}
                    label="Medical Record"
                    active={activeTab === 'emr'}
                    onClick={() => onTabChange('emr')}
                />
                <NavItem
                    icon={<Languages />}
                    label="AI Translator"
                    active={activeTab === 'translator'}
                    onClick={() => onTabChange('translator')}
                />
                <NavItem icon={<User />} label="Patients" />
                <NavItem icon={<Settings />} label="Settings" />
            </nav>

            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs ring-2 ring-slate-600">
                        DR
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-medium">Dr. Budi Santoso</p>
                        <p className="text-xs text-slate-400">Sp. Penyakit Dalam</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${active
            ? 'bg-medical-blue text-white shadow-lg shadow-blue-900/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
    >
        <span className="shrink-0">{icon}</span>
        <span className="hidden lg:block font-medium text-sm">{label}</span>
    </button>
);

export default Sidebar;
