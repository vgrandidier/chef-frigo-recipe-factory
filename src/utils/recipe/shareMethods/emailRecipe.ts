
import { Recipe } from '../types';
import { formatRecipeText } from '../formatRecipe';

export const emailRecipe = (recipe: Recipe): Promise<void> => {
  const recipeText = formatRecipeText(recipe);
  const emailWindow = window.open(
    `mailto:?subject=${encodeURIComponent(`Recette: ${recipe.titre}`)}&body=${encodeURIComponent(recipeText)}`, 
    '_blank'
  );
  
  if (emailWindow) {
    setTimeout(() => {
      try {
        if (!emailWindow.closed) emailWindow.close();
      } catch (e) {
        // Ignorer les erreurs de cross-origin
      }
    }, 500);
  }
  
  return Promise.resolve();
};
