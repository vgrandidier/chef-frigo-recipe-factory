
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { IngredientInput } from "@/components/IngredientInput";
import { Logo } from "@/components/Logo";
import { MobileNavigation } from "@/components/MobileNavigation";
import { getMistralRecipe } from "@/utils/recipe/getMistralRecipe";

// Import refactored components
import { CuisineTypeField } from "@/components/recipe-form/CuisineTypeField";
import { ServeCountField } from "@/components/recipe-form/ServeCountField";
import { CookingTypeField, COOKING_TYPES } from "@/components/recipe-form/CookingTypeField";
import { DishTypeField } from "@/components/recipe-form/DishTypeField";
import { RecipeOptionsField } from "@/components/recipe-form/RecipeOptionsField";
import { LoadingIndicator } from "@/components/recipe-form/LoadingIndicator";
import { FormSubmitButton } from "@/components/recipe-form/FormSubmitButton";

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cuisineType, setCuisineType] = useState("");
  const [cookingType, setCookingType] = useState(COOKING_TYPES[0]);
  const [dishType, setDishType] = useState("Plat");
  const [nombreCouverts, setNombreCouverts] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [fondDeFrigo, setFondDeFrigo] = useState(false);
  const [pressé, setPressé] = useState(false);
  const [léger, setLéger] = useState(false);
  const [gourmet, setGourmet] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const [cancelTokenSource, setCancelTokenSource] = useState<any>(null);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  const handleCancelRequest = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Requête annulée par l'utilisateur");
      toast({
        title: "Requête annulée",
        description: "La génération de recette a été interrompue.",
        variant: "destructive",
      });
    }
  };

  const validateForm = () => {
    if (ingredients.length === 0) {
      toast({
        title: "Ingrédients manquants",
        description: "Veuillez ajouter au moins un ingrédient.",
        variant: "destructive",
      });
      return false;
    }

    if (!cuisineType) {
      toast({
        title: "Type de cuisine manquant",
        description: "Veuillez sélectionner un type de cuisine.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setLoadingMessage("Préparation de votre recette personnalisée...");
    setProgress(10);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setCancelTokenSource(source);

    const additionalRequirements = [];
    if (fondDeFrigo) {
      additionalRequirements.push(
        "en utilisant uniquement les ingrédients fournis et en ajoutant uniquement des assaisonements de base"
      );
    } else {
      additionalRequirements.push(
        "en incluant des ingrédients variés pour une recette plus élaborée (par exemple en proposant du poisson ou de la viande si je n'ai listé que des légumes ou en proposant un accompagnement si je n'ai listé que de la viande ou du poisson)"
      );
    }
    if (pressé)
      additionalRequirements.push(
        "avec un temps de préparation court, maximum 15 minutes"
      );
    if (léger)
      additionalRequirements.push(
        "avec un minimum de calories et un Nutri-Score favorable"
      );
    if (gourmet) {
      additionalRequirements.push(
        "en ajoutant des ingrédients additionnels de qualité et en les utilisant dans une recette digne d'un restaurant gastronomique"
      );
    }

    // Ajouter la contrainte de type de plat
    additionalRequirements.push(
      `la recette doit correspondre à un(e) ${dishType}`
    );

    // Ajouter la contrainte de type de cuisson
    if (cookingType !== "Cuisine traditionnelle") {
      additionalRequirements.push(
        `en utilisant spécifiquement la méthode de cuisson "${cookingType}"`
      );
    }

    const additionalPrompt =
      additionalRequirements.length > 0
        ? `Contraintes supplémentaires: ${additionalRequirements.join(". ")}. `
        : "";

    try {
      setLoadingMessage("Chef Frigo prépare la recette...");
      setProgress(30);

      // Fix: convert nombreCouverts to string here
      const cleanedResponse = await getMistralRecipe({
        cuisineType,
        ingredients,
        additionalPrompt,
        nombreCouverts: nombreCouverts.toString(), // Convert number to string explicitly
        cookingType,
        dishType,
      });

      setLoadingMessage("Mise en forme de votre recette...");
      setProgress(70);

      let recipeData;
      try {
        recipeData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        throw new Error("Impossible de lire la recette reçue.");
      }

      setLoadingMessage("Chef Frigo choisit la présentation...");
      setProgress(80);

      const imagePath = `/images/${cuisineType}.jpg`;

      navigate("/recipe", {
        state: { recipe: recipeData, recipeImage: imagePath },
      });
    } catch (error: any) {
      if (axios.isCancel(error)) {
        setLoadingMessage("Requête annulée.");
      } else {
        console.error("Erreur lors de la requête à l'API :", error);
        toast({
          title: "Erreur",
          description:
            error.message ||
            "Une erreur est survenue lors de la génération de la recette.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setCancelTokenSource(null);
      setLoadingMessage("");
    }
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header flex-col py-4">
        <Logo size="md" showSlogan={true} />
      </div>

      <div className="mobile-content">
        <div className="p-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vos ingrédients :</label>
              <IngredientInput
                ingredients={ingredients}
                setIngredients={setIngredients}
              />
            </div>

            <CuisineTypeField 
              cuisineType={cuisineType} 
              setCuisineType={setCuisineType} 
            />

            <ServeCountField 
              nombreCouverts={nombreCouverts} 
              setNombreCouverts={setNombreCouverts} 
            />

            <CookingTypeField 
              cookingType={cookingType} 
              setCookingType={setCookingType} 
            />

            <DishTypeField 
              dishType={dishType} 
              setDishType={setDishType} 
            />

            <RecipeOptionsField 
              fondDeFrigo={fondDeFrigo}
              setFondDeFrigo={setFondDeFrigo}
              pressé={pressé}
              setPressé={setPressé}
              léger={léger}
              setLéger={setLéger}
              gourmet={gourmet}
              setGourmet={setGourmet}
            />

            <LoadingIndicator 
              loading={loading} 
              loadingMessage={loadingMessage}
              progress={progress}
              onCancel={handleCancelRequest}
            />

            <FormSubmitButton loading={loading} />
          </form>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default RecipeForm;
