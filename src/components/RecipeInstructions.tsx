
import { Recipe } from "@/utils/recipe/types";

interface RecipeInstructionsProps {
  recipe: Recipe;
  cleanInstructionText: (step: string) => string;
}

export const RecipeInstructions = ({ recipe, cleanInstructionText }: RecipeInstructionsProps) => {
  return (
    <div>
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
    </div>
  );
};
