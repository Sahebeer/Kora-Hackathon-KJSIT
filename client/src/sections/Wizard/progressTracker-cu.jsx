import React from "react"
import { CheckCircle2 } from "lucide-react"

export default function ProgressTrackerCopper({ steps, currentStep = 0, onStepClick, completedSteps = [], completionPercentage = 0 }) {
  const defaultSteps = [
    { title: "Mining", description: "Extract copper ore from deposits" },
    { title: "Beneficiation", description: "Concentrate copper ore" },
    { title: "Refining", description: "Purify copper to required standards" },
    { title: "Manufacturing", description: "Transform copper into products" },
    { title: "Use Phase", description: "Track product performance during use" },
    { title: "Recycling", description: "Recover and reprocess copper waste" },
    { title: "Valorization", description: "Create value from by-products and waste" },
  ]

  const items = steps?.length ? steps : defaultSteps
  const handleClick = (idx) => {
    if (typeof onStepClick === "function") onStepClick(idx)
  }
  
  const isStepCompleted = (idx) => completedSteps.includes(idx)

  return (
    <aside className="hidden md:flex md:flex-col fixed inset-y-0 right-0 z-30 w-80 border-l border-[#DED6CC] bg-[#F5F0E8] overflow-hidden shadow-xs">
      <div className="p-6 pb-4 flex-shrink-0">
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
      
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <ol className="relative min-h-full">
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-[#DED6CC]" aria-hidden="true" />
        {items.map((step, idx) => {
          const completed = isStepCompleted(idx)
          const active = idx === currentStep
          const upcoming = !completed && idx > currentStep

          return (
            <li key={idx} className="relative pl-14 py-5">
              <button
                type="button"
                onClick={() => handleClick(idx)}
                className="group text-left w-full cursor-pointer"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={[
                    "absolute left-2 mt-1 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 shadow-xs",
                    completed && "bg-[#8FAF9A] text-[#FCFAF6] border-transparent",
                    active && "bg-[#68538C] text-[#FCFAF6] border-transparent ring-8 ring-[#68538C]/25 shadow-lg animate-float-strong",
                    upcoming && "bg-[#FCFAF6] text-[#342744]/70 border-[#DED6CC]",
                  ].filter(Boolean).join(" ")}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  )}
                </span>
                <div className="transition-all duration-300">
                  <p className={["font-semibold", active ? "text-[#342744] font-bold" : completed ? "text-[#24422E]" : "text-[#342744]/70", "text-base sm:text-lg"].join(" ")}>{step.title}</p>
                  <p className="text-sm sm:text-base text-[#342744]/75">{step.description}</p>
                  {completed && <p className="text-xs text-[#24422E] font-medium mt-1">✓ Completed</p>}
                </div>
              </button>
            </li>
          )
        })}
        </ol>
      </div>

      <style>{`
        @keyframes floatStrong { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float-strong { animation: floatStrong 1.6s ease-in-out infinite; }
      `}</style>
    </aside>
  )
}
