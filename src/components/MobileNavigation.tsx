
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Share2, ChefHat } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  showShareButton?: boolean;
  onShare?: () => void;
  className?: string;
}

export function MobileNavigation({ 
  showShareButton = false, 
  onShare,
  className
}: MobileNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  const isHomePage = isActive('/') || isActive('/form');
  
  // Si nous sommes déjà sur la page d'accueil, ne pas afficher le bouton Accueil
  const showHomeButton = !isHomePage;
  
  // Si not mobile, render a horizontal navigation bar with centered items
  if (!isMobile) {
    return (
      <div className={cn("flex items-center justify-center py-3 border-b bg-white", className)}>
        <div className="flex items-center gap-6">
          {showHomeButton && (
            <button 
              className={`flex items-center gap-2 text-sm ${isActive('/') || isActive('/form') ? 'text-primary font-medium' : 'text-gray-500'}`}
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </button>
          )}
          
          {showShareButton && onShare && (
            <button 
              className="flex items-center gap-2 text-sm text-gray-500"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Mobile navigation
  return (
    <div className={cn("mobile-nav", className)}>
      {showHomeButton && (
        <button 
          className={`mobile-nav-item ${isHomePage ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <Home className="mobile-nav-icon" />
          <span>Accueil</span>
        </button>
      )}
      
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
