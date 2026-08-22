/**
 * DraggableProcess Component
 * Individual draggable process card in the library
 */

import React from 'react';
import { motion } from 'framer-motion';

const DraggableProcess = ({ process, onDragStart, isDisabled = false, isOnCanvas = false }) => {
  const IconComponent = process.icon;
  
  const handleDragStart = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onDragStart(e, process);
  };
  
  return (
    <motion.div
      draggable={!isDisabled}
      onDragStart={handleDragStart}
      className={`group ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing'}`}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      <div className={`bg-[#FCFAF6] border rounded-xl p-3 transition-all duration-200 flex flex-col items-center text-center h-full shadow-xs ${
        isDisabled 
          ? 'border-[#DED6CC] bg-[#F5F0E8]/50' 
          : 'border-[#DED6CC] hover:border-[#68538C] hover:shadow-md'
      }`}>
        {/* Icon */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-xs"
          style={{ backgroundColor: isDisabled ? '#DED6CC' : `${process.color}25` }}
        >
          <IconComponent
            className="w-6 h-6"
            style={{ color: isDisabled ? '#8C827A' : process.color }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 w-full">
          <h4 className={`text-sm font-semibold mb-1 ${
            isDisabled ? 'text-gray-400' : 'text-[#342744]'
          }`}>
            {process.name}
          </h4>
          <p className={`text-xs line-clamp-2 ${
            isDisabled ? 'text-gray-400' : 'text-[#342744]/70'
          }`}>
            {process.description}
          </p>
        </div>
        
        {/* Drag hint or disabled message */}
        <div className={`mt-2 text-center text-xs transition-opacity ${
          isOnCanvas
            ? 'text-[#B87968] font-medium opacity-100' 
            : isDisabled 
            ? 'text-[#342744]/40 opacity-0' 
            : 'text-[#68538C] font-medium opacity-0 group-hover:opacity-100'
        }`}>
          {isOnCanvas ? 'Already on canvas' : 'Drag to canvas'}
        </div>
      </div>
    </motion.div>
  );
};

export default DraggableProcess;
