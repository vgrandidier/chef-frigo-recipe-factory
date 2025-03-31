
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Clock, Award, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNavigation } from "@/components/MobileNavigation";

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

interface LocationState {
  recipe: Recipe;
  recipeImage: string;
}

const RecipeDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [favorited, setFavorited] = useState(false);

  // Si pas de recette, redirection vers le formulaire
  if (!state || !state.recipe) {
    navigate("/");
    return null;
  }

  const { recipe, recipeImage } = state;

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate("/");
  };

  // Badge variant selon le Nutri-Score
  const getNutriScoreBadge = (score: string) => {
    const scoreMap: Record<string, string> = {
      A: "bg-green-500",
      B: "bg-green-300",
      C: "bg-yellow-300",
      D: "bg-orange-400",
      E: "bg-red-500",
    };

    const firstChar = score.charAt(0).toUpperCase();
    return scoreMap[firstChar] || "bg-gray-400";
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header no-print">
        <button onClick={handleBack} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium truncate max-w-[200px]">
          {recipe.titre}
        </h1>
        <button onClick={handlePrint} className="p-1">
          <Share2 size={20} />
        </button>
      </div>

      <div className="mobile-content">
        {/* Image de la recette */}
        <div className="relative h-60 w-full">
          <img 
            src={recipeImage} 
            alt={recipe.titre} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h1 className="text-white text-2xl font-semibold">{recipe.titre}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-white text-black text-xs px-2">
                {recipe.nutriscore}
              </Badge>
              <span className="text-white text-xs">4.8 ★★★★★</span>
            </div>
          </div>
          <button 
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full"
            onClick={() => setFavorited(!favorited)}
          >
            <Heart 
              size={20} 
              className={favorited ? "fill-red-500 text-red-500" : "text-white"} 
            />
          </button>
        </div>

        {/* Informations clés */}
        <div className="flex justify-between px-4 py-3 border-b">
          <div className="flex flex-col items-center">
            <Clock size={16} className="mb-1 text-gray-600" />
            <span className="text-xs font-medium">Préparation</span>
            <span className="text-sm">{recipe.temps_preparation}</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock size={16} className="mb-1 text-gray-600" />
            <span className="text-xs font-medium">Total</span>
            <span className="text-sm">{recipe.temps_total}</span>
          </div>
          <div className="flex flex-col items-center">
            <Award size={16} className="mb-1 text-gray-600" />
            <span className="text-xs font-medium">Nutri-Score</span>
            <Badge className={`${getNutriScoreBadge(recipe.nutriscore)} text-white text-xs`}>
              {recipe.nutriscore}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="mobile-tabs">
            <TabsTrigger value="ingredients" className="mobile-tab">
              Ingrédients
            </TabsTrigger>
            <TabsTrigger value="preparation" className="mobile-tab">
              Préparation
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="mobile-tab">
              Nutrition
            </TabsTrigger>
          </TabsList>
          
          {/* Contenu des tabs */}
          <div className="p-4">
            {/* Tab Ingrédients */}
            <TabsContent value="ingredients" className="mt-0 space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Ingrédients</h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={`ingredient-${index}`}
                      className="flex justify-between items-center pb-2 border-b border-gray-100"
                    >
                      <span>{ingredient.nom}</span>
                      <span className="font-medium text-sm text-gray-700">
                        {ingredient.quantite}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Ustensiles</h3>
                <div className="grid grid-cols-2 gap-2">
                  {recipe.ustensiles.map((ustensile, index) => (
                    <div
                      key={`ustensile-${index}`}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl p-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-sm">{ustensile.nom}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Tab Préparation */}
            <TabsContent value="preparation" className="mt-0">
              <h3 className="text-lg font-medium mb-3">Instructions</h3>
              {Object.entries(recipe.instructions).map(
                ([category, steps], categoryIndex) => (
                  <div key={`cat-${categoryIndex}`} className="mb-6">
                    <h4 className="font-medium text-primary mb-3">
                      {category}
                    </h4>
                    <ol className="space-y-4">
                      {steps.map((step, stepIndex) => (
                        <li
                          key={`step-${categoryIndex}-${stepIndex}`}
                          className="text-sm"
                        >
                          <div className="flex">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-3">
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              )}
            </TabsContent>
            
            {/* Tab Nutrition */}
            <TabsContent value="nutrition" className="mt-0">
              <h3 className="text-lg font-medium mb-3">Valeurs Nutritionnelles</h3>
              <p className="text-xs text-gray-500 mb-4">Pour 100g</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium">Calories</span>
                  <span>{recipe.valeurs_nutritionnelles.calories}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium">Protéines</span>
                  <span>{recipe.valeurs_nutritionnelles.proteines}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium">Glucides</span>
                  <span>{recipe.valeurs_nutritionnelles.glucides}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium">Lipides</span>
                  <span>{recipe.valeurs_nutritionnelles.lipides}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium">Fibres</span>
                  <span>{recipe.valeurs_nutritionnelles.fibres}</span>
                </div>
                
                <div className="mt-6 flex items-center justify-center">
                  <span className="text-sm mr-2">Nutri-Score:</span>
                  <Badge className={`${getNutriScoreBadge(recipe.nutriscore)} text-white px-3 py-1`}>
                    {recipe.nutriscore}
                  </Badge>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default RecipeDisplay;
