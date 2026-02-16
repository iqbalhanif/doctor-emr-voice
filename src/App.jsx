import Sidebar from './components/Sidebar';
import SOAPEditor from './components/SOAPEditor';

function App() {
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-20 lg:ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-5xl mx-auto">
                    <SOAPEditor />
                </div>
            </main>
        </div>
    )
}

export default App
