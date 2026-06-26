import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold italic transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer shadow-[0_5px_14px_rgba(0,0,0,0.18)] hover:shadow-[0_9px_20px_rgba(0,0,0,0.24)] active:translate-y-px active:shadow-[0_3px_8px_rgba(0,0,0,0.2)]",
  {
    variants: {
      variant: {
        default:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
        destructive:
          "border-2 border-destructive bg-transparent text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20",
        outline:
          "border-2 border-foreground/55 bg-transparent text-foreground hover:bg-foreground/10",
        secondary:
          "border-2 border-foreground/40 bg-transparent text-foreground hover:bg-foreground/10",
        success:
          "border-2 border-success bg-transparent text-success hover:bg-success/10",
        ghost:
          "border-0 bg-transparent text-foreground shadow-none hover:bg-accent hover:text-accent-foreground hover:shadow-none active:shadow-none",
        link: "border-0 text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none active:shadow-none active:translate-y-0",
      },
      size: {
        default: "h-9 rounded-full px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-full gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-11 rounded-full px-7 text-base has-[>svg]:px-5",
        icon: "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
