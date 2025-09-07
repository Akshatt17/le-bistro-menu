import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import appetizersImage from "@/assets/appetizers-category.jpg";
import mainCoursesImage from "@/assets/main-courses-category.jpg";
import dessertsImage from "@/assets/desserts-category.jpg";
import drinksImage from "@/assets/drinks-category.jpg";

const categories = [
  {
    id: "appetizers",
    name: "Appetizers",
    description: "Perfect starters to awaken your palate",
    image: appetizersImage,
  },
  {
    id: "main-courses",
    name: "Main Courses",
    description: "Hearty dishes crafted with premium ingredients",
    image: mainCoursesImage,
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet endings to your perfect meal",
    image: dessertsImage,
  },
  {
    id: "drinks",
    name: "Drinks",
    description: "Carefully curated wines and beverages",
    image: drinksImage,
  },
];

const MenuCategories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
            Our Menu
          </h1>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden shadow-card hover:shadow-lg transition-smooth cursor-pointer transform hover:scale-105"
              onClick={() => navigate(`/menu/${category.id}`)}
            >
              {/* Category Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-smooth hover:scale-110"
                />
              </div>
              
              {/* Category Info */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {category.name}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCategories;