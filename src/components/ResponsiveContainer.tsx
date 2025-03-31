
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileFullWidth?: boolean;
}

export function ResponsiveContainer({ 
  children, 
  className,
  mobileFullWidth = true
}: ResponsiveContainerProps) {
  const isMobile = useIsMobile();
  
  if (isMobile && mobileFullWidth) {
    return (
      <div className={cn("w-full h-full", className)}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={cn("w-full mx-auto py-6", className)}>
      {children}
    </div>
  );
}
