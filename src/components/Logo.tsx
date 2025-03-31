
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl"
  };

  const iconSize = {
    sm: 24,
    md: 28,
    lg: 36
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <ChefHat 
        size={iconSize[size]} 
        className="text-primary" 
      />
      <h1 className={cn("app-logo-text", sizeClasses[size])}>
        <span className="text-primary">Chef</span>
        <span className="text-gray-700">Frigo</span>
      </h1>
    </div>
  );
}
