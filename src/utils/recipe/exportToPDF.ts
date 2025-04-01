
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Recipe } from './types';

// Exporte la recette en PDF
export const exportToPDF = async (
  recipe: Recipe,
  recipeImage: string
): Promise<Blob> => {
  const tempElement = document.createElement("div");
  tempElement.className = "pdf-container";
  tempElement.style.padding = "20px";
  tempElement.style.maxWidth = "600px";
  tempElement.style.margin = "0 auto";
  tempElement.style.fontFamily = "Arial, sans-serif";
  
  tempElement.innerHTML = `
    <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">${recipe.titre}</h1>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #f7f7f7; padding: 15px; border-radius: 8px;">
      <div style="text-align: center;">
        <p style="font-weight: bold; margin: 0; color: #555;">Préparation</p>
        <p style="margin: 0; color: #333;">${recipe.temps_preparation}</p>
      </div>
      <div style="text-align: center;">
        <p style="font-weight: bold; margin: 0; color: #555;">Total</p>
        <p style="margin: 0; color: #333;">${recipe.temps_total}</p>
      </div>
      <div style="text-align: center;">
        <p style="font-weight: bold; margin: 0; color: #555;">Nutriscore</p>
        <p style="margin: 0; color: #333;">${recipe.nutriscore}</p>
      </div>
    </div>
    
    <h2 style="color: #9b87f5; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #9b87f5; padding-bottom: 5px;">INGRÉDIENTS</h2>
    <ul style="padding-left: 20px;">
      ${recipe.ingredients.map(ing => `<li><span style="font-weight: bold;">${ing.nom}:</span> ${ing.quantite}</li>`).join('')}
    </ul>
    
    <h3 style="color: #333; font-size: 18px; margin-top: 20px;">Ustensiles</h3>
    <ul style="padding-left: 20px;">
      ${recipe.ustensiles.map(ust => `<li>${ust.nom}</li>`).join('')}
    </ul>
    
    <h2 style="color: #9b87f5; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #9b87f5; padding-bottom: 5px;">PRÉPARATION</h2>
    ${Object.entries(recipe.instructions).map(([category, steps]) => `
      <h3 style="color: #555; font-size: 18px; margin-top: 15px;">${category}</h3>
      <ol style="padding-left: 20px;">
        ${steps.map(step => `<li style="margin-bottom: 10px;">${step}</li>`).join('')}
      </ol>
    `).join('')}
    
    <h2 style="color: #9b87f5; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #9b87f5; padding-bottom: 5px;">NUTRITION</h2>
    <p style="font-size: 12px; color: #777; margin-bottom: 10px;">Pour 100g</p>
    <ul style="padding-left: 20px;">
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Calories:</span> ${recipe.valeurs_nutritionnelles.calories}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Protéines:</span> ${recipe.valeurs_nutritionnelles.proteines}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Glucides:</span> ${recipe.valeurs_nutritionnelles.glucides}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Lipides:</span> ${recipe.valeurs_nutritionnelles.lipides}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Fibres:</span> ${recipe.valeurs_nutritionnelles.fibres}</li>
    </ul>
    
    <p style="text-align: center; margin-top: 30px; color: #777; font-size: 12px; font-style: italic;">Cette recette a été générée par Chef Frigo</p>
  `;
  
  document.body.appendChild(tempElement);
  
  try {
    const canvas = await html2canvas(tempElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
    
    return pdf.output('blob');
  } finally {
    document.body.removeChild(tempElement);
  }
};
