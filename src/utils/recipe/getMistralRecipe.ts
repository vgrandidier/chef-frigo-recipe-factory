
import axios from "axios";

interface MistralRequestParams {
  cuisineType: string;
  ingredients: string[];
  additionalPrompt: string;
}

export const getMistralRecipe = async (
  params: MistralRequestParams
): Promise<string> => {
  const { cuisineType, ingredients, additionalPrompt } = params;
  
  // Dans cette implémentation, l'API key est gérée par l'utilisateur dans le navigateur
  // ATTENTION: Cette implémentation n'est pas idéale du point de vue de la sécurité
  // L'idéal serait d'utiliser un backend avec Supabase ou un autre service
  const apiKey = localStorage.getItem("MISTRAL_API_KEY");
  
  if (!apiKey) {
    throw new Error("Clé API Mistral non configurée. Veuillez l'ajouter dans les paramètres.");
  }

  const prompt = `Je voudrais une recette de type ${cuisineType} avec ${ingredients.join(
    ", "
  )}. ${additionalPrompt}En retour, je veux un titre, une description, la liste des ustensiles nécessaires, la liste complète des ingrédients avec les quantités, les valeurs nutritionnelles pour 100g (kcal, protéines, glucides, lipides, fibres), le Nutri-Score, le temps de préparation, le temps total, et les instructions pour la réalisation de la recette par étape. Les instructions doivent être regroupées par type de travail (préparation, cuisson, montage, etc.), et chaque groupe doit avoir un titre. Formate le résultat en JSON avec la structure suivante :
    {
      "titre": "Nom de la recette",
      "description": "Description de la recette",
      "ustensiles": [
        {"nom": "Nom de l'ustensile"},
        ...
      ],
      "ingredients": [
        {"nom": "Nom de l'ingrédient", "quantite": "Quantité nécessaire"},
        ...
      ],
      "valeurs_nutritionnelles": {
        "calories": "Nombre de kcal pour 100g",
        "proteines": "Protéines en grammes pour 100g",
        "glucides": "Glucides en grammes pour 100g",
        "lipides": "Lipides en grammes pour 100g",
        "fibres": "Fibres en grammes pour 100g"
      },
      "nutriscore": "Valeur du Nutri-Score",
      "temps_preparation": "Intervalle de temps de préparation en minutes (ex: 20-25 minutes)",
      "temps_total": "Intervalle de temps total en minutes (ex: 35-40 minutes)",
      "instructions": {
        "Préparation": [
          "Étape 1 : Description de l'étape.",
          ...
        ],
        "Cuisson": [
          "Étape 1 : Description de l'étape.",
          ...
        ],
        "Montage": [
          "Étape 1 : Description de l'étape.",
          ...
        ],
        ...
      }
    }`;

  const response = await axios.post(
    "https://api.mistral.ai/v1/chat/completions",
    {
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  const rawResponse = response.data.choices[0].message.content;
  
  const jsonMatch = rawResponse.match(/(\{.*\})/s);
  if (!jsonMatch) {
    throw new SyntaxError("Pas de JSON valide trouvé dans la réponse.");
  }

  return jsonMatch[0];
};
