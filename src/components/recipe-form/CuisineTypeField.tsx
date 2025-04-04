
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  "Thaie",
];

interface CuisineTypeFieldProps {
  cuisineType: string;
  setCuisineType: (type: string) => void;
}

export const CuisineTypeField = ({ cuisineType, setCuisineType }: CuisineTypeFieldProps) => {
  return (
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
  );
};
