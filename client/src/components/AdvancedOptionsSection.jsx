import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Collapsible section for advanced/optional form fields
 * Helps reduce visual clutter by hiding non-essential fields initially
 */
export function AdvancedOptionsSection({ 
  title, 
  children, 
  defaultExpanded = false,
  icon = "🔧",
  description = null,
  className = ""
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  return (
    <div className={`border border-[#DED6CC] bg-[#F5F0E8]/60 rounded-xl overflow-hidden shadow-xs ${className}`}>
      <Button
        type="button"
        variant="ghost"
        className="w-full flex items-center justify-between p-4 hover:bg-[#DED6CC]/40 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-left">
          <span className="text-lg">{icon}</span>
          <div>
            <span className="font-semibold text-[#342744]">{title}</span>
            {description && !isExpanded && (
              <p className="text-xs text-[#342744]/60 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-[#68538C]" />
        </motion.div>
      </Button>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 bg-[#FCFAF6] border-t border-[#DED6CC]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
