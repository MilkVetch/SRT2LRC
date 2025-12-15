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
  Save
} from 'lucide-react';
import { convertSrtToLrc } from '../utils/parser';

const Converter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Download configuration state
  const [baseName, setBaseName] = useState<string>('lyrics');
  const [extension, setExtension] = useState<'lrc' | 'txt'>('lrc');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto convert when input changes
  useEffect(() => {
    const result = convertSrtToLrc(input);
    setOutput(result);
  }, [input]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Set suggested filename from upload
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
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
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
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload SRT
          </button>
          
          <button
            onClick={clearAll}
            disabled={!input}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
              !input 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Right Side: Download Settings */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg p-1">
             <div className="relative flex-grow">
               <input 
                  type="text" 
                  value={baseName}
                  onChange={(e) => setBaseName(e.target.value)}
                  placeholder="Filename"
                  className="w-full sm:w-40 bg-transparent border-none text-sm px-3 py-1.5 focus:outline-none text-slate-700 placeholder-slate-400"
               />
               <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-slate-200"></span>
             </div>
             <select 
                value={extension}
                onChange={(e) => setExtension(e.target.value as 'lrc' | 'txt')}
                className="bg-transparent border-none text-sm px-2 py-1.5 font-medium text-slate-600 focus:outline-none cursor-pointer hover:text-indigo-600"
             >
                <option value="lrc">.lrc</option>
                <option value="txt">.txt</option>
             </select>
          </div>

          <button
            onClick={downloadFile}
            disabled={!output}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Input Column */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2 px-1">
             <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
               <FileText className="w-4 h-4" />
               Input (SRT Format)
             </label>
             <span className="text-xs text-slate-400">Paste or drag file here</span>
          </div>
          <div 
            className="relative flex-grow group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <textarea
              className="w-full h-full p-4 rounded-xl border border-slate-200 bg-white font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-shadow shadow-sm group-hover:shadow-md"
              placeholder={`Paste SRT content here...\n\nExample:\n1\n00:00:12,000 --> 00:00:17,766\nLyrics text here`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input === '' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-12 h-12 text-slate-300" />
                  <span className="text-slate-400">Drop SRT file here</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arrow (Visible on desktop) */}
        <div className="hidden lg:flex flex-col justify-center items-center text-slate-300">
           <ArrowRight className="w-8 h-8" />
        </div>

        {/* Output Column */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2 px-1">
             <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
               <Music className="w-4 h-4" />
               Output (LRC / TXT)
             </label>
             <button
                onClick={copyToClipboard}
                disabled={!output}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                } disabled:opacity-0`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
          </div>
          <div className="relative flex-grow">
            <textarea
              className="w-full h-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none shadow-inner text-slate-600"
              readOnly
              placeholder="Converted lyrics will appear here..."
              value={output}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;