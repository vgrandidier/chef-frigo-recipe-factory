import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientInput } from "@/components/IngredientInput";
import { Logo } from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const CUISINE_TYPES = [
  "Africaine",
  "Antillaise",
  "Asiatique",
  "Chinoise",
  "Créole",
  "Cubaine",
  "Espagnole",
  "Française",
  "Grecque",
  "Indienne",
  "Italienne",
  "Japonaise",
  "Méditerranéenne",
  "Mexicaine",
  "Portugaise",
  "Québécoise",
  "Scandinave",
  "Thaïe",
  "Vietnamienne",
];

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cuisineType, setCuisineType] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [fondDeFrigo, setFondDeFrigo] = useState(false);
  const [pressé, setPressé] = useState(false);
  const [léger, setLéger] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Setup cancellation token
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

    const apiKey = "bX7PSeGLmU5Qh6JYnvr2tzvESPhiORAH"; // Remplacez par votre clé API

    // Construct additional requirements based on checkboxes
    const additionalRequirements = [];
    if (fondDeFrigo)
      additionalRequirements.push(
        "en utilisant le minimum d'ingrédients et avec des substitutions possibles pour les ingrédients courants"
      );
    if (pressé)
      additionalRequirements.push(
        "avec un temps de préparation court, maximum 15 minutes"
      );
    if (léger)
      additionalRequirements.push(
        "avec un minimum de calories et un Nutri-Score favorable"
      );

    const additionalPrompt =
      additionalRequirements.length > 0
        ? `Contraintes supplémentaires: ${additionalRequirements.join(". ")}. `
        : "";

    const prompt = `Je voudrais une recette de type ${cuisineType} avec ${ingredients.join(
      ", "
    )}. ${additionalPrompt}En retour, je veux un titre, une description, la liste des ustensiles nécessaires, la liste complète des ingrédients avec les quantités, les valeurs nutritionnelles pour 100g (kcal, protéines, glucides, lipides, fibres), le Nutri-Score, le temps de préparation, le temps total, et les instructions pour la réalisation de la recette par étape. Les instructions doivent être regroupées par type de travail (préparation, cuisson, montage, etc.), et chaque groupe doit avoir un titre. Formate le résultat en JSON avec la structure suivante :
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
        "kcal": "Nombre de kcal pour 100g",
        "proteines": "Protéines en grammes pour 100g",
        "glucides": "Glucides en grammes pour 100g",
        "lipides": "Lipides en grammes pour 100g",
        "fibres": "Fibres en grammes pour 100g"
      },
      "nutriscore": "Valeur du Nutri-Score",
      "temps_preparation": "Intervalle de temps de préparation en minutes (ex: 20-25 minutes)",
      "temps_total": "Intervalle de temps total en minutes (ex: 35-40 minutes)",
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

    try {
      setLoadingMessage("Communication avec le Chef Frigo...");
      setProgress(30);

      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-large-latest",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          cancelToken: source.token,
        }
      );

      setLoadingMessage("Mise en forme de votre recette...");
      setProgress(80);

      const rawResponse = response.data.choices[0].message.content;
      console.log("Raw response:", rawResponse);

      // Extract only the JSON part using a regular expression
      const jsonMatch = rawResponse.match(/(\{.*\})/s);
      if (!jsonMatch) {
        throw new SyntaxError("Pas de JSON valide trouvé dans la réponse.");
      }

      const cleanedResponse = jsonMatch[0];
      let recipeData;
      try {
        recipeData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        throw new Error("Impossible de lire la recette reçue.");
      }

      setProgress(100);
      navigate("/recipe", { state: { recipe: recipeData } });
    } catch (error: any) {
      if (axios.isCancel(error)) {
        setLoadingMessage("Requête annulée.");
      } else if (error.response && error.response.status === 401) {
        toast({
          title: "Erreur d'autorisation",
          description: "Vérifiez votre clé API.",
          variant: "destructive",
        });
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
    <div className="min-h-screen gradient-bg py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <p className="text-culinary-dark/80 text-sm md:text-base">
            Transformez vos ingrédients en délicieuses recettes personnalisées
          </p>
        </div>

        <Card className="card-elevation border-culinary-primary/20">
          <CardHeader className="pb-3">
            <h2 className="text-xl font-medium text-center">
              Que voulez-vous cuisiner ?
            </h2>
          </CardHeader>

          <CardContent>
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
                  <SelectTrigger>
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

              <div className="space-y-3">
                <label className="text-sm font-medium">Vos options :</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fondDeFrigo"
                      checked={fondDeFrigo}
                      onCheckedChange={(checked) =>
                        setFondDeFrigo(checked === true)
                      }
                    />
                    <Label htmlFor="fondDeFrigo" className="cursor-pointer">
                      Fond de frigo
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="presse"
                      checked={pressé}
                      onCheckedChange={(checked) => setPressé(checked === true)}
                    />
                    <Label htmlFor="presse" className="cursor-pointer">
                      Je suis pressé!
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="leger"
                      checked={léger}
                      onCheckedChange={(checked) => setLéger(checked === true)}
                    />
                    <Label htmlFor="leger" className="cursor-pointer">
                      Manger léger
                    </Label>
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
                className="w-full bg-culinary-primary hover:bg-culinary-primary/90"
                disabled={loading}
              >
                {loading ? "Génération en cours..." : "Générer ma recette"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeForm;
