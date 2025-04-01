
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Logo } from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import NutriScore from "@/components/NutriScore";
import { 
  shareRecipe,
  Recipe as RecipeType
} from "@/utils/recipe";

interface LocationState {
  recipe: RecipeType;
  recipeImage: string;
}

const RecipeDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  if (!state || !state.recipe) {
    navigate("/");
    return null;
  }

  const { recipe, recipeImage } = state;

  const handleShare = () => {
    // Cette fonction est maintenant gérée par le composant MobileNavigation
  };

  const handlePrint = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await shareRecipe(recipe, recipeImage, 'print');
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer la recette. Veuillez réessayer.",
        duration: 3000,
      });
    }
  };

  const shareViaEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsSharing(true);
      await shareRecipe(recipe, recipeImage, 'email');
    } catch (error) {
      console.error("Erreur lors du partage par email:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager par email. Veuillez réessayer.",
        duration: 3000,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const shareViaWhatsapp = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsSharing(true);
      await shareRecipe(recipe, recipeImage, 'whatsapp');
    } catch (error) {
      console.error("Erreur lors du partage WhatsApp:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager via WhatsApp. Veuillez réessayer.",
        duration: 3000,
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Fonction pour nettoyer les instructions en supprimant les "Étape x : " au début
  const cleanInstructionText = (step: string): string => {
    return step.replace(/^Étape\s+\d+\s*:\s*/i, '');
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
                            <span>{cleanInstructionText(step)}</span>
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

      <MobileNavigation 
        showShareButton={true} 
        onShare={() => {
          const shareOptions = [
            { 
              label: "Email",
              action: (e: any) => shareViaEmail(e)
            },
            {
              label: "WhatsApp",
              action: (e: any) => shareViaWhatsapp(e)
            },
            {
              label: "Imprimer",
              action: (e: any) => handlePrint(e)
            }
          ];
          
          // Ici, vous pourriez utiliser un gestionnaire d'état global ou un service
          // pour montrer une boîte de dialogue avec ces options
          // Pour l'instant, nous utilisons la navigation mobile existante
        }}
      />
    </div>
  );
};

export default RecipeDisplay;
