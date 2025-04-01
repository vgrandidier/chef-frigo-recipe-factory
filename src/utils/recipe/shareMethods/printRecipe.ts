
import { Recipe } from '../types';

export const printRecipe = (recipe: Recipe): Promise<void> => {
  const printWindow = window.open('', '_blank');
  
  // Fonction pour nettoyer les instructions en supprimant les "Étape x : " au début
  const cleanInstructionText = (step: string): string => {
    return step.replace(/^Étape\s+\d+\s*:\s*/i, '');
  };
  
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>ChefFrigo - ${recipe.titre}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            h2 { margin-top: 30px; color: #9b87f5; border-bottom: 2px solid #9b87f5; padding-bottom: 5px; }
            .info-bar { display: flex; justify-content: space-between; background-color: #f7f7f7; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
            .info-item { text-align: center; }
            .info-item p:first-child { font-weight: bold; margin: 0; color: #555; }
            ul, ol { padding-left: 20px; }
            li { margin-bottom: 8px; }
            .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; font-style: italic; }
          </style>
        </head>
        <body>
          <h1>${recipe.titre}</h1>
          
          <div class="info-bar">
            <div class="info-item">
              <p>Préparation</p>
              <p>${recipe.temps_preparation}</p>
            </div>
            <div class="info-item">
              <p>Total</p>
              <p>${recipe.temps_total}</p>
            </div>
            <div class="info-item">
              <p>Nutriscore</p>
              <p>${recipe.nutriscore}</p>
            </div>
          </div>
          
          <h2>INGRÉDIENTS</h2>
          <ul>
            ${recipe.ingredients.map(ing => `<li><strong>${ing.nom}:</strong> ${ing.quantite}</li>`).join('')}
          </ul>
          
          <h3>Ustensiles</h3>
          <ul>
            ${recipe.ustensiles.map(ust => `<li>${ust.nom}</li>`).join('')}
          </ul>
          
          <h2>PRÉPARATION</h2>
          ${Object.entries(recipe.instructions).map(([category, steps]) => `
            <h3>${category}</h3>
            <ol>
              ${steps.map(step => `<li>${cleanInstructionText(step)}</li>`).join('')}
            </ol>
          `).join('')}
          
          <h2>NUTRITION</h2>
          <p style="font-size: 12px; color: #777;">Pour 100g</p>
          <ul>
            <li><strong>Calories:</strong> ${recipe.valeurs_nutritionnelles.calories}</li>
            <li><strong>Protéines:</strong> ${recipe.valeurs_nutritionnelles.proteines}</li>
            <li><strong>Glucides:</strong> ${recipe.valeurs_nutritionnelles.glucides}</li>
            <li><strong>Lipides:</strong> ${recipe.valeurs_nutritionnelles.lipides}</li>
            <li><strong>Fibres:</strong> ${recipe.valeurs_nutritionnelles.fibres}</li>
          </ul>
          
          <p class="footer">Cette recette a été générée par Chef Frigo</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  } else {
    window.print();
  }
  
  return Promise.resolve();
};
