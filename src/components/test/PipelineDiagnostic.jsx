'use client';

import React, { useState } from 'react';
import { normalizeAndTokenize } from '../../lib/utils/textPipeline';

const PipelineDiagnostic = ({ sampleText = "태초에 하나님이 천지를 창조하시니라." }) => {
    const [input, setInput] = useState(sampleText);
    const result = normalizeAndTokenize(input);

    return (
        <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 my-10 max-w-4xl mx-auto font-mono">
            <h2 className="text-2xl font-bold mb-6 text-[#05121C]">Text Pipeline Diagnostic</h2>

            <div className="mb-8">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Input Text (Raw)</label>
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg h-32 text-lg focus:ring-2 focus:ring-[#2A4458] focus:border-transparent outline-none transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to test normalization (NFD to NFC, etc.)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Normalized (NFC)</h3>
                    <div className="p-4 bg-gray-50 rounded-lg min-h-[100px] border border-gray-200">
                        <p className="text-lg leading-relaxed text-[#05121C]">
                            {result.normalized}
                        </p>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                        Length: {result.normalized.length} | Hex: {Array.from(result.normalized).map(c => c.charCodeAt(0).toString(16)).join(' ')}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Tokenization</h3>
                    <div className="p-4 bg-gray-50 rounded-lg min-h-[100px] border border-gray-200 flex flex-wrap gap-2">
                        {result.tokens.map(token => (
                            <span
                                key={token.id}
                                className={`px-2 py-1 rounded text-sm ${token.isSeparator ? 'bg-gray-200 text-gray-400' : 'bg-[#2A4458]/10 text-[#2A4458] font-medium'}`}
                                title={token.id}
                            >
                                {token.text === ' ' ? '␣' : (token.text === '\n' ? '↵' : token.text)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">NFC Normalization:</span> Ensures consistent rendering across different OS/Browsers (e.g., Mac vs. Windows Korean input).
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PipelineDiagnostic;
