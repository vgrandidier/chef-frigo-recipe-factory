
import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  loading: boolean;
}

export const FormSubmitButton = ({ loading }: FormSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full mobile-button h-12 text-base"
      disabled={loading}
    >
      {loading ? "Génération en cours..." : "Générer ma recette"}
    </Button>
  );
};
