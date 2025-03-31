
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, Plus } from "lucide-react";

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="mobile-nav">
      <button 
        className={`mobile-nav-item ${isActive('/') || isActive('/form') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <Home className="mobile-nav-icon" />
        <span>Accueil</span>
      </button>
      
      <button className="mobile-nav-item">
        <Search className="mobile-nav-icon" />
        <span>Rechercher</span>
      </button>
      
      <div className="relative">
        <button 
          className="mobile-fab absolute -top-8 left-1/2 transform -translate-x-1/2"
          onClick={() => navigate('/')}
        >
          <Plus size={24} />
        </button>
      </div>
      
      <button className="mobile-nav-item">
        <Heart className="mobile-nav-icon" />
        <span>Favoris</span>
      </button>
      
      <button className="mobile-nav-item">
        <User className="mobile-nav-icon" />
        <span>Profil</span>
      </button>
    </div>
  );
}
