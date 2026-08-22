import React, { useState } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';

export default function Header({ selectedProject, mode = 'circular', onModeChange, onProjectSelect, projects, selectedProjects = [], onProjectsCompare }) {
    const [showProjectSelector, setShowProjectSelector] = useState(false);
    
    // Calculate metrics for quick stats (using calculatelca-style circularity fields when available)
    const getMetrics = () => {
        if (!selectedProject) return null;

        const circularityScore =
            selectedProject.circularityScore ??
            selectedProject.circularityIndex ??
            selectedProject.circularModel?.materialCircularity ??
            0;

        const linearIndex = selectedProject.linearityIndex;
        const circularIndex = selectedProject.circularityIndex;

        const gwpLinear = selectedProject.linearModel?.totalEmissions || selectedProject.totalGWP || 0;
        const gwpCircular =
            typeof circularIndex === 'number' && typeof linearIndex === 'number' && gwpLinear > 0
                ? gwpLinear * (1 - circularIndex)
                : selectedProject.circularModel?.totalEmissions || 0;

        const gwpReduction = gwpLinear > 0
            ? Math.round(((gwpLinear - gwpCircular) / gwpLinear) * 100)
            : 0;

        const costSavings = selectedProject.comparativeMetrics?.totalCost?.savings || 0;

        return { circularityScore, gwpReduction, costSavings };
    };

    const metrics = getMetrics();

    // Data for mini bar charts
    const getChartData = (metric, value) => [
        { name: metric, value: value, max: 100 }
    ];

    const handleExport = (type) => {
        console.log(`Export triggered: ${type}`, {
            project: selectedProject?.projectName || 'No project selected',
            mode: mode,
            timestamp: new Date().toISOString()
        });
    };

    return (
        <header className="analytics-header bg-[#FCFAF6] shadow-xs border-b border-[#DED6CC] mb-6">
            <div className="px-6 py-4">
                {/* Top Row: Title and Export Controls */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#342744]">Analytics Dashboard</h1>
                        {selectedProject && (
                            <p className="text-sm text-[#342744]/70 mt-1">
                                {selectedProject.projectName} • {selectedProject.geographicAnalysis?.city}, {selectedProject.geographicAnalysis?.state}
                            </p>
                        )}
                    </div>
                </div>

                {selectedProject && (
                    <div className="flex items-center justify-between mb-4">
                        {/* Multi-Project Comparison */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#342744]">Compare Projects:</span>
                            <div className="relative">
                                <button
                                    onClick={() => setShowProjectSelector(!showProjectSelector)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#342744] bg-[#F5F0E8] border border-[#DED6CC] rounded-lg hover:bg-[#DED6CC]/50 transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4 text-[#68538C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    {selectedProjects.length > 0 ? `${selectedProjects.length} Selected` : 'Select Projects'}
                                </button>

                                {showProjectSelector && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-[#FCFAF6] border border-[#DED6CC] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                        <div className="p-3 border-b border-[#DED6CC] bg-[#F5F0E8]">
                                            <h4 className="font-semibold text-[#342744] text-sm">Select Projects to Compare</h4>
                                            <p className="text-xs text-[#342744]/70 mt-1">Choose 2-3 projects for side-by-side comparison</p>
                                        </div>
                                        <div className="p-2">
                                            {projects && projects.map((project) => (
                                                <label
                                                    key={project.projectId}
                                                    className="flex items-center gap-3 p-2 hover:bg-[#F5F0E8] rounded cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProjects.some(p => p.projectId === project.projectId)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                if (selectedProjects.length < 3) {
                                                                    onProjectsCompare([...selectedProjects, project]);
                                                                }
                                                            } else {
                                                                onProjectsCompare(selectedProjects.filter(p => p.projectId !== project.projectId));
                                                            }
                                                        }}
                                                        disabled={!selectedProjects.some(p => p.projectId === project.projectId) && selectedProjects.length >= 3}
                                                        className="w-4 h-4 text-[#68538C] border-[#DED6CC] rounded focus:ring-[#A996C7]"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-[#342744]">{project.projectName}</div>
                                                        <div className="text-xs text-[#342744]/70">{project.geographicAnalysis?.city}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-[#DED6CC] bg-[#F5F0E8] flex gap-2">
                                            <button
                                                onClick={() => {
                                                    onProjectsCompare([]);
                                                    setShowProjectSelector(false);
                                                }}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-[#342744] bg-[#FCFAF6] border border-[#DED6CC] rounded hover:bg-[#F5F0E8] cursor-pointer"
                                            >
                                                Clear All
                                            </button>
                                            <button
                                                onClick={() => setShowProjectSelector(false)}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-[#FCFAF6] bg-[#68538C] rounded hover:bg-[#342744] cursor-pointer"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Row: Quick Stats Cards */}
                {selectedProject && metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Circularity Score Card */}
                        <div className="bg-gradient-to-br from-[#8FAF9A]/15 to-[#8FAF9A]/25 rounded-xl p-4 border border-[#8FAF9A]/40">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-[#24422E] uppercase mb-1">Circularity Score</p>
                                    <p className="text-3xl font-bold text-[#24422E]">{metrics.circularityScore}%</p>
                                    <p className="text-xs text-[#24422E]/80 mt-1">Material Circularity Index</p>
                                </div>
                                <div className="w-16 h-16">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getChartData('Circularity', metrics.circularityScore)}>
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                <Cell fill="#8FAF9A" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="w-full bg-[#8FAF9A]/30 rounded-full h-2 mt-2">
                                <div 
                                    className="bg-[#8FAF9A] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${metrics.circularityScore}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* GWP Reduction Card */}
                        <div className="bg-gradient-to-br from-[#B87968]/15 to-[#B87968]/25 rounded-xl p-4 border border-[#B87968]/40">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-[#B87968] uppercase mb-1">GWP Reduction</p>
                                    <p className="text-3xl font-bold text-[#342744]">{metrics.gwpReduction}%</p>
                                    <p className="text-xs text-[#B87968]/80 mt-1">CO₂ Emissions Saved</p>
                                </div>
                                <div className="w-16 h-16">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getChartData('GWP', metrics.gwpReduction)}>
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                <Cell fill="#B87968" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="w-full bg-[#B87968]/20 rounded-full h-2 mt-2">
                                <div 
                                    className="bg-[#B87968] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${metrics.gwpReduction}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Cost Savings Card */}
                        <div className="bg-gradient-to-br from-[#C9A96E]/15 to-[#C9A96E]/25 rounded-xl p-4 border border-[#C9A96E]/40">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-[#59421A] uppercase mb-1">Cost Savings</p>
                                    <p className="text-2xl font-bold text-[#342744]">
                                        ${(metrics.costSavings / 1000000).toFixed(2)}M
                                    </p>
                                    <p className="text-xs text-[#59421A]/80 mt-1">
                                        Total: ${metrics.costSavings.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center w-16 h-16 text-[#C9A96E]">
                                    <svg className="w-12 h-12 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs mt-2">
                                <span className="flex items-center text-[#59421A] font-semibold">
                                    <svg className="w-4 h-4 mr-1 text-[#8FAF9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    {((metrics.costSavings / (selectedProject.linearModel?.totalCost || 1)) * 100).toFixed(1)}% savings
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Project Selected State */}
                {!selectedProject && (
                    <div className="text-center py-8 bg-[#F5F0E8] rounded-xl border-2 border-dashed border-[#DED6CC]">
                        <svg className="w-12 h-12 text-[#A996C7]/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-[#342744] font-medium">Select a project to view analytics</p>
                        <p className="text-sm text-[#342744]/70 mt-1">Use the project selector below to get started</p>
                    </div>
                )}
            </div>
        </header>
    );
}
