/**
 * CanvasToolbar Component
 * Toolbar with actions: Connect, Clear
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Trash2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CanvasToolbar = ({
  isConnectMode,
  onToggleConnectMode,
  onClear,
  nodeCount,
  edgeCount,
  hasRightSidebar = false
}) => {
  return (
    <div className={`absolute top-4 z-10 transition-all duration-300 ${
      hasRightSidebar ? 'left-1/2 -translate-x-1/2' : 'right-4'
    }`}>
      <div className="bg-[#FCFAF6] rounded-xl shadow-md border border-[#DED6CC] p-2">
        <div className="flex items-center gap-2">
          {/* Stats */}
          <div className="flex items-center gap-3 px-3 py-1.5 bg-[#F5F0E8] rounded-lg border border-[#DED6CC]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#68538C]" />
              <span className="text-xs font-medium text-[#342744]">
                {nodeCount} {nodeCount === 1 ? 'process' : 'processes'}
              </span>
            </div>
            <div className="w-px h-4 bg-[#DED6CC]" />
            <div className="flex items-center gap-1.5">
              <Link2 className="w-3 h-3 text-[#68538C]" />
              <span className="text-xs font-medium text-[#342744]">
                {edgeCount} {edgeCount === 1 ? 'connection' : 'connections'}
              </span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-px h-8 bg-[#DED6CC]" />
          
          {/* Connect Mode Toggle */}
          <Button
            size="sm"
            variant={isConnectMode ? "default" : "outline"}
            onClick={onToggleConnectMode}
            className={`
              ${isConnectMode 
                ? 'bg-[#68538C] text-[#FCFAF6] hover:bg-[#342744]' 
                : 'border-[#DED6CC] bg-[#F5F0E8] text-[#342744] hover:border-[#68538C] hover:text-[#68538C]'
              }
            `}
          >
            <Link2 className="w-4 h-4 mr-1.5" />
            Connect
          </Button>
          
          {/* Clear Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onClear}
            disabled={nodeCount === 0}
            className="border-[#DED6CC] bg-[#F5F0E8] text-[#342744] hover:border-red-500 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear
          </Button>
        </div>
        
        {/* Connect Mode Instructions */}
        <AnimatePresence>
          {isConnectMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-[#DED6CC]"
            >
              <div className="flex items-start gap-2 px-3 py-2 bg-[#68538C]/10 rounded-lg border border-[#68538C]/25">
                <Info className="w-4 h-4 text-[#68538C] shrink-0 mt-0.5" />
                <div className="text-xs text-[#342744]">
                  <p className="font-semibold mb-1 text-[#68538C]">Connect Mode Active</p>
                  <p>Click on a node's handle, then click on another node's handle to create a connection.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CanvasToolbar;
