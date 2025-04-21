import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelService } from "@/services/dataModelService";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

export default function ProductCardListPage() {
  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);


  useEffect(() => {
    fetchProductList();
  }, [id]);

  const fetchProductImage = async (itemCode) => {
    try {
      const response = await axios.get(
        `https://cloud.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(userData.currentUserLogin)}&fileName=PRODUCT_IMAGE_${itemCode}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.warn(`Error fetching image for ${itemCode}`, error);
      const ph = await fetch("data:image/png;base64,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");
      return await ph.blob();
    }
  };


  const fetchProductList = async () => {
    setLoading(true);
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: `GROUP_LEVEL1 = '${id}' AND COST_CODE = 'MXXXX' AND ITEM_GROUP = 'PRODUCT'`,
        Orderby: "",
      };

      const response = await getDataModelService(
        payload,
        userData.currentUserLogin,
        userData.clientURL
      );

      const updatedList = await Promise.all(
        response.map(async (item) => {
          const imageBlob = await fetchProductImage(item.ITEM_CODE);
          const imageUrl = URL.createObjectURL(imageBlob);
          return { ...item, imageUrl };
        })
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


  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Explore {id}</h1>
      {
        loading ? (
          <BarLoader color="#36d399" height={2} width="100%" />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {productList.map((product, index) => (
                <Link key={product.id || index} to={`/product-detail/${product.ITEM_CODE}`}>
                  <Card className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group">
                    <div className="relative flex items-center justify-center bg-neutral-300 dark:bg-gray-800 h-36 overflow-hidden">
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
                          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-sm text-white">No Image</span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="mb-2 cursor-pointer text-sm text-blue-600 underline">
                        +1 other colour/pattern
                      </p>
                      <div className="flex flex-col h-full justify-between">
                        <h2 className="mb-2 line-clamp-2 text-sm leading-snug group-hover:underline truncate">
                          {product.ITEM_NAME}
                        </h2>
                        <span className="text-lg font-semibold">
                          <span className="text-sm">₹</span> {product.SALE_RATE}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )
      }
    </div>
  );
}