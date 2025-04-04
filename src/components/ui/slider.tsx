
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
  valuePosition?: "top" | "bottom";
  showMarks?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showValue = false, valuePosition = "top", showMarks = false, min = 0, max = 100, step = 1, ...props }, ref) => {
  const value = props.value || props.defaultValue || [0];
  
  // Generate marks for display below the slider
  const marks = React.useMemo(() => {
    if (!showMarks) return [];
    const result = [];
    for (let i = min; i <= max; i += step) {
      result.push(i);
    }
    return result;
  }, [min, max, step, showMarks]);
  
  // Ensure value snaps to steps
  const handleValueChange = (newValue: number[]) => {
    if (props.onValueChange) {
      // Round to nearest step
      const roundedValue = newValue.map(v => 
        Math.round((v - min) / step) * step + min
      );
      props.onValueChange(roundedValue);
    }
  };
  
  return (
    <div className="relative w-full">
      {showValue && valuePosition === "top" && (
        <div className="absolute -top-6 left-0 right-0 text-center">
          <span className="text-sm font-medium">{value[0]}</span>
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        step={step}
        min={min}
        max={max}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      
      {showMarks && (
        <div className="flex justify-between mt-1 px-1">
          {marks.map((mark) => (
            <div key={mark} className="flex flex-col items-center">
              <div 
                className={cn(
                  "text-xs font-medium mt-1 rounded-full w-5 h-5 flex items-center justify-center",
                  value[0] === mark 
                    ? "bg-primary text-white" 
                    : "text-gray-500"
                )}
              >
                {mark}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showValue && valuePosition === "bottom" && !showMarks && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-sm font-medium">{value[0]}</span>
        </div>
      )}
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
