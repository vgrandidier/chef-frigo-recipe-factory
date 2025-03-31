
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ChevronLeft } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <button onClick={() => navigate('/')} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Page non trouvée</h1>
        <div className="w-8"></div>
      </div>

      <div className="mobile-content flex flex-col items-center justify-center p-6">
        <Logo size="lg" className="mb-6" />
        
        <div className="mobile-card p-8 w-full">
          <h1 className="text-5xl font-bold text-primary mb-2 text-center">404</h1>
          <p className="text-center text-gray-600 mb-6">
            Cette page n'existe pas ou la recette a été mangée !
          </p>
          <Button
            onClick={() => navigate("/")}
            className="w-full mobile-button h-12"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default NotFound;
