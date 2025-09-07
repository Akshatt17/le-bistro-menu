import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import restaurantInterior from "@/assets/restaurant-interior.jpg";
import leBistroLogo from "@/assets/le-bistro-logo.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${restaurantInterior})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={leBistroLogo} 
            alt="Le Bistro Logo" 
            className="w-24 h-24 rounded-full mx-auto shadow-card"
          />
        </div>
        
        {/* Main Heading */}
        <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Welcome to<br />Le Bistro
        </h1>
        
        {/* Subheading */}
        <p className="font-body text-xl md:text-2xl text-white/90 mb-12 max-w-md leading-relaxed">
          Experience our menu, crafted with care and flavor
        </p>
        
        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="hero"
          onClick={() => navigate("/menu")}
          className="mb-8"
        >
          See menu
        </Button>
      </div>
    </div>
  );
};

export default Welcome;