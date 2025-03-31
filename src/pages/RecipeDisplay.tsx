import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Share2, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Logo } from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NutriScore from "@/components/NutriScore";

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
  const { toast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);

  if (!state || !state.recipe) {
    navigate("/");
    return null;
  }

  const { recipe, recipeImage } = state;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papier.",
        duration: 3000,
      });
      setShareOpen(false);
    });
  };

  const shareViaEmail = () => {
    const url = window.location.href;
    window.open(
      `mailto:?subject=Une recette pour toi de ChefFrigo&body=Regarde cette recette que j'ai trouvée: ${url}`
    );
    setShareOpen(false);
  };

  const shareViaWhatsapp = () => {
    const url = window.location.href;
    window.open(
      `https://api.whatsapp.com/send?text=Regarde cette recette que j'ai trouvée: ${url}`
    );
    setShareOpen(false);
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header no-print">
        <Logo size="sm" />
      </div>

      <div className="mobile-content">
        <div className="relative h-60 w-full">
          <img
            src={recipeImage}
            alt={recipe.titre}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h1 className="text-white text-2xl font-semibold">
              {recipe.titre}
            </h1>
          </div>
        </div>

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
            <span className="text-xs font-medium">Nutriscore</span>
            <div className="mt-1">
              <NutriScore score={recipe.nutriscore} size="sm" />
            </div>
          </div>
        </div>

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

          <div className="p-4">
            <TabsContent value="ingredients" className="mt-0 space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Ingrédients</h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={`ingredient-${index}`}
                      className="flex justify-between items-center pb-2 border-b border-gray-100"
                    >
                      <span className="text-sm">{ingredient.nom}</span>
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

            <TabsContent value="preparation" className="mt-0">
              <h3 className="text-lg font-medium mb-3">Instructions</h3>
              {Object.entries(recipe.instructions).map(
                ([category, steps], categoryIndex) => (
                  <div key={`cat-${categoryIndex}`} className="mb-6">
                    <h4 className="font-medium text-primary mb-3 text-sm">
                      {category}
                    </h4>
                    <ol className="space-y-4">
                      {steps.map((step, stepIndex) => (
                        <li
                          key={`step-${categoryIndex}-${stepIndex}`}
                          className="text-sm"
                        >
                          <div className="flex">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-3 text-xs">
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

            <TabsContent value="nutrition" className="mt-0">
              <h3 className="text-lg font-medium mb-3">
                Valeurs Nutritionnelles
              </h3>

              <p className="text-xs text-gray-500 mb-4">Pour 100g</p>

              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-sm">Calories</span>
                  <span className="text-sm">
                    {recipe.valeurs_nutritionnelles.calories}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-sm">Protéines</span>
                  <span className="text-sm">
                    {recipe.valeurs_nutritionnelles.proteines}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-sm">Glucides</span>
                  <span className="text-sm">
                    {recipe.valeurs_nutritionnelles.glucides}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-sm">Lipides</span>
                  <span className="text-sm">
                    {recipe.valeurs_nutritionnelles.lipides}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-sm">Fibres</span>
                  <span className="text-sm">
                    {recipe.valeurs_nutritionnelles.fibres}
                  </span>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <Popover open={shareOpen} onOpenChange={setShareOpen}>
        <PopoverContent className="w-56 p-2" align="center">
          <div className="grid gap-2">
            <Button
              onClick={shareViaEmail}
              variant="outline"
              className="justify-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </Button>
            <Button
              onClick={shareViaWhatsapp}
              variant="outline"
              className="justify-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21 13.34c0 4.97-4.5 9-10 9a9.8 9.8 0 0 1-5.3-1.5L2 22l1.3-3.9A8.94 8.94 0 0 1 2 13.34C2 8.38 6.5 4.35 12 4.35c5.5 0 9 4.03 9 9ZM9.5 7.84v8.33M14.5 7.84v8.33M8 12.84h8" />
              </svg>
              WhatsApp
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="justify-start"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Copier le lien
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="justify-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect width="12" height="8" x="6" y="14" />
              </svg>
              Imprimer
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <MobileNavigation showShareButton={true} onShare={handleShare} />
    </div>
  );
};

export default RecipeDisplay;
