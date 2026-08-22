import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#68538C] text-[#FCFAF6] [a&]:hover:bg-[#342744]",
        secondary:
          "border-[#DED6CC] bg-[#F5F0E8] text-[#342744] [a&]:hover:bg-[#DED6CC]/60",
        destructive:
          "border-transparent bg-[#B87968] text-white [a&]:hover:bg-[#9C6152]",
        outline:
          "border-[#DED6CC] text-[#342744] bg-[#FCFAF6] [a&]:hover:bg-[#F5F0E8] [a&]:hover:text-[#68538C]",
        success:
          "border-[#8FAF9A]/30 bg-[#8FAF9A]/15 text-[#24422E] font-semibold",
        warning:
          "border-[#C9A96E]/30 bg-[#C9A96E]/15 text-[#59421A] font-semibold",
        info:
          "border-[#526B91]/30 bg-[#526B91]/15 text-[#213550] font-semibold",
        ai:
          "border-[#C9A96E]/40 bg-gradient-to-r from-[#68538C]/15 to-[#A996C7]/20 text-[#342744] font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
