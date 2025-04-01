
import { Recipe } from "@/utils/recipe/types";
import { Clock, Award, Users } from "lucide-react";
import NutriScore from "@/components/NutriScore";

interface RecipeInfoProps {
  recipe: Recipe;
}

export const RecipeInfo = ({ recipe }: RecipeInfoProps) => {
  // Helper function to extract numeric value from time string
  const extractTimeValue = (timeString: string): string => {
    const match = timeString.match(/(\d+)/);
    return match ? match[1] : timeString;
  };

  return (
    <div className="flex justify-between px-4 py-3 border-b">
      <div className="flex flex-col items-center">
        <Clock size={16} className="mb-1 text-gray-600" />
        <span className="text-xs font-medium">Préparation</span>
        <div className="flex flex-col items-center">
          <span className="text-sm">{extractTimeValue(recipe.temps_preparation)}</span>
          <span className="text-xs text-gray-500">minutes</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Clock size={16} className="mb-1 text-gray-600" />
        <span className="text-xs font-medium">Total</span>
        <div className="flex flex-col items-center">
          <span className="text-sm">{extractTimeValue(recipe.temps_total)}</span>
          <span className="text-xs text-gray-500">minutes</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Users size={16} className="mb-1 text-gray-600" />
        <span className="text-xs font-medium">Couverts</span>
        <span className="text-sm">{recipe.nombre_couverts || 4}</span>
      </div>
      <div className="flex flex-col items-center">
        <Award size={16} className="mb-1 text-gray-600" />
        <span className="text-xs font-medium">Nutriscore</span>
        <div className="mt-1">
          <NutriScore score={recipe.nutriscore} size="sm" />
        </div>
      </div>
    </div>
  );
};
