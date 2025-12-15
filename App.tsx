import React from 'react';
import Converter from './components/Converter';
import { Music, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-md opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                <Music className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                SRT to LRC
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-indigo-300 font-medium uppercase tracking-wider">
                  Converter
                </span>
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Pro Audio Tools</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Converter />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 mt-auto bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Khee. Crafted with <span className="text-red-500">♥</span> for music lovers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;