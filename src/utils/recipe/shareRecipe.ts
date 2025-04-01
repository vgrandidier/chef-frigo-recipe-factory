
import { Recipe } from './types';
import { printRecipe } from './shareMethods/printRecipe';
import { emailRecipe } from './shareMethods/emailRecipe';
import { whatsappRecipe } from './shareMethods/whatsappRecipe';
import { exportToPDF } from './exportToPDF';

type ShareMethod = 'email' | 'whatsapp' | 'print';

// Fonction principale pour partager une recette
export const shareRecipe = async (
  recipe: Recipe,
  recipeImage: string,
  method: ShareMethod
): Promise<void> => {
  switch (method) {
    case 'print':
      return printRecipe(recipe);
      
    case 'email':
      return emailRecipe(recipe);
      
    case 'whatsapp':
      return whatsappRecipe(recipe);
      
    default:
      console.error("Méthode de partage non prise en charge");
      return Promise.resolve();
  }
};

// Re-export all the utility functions and types
export { formatRecipeText } from './formatRecipe';
export { exportToPDF } from './exportToPDF';
export type { Recipe, RecipeIngredient, RecipeUstensil, RecipeNutritionalValues } from './types';
