/**
 * CanvasNode Component
 * Custom ReactFlow node component for process representation
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CanvasNode = ({ data, selected }) => {
  const process = data?.process;
  const IconComponent = process?.icon;
  
  // Debug icon
  if (process && !IconComponent) {
    console.log('❌ No icon for process:', process.name, process);
  }
  
  if (!data || !process) {
    return null;
  }

  // Get stage label from stageMapping
  const getStageLabel = (stageId, metal) => {
    const stageConfig = {
      steel: [
        { id: 'extraction', label: 'Stage 1: Mining' },
        { id: 'processing', label: 'Stage 2: Beneficiation' },
        { id: 'ironmaking', label: 'Stage 3: Ironmaking' },
        { id: 'steelmaking', label: 'Stage 4: Steelmaking' },
        { id: 'manufacturing', label: 'Stage 5: Manufacturing' },
        { id: 'recycling', label: 'Stage 6: Recycling' },
        { id: 'valorization', label: 'Stage 7: Valorization' }
      ],
      aluminum: [
        { id: 'extraction', label: 'Stage 1: Mining' },
        { id: 'processing', label: 'Stage 2: Beneficiation' },
        { id: 'alumina_refining', label: 'Stage 3: Refining' },
        { id: 'smelting', label: 'Stage 4: Smelting' },
        { id: 'manufacturing', label: 'Stage 5: Manufacturing' },
        { id: 'recycling', label: 'Stage 6: Recycling' },
        { id: 'valorization', label: 'Stage 7: Valorization' }
      ]
    };
    
    const stages = stageConfig[metal] || [];
    const stage = stages.find(s => s.id === stageId);
    return stage?.label || stageId;
  };
  
  return (
    <div
      className={`
        bg-[#FCFAF6] rounded-xl shadow-xs transition-all duration-200
        border ${selected ? 'border-[#68538C] ring-4 ring-[#68538C]/20 shadow-md' : 'border-[#DED6CC] hover:border-[#68538C]/60'}
        w-[200px]
      `}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-[#68538C] border-2 border-[#FCFAF6]"
      />
      
      {/* Node Content */}
      <div className="p-3">
        {/* Icon and Title - Centered Layout */}
        <div className="flex flex-col items-center text-center gap-2">
          <div
            className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-xs"
            style={{ backgroundColor: process.color || '#68538C' }}
          >
            {IconComponent && typeof IconComponent === 'function' ? (
              <IconComponent className="w-5 h-5 text-[#FCFAF6]" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-white/30" />
            )}
          </div>
          
          <div className="w-full">
            <h3 className="text-sm font-semibold text-[#342744] mb-0.5">
              {data.label}
            </h3>
            <p className="text-xs text-[#68538C] font-medium">
              {getStageLabel(data.stage, data.metal)}
            </p>
          </div>
          
          <p className="text-xs text-[#342744]/60 italic mt-0.5">
            Configure details on the right
          </p>
        </div>
      </div>
      
      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-[#68538C] border-2 border-[#FCFAF6]"
      />
      
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-[#68538C] border-2 border-[#FCFAF6]"
      />
      
      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-[#68538C] border-2 border-[#FCFAF6]"
      />
    </div>
  );
};

export default CanvasNode;
