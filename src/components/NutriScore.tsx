
import React from "react";
import { cn } from "@/lib/utils";

interface NutriScoreProps {
  score: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const NutriScore: React.FC<NutriScoreProps> = ({ 
  score, 
  size = "md",
  className 
}) => {
  // Determine background color based on nutriscore letter
  const getScoreColor = (score: string) => {
    const normalizedScore = score.toUpperCase();
    switch (normalizedScore) {
      case "A":
        return "bg-emerald-600 text-white"; // Dark Green
      case "B":
        return "bg-lime-500 text-white"; // Light Green
      case "C":
        return "bg-yellow-400 text-white"; // Yellow
      case "D":
        return "bg-orange-500 text-white"; // Orange
      case "E":
        return "bg-red-500 text-white"; // Red
      default:
        return "bg-gray-300 text-gray-700"; // Default/Unknown
    }
  };

  // Determine size classes
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  };

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center font-bold",
        getScoreColor(score),
        sizeClasses[size],
        className
      )}
    >
      {score.toUpperCase()}
    </div>
  );
};

export default NutriScore;
