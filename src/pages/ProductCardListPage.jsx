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
      console.error(`Error fetching image for ${itemCode}`, error);
      return null; // Handle missing images gracefully
    }
  };

  console.log(productList[0]);


  return loading ? (
    <BarLoader color="#36d399" height={2} width="100%" />
  ) : (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Explore {id}</h1>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productList.map((product, index) => (
            <Link key={product.id || index} to={`/product-detail/${product.ITEM_CODE}`}>
              <Card className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative flex items-center justify-center bg-slate-700 h-36">
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
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
                    <h2 className="mb-2 line-clamp-2 text-sm leading-snug">
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
    </div>
  );
}