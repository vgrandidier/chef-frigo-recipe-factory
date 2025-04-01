import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Share2, Clock, Award, FileDown, Mail, Smartphone, Printer, HardDrive } from "lucide-react";
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
import { shareRecipe } from "@/utils/recipeShare";

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
  const [isSharing, setIsSharing] = useState(false);

  if (!state || !state.recipe) {
    navigate("/");
    return null;
  }

  const { recipe, recipeImage } = state;

  const handleShare = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShareOpen(prev => !prev);
  };

  const handlePrint = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await shareRecipe(recipe, recipeImage, 'print');
      setShareOpen(false);
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
      setShareOpen(false);
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
      setShareOpen(false);
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

  const exportToPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsSharing(true);
      await shareRecipe(recipe, recipeImage, 'pdf');
      setShareOpen(false);
      toast({
        title: "Succès",
        description: "La recette a été exportée en PDF.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter en PDF. Veuillez réessayer.",
        duration: 3000,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const shareToGoogleDrive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsSharing(true);
      await shareRecipe(recipe, recipeImage, 'gdrive');
      setShareOpen(false);
    } catch (error) {
      console.error("Erreur lors du partage Google Drive:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager vers Google Drive. Veuillez réessayer.",
        duration: 3000,
      });
    } finally {
      setIsSharing(false);
    }
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

      <div className="fixed bottom-0 right-0 p-4 no-print z-50">
        <Popover open={shareOpen} onOpenChange={setShareOpen}>
          <PopoverTrigger asChild>
            <Button 
              onClick={handleShare}
              variant="outline" 
              size="icon" 
              className="rounded-full shadow-md"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="grid gap-2">
              <Button
                onClick={shareViaEmail}
                variant="outline"
                className="justify-start"
                disabled={isSharing}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button
                onClick={shareViaWhatsapp}
                variant="outline"
                className="justify-start"
                disabled={isSharing}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                onClick={exportToPDF}
                variant="outline"
                className="justify-start"
                disabled={isSharing}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Exporter en PDF
              </Button>
              <Button
                onClick={shareToGoogleDrive}
                variant="outline"
                className="justify-start"
                disabled={isSharing}
              >
                <HardDrive className="mr-2 h-4 w-4" />
                Google Drive
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="justify-start"
                disabled={isSharing}
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <MobileNavigation showShareButton={true} onShare={handleShare} />
    </div>
  );
};

export default RecipeDisplay;
