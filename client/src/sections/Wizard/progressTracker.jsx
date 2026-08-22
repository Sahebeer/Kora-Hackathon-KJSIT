import React from "react"
import { CheckCircle2 } from "lucide-react"

export default function ProgressTracker({ steps, currentStep = 0, onStepClick, completedSteps = [], completionPercentage = 0, materialSource = 'primary' }) {
  const defaultSteps = [
    { title: "Mining", description: "Extract raw materials from ore deposits" },
    { title: "Beneficiation", description: "Process and concentrate the ore" },
    { title: "Bayer Process (Alumina Production)", description: "Refine bauxite to alumina" },
    { title: "Hall–Héroult Process (Aluminium Smelting)", description: "Smelt alumina to aluminium" },
    { title: "Manufacturing", description: "Transform refined metal into products" },
    { title: "Recycling", description: "Recover and reprocess metal waste" },
    { title: "Valorization", description: "Create value from by-products and waste" },
  ]

  const items = steps?.length ? steps : defaultSteps
  
  // Check if step should be disabled (first 4 steps when 100% secondary)
  const isStepDisabled = (idx) => {
    return materialSource === 'secondary' && idx < 4;
  };
  
  const handleClick = (idx) => {
    if (isStepDisabled(idx)) return; // Don't allow clicking disabled steps
    if (typeof onStepClick === "function") onStepClick(idx)
  }
  
  const isStepCompleted = (idx) => completedSteps.includes(idx)

  return (
    <aside className="hidden md:block fixed inset-y-0 right-0 z-30 w-80 border-l border-[#DED6CC] bg-[#F5F0E8] p-6 overflow-y-auto shadow-xs">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#342744]">Progress</h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 bg-[#DED6CC] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#68538C] transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      <ol className="relative min-h-full">
        <div className="absolute left-[1.75rem] top-0 bottom-0 w-[2px] bg-[#DED6CC]" aria-hidden="true" />
        {items.map((step, idx) => {
          const completed = isStepCompleted(idx)
          const active = idx === currentStep
          const upcoming = !completed && idx > currentStep
          const disabled = isStepDisabled(idx)

          return (
            <li key={idx} className="relative pl-14 py-5">
              <button
                type="button"
                onClick={() => handleClick(idx)}
                disabled={disabled}
                className={`group text-left w-full ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={[
                    "absolute left-2 mt-1 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 shadow-xs",
                    disabled && "bg-gray-300 text-gray-500 border-gray-400",
                    !disabled && completed && "bg-[#8FAF9A] text-[#FCFAF6] border-transparent",
                    !disabled && active && "bg-[#68538C] text-[#FCFAF6] border-transparent ring-8 ring-[#68538C]/25 shadow-lg animate-float-strong",
                    !disabled && upcoming && "bg-[#FCFAF6] text-[#342744]/70 border-[#DED6CC]",
                  ].filter(Boolean).join(" ")}
                >
                  {disabled ? (
                    <span className="text-lg">🚫</span>
                  ) : completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  )}
                </span>
                <div className="transition-all duration-300">
                  <p className={["font-semibold", disabled ? "text-gray-400" : active ? "text-[#342744] font-bold" : completed ? "text-[#24422E]" : "text-[#342744]/70", "text-base sm:text-lg"].join(" ")}>{step.title}</p>
                  <p className={`text-sm sm:text-base ${disabled ? 'text-gray-400' : 'text-[#342744]/75'}`}>{step.description}</p>
                  {disabled && <p className="text-xs text-[#342744]/50 mt-1">⊘ Not applicable (100% Secondary)</p>}
                  {!disabled && completed && <p className="text-xs text-[#24422E] font-medium mt-1">✓ Completed</p>}
                </div>
              </button>
            </li>
          )
        })}
      </ol>

      <style>{`
        @keyframes floatStrong { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float-strong { animation: floatStrong 1.6s ease-in-out infinite; }
      `}</style>
    </aside>
  )
}
