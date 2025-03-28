
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
    sm: 20,
    md: 28,
    lg: 36
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ChefHat 
        size={iconSize[size]} 
        className="text-culinary-primary" 
      />
      <h1 className={cn("app-logo-text", sizeClasses[size])}>
        <span className="text-culinary-primary">Chef</span>
        <span className="text-culinary-secondary">Frigo</span>
      </h1>
    </div>
  );
}
