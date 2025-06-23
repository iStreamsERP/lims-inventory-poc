import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { callSoapService } from "@/api/callSoapService";
import { formatPrice } from "@/utils/formatPrice";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const PLACEHOLDER_IMAGE =
  "data:image/png;base64,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";
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
                      <p className="mb-2 text-sm text-blue-600 underline">{product.subProductCount} other color/pattern</p>
                    )}
                    <div className="flex h-full flex-col justify-between">
                      <h2 className="mb-2 line-clamp-2 truncate text-sm leading-snug group-hover:underline" title={product.ITEM_NAME}>{product.ITEM_NAME}</h2>
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
