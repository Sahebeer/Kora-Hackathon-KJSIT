import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * LCA Success Modal
 * Displays success message after LCA calculation with key metrics and navigation button
 */
const LCASuccessModal = ({ isOpen, onClose, reportData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewReport = () => {
    // Navigate to analytics with reportId query parameter
    navigate(`/analytics?reportId=${reportData.reportId}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-[#68538C] to-[#342744] p-8 text-[#FCFAF6] text-center relative overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <svg className="w-20 h-20 text-[#8FAF9A]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">LCA Calculation Complete!</h2>
          <p className="text-[#A996C7] text-lg">Your environmental impact report is ready</p>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        </div>

        {/* Report Summary */}
        <div className="p-8 bg-[#FCFAF6]">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#342744] mb-4">Report Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F5F0E8] rounded-xl p-4 border border-[#DED6CC]">
                <p className="text-sm text-[#68538C] font-medium mb-1">Report ID</p>
                <p className="text-lg font-semibold text-[#342744] truncate" title={reportData.reportId}>
                  {reportData.reportId?.substring(0, 12)}...
                </p>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-4 border border-[#DED6CC]">
                <p className="text-sm text-[#68538C] font-medium mb-1">Project</p>
                <p className="text-lg font-semibold text-[#342744] truncate" title={reportData.projectName}>
                  {reportData.projectName || 'Aluminum LCA'}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          {reportData.summary && (
            <div className="mb-6 bg-[#F5F0E8]/70 rounded-xl p-5 border border-[#DED6CC]">
              <h4 className="text-md font-semibold text-[#342744] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#8FAF9A]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
                Key Environmental Metrics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {reportData.summary.totalGWP !== undefined && (
                  <div className="bg-[#FCFAF6] rounded-lg p-3 shadow-xs border border-[#DED6CC]">
                    <p className="text-xs text-[#342744]/60 mb-1">Total GWP</p>
                    <p className="text-lg font-bold text-[#B87968]">
                      {reportData.summary.totalGWP.toFixed(2)} <span className="text-sm font-normal">kg CO₂e</span>
                    </p>
                  </div>
                )}
                {reportData.summary.circularityScore !== undefined && (
                  <div className="bg-[#FCFAF6] rounded-lg p-3 shadow-xs border border-[#DED6CC]">
                    <p className="text-xs text-[#342744]/60 mb-1">Circularity Score</p>
                    <p className="text-lg font-bold text-[#24422E]">
                      {reportData.summary.circularityScore.toFixed(1)}%
                    </p>
                  </div>
                )}
                {reportData.summary.energyUse !== undefined && (
                  <div className="bg-[#FCFAF6] rounded-lg p-3 shadow-xs border border-[#DED6CC]">
                    <p className="text-xs text-[#342744]/60 mb-1">Energy Use</p>
                    <p className="text-lg font-bold text-[#526B91]">
                      {reportData.summary.energyUse.toFixed(2)} <span className="text-sm font-normal">MJ</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleViewReport}
              className="flex-1 bg-gradient-to-r from-[#68538C] to-[#342744] hover:from-[#342744] hover:to-[#28242A] text-[#FCFAF6] font-semibold py-6 rounded-xl shadow-md transition-all duration-200 text-lg cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 py-6 border border-[#DED6CC] bg-[#F5F0E8] hover:bg-[#DED6CC]/50 text-[#342744] font-medium rounded-xl transition-all duration-200 cursor-pointer"
            >
              Close
            </Button>
          </div>

          {/* PDF Download Info */}
          {reportData.pdfUrl && (
            <div className="mt-4 p-3 bg-[#C9A96E]/15 border border-[#C9A96E]/30 rounded-xl">
              <p className="text-sm text-[#59421A]">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                Your PDF report is available for download in the analytics dashboard
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LCASuccessModal;
