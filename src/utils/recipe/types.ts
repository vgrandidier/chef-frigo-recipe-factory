
export interface RecipeIngredient {
  nom: string;
  quantite: string;
}

export interface RecipeUstensil {
  nom: string;
}

export interface RecipeNutritionalValues {
  calories: string;
  proteines: string;
  glucides: string;
  lipides: string;
  fibres: string;
}

export interface Recipe {
  titre: string;
  description: string;
  ustensiles: RecipeUstensil[];
  ingredients: RecipeIngredient[];
  valeurs_nutritionnelles: RecipeNutritionalValues;
  nutriscore: string;
  temps_preparation: string;
  temps_total: string;
  instructions: Record<string, string[]>;
  nombre_couverts: number;
}
