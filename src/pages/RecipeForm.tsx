
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IngredientInput } from "@/components/IngredientInput";
import { Logo } from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { X, Clock, HeartPulse, Refrigerator, ChefHat } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MobileNavigation } from "@/components/MobileNavigation";
import { getMistralRecipe } from "@/utils/recipe/getMistralRecipe";

const CUISINE_TYPES = [
  "Africaine",
  "Amérique du Sud",
  "Antillaise",
  "Chinoise",
  "Cubaine",
  "Espagnole",
  "Etats-Unis",
  "Française",
  "Grecque",
  "Indienne",
  "Italienne",
  "Japonaise",
  "Méditerranéenne",
  "Mexicaine",
  "Scandinave",
  "Thaïe",
];

const COOKING_TYPES = [
  "Cuisine traditionnelle",
  "Air Fryer",
  "Barbecue / Plancha",
];

const SERVINGS_OPTIONS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cuisineType, setCuisineType] = useState("");
  const [cookingType, setCookingType] = useState(COOKING_TYPES[0]);
  const [nombreCouverts, setNombreCouverts] = useState<string>("4");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [fondDeFrigo, setFondDeFrigo] = useState(false);
  const [pressé, setPressé] = useState(false);
  const [léger, setLéger] = useState(false);
  const [gourmet, setGourmet] = useState(false);
  const [recipeImage, setRecipeImage] = useState("");

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

      // Utiliser notre nouveau module pour obtenir la recette
      const cleanedResponse = await getMistralRecipe({
        cuisineType,
        ingredients,
        additionalPrompt,
        nombreCouverts: parseInt(nombreCouverts),
        cookingType
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

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Votre type de cuisine :
              </label>
              <Select value={cuisineType} onValueChange={setCuisineType}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Sélectionnez un style culinaire" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Votre type de cuisson :
              </label>
              <Select value={cookingType} onValueChange={setCookingType}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Sélectionnez un type de cuisson" />
                </SelectTrigger>
                <SelectContent>
                  {COOKING_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nombre de couverts :
              </label>
              <Select value={nombreCouverts} onValueChange={setNombreCouverts}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Sélectionnez le nombre de couverts" />
                </SelectTrigger>
                <SelectContent>
                  {SERVINGS_OPTIONS.map((number) => (
                    <SelectItem key={number} value={number}>
                      {number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Options :</label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="mobile-card p-3 flex flex-col items-center justify-center">
                  <Refrigerator className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs mb-2">Fond de frigo</span>
                  <Checkbox
                    id="fondDeFrigo"
                    checked={fondDeFrigo}
                    onCheckedChange={(checked) =>
                      setFondDeFrigo(checked === true)
                    }
                    className="h-5 w-5"
                  />
                </div>

                <div className="mobile-card p-3 flex flex-col items-center justify-center">
                  <Clock className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs mb-2">Rapide</span>
                  <Checkbox
                    id="presse"
                    checked={pressé}
                    onCheckedChange={(checked) => setPressé(checked === true)}
                    className="h-5 w-5"
                  />
                </div>

                <div className="mobile-card p-3 flex flex-col items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs mb-2">Équilibré</span>
                  <Checkbox
                    id="leger"
                    checked={léger}
                    onCheckedChange={(checked) => setLéger(checked === true)}
                    className="h-5 w-5"
                  />
                </div>
                
                <div className="mobile-card p-3 flex flex-col items-center justify-center">
                  <ChefHat className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs mb-2">Gourmet</span>
                  <Checkbox
                    id="gourmet"
                    checked={gourmet}
                    onCheckedChange={(checked) => setGourmet(checked === true)}
                    className="h-5 w-5"
                  />
                </div>
              </div>
            </div>

            {loading && (
              <div className="space-y-2 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {loadingMessage}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelRequest}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full mobile-button h-12 text-base"
              disabled={loading}
            >
              {loading ? "Génération en cours..." : "Générer ma recette"}
            </Button>
          </form>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default RecipeForm;
