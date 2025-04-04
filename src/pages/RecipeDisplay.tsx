
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Logo } from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import { RecipeInfo } from "@/components/RecipeInfo";
import { RecipeIngredients } from "@/components/RecipeIngredients";
import { RecipeInstructions } from "@/components/RecipeInstructions";
import { RecipeNutrition } from "@/components/RecipeNutrition";
import { ActionIcons } from "@/components/ActionIcons";
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
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  if (!state || !state.recipe) {
    navigate("/");
    return null;
  }

  const { recipe, recipeImage } = state;

  const handlePrint = async () => {
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

  const handleEmailShare = async () => {
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

  const handleWhatsappShare = async () => {
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
          // Create a virtual button to hold our share options
          const virtualShareButton = document.createElement('button');
          virtualShareButton.style.display = 'none';
          document.body.appendChild(virtualShareButton);
          
          // Create and show the ActionIcons popover
          const shareIcons = document.createElement('div');
          document.body.appendChild(shareIcons);
          
          const actionIconsProps = {
            url: window.location.href,
            onPrint: handlePrint,
            onEmailShare: handleEmailShare,
            onWhatsappShare: handleWhatsappShare
          };
          
          const handleClickOutside = (e: MouseEvent) => {
            document.body.removeChild(shareIcons);
            document.body.removeChild(virtualShareButton);
            document.removeEventListener('click', handleClickOutside);
          };
          
          // Show the share options modal/popup
          // We'll use the existing popover mechanism from ActionIcons
          const rect = document.querySelector('.mobile-nav')?.getBoundingClientRect();
          if (rect) {
            shareIcons.style.position = 'fixed';
            shareIcons.style.bottom = `${window.innerHeight - rect.top + 10}px`;
            shareIcons.style.left = '50%';
            shareIcons.style.transform = 'translateX(-50%)';
            shareIcons.style.zIndex = '1000';
            
            // Create a custom popover
            const popover = document.createElement('div');
            popover.className = 'bg-white shadow-lg rounded-md p-3 border border-gray-200';
            shareIcons.appendChild(popover);
            
            // Add the share options
            const addOption = (label: string, icon: string, onClick: () => void) => {
              const button = document.createElement('button');
              button.className = 'flex items-center gap-2 w-full text-left py-2 px-3 rounded-md hover:bg-gray-100';
              button.innerHTML = `${icon} <span>${label}</span>`;
              button.addEventListener('click', (e) => {
                e.stopPropagation();
                onClick();
                handleClickOutside(e);
              });
              popover.appendChild(button);
            };
            
            const emailIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>';
            const whatsappIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 13.34c0 4.97-4.5 9-10 9a9.8 9.8 0 0 1-5.3-1.5L2 22l1.3-3.9A8.94 8.94 0 0 1 2 13.34C2 8.38 6.5 4.35 12 4.35c5.5 0 9 4.03 9 9ZM9.5 7.84v8.33M14.5 7.84v8.33M8 12.84h8" /></svg>';
            const printIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>';
            
            addOption('Email', emailIcon, handleEmailShare);
            addOption('WhatsApp', whatsappIcon, handleWhatsappShare);
            addOption('Imprimer', printIcon, handlePrint);
            
            // Close when clicking outside
            setTimeout(() => {
              document.addEventListener('click', handleClickOutside);
            }, 0);
          }
        }}
      />
    </div>
  );
};

export default RecipeDisplay;
