
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface RecipeIngredient {
  nom: string;
  quantite: string;
}

interface RecipeUstensil {
  nom: string;
}

interface RecipeNutritionalValues {
  calories: string;
  proteines: string;
  glucides: string;
  lipides: string;
  fibres: string;
}

interface Recipe {
  titre: string;
  description: string;
  ustensiles: RecipeUstensil[];
  ingredients: RecipeIngredient[];
  valeurs_nutritionnelles: RecipeNutritionalValues;
  nutriscore: string;
  temps_preparation: string;
  temps_total: string;
  instructions: Record<string, string[]>;
}

// Format le texte de la recette pour le partage
export const formatRecipeText = (recipe: Recipe): string => {
  let recipeText = `CHEF FRIGO\n\n`;
  
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
      recipeText += `${index + 1}. ${step}\n`;
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
  
  return recipeText;
};

// Exporte la recette en PDF
export const exportToPDF = async (
  recipe: Recipe,
  recipeImage: string
): Promise<Blob> => {
  // Créer un élément temporaire pour rendre la recette
  const tempElement = document.createElement("div");
  tempElement.className = "pdf-container";
  tempElement.style.padding = "20px";
  tempElement.style.maxWidth = "600px";
  tempElement.style.margin = "0 auto";
  tempElement.style.fontFamily = "Arial, sans-serif";
  
  tempElement.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <div style="width: 32px; height: 32px; background-color: #6200ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">C</div>
        <h1 style="margin: 0; color: #333; font-size: 28px;"><span style="color: #6200ee;">Chef</span><span style="color: #555;">Frigo</span></h1>
      </div>
    </div>

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
    
    <h2 style="color: #6200ee; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #6200ee; padding-bottom: 5px;">INGRÉDIENTS</h2>
    <ul style="padding-left: 20px;">
      ${recipe.ingredients.map(ing => `<li><span style="font-weight: bold;">${ing.nom}:</span> ${ing.quantite}</li>`).join('')}
    </ul>
    
    <h3 style="color: #333; font-size: 18px; margin-top: 20px;">Ustensiles</h3>
    <ul style="padding-left: 20px;">
      ${recipe.ustensiles.map(ust => `<li>${ust.nom}</li>`).join('')}
    </ul>
    
    <h2 style="color: #6200ee; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #6200ee; padding-bottom: 5px;">PRÉPARATION</h2>
    ${Object.entries(recipe.instructions).map(([category, steps]) => `
      <h3 style="color: #555; font-size: 18px; margin-top: 15px;">${category}</h3>
      <ol style="padding-left: 20px;">
        ${steps.map(step => `<li style="margin-bottom: 10px;">${step}</li>`).join('')}
      </ol>
    `).join('')}
    
    <h2 style="color: #6200ee; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #6200ee; padding-bottom: 5px;">NUTRITION</h2>
    <p style="font-size: 12px; color: #777; margin-bottom: 10px;">Pour 100g</p>
    <ul style="padding-left: 20px;">
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Calories:</span> ${recipe.valeurs_nutritionnelles.calories}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Protéines:</span> ${recipe.valeurs_nutritionnelles.proteines}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Glucides:</span> ${recipe.valeurs_nutritionnelles.glucides}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Lipides:</span> ${recipe.valeurs_nutritionnelles.lipides}</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold; display: inline-block; width: 100px;">Fibres:</span> ${recipe.valeurs_nutritionnelles.fibres}</li>
    </ul>
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
    
    // Ajouter le contenu principal sans l'image de la recette
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
    
    return pdf.output('blob');
  } finally {
    document.body.removeChild(tempElement);
  }
};

// Ajoute la déclaration pour Google Picker API
declare global {
  interface Window {
    google?: {
      picker?: any;
    };
  }
}

// Partage la recette via l'API Web Share si disponible
export const shareRecipe = async (
  recipe: Recipe,
  recipeImage: string,
  method: 'email' | 'whatsapp' | 'pdf' | 'gdrive' | 'print'
): Promise<void> => {
  const recipeText = formatRecipeText(recipe);
  
  switch (method) {
    case 'print':
      // Création d'une fenêtre d'impression temporaire avec un style adapté
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ChefFrigo - ${recipe.titre}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; margin-bottom: 20px; }
                h2 { margin-top: 30px; color: #6200ee; border-bottom: 2px solid #6200ee; padding-bottom: 5px; }
                .logo { text-align: center; margin-bottom: 30px; }
                .logo-text { font-size: 24px; }
                .logo-text span:first-child { color: #6200ee; }
                .logo-text span:last-child { color: #555; }
                .info-bar { display: flex; justify-content: space-between; background-color: #f7f7f7; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
                .info-item { text-align: center; }
                .info-item p:first-child { font-weight: bold; margin: 0; color: #555; }
                ul, ol { padding-left: 20px; }
                li { margin-bottom: 8px; }
              </style>
            </head>
            <body>
              <div class="logo">
                <div class="logo-text">
                  <span>Chef</span><span>Frigo</span>
                </div>
              </div>
              
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
                  ${steps.map(step => `<li>${step}</li>`).join('')}
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
      break;
      
    case 'email':
      window.open(`mailto:?subject=${encodeURIComponent(`Recette: ${recipe.titre}`)}&body=${encodeURIComponent(recipeText)}`);
      break;
      
    case 'whatsapp':
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${recipeText}`)}`);
      break;
      
    case 'pdf':
      const pdfBlob = await exportToPDF(recipe, recipeImage);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Créer un lien pour télécharger le PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `recette-${recipe.titre.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
      break;
      
    case 'gdrive':
      try {
        const pdfBlob = await exportToPDF(recipe, recipeImage);
        
        // Vérifier si Google Drive API est chargée
        if (!window.google || !window.google.picker) {
          alert("Impossible de se connecter à Google Drive. Veuillez essayer l'option de téléchargement PDF.");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
          // Proposer le téléchargement direct
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `recette-${recipe.titre.toLowerCase().replace(/\s+/g, '-')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
          return;
        }
        
        // Interface simplifiée pour Google Drive (nécessite généralement une configuration avancée)
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(`https://drive.google.com/`, '_blank');
        alert("Veuillez télécharger le PDF puis l'importer manuellement dans Google Drive");
        
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `recette-${recipe.titre.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
      } catch (error) {
        console.error("Erreur lors du partage vers Google Drive:", error);
        alert("Une erreur est survenue lors du partage vers Google Drive. Veuillez essayer l'option de téléchargement PDF.");
      }
      break;
      
    default:
      console.error("Méthode de partage non prise en charge");
  }
};
