import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Modal component to display reasoning for generated fallback values
 * Shows which fields were populated, the matched scenarios, and explanations
 */
export default function FallbackReasoningModal({ 
  isOpen, 
  onClose, 
  reasoning = {},
  matchedScenarios = [],
  populatedCount = 0,
  stepName = ''
}) {
  if (!isOpen) return null;

  const hasContent = Object.keys(reasoning).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl text-[#342744]">
            <Sparkles className="h-6 w-6 text-[#68538C]" />
            Fallback Values Generated for {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
          </DialogTitle>
          <DialogDescription className="text-[#342744]/75">
            Successfully populated <span className="font-semibold text-[#68538C]">{populatedCount}</span> missing {populatedCount === 1 ? 'field' : 'fields'} based on realistic scenarios and dependency rules.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4 my-4">
          {/* Matched Scenarios Section */}
          {matchedScenarios && matchedScenarios.length > 0 && (
            <div className="rounded-xl border border-[#526B91]/30 bg-gradient-to-br from-[#526B91]/10 to-[#68538C]/10 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#342744] mb-3">
                <Info className="h-4 w-4 text-[#526B91]" />
                Matched Scenarios
              </h3>
              <div className="space-y-2">
                {matchedScenarios.map((scenario, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-[#FCFAF6] rounded-lg px-3 py-2 border border-[#DED6CC]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#526B91] bg-[#526B91]/15 px-2 py-0.5 rounded">
                        {scenario.key}
                      </span>
                      <span className="text-sm text-[#342744]">{scenario.name}</span>
                    </div>
                    <span className="text-xs font-mono text-[#342744]/60">
                      Score: {scenario.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Populated Fields Section */}
          {hasContent && (
            <div className="rounded-xl border border-[#DED6CC] bg-[#FCFAF6]">
              <div className="bg-gradient-to-r from-[#68538C] to-[#342744] text-[#FCFAF6] px-4 py-3 rounded-t-xl">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle className="h-4 w-4 text-[#8FAF9A]" />
                  Generated Values & Reasoning
                </h3>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto p-4">
                <div className="space-y-3">
                  {Object.entries(reasoning).map(([fieldName, data], index) => (
                    <div
                      key={fieldName}
                      className="border border-[#DED6CC] rounded-xl p-4 hover:border-[#68538C] transition-colors bg-[#F5F0E8]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-[#342744]/60 uppercase tracking-wide">
                              #{index + 1}
                            </span>
                            <code className="text-sm font-mono bg-[#68538C]/10 text-[#68538C] px-2 py-0.5 rounded border border-[#68538C]/20">
                              {fieldName}
                            </code>
                          </div>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-xs text-[#342744]/60">Value:</span>
                            <span className="text-lg font-bold text-[#342744]">
                              {typeof data.value === 'number' 
                                ? data.value.toFixed(2)
                                : data.value}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Base Scenario */}
                      {data.baseScenario && (
                        <div className="mt-2 p-2 bg-[#526B91]/10 rounded-lg border border-[#526B91]/25">
                          <p className="text-xs text-[#526B91] font-medium">
                            <span className="font-semibold">📊 Base:</span> {data.baseScenario}
                          </p>
                        </div>
                      )}

                      {/* Reasoning */}
                      {data.reasons && data.reasons.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-xs font-semibold text-[#342744]/80 uppercase tracking-wide">
                            Reasoning:
                          </p>
                          {data.reasons.map((reason, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-2 text-xs text-[#342744]/85"
                            >
                              <span className="text-[#68538C] mt-0.5">•</span>
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!hasContent && (
            <div className="rounded-xl border border-[#DED6CC] bg-[#F5F0E8] p-8 text-center">
              <p className="text-[#342744]">No fallback values were generated.</p>
              <p className="text-sm text-[#342744]/60 mt-2">
                All fields are either filled by you or predicted by AI.
              </p>
            </div>
          )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 mt-4">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#68538C] hover:bg-[#342744] text-[#FCFAF6]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
