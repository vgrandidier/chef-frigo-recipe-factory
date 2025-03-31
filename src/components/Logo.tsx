
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showSlogan?: boolean;
}

export function Logo({ size = "md", className, showSlogan = false }: LogoProps) {
  const isMobile = useIsMobile();
  
  const sizeClasses = {
    sm: isMobile ? "text-xl" : "text-xl md:text-2xl",
    md: isMobile ? "text-2xl" : "text-2xl md:text-3xl",
    lg: isMobile ? "text-3xl" : "text-3xl md:text-4xl lg:text-5xl"
  };

  const iconSize = {
    sm: isMobile ? 24 : 28,
    md: isMobile ? 28 : 32,
    lg: isMobile ? 36 : 42
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
        <p className={cn("text-gray-600 mt-1", isMobile ? "text-xs" : "text-sm")}>
          Transformez vos ingrédients en recette
        </p>
      )}
    </div>
  );
}
