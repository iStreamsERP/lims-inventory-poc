import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { callSoapService } from "@/services/callSoapService";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const ServiceCategoryListPage = () => {
  const { userData } = useAuth();
  const { addItem } = useCart();

  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // only fetch once userData is ready
    if (userData?.userEmail && userData?.clientURL) {
      fetchAllServicesData();
    }
  }, [userData]);

  const fetchAllServicesData = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: "COST_CODE = 'MXXXX' AND ITEM_GROUP = 'SERVICE'",
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);

      // assume response is an array
      const updated = response.map((item) => ({
        ...item,
        FEATURES: item.FEATURES ? item.FEATURES.split(",") : [],
      }));
      setServiceData(updated);
    } catch (err) {
      setError(err?.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = ({ ITEM_CODE: itemCode, ITEM_NAME: itemName, ITEM_GROUP: itemGroup, SALE_RATE: finalSaleRate, SALE_UOM: saleUom }) => {
    addItem({
      itemCode,
      itemName,
      itemGroup,
      finalSaleRate,
      saleUom,
      image:
        "https://img.freepik.com/free-vector/businessman-holding-pencil-big-complete-checklist-with-tick-marks_1150-35019.jpg?t=st=1746508610~exp=1746512210~hmac=bffe01511ed20780fc69db0bdf2fbea126fb78ea57216b6ba027d4b8dd527c53&w=996",
      itemQty: 1,
    });
  };

  const priceFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="mx-auto w-full px-4">
      <h1 className="mt-4 text-center text-5xl font-medium text-gray-800 dark:text-gray-200">
        Simple and Affordable <br /> Pricing Plans
      </h1>

      {loading && (
        <BarLoader
          height={2}
          width="100%"
          className="mt-12"
        />
      )}

      {error && <div className="mt-4 text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceData.map((item) => (
            <Card key={item.ID || item.ITEM_CODE}>
              <CardHeader>
                <CardTitle className="mb-2 text-sm text-gray-400">
                  {item.ITEM_NAME}
                  <Badge className="ml-2">{item.GROUP_LEVEL1}</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4">
                <div className="text-4xl font-semibold">
                  {priceFormatter.format(item.SALE_RATE)}
                  <span className="text-sm text-gray-400">/{item.SALE_UOM || "unit"}</span>
                </div>

                <Button
                  className="w-full bg-gradient-to-tr from-violet-600 via-violet-600 to-indigo-600"
                  onClick={() => handleAddToCart(item)}
                  aria-label={`Add ${item.ITEM_NAME} to cart`}
                >
                  Add to Cart
                </Button>

                <div className="space-y-1 text-sm font-normal text-muted-foreground">
                  <div className="mb-1 font-semibold">Features</div>
                  {item.FEATURES.length > 0 ? (
                    item.FEATURES.map((feature, i) => (
                      <p
                        key={i}
                        className="flex items-center gap-1"
                      >
                        <CircleCheck
                          size={18}
                          className="text-violet-500"
                        />
                        {feature}
                      </p>
                    ))
                  ) : (
                    <p className="flex items-center gap-1">No Features Available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceCategoryListPage;
