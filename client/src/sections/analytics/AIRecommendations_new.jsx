import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AIRecommendations({ mode, selectedProject }) {
    const [selectedPriority, setSelectedPriority] = useState('all');

    if (!selectedProject) {
        return (
            <div className="text-center py-12 text-gray-500">
                Select a project to view AI recommendations
            </div>
        );
    }

    // Get actual recommendations from backend
    const recommendations = selectedProject.aiRecommendations || [];

    // Filter by priority
    const filteredRecommendations = selectedPriority === 'all' 
        ? recommendations 
        : recommendations.filter(rec => rec.priority.toLowerCase() === selectedPriority);

    // Get priority color
    const getPriorityColor = (priority) => {
        const colors = {
            high: '#B87968',
            medium: '#526B91',
            low: '#8FAF9A'
        };
        return colors[priority.toLowerCase()] || colors.medium;
    };

    // Get priority icon
    const getPriorityIcon = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return <AlertCircle className="w-5 h-5" />;
            case 'medium':
                return <AlertTriangle className="w-5 h-5" />;
            case 'low':
                return <CheckCircle2 className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    // Count by priority
    const priorityCounts = {
        high: recommendations.filter(r => r.priority.toLowerCase() === 'high').length,
        medium: recommendations.filter(r => r.priority.toLowerCase() === 'medium').length,
        low: recommendations.filter(r => r.priority.toLowerCase() === 'low').length
    };

    return (
        <div className="ai-recommendations space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#68538C]/15 to-[#A996C7]/10 rounded-xl p-6 border border-[#68538C]/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#342744] mb-2">AI-Powered Recommendations</h2>
                        <p className="text-[#342744]/70">
                            {mode === 'circular' ? 'Circular economy optimization insights' : 'Linear process improvement opportunities'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-[#68538C]">
                            {recommendations.length}
                        </div>
                        <div className="text-sm text-[#342744]/70">Total Recommendations</div>
                    </div>
                </div>
            </div>

            {/* Priority Filter */}
            <div className="bg-[#FCFAF6] rounded-xl shadow-xs border border-[#DED6CC] p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-[#342744] mb-1">Filter by Priority</h3>
                        <p className="text-xs text-[#342744]/70">View recommendations by priority level</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedPriority('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                selectedPriority === 'all'
                                    ? 'bg-[#68538C] text-[#FCFAF6] shadow-xs'
                                    : 'bg-[#F5F0E8] text-[#342744] hover:bg-[#DED6CC]/60'
                            }`}
                        >
                            All ({recommendations.length})
                        </button>
                        <button
                            onClick={() => setSelectedPriority('high')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                selectedPriority === 'high'
                                    ? 'bg-[#B87968] text-[#FCFAF6] shadow-xs'
                                    : 'bg-[#F5F0E8] text-[#342744] hover:bg-[#DED6CC]/60'
                            }`}
                        >
                            High ({priorityCounts.high})
                        </button>
                        <button
                            onClick={() => setSelectedPriority('medium')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                selectedPriority === 'medium'
                                    ? 'bg-[#526B91] text-[#FCFAF6] shadow-xs'
                                    : 'bg-[#F5F0E8] text-[#342744] hover:bg-[#DED6CC]/60'
                            }`}
                        >
                            Medium ({priorityCounts.medium})
                        </button>
                        <button
                            onClick={() => setSelectedPriority('low')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                selectedPriority === 'low'
                                    ? 'bg-[#8FAF9A] text-[#FCFAF6] shadow-xs'
                                    : 'bg-[#F5F0E8] text-[#342744] hover:bg-[#DED6CC]/60'
                            }`}
                        >
                            Low ({priorityCounts.low})
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommendations List */}
            {filteredRecommendations.length === 0 ? (
                <div className="bg-[#FCFAF6] rounded-xl shadow-xs border border-[#DED6CC] p-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-[#A996C7] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#342744] mb-2">No Recommendations Found</h3>
                    <p className="text-[#342744]/70">
                        {selectedPriority === 'all' 
                            ? 'No recommendations available for this workflow.'
                            : `No ${selectedPriority} priority recommendations found. Try a different filter.`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRecommendations.map((recommendation, index) => (
                        <div 
                            key={index}
                            className="bg-[#FCFAF6] rounded-xl shadow-xs border border-[#DED6CC] p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                {/* Priority Badge */}
                                <div 
                                    className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
                                    style={{ 
                                        backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                                        color: getPriorityColor(recommendation.priority)
                                    }}
                                >
                                    {getPriorityIcon(recommendation.priority)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-semibold text-[#342744]">
                                            {recommendation.title}
                                        </h3>
                                        <span 
                                            className="px-3 py-1 rounded-full text-xs font-medium uppercase shrink-0"
                                            style={{
                                                backgroundColor: `${getPriorityColor(recommendation.priority)}20`,
                                                color: getPriorityColor(recommendation.priority)
                                            }}
                                        >
                                            {recommendation.priority}
                                        </span>
                                    </div>
                                    <p className="text-[#342744]/80 leading-relaxed">
                                        {recommendation.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
