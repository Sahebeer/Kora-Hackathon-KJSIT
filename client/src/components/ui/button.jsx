import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[#68538C] text-[#FCFAF6] hover:bg-[#342744] shadow-sm active:scale-[0.98] transition-all",
        destructive:
          "bg-[#B87968] text-white hover:bg-[#9C6152] focus-visible:ring-[#B87968]/20",
        outline:
          "border border-[#DED6CC] bg-[#FCFAF6] text-[#342744] shadow-xs hover:bg-[#F5F0E8] hover:text-[#68538C] hover:border-[#68538C]/40 dark:bg-[#342744] dark:border-[#A996C7]/30 dark:hover:bg-[#28242A]",
        secondary:
          "bg-[#F5F0E8] text-[#342744] border border-[#DED6CC] hover:bg-[#DED6CC]/50",
        ghost:
          "hover:bg-[#F5F0E8] hover:text-[#68538C] dark:hover:bg-[#342744]/70",
        link: "text-[#68538C] underline-offset-4 hover:underline",
        ai: "bg-gradient-to-r from-[#68538C] to-[#A996C7] text-[#FCFAF6] hover:from-[#342744] hover:to-[#68538C] shadow-md shadow-[#68538C]/25 border border-[#C9A96E]/40 font-medium active:scale-[0.98]",
        gold: "bg-[#C9A96E] text-[#342744] font-semibold hover:bg-[#B89659] shadow-sm active:scale-[0.98]",
        jade: "bg-[#8FAF9A] text-[#1E3024] font-semibold hover:bg-[#7D9E88] shadow-sm active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
