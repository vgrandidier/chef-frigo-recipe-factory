
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Logo } from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import { RecipeInfo } from "@/components/RecipeInfo";
import { RecipeIngredients } from "@/components/RecipeIngredients";
import { RecipeInstructions } from "@/components/RecipeInstructions";
import { RecipeNutrition } from "@/components/RecipeNutrition";
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

        <RecipeInfo recipe={recipe} />

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
              <RecipeIngredients recipe={recipe} />
            </TabsContent>

            <TabsContent value="preparation" className="mt-0">
              <RecipeInstructions recipe={recipe} cleanInstructionText={cleanInstructionText} />
            </TabsContent>

            <TabsContent value="nutrition" className="mt-0">
              <RecipeNutrition recipe={recipe} />
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
