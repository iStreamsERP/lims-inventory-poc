import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const ServiceCategoryListPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { cart, addItem } = useCart();

  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      fetchAllServicesData();
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

  const handleAddToCart = (serviceItem) => {
    addItem({
      ITEM_CODE: serviceItem.ITEM_CODE,
      ITEM_NAME: serviceItem.ITEM_NAME,
      ITEM_GROUP: serviceItem.ITEM_GROUP,
      SALE_UOM: serviceItem.SALE_UOM,
      finalSaleRate: serviceItem.SALE_RATE,
      image: "https://img.freepik.com/free-vector/businessman-holding-pencil-big-complete-checklist-with-tick-marks_1150-35019.jpg?t=st=1746508610~exp=1746512210~hmac=bffe01511ed20780fc69db0bdf2fbea126fb78ea57216b6ba027d4b8dd527c53&w=996",
      itemQty: 1,
    });

    toast({ title: "Added to cart" });
  };

  const priceFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="mx-auto w-full">
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
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceData.map((serviceItem) => {
            // Calculate quantity for THIS specific item
            const existingCartItem = cart.find(
              (cartItem) => cartItem.itemCode === serviceItem.ITEM_CODE
            );
            const quantityInCart = existingCartItem?.itemQty || 0;

            return (
              <Card key={serviceItem.ID || serviceItem.ITEM_CODE}>
                <CardHeader>
                  <CardTitle className="mb-2 text-sm text-gray-400">
                    {serviceItem.ITEM_NAME}
                    <Badge className="ml-2">{serviceItem.GROUP_LEVEL1}</Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4">
                  <div className="text-4xl font-semibold">
                    {priceFormatter.format(serviceItem.SALE_RATE)}
                    <span className="text-sm text-gray-400">/{serviceItem.SALE_UOM || "unit"}</span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-tr from-violet-600 via-violet-600 to-indigo-600"
                    onClick={() => handleAddToCart(serviceItem)}
                    aria-label={`Add ${serviceItem.ITEM_NAME} to cart`}
                  >
                    Add to Cart
                  </Button>

                  {/* Display quantity only if item exists in cart */}
                  {quantityInCart > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      Quantity in cart: {quantityInCart}
                    </p>
                  )}

                  <div className="space-y-1 text-sm font-normal text-muted-foreground">
                    <div className="mb-1 font-semibold">Features</div>
                    {serviceItem.FEATURES.length > 0 ? (
                      serviceItem.FEATURES.map((feature, i) => (
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceCategoryListPage;