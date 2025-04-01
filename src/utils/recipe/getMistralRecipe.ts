
import { supabase } from "@/integrations/supabase/client";

interface MistralRequestParams {
  cuisineType: string;
  ingredients: string[];
  additionalPrompt: string;
}

export const getMistralRecipe = async (
  params: MistralRequestParams
): Promise<string> => {
  const { cuisineType, ingredients, additionalPrompt } = params;
  
  try {
    console.log("Préparation de l'appel à l'edge function avec les paramètres:", { cuisineType, ingredients });
    
    // Utilisation d'un timeout plus long pour l'appel à l'edge function
    const { data, error } = await supabase.functions.invoke('get-mistral-recipe', {
      body: {
        cuisineType,
        ingredients,
        additionalPrompt
      },
      // Ajout d'un délai d'attente de 120 secondes
      options: {
        timeout: 120000
      }
    });

    if (error) {
      console.error("Erreur lors de l'appel à l'edge function:", error);
      throw new Error(`Erreur lors de la génération de la recette: ${error.message}`);
    }

    if (!data || !data.recipe) {
      console.error("Format de réponse invalide de l'edge function:", data);
      throw new Error("Format de réponse invalide de l'edge function");
    }

    console.log("Réponse reçue de l'edge function:", data.recipe.substring(0, 50) + "...");
    return data.recipe;
  } catch (error: any) {
    console.error("Erreur lors de la requête:", error);
    throw error;
  }
};
