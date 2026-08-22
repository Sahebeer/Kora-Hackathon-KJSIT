import React from 'react';
import { Layers, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export default function ProjectSelector({ projects = [], selectedProject, onSelect }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full bg-[#FCFAF6] border border-[#DED6CC] rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#BA7967]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#342744]">
            Select Analyzed Metallurgy Project ({projects.length})
          </span>
        </div>
        <span className="text-xs text-[#342744]/60">
          Switch project to view stage breakdown, Sankey flow & circular ROI
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => {
          const isSelected = selectedProject?._id === project._id || selectedProject?.projectId === project.projectId;
          const isCopper = project.metalType === 'Copper' || project.projectName?.toLowerCase().includes('copper');
          const isAluminium = project.metalType === 'Aluminium' || project.projectName?.toLowerCase().includes('alum');
          const isSteel = project.metalType === 'Steel' || project.projectName?.toLowerCase().includes('steel');

          const badgeColor = isCopper
            ? 'bg-[#B87968]/15 text-[#B87968] border-[#B87968]/30'
            : isAluminium
            ? 'bg-[#68538C]/15 text-[#68538C] border-[#68538C]/30'
            : isSteel
            ? 'bg-[#59421A]/15 text-[#59421A] border-[#C9A96E]/40'
            : 'bg-[#8FAF9A]/15 text-[#8FAF9A] border-[#8FAF9A]/30';

          return (
            <button
              key={project._id || project.projectId}
              onClick={() => onSelect?.(project)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#BA7967] ring-2 ring-[#BA7967]/20 shadow-md'
                  : 'bg-[#F5F0E8]/70 border-[#DED6CC] hover:bg-white hover:border-[#BA7967]/50 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {project.metalType || 'Metal'}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-[#2E7D32]">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-[#342744] line-clamp-1">
                    {project.projectName}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#342744]/70 pt-2 border-t border-[#DED6CC]/60 mt-1">
                <span>MCI: <strong className="text-[#342744] font-semibold">{project.circularityScore || 80}%</strong></span>
                <span>GWP: <strong className="text-[#342744] font-semibold">{(project.totalCO2Emissions || 0).toLocaleString()} kg</strong></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
