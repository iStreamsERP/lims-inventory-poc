import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { callSoapService } from "@/services/callSoapService";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

const CategoryListPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { fetchImageUrl } = useImageAPI();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      categories.forEach((category) => {
        if (category.imageUrl) URL.revokeObjectURL(category.imageUrl);
      });
    };
  }, [categories]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        SQLQuery:
          "SELECT GROUP_LEVEL1, COUNT(ITEM_CODE) AS productCount, MIN(ITEM_CODE) AS firstItemCode FROM INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' AND ITEM_GROUP = 'PRODUCT' GROUP BY GROUP_LEVEL1 ORDER BY GROUP_LEVEL1",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      // Fetch images in parallel
      const categoriesWithImages = await Promise.all(
        response.map(async (category) => {
          try {
            const imageUrl = await fetchImageUrl("product", category.firstItemCode);
            return { ...category, imageUrl };
          } catch (error) {
            console.error(`Error fetching image for ${category.GROUP_LEVEL1}`, error);
            return { ...category, imageUrl: null };
          }
        }),
      );

      setCategories(categoriesWithImages);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error fetching categories",
        description: err?.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, [userData, fetchImageUrl, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">All Categories</h1>
      {loading ? (
        <BarLoader
          color="#36d399"
          height={2}
          width="100%"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group overflow-hidden"
            >
              <div className="h-36 w-full overflow-hidden rounded-lg bg-neutral-300 dark:bg-gray-900">
                <Link
                  to={`/product-card-list/${category.GROUP_LEVEL1}`}
                  className="relative"
                >
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.GROUP_LEVEL1}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.style.backgroundColor = "red";
                        e.target.style.display = "none";
                      }}
                      className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-sm text-white">No Image</span>
                  )}
                  <Badge className="absolute right-2 top-2 z-20 h-fit">{category.productCount || 0} Products</Badge>
                </Link>
              </div>
              <h3 className="truncate text-lg font-semibold leading-snug group-hover:text-blue-700">{category.GROUP_LEVEL1}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryListPage;
