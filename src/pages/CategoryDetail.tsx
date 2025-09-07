import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye } from "lucide-react";
import { ARViewer } from "@/components/ARViewer";
import bruschettaImage from "@/assets/bruschetta.jpg";
import beefSteakImage from "@/assets/beef-steak.jpg";
import tiramisuImage from "@/assets/tiramisu.jpg";

const menuData = {
  appetizers: {
    title: "Appetizers",
    description: "Perfect starters to awaken your palate with fresh, seasonal ingredients",
    items: [
      {
        id: 1,
        name: "Artisan Bruschetta",
        price: "$12",
        description: "Fresh tomatoes, basil, and mozzarella on toasted artisan bread",
        image: bruschettaImage,
        tags: ["Vegetarian", "Classic"],
        arModel: "/3D models/Grilled-Cheese-Sandwich.glb"
      },
      {
        id: 2,
        name: "Charcuterie Board",
        price: "$18",
        description: "Selection of cured meats, artisan cheeses, and house-made accompaniments",
        image: bruschettaImage,
        tags: ["Signature", "Sharing"],
        arModel: "/3D models/Sandwich.glb"
      },
      {
        id: 9,
        name: "Premium Sushi Platter",
        price: "$24",
        description: "Fresh toro and shrimp sushi with traditional accompaniments",
        image: bruschettaImage,
        tags: ["Fresh", "Premium"],
        arModel: "/3D models/3D food - sushi 🍣　(toro and shrimp) .glb"
      },
    ]
  },
  "main-courses": {
    title: "Main Courses",
    description: "Hearty dishes crafted with premium ingredients and culinary expertise",
    items: [
      {
        id: 3,
        name: "Grilled Beef Tenderloin",
        price: "$32",
        description: "Prime beef tenderloin with seasonal vegetables and red wine reduction",
        image: beefSteakImage,
        tags: ["Signature", "Premium"],
        arModel: "/3D models/Chicken Mexican dinner photogrammetry.glb"
      },
      {
        id: 4,
        name: "Pan-Seared Salmon",
        price: "$28",
        description: "Atlantic salmon with lemon herb butter and roasted vegetables",
        image: beefSteakImage,
        tags: ["Healthy", "Seasonal"],
        arModel: "/3D models/Spicy Ramen.glb"
      },
      {
        id: 10,
        name: "Crispy Chicken Nuggets",
        price: "$16",
        description: "Golden crispy chicken nuggets served with dipping sauces",
        image: beefSteakImage,
        tags: ["Crispy", "Comfort"],
        arModel: "/3D models/Chicken nuggets. McDonald's .glb"
      },
    ]
  },
  desserts: {
    title: "Desserts",
    description: "Sweet endings to your perfect meal, crafted by our pastry chef",
    items: [
      {
        id: 5,
        name: "Classic Tiramisu",
        price: "$9",
        description: "Traditional Italian dessert with mascarpone and espresso-soaked ladyfingers",
        image: tiramisuImage,
        tags: ["Classic", "Coffee"],
        arModel: "/3D models/Food - Tiramisu Cake.glb"
      },
      {
        id: 6,
        name: "Seasonal Fruit Tart",
        price: "$8",
        description: "Fresh seasonal fruits on vanilla pastry cream with almond crust",
        image: tiramisuImage,
        tags: ["Seasonal", "Fresh"],
        arModel: "/3D models/Strawberry cake.glb"
      },
      {
        id: 11,
        name: "Authentic Vietnamese Pho",
        price: "$14",
        description: "Traditional Vietnamese noodle soup with fresh herbs and spices",
        image: tiramisuImage,
        tags: ["Authentic", "Comfort"],
        arModel: "/3D models/Vietnamese food.glb"
      },
    ]
  },
  drinks: {
    title: "Drinks",
    description: "Carefully curated wines, cocktails, and beverages to complement your meal",
    items: [
      {
        id: 7,
        name: "House Red Wine",
        price: "$8",
        description: "Full-bodied red wine from our specially selected vineyard",
        image: bruschettaImage,
        tags: ["Wine", "House Special"]
      },
      {
        id: 8,
        name: "Craft Cocktail",
        price: "$14",
        description: "Our signature cocktail with premium spirits and fresh ingredients",
        image: bruschettaImage,
        tags: ["Signature", "Craft"]
      },
    ]
  }
};

const categories = [
  { id: "appetizers", name: "Appetizers" },
  { id: "main-courses", name: "Main Courses" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
];

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(categoryId || "appetizers");
  const [arViewerOpen, setArViewerOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<{name: string, modelPath: string} | null>(null);

  const currentCategory = menuData[activeCategory as keyof typeof menuData];

  const handleARView = (dishName: string, modelPath: string) => {
    setSelectedDish({ name: dishName, modelPath });
    setArViewerOpen(true);
  };

  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/menu")}
              className="mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {currentCategory.title}
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-1">
                {currentCategory.description}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "tab-active" : "tab"}
                size="tab"
                onClick={() => {
                  setActiveCategory(category.id);
                  navigate(`/menu/${category.id}`, { replace: true });
                }}
                className="flex-shrink-0"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {currentCategory.items.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-card">
              {/* Item Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Item Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <span className="font-body text-lg font-semibold text-primary ml-4">
                    {item.price}
                  </span>
                </div>
                
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* AR View Button */}
                {item.arModel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleARView(item.name, item.arModel)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View in 3D/AR
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AR Viewer Modal */}
      {selectedDish && (
        <ARViewer
          isOpen={arViewerOpen}
          onClose={() => setArViewerOpen(false)}
          modelPath={selectedDish.modelPath}
          dishName={selectedDish.name}
        />
      )}
    </div>
  );
};

export default CategoryDetail;