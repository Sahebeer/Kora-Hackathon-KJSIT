/**
 * SubprocessSelectionModal Component
 * Modal for selecting subprocesses before adding to canvas
 */

import React, { useState } from 'react';
import { X, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SubprocessSelectionModal = ({
  isOpen,
  process,
  onClose,
  onAddToCanvas
}) => {
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [activeTab, setActiveTab] = useState('methods');
  
  if (!isOpen || !process) return null;
  
  const toggleMethod = (method) => {
    setSelectedMethods(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };
  
  const toggleVariant = (variant) => {
    setSelectedVariants(prev =>
      prev.includes(variant)
        ? prev.filter(v => v !== variant)
        : [...prev, variant]
    );
  };
  
  const handleAdd = () => {
    const enhancedProcess = {
      ...process,
      subprocesses: {
        methods: selectedMethods,
        variants: selectedVariants
      },
      isEnhanced: true
    };
    onAddToCanvas(enhancedProcess);
    setSelectedMethods([]);
    setSelectedVariants([]);
    onClose();
  };
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />
        
        {/* Modal */}
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#FCFAF6] rounded-2xl shadow-2xl overflow-hidden border border-[#DED6CC]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#DED6CC] bg-gradient-to-r from-[#68538C] to-[#342744]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#FCFAF6]">{process.name}</h2>
                <p className="text-sm text-[#A996C7] mt-1">Configure subprocess options</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[#FCFAF6]" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-[#DED6CC] px-6 bg-[#F5F0E8]">
            <button
              onClick={() => setActiveTab('methods')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'methods'
                  ? 'border-[#68538C] text-[#68538C]'
                  : 'border-transparent text-[#342744]/60 hover:text-[#342744]'
              }`}
            >
              Methods
              {process.subprocesses?.methods && (
                <span className="ml-2 px-1.5 py-0.5 bg-[#68538C]/15 text-[#68538C] rounded text-xs">
                  {process.subprocesses.methods.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('variants')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'variants'
                  ? 'border-[#68538C] text-[#68538C]'
                  : 'border-transparent text-[#342744]/60 hover:text-[#342744]'
              }`}
            >
              Variants
              {process.subprocesses?.variants && (
                <span className="ml-2 px-1.5 py-0.5 bg-[#68538C]/15 text-[#68538C] rounded text-xs">
                  {process.subprocesses.variants.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto bg-[#FCFAF6]">
            {activeTab === 'methods' && (
              <div>
                {process.subprocesses?.methods && process.subprocesses.methods.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {process.subprocesses.methods.map((method) => (
                      <button
                        key={method}
                        onClick={() => toggleMethod(method)}
                        className={`p-4 rounded-xl border transition-all text-left cursor-pointer ${
                          selectedMethods.includes(method)
                            ? 'border-[#68538C] bg-[#68538C]/15 ring-2 ring-[#68538C]/25'
                            : 'border-[#DED6CC] bg-[#F5F0E8] hover:border-[#68538C]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-semibold text-[#342744]">
                            {method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          {selectedMethods.includes(method) && (
                            <div className="w-5 h-5 bg-[#68538C] rounded-full flex items-center justify-center shrink-0">
                              <svg className="w-3 h-3 text-[#FCFAF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="w-12 h-12 text-[#342744]/30 mx-auto mb-3" />
                    <p className="text-sm text-[#342744]/60">No methods available</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'variants' && (
              <div>
                {process.subprocesses?.variants && process.subprocesses.variants.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {process.subprocesses.variants.map((variant) => (
                      <button
                        key={variant}
                        onClick={() => toggleVariant(variant)}
                        className={`p-4 rounded-xl border transition-all text-left cursor-pointer ${
                          selectedVariants.includes(variant)
                            ? 'border-[#68538C] bg-[#68538C]/15 ring-2 ring-[#68538C]/25'
                            : 'border-[#DED6CC] bg-[#F5F0E8] hover:border-[#68538C]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-semibold text-[#342744]">
                            {variant.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          {selectedVariants.includes(variant) && (
                            <div className="w-5 h-5 bg-[#68538C] rounded-full flex items-center justify-center shrink-0">
                              <svg className="w-3 h-3 text-[#FCFAF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="w-12 h-12 text-[#342744]/30 mx-auto mb-3" />
                    <p className="text-sm text-[#342744]/60">No variants available</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#DED6CC] bg-[#F5F0E8]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#342744]">
                <span className="font-semibold text-[#68538C]">{selectedMethods.length + selectedVariants.length}</span> options selected
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-[#DED6CC] text-[#342744] hover:bg-[#DED6CC]/40 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  className="bg-[#68538C] hover:bg-[#342744] text-[#FCFAF6] cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Canvas
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubprocessSelectionModal;
