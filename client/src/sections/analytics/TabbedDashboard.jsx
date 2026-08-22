import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExecutiveSummary from './ExecutiveSummary';
import ProcessStages from './ProcessStages';
import GeographicAnalysis from './GeographicAnalysis';
import AIRecommendations from './AIRecommendations_new';
import DetailedReports from './DetailedReports';
import LinearCircularSummary from './LinearCircularSummary';
import SankeyDiagramTab from './SankeyDiagramTab';

export default function TabbedDashboard({ activeTab = 1, onTabChange, mode = 'circular', selectedProject }) {
    
    const tabs = [
        {
            id: 1,
            name: 'Executive Summary',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            component: ExecutiveSummary
        },
        {
            id: 2,
            name: 'Process Stage Analytics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            component: ProcessStages
        },
        {
            id: 3,
            name: 'Sankey Diagram',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            ),
            component: SankeyDiagramTab
        },
        {
            id: 4,
            name: 'Linear vs Circular',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M9 6l-6 6 6 6m6-12l6 6-6 6" />
                </svg>
            ),
            component: LinearCircularSummary
        },
        {
            id: 5,
            name: 'Geographic Analysis',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            component: GeographicAnalysis
        },
        {
            id: 6,
            name: 'AI Recommendations',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            component: AIRecommendations
        },
        {
            id: 7,
            name: 'Detailed Reports',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            component: DetailedReports
        }
    ];

    const renderTabContent = () => {
        const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ExecutiveSummary;
        return <ActiveComponent mode={mode} selectedProject={selectedProject} />;
    };

    return (
        <div className="tabbed-dashboard">
            {/* Tab Navigation */}
            <div className="bg-[#FCFAF6] border-b border-[#DED6CC] shadow-xs">
                <div className="px-6">
                    <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                                    transition-colors duration-200 cursor-pointer
                                    ${activeTab === tab.id
                                        ? 'border-[#68538C] text-[#68538C] font-semibold'
                                        : 'border-transparent text-[#342744]/70 hover:text-[#342744] hover:border-[#DED6CC]'
                                    }
                                `}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                            >
                                <span className={`
                                    transition-colors duration-200
                                    ${activeTab === tab.id ? 'text-[#68538C]' : 'text-[#342744]/50 group-hover:text-[#342744]'}
                                `}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                                {activeTab === tab.id && (
                                    <span className="ml-2 bg-[#68538C]/15 text-[#68538C] border border-[#C9A96E]/40 py-0.5 px-2 rounded-full text-xs font-semibold">
                                        Active
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="px-6 py-6">
                {/* Mode Indicator */}
                <AnimatePresence mode="wait">
                    {selectedProject && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4 flex items-center gap-3"
                        >
                            <span className="text-sm text-[#342744]/70">Viewing in:</span>
                            <span className={`
                                inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                                ${mode === 'linear' 
                                    ? 'bg-[#B87968]/15 text-[#B87968] border border-[#B87968]/30' 
                                    : mode === 'circular'
                                    ? 'bg-[#8FAF9A]/20 text-[#24422E] border border-[#8FAF9A]/30'
                                    : 'bg-[#68538C]/15 text-[#68538C] border border-[#68538C]/30'
                                }
                            `}>
                                <div className={`w-2 h-2 rounded-full ${
                                    mode === 'linear' 
                                        ? 'bg-[#B87968]' 
                                        : mode === 'circular'
                                        ? 'bg-[#8FAF9A]'
                                        : 'bg-[#68538C]'
                                }`}></div>
                                {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Panels */}
                <div className="min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {selectedProject ? (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderTabContent()}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center h-[600px] bg-[#FCFAF6] rounded-xl border-2 border-dashed border-[#DED6CC]"
                            >
                                <div className="text-center p-8">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-16 h-16 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <svg className="w-8 h-8 text-[#A996C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </motion.div>
                                    <motion.h3 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-lg font-medium text-[#342744] mb-2"
                                    >
                                        No Project Selected
                                    </motion.h3>
                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-[#342744]/70 mb-6"
                                    >
                                        Please select a project from the dropdown above to view detailed analytics
                                    </motion.p>
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="inline-flex items-center gap-2 text-sm text-[#68538C] font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        Use the Project Selector to get started
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tab Quick Info */}
                <AnimatePresence mode="wait">
                    {selectedProject && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mt-6 bg-[#68538C]/5 border border-[#68538C]/20 rounded-xl p-4"
                        >
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#68538C] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-[#342744] mb-1">
                                        {tabs.find(tab => tab.id === activeTab)?.name}
                                    </h4>
                                    <p className="text-sm text-[#342744]/75">
                                        {activeTab === 1 && "Overview of key performance indicators and comparative analysis"}
                                        {activeTab === 2 && "Detailed breakdown of production stages with efficiency metrics"}
                                        {activeTab === 3 && "Side-by-side summary of linear vs circular performance"}
                                        {activeTab === 4 && "Geographic distribution, facilities, and supply chain visualization"}
                                        {activeTab === 5 && "AI-powered recommendations for optimization and improvement"}
                                        {activeTab === 6 && "Comprehensive reports with exportable data and insights"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
