
import * as React from "react"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

// Since we can't install input-otp, let's create a simplified version
interface OTPInputContextType {
  slots: {
    char: string;
    hasFakeCaret: boolean;
    isActive: boolean;
  }[];
}

const OTPInputContext = React.createContext<OTPInputContextType>({ slots: [] });

const InputOTP = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { containerClassName?: string }
>(({ className, containerClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

type InputOTPSlotProps = React.ComponentPropsWithoutRef<"div"> & { index: number }

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  InputOTPSlotProps
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { slots } = inputOTPContext;
  const slot = slots && slots.length > index ? slots[index] : undefined;
  const char = slot?.char || "";
  const hasFakeCaret = slot?.hasFakeCaret || false;
  const isActive = slot?.isActive || false;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
