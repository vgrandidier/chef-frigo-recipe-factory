
import { Share, ArrowLeft, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ActionIconsProps {
  url: string;
  onPrint?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ActionIcons({ url, onPrint, onBack, className }: ActionIconsProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papier.",
        duration: 3000,
      });
      setOpen(false);
    });
  };

  const shareViaEmail = () => {
    window.open(`mailto:?subject=Une recette pour toi de Chef Frigo&body=Regarde cette recette que j'ai trouvée: ${url}`);
    setOpen(false);
  };

  const shareViaWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send?text=Regarde cette recette que j'ai trouvée: ${url}`);
    setOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onBack && (
        <Button onClick={onBack} variant="outline" size="icon" className="no-print">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="no-print">
            <Share className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="grid gap-2">
            <Button onClick={shareViaEmail} variant="outline" className="justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </Button>
            <Button onClick={shareViaWhatsapp} variant="outline" className="justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 13.34c0 4.97-4.5 9-10 9a9.8 9.8 0 0 1-5.3-1.5L2 22l1.3-3.9A8.94 8.94 0 0 1 2 13.34C2 8.38 6.5 4.35 12 4.35c5.5 0 9 4.03 9 9ZM9.5 7.84v8.33M14.5 7.84v8.33M8 12.84h8" />
              </svg>
              WhatsApp
            </Button>
            {onPrint && (
              <Button onClick={onPrint} variant="outline" className="justify-start">
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
