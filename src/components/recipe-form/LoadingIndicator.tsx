
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LoadingIndicatorProps {
  loading: boolean;
  loadingMessage: string;
  progress: number;
  onCancel: () => void;
}

export const LoadingIndicator = ({ 
  loading, 
  loadingMessage, 
  progress, 
  onCancel 
}: LoadingIndicatorProps) => {
  if (!loading) return null;
  
  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {loadingMessage}
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Progress value={progress} className="h-2 bg-culinary-accent" />
    </div>
  );
};
