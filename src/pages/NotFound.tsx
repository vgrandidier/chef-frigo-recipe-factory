
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

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
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <Logo size="lg" className="justify-center mb-6" />
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-culinary-primary/20">
          <h1 className="text-5xl font-bold text-culinary-primary mb-2">404</h1>
          <p className="text-lg text-culinary-dark mb-6">
            Cette page n'existe pas ou la recette a été mangée !
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-culinary-primary hover:bg-culinary-primary/90"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
