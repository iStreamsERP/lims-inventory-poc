import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { callSoapService } from "@/api/callSoapService";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

const ProductCategoryListPage = () => {
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
    <div className="container mx-auto flex flex-col gap-y-6">
      <h1 className="title">All Categories</h1>

      {loading ? (
        <div className="w-full">
          <BarLoader color="#36d399" height={2} width="100%" />
        </div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category, idx) => (
          <Link
            key={idx}
            to={`/product-card-list/${encodeURIComponent(category.GROUP_LEVEL1)}`}
            className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg"
          >
            {/* Image container */}
            <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.GROUP_LEVEL1}
                  loading="lazy"
                  onError={(e) => {
                    // Hide broken images
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-300">No Image</span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex items-center justify-between gap-5">
              <div className="flex items-baseline gap-1 overflow-hidden">
                <h3 className="line-clamp-2 truncate text-sm leading-snug group-hover:underline" title={category.GROUP_LEVEL1}>
                  {category.GROUP_LEVEL1}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  ({category.productCount || 0})
                </span>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
            </div>
          </Link>
        ))}
</div>

      )}
    </div>
  );
};

export default ProductCategoryListPage;
