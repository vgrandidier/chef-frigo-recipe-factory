
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showSlogan?: boolean;
}

export function Logo({ size = "md", className, showSlogan = false }: LogoProps) {
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
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center gap-1.5">
        <ChefHat 
          size={iconSize[size]} 
          className="text-primary" 
        />
        <h1 className={cn("app-logo-text", sizeClasses[size])}>
          <span className="text-primary">Chef</span>
          <span className="text-gray-700">Frigo</span>
        </h1>
      </div>
      
      {showSlogan && (
        <p className="text-xs text-gray-600 mt-1">
          Transformez vos ingrédients en recette
        </p>
      )}
    </div>
  );
}
