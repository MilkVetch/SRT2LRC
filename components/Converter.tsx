import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  Trash2,
  FileText,
  Music,
  AlignLeft,
  FileCode
} from 'lucide-react';
import { convertSrtToLrc } from '../utils/parser';

const Converter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Download configuration state
  const [baseName, setBaseName] = useState<string>('lyrics');
  const [extension, setExtension] = useState<'lrc' | 'txt'>('txt');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto convert when input changes
  useEffect(() => {
    const result = convertSrtToLrc(input);
    setOutput(result);
  }, [input]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setBaseName(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setBaseName(nameWithoutExt);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadFile = () => {
    let finalName = baseName.trim();
    if (!finalName) {
      finalName = prompt("Please enter a filename:", "lyrics") || "lyrics";
      setBaseName(finalName);
    }

    const element = document.createElement("a");
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${finalName}.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPureLyrics = () => {
    if (!output) return;

    // Remove timestamps [mm:ss.xxx] from the beginning of lines
    const pureLyrics = output.replace(/^\[\d{2}:\d{2}\.\d{2,3}\]/gm, '');

    let finalName = baseName.trim();
    if (!finalName) {
      finalName = prompt("Please enter a filename:", "lyrics") || "lyrics";
      setBaseName(finalName);
    }

    const element = document.createElement("a");
    const file = new Blob([pureLyrics], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${finalName}_pure.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearAll = () => {
    setInput('');
    setBaseName('lyrics');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Left Side: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="file"
            accept=".srt,.txt"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all font-medium text-sm border border-white/5 hover:border-white/10 active:scale-95"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            Upload SRT
          </button>
          
          <button
            onClick={clearAll}
            disabled={!input}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium text-sm border border-transparent ${
              !input 
                ? 'text-slate-600 bg-transparent cursor-not-allowed' 
                : 'text-red-400 hover:bg-red-500/10 hover:border-red-500/20 active:scale-95'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Right Side: Download Settings */}
        <div className="flex flex-col xl:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full xl:w-auto bg-slate-950/50 border border-white/5 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
             <div className="relative flex-grow">
               <input 
                  type="text" 
                  value={baseName}
                  onChange={(e) => setBaseName(e.target.value)}
                  placeholder="Filename"
                  className="w-full sm:w-40 bg-transparent border-none text-sm px-3 py-1.5 focus:outline-none text-slate-200 placeholder-slate-600"
               />
               <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-white/10"></span>
             </div>
             <select 
                value={extension}
                onChange={(e) => setExtension(e.target.value as 'lrc' | 'txt')}
                className="bg-transparent border-none text-sm px-2 py-1.5 font-medium text-slate-400 focus:outline-none cursor-pointer hover:text-indigo-400"
             >
                <option value="txt" className="bg-slate-900">.txt</option>
                <option value="lrc" className="bg-slate-900">.lrc</option>
             </select>
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto">
            <button
              onClick={downloadPureLyrics}
              disabled={!output}
              className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 border border-white/5 hover:bg-slate-700 text-slate-300 rounded-xl transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
              title="Download lyrics without timestamps"
            >
              <AlignLeft className="w-4 h-4" />
              No Time
            </button>

            <button
              onClick={downloadFile}
              disabled={!output}
              className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 border border-white/10"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Input Column */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 px-1">
             <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
               <FileCode className="w-4 h-4 text-indigo-400" />
               Input (SRT Format)
             </label>
             <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">Drag & Drop</span>
          </div>
          <div 
            className="relative flex-grow group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl pointer-events-none"></div>
            <textarea
              className="w-full h-full p-5 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm font-mono text-sm leading-relaxed text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none resize-none transition-all shadow-inner group-hover:border-white/20 placeholder-slate-600"
              placeholder={`Paste SRT content here...\n\nExample:\n1\n00:00:12,000 --> 00:00:17,766\nLyrics text here`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
            {input === '' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-4 text-slate-600 group-hover:text-slate-500 transition-colors">
                  <div className="p-4 rounded-full bg-white/5 border border-white/5 shadow-xl">
                    <Upload className="w-8 h-8 opacity-50" />
                  </div>
                  <span className="font-medium">Drop SRT file here</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arrow (Visible on desktop/tablet) */}
        <div className="hidden md:flex flex-col justify-center items-center text-slate-700">
           <ArrowRight className="w-6 h-6 opacity-20" />
        </div>

        {/* Output Column */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 px-1">
             <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
               <Music className="w-4 h-4 text-purple-400" />
               Output (LRC / TXT)
             </label>
             <button
                onClick={copyToClipboard}
                disabled={!output}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                  copied 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20'
                } disabled:opacity-0`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
          </div>
          <div className="relative flex-grow">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-2xl pointer-events-none"></div>
            <textarea
              className="w-full h-full p-5 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm font-mono text-sm leading-relaxed text-slate-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none resize-none transition-all shadow-inner placeholder-slate-600"
              placeholder="Converted lyrics will appear here. You can also edit them manually."
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;