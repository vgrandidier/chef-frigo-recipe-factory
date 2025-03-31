
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Share2 } from "lucide-react";

interface MobileNavigationProps {
  showShareButton?: boolean;
  onShare?: () => void;
}

export function MobileNavigation({ showShareButton = false, onShare }: MobileNavigationProps) {
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
      
      {showShareButton && onShare && (
        <button 
          className="mobile-nav-item"
          onClick={onShare}
        >
          <Share2 className="mobile-nav-icon" />
          <span>Partager</span>
        </button>
      )}
    </div>
  );
}
