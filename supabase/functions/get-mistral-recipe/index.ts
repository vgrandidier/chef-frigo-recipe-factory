
// Import nécessaire pour que Deno puisse utiliser fetch dans l'environnement edge function
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Headers CORS pour permettre les requêtes depuis notre frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Edge function appelée - méthode:", req.method);
  
  // Gestion des requêtes OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log("Traitement d'une requête OPTIONS (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupération de la clé API depuis les variables d'environnement
    const apiKey = Deno.env.get("MISTRAL_API_KEY");
    
    if (!apiKey) {
      console.error("Clé API Mistral non configurée sur le serveur.");
      throw new Error("Clé API Mistral non configurée sur le serveur.");
    }

    console.log("Analyse du corps de la requête");
    
    // Récupération des paramètres depuis le corps de la requête
    const requestBody = await req.json().catch(err => {
      console.error("Erreur lors de l'analyse du JSON:", err);
      return null;
    });
    
    if (!requestBody) {
      console.error("Corps de requête invalide ou vide");
      return new Response(
        JSON.stringify({ error: "Corps de requête invalide" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { cuisineType, ingredients, additionalPrompt, nombreCouverts = 4, cookingType = "Cuisine traditionnelle", dishType = "Plat" } = requestBody;

    // Validation des paramètres
    if (!cuisineType || !ingredients || !Array.isArray(ingredients)) {
      console.error("Paramètres invalides:", { cuisineType, ingredients });
      return new Response(
        JSON.stringify({ error: "Paramètres invalides" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Traitement de la requête avec les paramètres:", { cuisineType, ingredients, additionalPrompt, nombreCouverts, cookingType, dishType });
    console.log("Clé API Mistral vérifiée:", apiKey ? "présente" : "absente");

    // Construction du prompt avec le type de cuisson
    let cookingTypePrompt = "";
    if (cookingType && cookingType !== "Cuisine traditionnelle") {
      cookingTypePrompt = `Je veux préparer cette recette en utilisant un "${cookingType}". `;
    }

    // Construction du prompt avec le type de plat
    const dishTypePrompt = `Je veux préparer un(e) "${dishType}". `;

    // Construction du prompt
    const prompt = `Je voudrais une recette de type ${cuisineType} avec ${ingredients.join(
      ", "
    )} pour ${nombreCouverts} personnes. ${dishTypePrompt}${cookingTypePrompt}${additionalPrompt}En retour, je veux un titre, une description, la liste des ustensiles nécessaires, la liste complète des ingrédients avec les quantités, les valeurs nutritionnelles pour 100g (kcal, protéines, glucides, lipides, fibres), le Nutri-Score, le temps de préparation, le temps total, et les instructions pour la réalisation de la recette par étape. Les instructions doivent être regroupées par type de travail (préparation, cuisson, montage, etc.), et chaque groupe doit avoir un titre. Formate le résultat en JSON avec la structure suivante :
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
      "nombre_couverts": ${nombreCouverts},
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

    console.log("Envoi de la requête à l'API Mistral...");
    
    // Appel à l'API Mistral avec gestion d'erreur améliorée
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      console.log("Statut de la réponse Mistral:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Erreur API Mistral:", errorData || response.statusText);
        throw new Error(`Erreur API Mistral: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Réponse reçue de Mistral API - premier caractère:", data.choices[0].message.content.substring(0, 50) + "...");
      
      const rawResponse = data.choices[0].message.content;
      
      // Extraction du JSON de la réponse
      const jsonMatch = rawResponse.match(/(\{.*\})/s);
      if (!jsonMatch) {
        console.error("Pas de JSON valide trouvé dans la réponse:", rawResponse.substring(0, 100) + "...");
        throw new SyntaxError("Pas de JSON valide trouvé dans la réponse.");
      }

      console.log("JSON extrait avec succès, envoi au frontend");
      
      // Retour de la réponse au frontend
      return new Response(
        JSON.stringify({ recipe: jsonMatch[0] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error("Erreur lors de l'appel à l'API Mistral:", fetchError.message);
      throw fetchError;
    }
  } catch (error) {
    console.error("Erreur dans l'edge function:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
