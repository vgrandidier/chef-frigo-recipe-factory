
import { Refrigerator, Timer, HeartPulse, ChefHat } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RecipeOptionsFieldProps {
  fondDeFrigo: boolean;
  setFondDeFrigo: (value: boolean) => void;
  pressé: boolean;
  setPressé: (value: boolean) => void;
  léger: boolean;
  setLéger: (value: boolean) => void;
  gourmet: boolean;
  setGourmet: (value: boolean) => void;
}

export const RecipeOptionsField = ({
  fondDeFrigo,
  setFondDeFrigo,
  pressé,
  setPressé,
  léger,
  setLéger,
  gourmet,
  setGourmet,
}: RecipeOptionsFieldProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Options :</label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col items-center justify-center border rounded-xl p-3">
          <Refrigerator className="h-6 w-6 text-primary mb-2" />
          <span className="text-xs mb-2">Fond de frigo</span>
          <Checkbox
            id="fondDeFrigo"
            checked={fondDeFrigo}
            onCheckedChange={(checked) => setFondDeFrigo(checked === true)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex flex-col items-center justify-center border rounded-xl p-3">
          <Timer className="h-6 w-6 text-primary mb-2" />
          <span className="text-xs mb-2">Rapide</span>
          <Checkbox
            id="presse"
            checked={pressé}
            onCheckedChange={(checked) => setPressé(checked === true)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex flex-col items-center justify-center border rounded-xl p-3">
          <HeartPulse className="h-6 w-6 text-primary mb-2" />
          <span className="text-xs mb-2">Équilibré</span>
          <Checkbox
            id="leger"
            checked={léger}
            onCheckedChange={(checked) => setLéger(checked === true)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex flex-col items-center justify-center border rounded-xl p-3">
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
  );
};
