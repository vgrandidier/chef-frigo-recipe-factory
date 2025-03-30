import { useLocation, useNavigate, useEffect, useState } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ActionIcons } from "@/components/ActionIcons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ImageIcon } from "lucide-react";

// Composant pour récupérer et afficher l'image via Mistral API
const RecipeImage = ({ title }) => {
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = 'bX7PSeGLmU5Qh6JYnvr2tzvESPhiORAH'; // Votre clé API

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.mistral.com/v1/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: title || 'Plat gastronomique',
            style: 'photo de recette de magazine culinaire',
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'image');
        }

        const data = await response.json();
        setImageBase64(data.imageBase64);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchImage();
    }
  }, [title, apiKey]);

  if (loading) {
    return (
      <div className="w-full h-56 md:h-80 bg-culinary-light/30 rounded-lg flex flex-col items-center justify-center">
        <div className="animate-pulse text-culinary-primary mb-2">
          <ImageIcon size={32} />
        </div>
        <p className="text-sm text-culinary-primary/70">Génération de l'image en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-40 bg-culinary-light/20 rounded-lg flex items-center justify-center">
        <p className="text-sm text-gray-500">Impossible de charger l'image</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg mb-4">
      {imageBase64 ? (
        <img 
          src={`data:image/png;base64,${imageBase64}`} 
          alt={title} 
          className="w-full object-cover rounded-lg"
          style={{ maxHeight: '400px' }}
        />
      ) : (
        <div className="w-full h-40 bg-culinary-light/20 rounded-lg flex items-center justify-center">
          <p className="text-sm text-gray-500">Aucune image disponible</p>
        </div>
      )}
    </div>
  );
};

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
}

const RecipeDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const isMobile = useIsMobile();
  const [openNutrition, setOpenNutrition] = useState(false);

  // Si pas de recette, redirection vers le formulaire
  if (!state || !state.recipe) {
    navigate("/");
    return null;
  }

  const { recipe } = state;

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
    <div className="min-h-screen gradient-bg py-4 px-3 md:py-6 md:px-4 print:p-0 print:bg-white">
      <div className="recipe-container print-friendly">
        <div className="flex justify-between items-center mb-4 md:mb-6 no-print">
          <Logo size="md" />
          <ActionIcons
            url={window.location.href}
            onPrint={handlePrint}
            onBack={handleBack}
          />
        </div>

        {/* Version d'impression uniquement visible lors de l'impression */}
        <div className="hidden print:block print-only mb-8">
          <Logo size="sm" className="mb-2" />
          <p className="text-sm text-gray-600">www.chef-frigo.com</p>
        </div>

        <Card className="card-elevation border-culinary-primary/20 mb-6 md:mb-8 print:shadow-none print:border-none">
          {/* Affichage de l'image Mistral en haut de la carte */}
          <div className="px-4 pt-4 md:px-6 md:pt-6">
            <RecipeImage title={recipe.titre} />
          </div>
          
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xl md:text-3xl font-display text-culinary-dark">
              {recipe.titre}
            </CardTitle>
            <CardDescription className="text-sm md:text-base mt-1 md:mt-2">
              {recipe.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="bg-culinary-light/50 rounded-md px-3 py-1.5 flex items-center text-xs md:text-sm">
                <span className="font-medium">Préparation: </span>
                <span className="ml-1">{recipe.temps_preparation}</span>
              </div>
              <div className="bg-culinary-light/50 rounded-md px-3 py-1.5 flex items-center text-xs md:text-sm">
                <span className="font-medium">Total: </span>
                <span className="ml-1">{recipe.temps_total}</span>
              </div>
              <div className="bg-culinary-light/50 rounded-md px-3 py-1.5 flex items-center text-xs md:text-sm">
                <span className="font-medium mr-1">Nutri-Score: </span>
                <Badge
                  className={`${getNutriScoreBadge(
                    recipe.nutriscore
                  )} text-white`}
                >
                  {recipe.nutriscore}
                </Badge>
              </div>
            </div>

            {isMobile ? (
              // Vue mobile avec sections collapsibles
              <div className="space-y-4">
                {/* Section ingrédients */}
                <Collapsible className="border rounded-md overflow-hidden">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-3 bg-culinary-light/20">
                    <h3 className="text-md font-medium text-culinary-primary">
                      Ingrédients
                    </h3>
                    <ChevronDown className="h-4 w-4 text-culinary-primary collapsible-icon" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-3 text-sm">
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li
                          key={`ingredient-${index}`}
                          className="flex justify-between pb-1 border-b border-dashed border-culinary-primary/20"
                        >
                          <span>{ingredient.nom}</span>
                          <span className="font-medium">
                            {ingredient.quantite}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                {/* Section ustensiles */}
                <Collapsible className="border rounded-md overflow-hidden">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-3 bg-culinary-light/20">
                    <h3 className="text-md font-medium text-culinary-primary">
                      Ustensiles
                    </h3>
                    <ChevronDown className="h-4 w-4 text-culinary-primary collapsible-icon" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-3 text-sm">
                    <ul className="space-y-1">
                      {recipe.ustensiles.map((ustensile, index) => (
                        <li
                          key={`ustensile-${index}`}
                          className="flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-culinary-primary"></span>
                          <span>{ustensile.nom}</span>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                {/* Section valeurs nutritionnelles */}
                <Collapsible
                  className="border rounded-md overflow-hidden"
                  open={openNutrition}
                  onOpenChange={setOpenNutrition}
                >
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-3 bg-culinary-light/20">
                    <h3 className="text-md font-medium text-culinary-primary">
                      Valeurs Nutritionnelles
                    </h3>
                    {openNutrition ? (
                      <ChevronUp className="h-4 w-4 text-culinary-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-culinary-primary" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-3 text-sm">
                    <p className="text-xs text-gray-500 mb-2">Pour 100g</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.calories}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protéines:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.proteines}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Glucides:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.glucides}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lipides:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.lipides}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fibres:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.fibres}
                        </span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Section instructions */}
                <div className="border rounded-md overflow-hidden">
                  <div className="p-3 bg-culinary-light/20">
                    <h3 className="text-md font-medium text-culinary-primary">
                      Instructions
                    </h3>
                  </div>
                  <div className="p-3">
                    {Object.entries(recipe.instructions).map(
                      ([category, steps], categoryIndex) => (
                        <div key={`cat-${categoryIndex}`} className="mb-4">
                          <h4 className="font-medium text-culinary-secondary mb-2">
                            {category}
                          </h4>
                          <ol className="space-y-3">
                            {steps.map((step, stepIndex) => (
                              <li
                                key={`step-${categoryIndex}-${stepIndex}`}
                                className="text-sm"
                              >
                                <div className="flex">
                                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-culinary-accent/30 text-culinary-dark mr-2">
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
                  </div>
                </div>
              </div>
            ) : (
              // Vue desktop (inchangée)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-culinary-primary">
                    Ingrédients
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={`ingredient-${index}`}
                        className="flex justify-between pb-1 border-b border-dashed border-culinary-primary/20"
                      >
                        <span>{ingredient.nom}</span>
                        <span className="font-medium">
                          {ingredient.quantite}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-medium mb-2 mt-6 text-culinary-primary">
                    Ustensiles
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {recipe.ustensiles.map((ustensile, index) => (
                      <li
                        key={`ustensile-${index}`}
                        className="flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-culinary-primary"></span>
                        <span>{ustensile.nom}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-4 bg-culinary-light/50 rounded-md">
                    <h3 className="text-lg font-medium mb-2 text-culinary-primary">
                      Valeurs Nutritionnelles
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Pour 100g</p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.calories}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protéines:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.proteines}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Glucides:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.glucides}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lipides:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.lipides}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fibres:</span>
                        <span className="font-medium">
                          {recipe.valeurs_nutritionnelles.fibres}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 text-culinary-primary">
                    Instructions
                  </h3>
                  <ScrollArea className="h-[500px] pr-4 print:h-auto">
                    {Object.entries(recipe.instructions).map(
                      ([category, steps], categoryIndex) => (
                        <div key={`cat-${categoryIndex}`} className="mb-6">
                          <h4 className="font-medium text-culinary-secondary mb-2">
                            {category}
                          </h4>
                          <ol className="space-y-3">
                            {steps.map((step, stepIndex) => (
                              <li
                                key={`step-${categoryIndex}-${stepIndex}`}
                                className="text-sm"
                              >
                                <div className="flex">
                                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-culinary-accent/30 text-culinary-dark mr-3">
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
                  </ScrollArea>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 no-print">
          Une création de Chef Frigo - Régalez-vous !
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;