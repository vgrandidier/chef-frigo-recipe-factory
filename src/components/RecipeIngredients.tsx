
import { Recipe } from "@/utils/recipe/types";

interface RecipeIngredientsProps {
  recipe: Recipe;
}

export const RecipeIngredients = ({ recipe }: RecipeIngredientsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-3">Ingrédients</h3>
        <ul className="space-y-3">
          {recipe.ingredients.map((ingredient, index) => (
            <li
              key={`ingredient-${index}`}
              className="flex justify-between items-center pb-2 border-b border-gray-100"
            >
              <span className="text-sm">{ingredient.nom}</span>
              <span className="font-medium text-sm text-gray-700">
                {ingredient.quantite}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Ustensiles</h3>
        <div className="grid grid-cols-2 gap-2">
          {recipe.ustensiles.map((ustensile, index) => (
            <div
              key={`ustensile-${index}`}
              className="flex items-center gap-2 bg-gray-50 rounded-xl p-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-sm">{ustensile.nom}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
