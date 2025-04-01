
import { Recipe } from "@/utils/recipe/types";

interface RecipeNutritionProps {
  recipe: Recipe;
}

export const RecipeNutrition = ({ recipe }: RecipeNutritionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">
        Valeurs Nutritionnelles
      </h3>

      <p className="text-xs text-gray-500 mb-4">Pour 100g</p>

      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
          <span className="font-medium text-sm">Calories</span>
          <span className="text-sm">
            {recipe.valeurs_nutritionnelles.calories}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
          <span className="font-medium text-sm">Protéines</span>
          <span className="text-sm">
            {recipe.valeurs_nutritionnelles.proteines}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
          <span className="font-medium text-sm">Glucides</span>
          <span className="text-sm">
            {recipe.valeurs_nutritionnelles.glucides}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
          <span className="font-medium text-sm">Lipides</span>
          <span className="text-sm">
            {recipe.valeurs_nutritionnelles.lipides}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
          <span className="font-medium text-sm">Fibres</span>
          <span className="text-sm">
            {recipe.valeurs_nutritionnelles.fibres}
          </span>
        </div>
      </div>
    </div>
  );
};
