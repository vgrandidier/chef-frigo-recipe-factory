
import { CookingPot, AirVent, Flame, PanelTop } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const COOKING_TYPES = [
  "Cuisine traditionnelle",
  "Air Fryer",
  "Barbecue / Plancha",
];

interface CookingTypeFieldProps {
  cookingType: string;
  setCookingType: (type: string) => void;
}

export const CookingTypeField = ({ cookingType, setCookingType }: CookingTypeFieldProps) => {
  const renderCookingTypeIcon = (type: string) => {
    switch (type) {
      case "Cuisine traditionnelle":
        return <CookingPot className="h-6 w-6 text-primary" />;
      case "Air Fryer":
        return <AirVent className="h-6 w-6 text-primary" />;
      case "Barbecue / Plancha":
        return <Flame className="h-6 w-6 text-primary" />;
      default:
        return <PanelTop className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Votre type de cuisson :
      </label>
      <RadioGroup
        value={cookingType}
        onValueChange={setCookingType}
        className="grid grid-cols-3 gap-2"
      >
        {COOKING_TYPES.map((type) => (
          <div
            key={type}
            className="flex flex-col items-center space-y-2 border rounded-xl p-3"
          >
            {renderCookingTypeIcon(type)}
            <Label className="text-center text-xs mt-1">{type}</Label>
            <RadioGroupItem
              value={type}
              id={`cooking-${type}`}
              className="rounded-sm"
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
