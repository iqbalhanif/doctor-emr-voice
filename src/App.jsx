import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SOAPEditor from './components/SOAPEditor';
import Translator from './components/Translator';

function App() {
    const [activeTab, setActiveTab] = useState('emr');

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1 ml-20 lg:ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'emr' ? <SOAPEditor /> : <Translator />}
                </div>
            </main>
        </div>
    )
}

export default App
