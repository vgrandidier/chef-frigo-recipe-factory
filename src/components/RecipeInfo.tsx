
import { Recipe } from "@/utils/recipe/types";
import { Clock, Award, Users } from "lucide-react";
import NutriScore from "@/components/NutriScore";

interface RecipeInfoProps {
  recipe: Recipe;
}

export const RecipeInfo = ({ recipe }: RecipeInfoProps) => {
  return (
    <div className="flex justify-between px-4 py-3 border-b">
      <div className="flex flex-col items-center">
        <Clock size={16} className="mb-1 text-gray-600" />
        <span className="text-xs font-medium">Préparation</span>
        <span className="text-sm">{recipe.temps_preparation}</span>
      </div>
      <div className="flex flex-col items-center">
        <Clock size={16} className="mb-1 text-gray-600" />
        <span className="text-xs font-medium">Total</span>
        <span className="text-sm">{recipe.temps_total}</span>
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
