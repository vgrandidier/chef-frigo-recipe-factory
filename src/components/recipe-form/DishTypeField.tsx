
import { HandPlatter, Ham, CakeSlice, Martini } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const DISH_TYPES = [
  { value: "Entrée", icon: HandPlatter },
  { value: "Plat", icon: Ham },
  { value: "Dessert", icon: CakeSlice },
  { value: "Apéro", icon: Martini },
];

interface DishTypeFieldProps {
  dishType: string;
  setDishType: (type: string) => void;
}

export const DishTypeField = ({ dishType, setDishType }: DishTypeFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Que voulez-vous cuisiner ?
      </label>
      <RadioGroup
        value={dishType}
        onValueChange={setDishType}
        className="grid grid-cols-4 gap-2"
      >
        {DISH_TYPES.map((type) => (
          <div
            key={type.value}
            className="flex flex-col items-center space-y-2 border rounded-xl p-3"
          >
            <type.icon className="h-6 w-6 text-primary" />
            <Label className="text-center text-xs mt-1">{type.value}</Label>
            <RadioGroupItem
              value={type.value}
              id={`dish-${type.value}`}
              className="rounded-sm"
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
