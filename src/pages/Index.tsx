
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page du formulaire de recette
    navigate("/form");
  }, [navigate]);

  return null; // Pas besoin de rendu, car on redirige
};

export default Index;
