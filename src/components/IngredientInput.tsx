
import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

export function IngredientInput({ ingredients, setIngredients }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addIngredient = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !ingredients.includes(trimmedValue)) {
      setIngredients([...ingredients, trimmedValue]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Ajouter un ingrédient"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full text-sm"
        />
        <Button 
          type="button" 
          size="icon" 
          onClick={addIngredient}
          className="h-10 w-10 flex-shrink-0 bg-culinary-accent text-culinary-dark hover:bg-culinary-accent/80"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {ingredients.map((ingredient, index) => (
          <Badge 
            key={`${ingredient}-${index}`} 
            variant="secondary"
            className="px-3 py-1.5 text-sm bg-culinary-accent text-culinary-dark flex items-center gap-1"
          >
            {ingredient}
            <X 
              className="h-3.5 w-3.5 cursor-pointer ml-1" 
              onClick={() => removeIngredient(ingredient)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
