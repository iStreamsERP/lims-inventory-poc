import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

const CategoryListPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const payload = {
          SQLQuery:
            "SELECT GROUP_LEVEL1, COUNT(ITEM_CODE) AS productCount, MIN(ITEM_CODE) AS firstItemCode FROM INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' AND ITEM_GROUP = 'PRODUCT' GROUP BY GROUP_LEVEL1 ORDER BY GROUP_LEVEL1",
        };

        const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

        setCategories(response);

        // Fetch images for each category
        response.forEach((category) => {
          fetchProductImage(category.firstItemCode, category.GROUP_LEVEL1);
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error fetching categories",
          description: err?.message || "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userData, toast]);

  const fetchProductImage = async (id, groupLevel) => {
    try {
      const response = await axios.get(
        `https://apps.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(userData.userEmail)}&fileName=PRODUCT_IMAGE_${id}`,
        { responseType: "blob" },
      );

      const blob = response.data;

      const mimeType = blob.type;
      const extension = mimeType.split("/")[1] || "png";
      const filename = `PRODUCT_IMAGE_${id}.${extension}`;
      const file = new File([blob], filename, { type: mimeType });

      const imageUrl = URL.createObjectURL(file);

      setCategories((prevCategories) => prevCategories.map((cat) => (cat.GROUP_LEVEL1 === groupLevel ? { ...cat, imageUrl } : cat)));
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching product image for ${groupLevel}`,
        description: error?.message || "Unknown error",
      });
    }
  };

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
