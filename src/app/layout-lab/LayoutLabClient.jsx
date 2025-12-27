'use client';

import React, { useState } from 'react';
import { HOME_LAYOUT_CONFIG } from '../../lib/home-layout-config';
import { saveLayoutConfig } from '../actions/saveLayout';

const LayoutLabClient = ({ sections }) => {
    const [config, setConfig] = useState(HOME_LAYOUT_CONFIG);
    const [saving, setSaving] = useState(false);

    const updateSection = (index, value) => {
        setConfig(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [index]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveLayoutConfig(config);
            alert('Saved successfully!');
        } catch (e) {
            alert('Failed to save: ' + e.message);
        } finally {
            setSaving(false);
        }
    };

    const extractVh = (str) => {
        const match = str.match(/pt-\[(\d+)vh\]/);
        return match ? parseInt(match[1]) : 0;
    };

    const updateVh = (index, vh) => {
        updateSection(index, `pt-[${vh}vh]`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Layout Lab</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>

                <div className="space-y-6">
                    {sections.map((section, idx) => {
                        const currentVal = config.sections[idx] || config.default;
                        const vhVal = extractVh(currentVal);

                        return (
                            <div key={section.id} className="border p-6 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {idx + 1}. {section.titleEn || "Untitled"}
                                        </h3>
                                        <p className="text-sm text-gray-500">{section.subtitle}</p>
                                        <p className="text-xs text-gray-400 mt-1 font-mono">{section.verse?.normalizedReference}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono text-sm font-bold">
                                            {currentVal}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-600 w-16">Top: {vhVal}vh</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="60"
                                        step="1"
                                        value={vhVal}
                                        onChange={(e) => updateVh(idx, e.target.value)}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => updateVh(idx, vhVal - 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                                        <button onClick={() => updateVh(idx, vhVal + 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LayoutLabClient;
