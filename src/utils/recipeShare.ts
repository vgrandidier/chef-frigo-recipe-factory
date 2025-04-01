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
  let recipeText = `Recette: ${recipe.titre}\n\n`;
  
  recipeText += `Description: ${recipe.description}\n\n`;
  
  recipeText += `Temps de préparation: ${recipe.temps_preparation}\n`;
  recipeText += `Temps total: ${recipe.temps_total}\n`;
  recipeText += `Nutriscore: ${recipe.nutriscore}\n\n`;
  
  recipeText += "Ingrédients:\n";
  recipe.ingredients.forEach(ing => {
    recipeText += `- ${ing.nom}: ${ing.quantite}\n`;
  });
  
  recipeText += "\nUstensiles:\n";
  recipe.ustensiles.forEach(ust => {
    recipeText += `- ${ust.nom}\n`;
  });
  
  recipeText += "\nInstructions:\n";
  Object.entries(recipe.instructions).forEach(([category, steps]) => {
    recipeText += `${category}:\n`;
    steps.forEach((step, index) => {
      recipeText += `${index + 1}. ${step}\n`;
    });
    recipeText += "\n";
  });
  
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
    <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">${recipe.titre}</h1>
    <p style="color: #666; margin-bottom: 20px;">${recipe.description}</p>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="text-align: center;">
        <p style="font-weight: bold; margin: 0;">Préparation</p>
        <p>${recipe.temps_preparation}</p>
      </div>
      <div style="text-align: center;">
        <p style="font-weight: bold; margin: 0;">Total</p>
        <p>${recipe.temps_total}</p>
      </div>
      <div style="text-align: center;">
        <p style="font-weight: bold; margin: 0;">Nutriscore</p>
        <p>${recipe.nutriscore}</p>
      </div>
    </div>
    
    <h2 style="color: #333; font-size: 18px; margin-top: 30px;">Ingrédients</h2>
    <ul style="padding-left: 20px;">
      ${recipe.ingredients.map(ing => `<li><span style="font-weight: bold;">${ing.nom}:</span> ${ing.quantite}</li>`).join('')}
    </ul>
    
    <h2 style="color: #333; font-size: 18px; margin-top: 30px;">Ustensiles</h2>
    <ul style="padding-left: 20px;">
      ${recipe.ustensiles.map(ust => `<li>${ust.nom}</li>`).join('')}
    </ul>
    
    <h2 style="color: #333; font-size: 18px; margin-top: 30px;">Instructions</h2>
    ${Object.entries(recipe.instructions).map(([category, steps]) => `
      <h3 style="color: #555; font-size: 16px;">${category}</h3>
      <ol style="padding-left: 20px;">
        ${steps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
      </ol>
    `).join('')}
    
    <h2 style="color: #333; font-size: 18px; margin-top: 30px;">Valeurs Nutritionnelles</h2>
    <p style="font-size: 12px; color: #777; margin-bottom: 10px;">Pour 100g</p>
    <ul style="padding-left: 20px;">
      <li><span style="font-weight: bold;">Calories:</span> ${recipe.valeurs_nutritionnelles.calories}</li>
      <li><span style="font-weight: bold;">Protéines:</span> ${recipe.valeurs_nutritionnelles.proteines}</li>
      <li><span style="font-weight: bold;">Glucides:</span> ${recipe.valeurs_nutritionnelles.glucides}</li>
      <li><span style="font-weight: bold;">Lipides:</span> ${recipe.valeurs_nutritionnelles.lipides}</li>
      <li><span style="font-weight: bold;">Fibres:</span> ${recipe.valeurs_nutritionnelles.fibres}</li>
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
    
    // Ajouter l'image de la recette
    if (recipeImage) {
      const img = new Image();
      img.src = recipeImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const imgWidth = 180;
      const imgHeight = (img.height * imgWidth) / img.width;
      pdf.addImage(recipeImage, 'JPEG', 15, 15, imgWidth, Math.min(imgHeight, 80));
      pdf.setFontSize(12);
      pdf.text("Recette générée par ChefFrigo", 15, Math.min(imgHeight, 80) + 25);
      pdf.addPage();
    }
    
    // Ajouter le contenu principal
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
) => {
  const recipeText = formatRecipeText(recipe);
  
  switch (method) {
    case 'print':
      window.print();
      break;
      
    case 'email':
      window.open(`mailto:?subject=${encodeURIComponent(`Recette: ${recipe.titre}`)}&body=${encodeURIComponent(recipeText)}`);
      break;
      
    case 'whatsapp':
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Recette: ${recipe.titre}\n\n${recipeText}`)}`);
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
