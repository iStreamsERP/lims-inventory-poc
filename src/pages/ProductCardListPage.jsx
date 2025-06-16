import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { callSoapService } from "@/services/callSoapService";
import { formatPrice } from "@/utils/formatPrice";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

export default function ProductCardListPage() {
  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const { fetchImageUrl } = useImageAPI();

  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchProductList();

    // Cleanup object URLs
    return () => {
      productList.forEach((product) => {
        if (product.imageUrl) URL.revokeObjectURL(product.imageUrl);
      });
    };
  }, [id]);

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: `GROUP_LEVEL1 = '${id}' AND COST_CODE = 'MXXXX' AND ITEM_GROUP = 'PRODUCT'`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);

      const updatedList = await Promise.all(
        response.map(async (item) => {
          try {
            // Get image URL from custom hook
            const imageUrl = await fetchImageUrl("product", item.ITEM_CODE);

            // Get sub-product count
            const subProductCount = await fetchSubProductCount(item.ITEM_CODE);

            return {
              ...item,
              imageUrl: imageUrl || PLACEHOLDER_IMAGE,
              subProductCount,
            };
          } catch (error) {
            console.error(`Error processing item ${item.ITEM_CODE}`, error);
            return {
              ...item,
              imageUrl: PLACEHOLDER_IMAGE,
              subProductCount: 0,
            };
          }
        }),
      );

      setProductList(updatedList);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching product list: ${error?.message || "An error occurred"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubProductCount = async (itemCode) => {
    try {
      const payload = {
        SQLQuery: `SELECT COUNT(*) AS count FROM INVT_SUBMATERIAL_MASTER WHERE ITEM_CODE = '${itemCode}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      return response[0]?.count || 0;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error fetching sub product count",
        description: err?.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Explore {id}</h1>
      {loading ? (
        <BarLoader
          color="#36d399"
          height={2}
          width="100%"
        />
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {productList.map((product, index) => (
              <Link
                key={index}
                to={`/product-detail/${product.ITEM_CODE}`}
              >
                <Card className="group relative h-full overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <div className="relative flex h-36 items-center justify-center overflow-hidden bg-neutral-300 dark:bg-gray-800">
                    {product?.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.ITEM_NAME}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                          e.target.style.backgroundColor = "black";
                          e.target.style.display = "none";
                        }}
                        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-sm text-white">No Image</span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    {product.subProductCount > 0 && (
                      <p className="mb-2 cursor-pointer text-sm text-blue-600 underline">+{product.subProductCount} other color/pattern</p>
                    )}
                    <div className="flex h-full flex-col justify-between">
                      <h2 className="mb-2 line-clamp-2 truncate text-sm leading-snug group-hover:underline">{product.ITEM_NAME}</h2>
                      <span className="text-lg font-semibold">{formatPrice(product.SALE_RATE)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
