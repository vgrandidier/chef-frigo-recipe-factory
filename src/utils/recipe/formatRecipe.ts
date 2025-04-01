
import { Recipe } from './types';

// Format le texte de la recette pour le partage
export const formatRecipeText = (recipe: Recipe): string => {
  let recipeText = ``;
  
  recipeText += `Recette: ${recipe.titre}\n\n`;
  
  recipeText += `Temps de préparation: ${recipe.temps_preparation}\n`;
  recipeText += `Temps total: ${recipe.temps_total}\n`;
  recipeText += `Nutriscore: ${recipe.nutriscore}\n\n`;
  
  recipeText += "INGRÉDIENTS\n";
  recipeText += "===========\n";
  recipe.ingredients.forEach(ing => {
    recipeText += `- ${ing.nom}: ${ing.quantite}\n`;
  });
  
  recipeText += "\nUstensiles:\n";
  recipe.ustensiles.forEach(ust => {
    recipeText += `- ${ust.nom}\n`;
  });
  
  recipeText += "\nPRÉPARATION\n";
  recipeText += "===========\n";
  Object.entries(recipe.instructions).forEach(([category, steps]) => {
    recipeText += `${category}:\n`;
    steps.forEach((step, index) => {
      // Supprimer les préfixes "Étape x : " des instructions
      const cleanedStep = step.replace(/^Étape\s+\d+\s*:\s*/i, '');
      recipeText += `${index + 1}. ${cleanedStep}\n`;
    });
    recipeText += "\n";
  });
  
  recipeText += "NUTRITION\n";
  recipeText += "=========\n";
  recipeText += "Valeurs Nutritionnelles (pour 100g):\n";
  recipeText += `- Calories: ${recipe.valeurs_nutritionnelles.calories}\n`;
  recipeText += `- Protéines: ${recipe.valeurs_nutritionnelles.proteines}\n`;
  recipeText += `- Glucides: ${recipe.valeurs_nutritionnelles.glucides}\n`;
  recipeText += `- Lipides: ${recipe.valeurs_nutritionnelles.lipides}\n`;
  recipeText += `- Fibres: ${recipe.valeurs_nutritionnelles.fibres}\n`;
  
  recipeText += "\nCette recette a été générée par Chef Frigo";
  
  return recipeText;
};
