
import { Recipe } from '../types';
import { formatRecipeText } from '../formatRecipe';

export const whatsappRecipe = (recipe: Recipe): Promise<void> => {
  const recipeText = formatRecipeText(recipe);
  window.open(
    `https://api.whatsapp.com/send?text=${encodeURIComponent(recipeText)}`, 
    '_blank'
  );
  
  return Promise.resolve();
};
