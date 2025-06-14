import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import { formatPrice } from "@/utils/formatPrice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const { cart, addItem } = useCart();

  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductVariants();
  }, [id]);

  useEffect(() => {
    if (variants.length) {
      const subs = variants[0].subProducts;

      const allColors = Array.from(new Set(subs.map((s) => s.itemColor))).filter(Boolean);
      const allSizes = Array.from(new Set(subs.map((s) => s.itemSize))).filter(Boolean);
      const allVariants = Array.from(new Set(subs.map((s) => s.itemVariant))).filter(Boolean);

      // pick the first of each (or leave blank if none)
      setSelectedColor(allColors[0] || "");
      setSelectedSize(allSizes[0] || "");
      setSelectedVariant(allVariants[0] || "");
    }
  }, [variants]);

  const fetchProductVariants = async () => {
    setLoading(true);
    try {
      const payload = {
        SQLQuery: `SELECT 
          m.ITEM_CODE AS itemCode, 
          m.ITEM_NAME AS itemName, 
          m.SALE_RATE AS mainSaleRate,
          m.ITEM_BRAND AS itemBrand,
          m.GROUP_LEVEL1 AS category,
          m.UOM_STOCK AS uomStock,
          m.ITEM_GROUP AS itemGroup,
          (
            SELECT 
              s.ITEM_CODE,
              s.ITEM_NAME, 
              s.SUB_MATERIAL_NO AS subProductNo,
              s.ITEM_FINISH AS itemColor, 
              s.ITEM_SIZE AS itemSize, 
              s.ITEM_TYPE AS itemVariant,
              COALESCE(s.SALE_RATE, m.SALE_RATE) AS finalSaleRate
            FROM INVT_SUBMATERIAL_MASTER s
            WHERE s.ITEM_CODE = m.ITEM_CODE
            FOR JSON PATH
          ) AS subProducts
        FROM INVT_MATERIAL_MASTER m
        WHERE m.ITEM_CODE = '${id}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      const normalized = await Promise.all(
        response.map(async (item) => {
          const parsed = item.subProducts && typeof item.subProducts === "string" ? JSON.parse(item.subProducts) : [];

          // Fetch main image once per item
          const mainImage = await fetchProductImage(item.itemCode);

          const subs = parsed.length
            ? parsed
            : [
                {
                  itemCode: item.itemCode,
                  itemName: item.itemName,
                  subProductNo: null,
                  itemColor: null,
                  itemSize: null,
                  itemVariant: null,
                  finalSaleRate: item.mainSaleRate,
                },
              ];

          const subsWithImages = await Promise.all(
            subs.map(async (sub) => {
              let image;
              if (sub.subProductNo && String(sub.subProductNo).trim() !== "") {
                // Attempt to fetch sub-product image, fallback to main image if it fails
                try {
                  image = await fetchSubProductImage(sub.ITEM_CODE, sub.subProductNo);
                } catch {
                  image = mainImage;
                }
              } else {
                image = mainImage;
              }
              return { ...sub, image };
            }),
          );

          // Use the pre-fetched main image for the item
          return { ...item, image: mainImage, subProducts: subsWithImages };
        }),
      );

      setVariants(normalized);
    } catch (err) {
      toast({ variant: "destructive", title: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImage = async (code) => {
    try {
      const { data } = await axios.get(
        `https://apps.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(userData.userEmail)}&fileName=PRODUCT_IMAGE_${code}`,
        { responseType: "blob" },
      );
      return URL.createObjectURL(data);
    } catch {
      return null;
    }
  };

  const fetchSubProductImage = async (code, no) => {
    try {
      const { data } = await axios.get(
        `https://apps.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(
          userData.userEmail,
        )}&fileName=SUB_PRODUCT_IMAGE_${code}_${no}`,
        { responseType: "blob" },
      );
      return URL.createObjectURL(data);
    } catch {
      return null;
    }
  };

  if (loading)
    return (
      <BarLoader
        height={2}
        width="100%"
      />
    );
  if (!variants.length) return <p className="mt-4 text-center">No product found.</p>;

  return (
    <>
      {variants.map((item) => {
        const subs = item.subProducts;
        const allColors = Array.from(new Set(subs.map((s) => s.itemColor))).filter(Boolean);
        const allSizes = Array.from(new Set(subs.map((s) => s.itemSize))).filter(Boolean);
        const allVariants = Array.from(new Set(subs.map((s) => s.itemVariant))).filter(Boolean);

        const availableColors = allColors.filter((c) =>
          subs.some(
            (s) => s.itemColor === c && (!selectedSize || s.itemSize === selectedSize) && (!selectedVariant || s.itemVariant === selectedVariant),
          ),
        );

        const availableSizes = allSizes.filter((sz) =>
          subs.some(
            (s) => s.itemSize === sz && (!selectedColor || s.itemColor === selectedColor) && (!selectedVariant || s.itemVariant === selectedVariant),
          ),
        );

        const availableVariants = allVariants.filter((v) =>
          subs.some(
            (s) => s.itemVariant === v && (!selectedColor || s.itemColor === selectedColor) && (!selectedSize || s.itemSize === selectedSize),
          ),
        );

        const chosen = subs.find((s) => s.itemColor === selectedColor && s.itemSize === selectedSize && s.itemVariant === selectedVariant) || subs[0];

        const handleClick = (dim, value, availableSet) => {
          setError("");

          if (!value) {
            if (dim === "color") {
              setSelectedColor("");
              setSelectedSize("");
              setSelectedVariant("");
            } else if (dim === "size") {
              setSelectedSize("");
              setSelectedVariant("");
            } else {
              setSelectedVariant("");
            }
            return;
          }

          if (!availableSet.includes(value)) {
            setError(`${dim} '${value}' not available`);
            return;
          }
          if (dim === "color") {
            setSelectedColor(value);
            setSelectedSize("");
            setSelectedVariant("");
          } else if (dim === "size") {
            setSelectedSize(value);
            setSelectedVariant("");
          } else {
            setSelectedVariant(value);
          }
        };

        const existingCartItem = cart.find(
          (item) =>
            item.itemCode === chosen.itemCode &&
            (item.itemColor || "") === (chosen.itemColor || "") &&
            (item.itemSize || "") === (chosen.itemSize || "") &&
            (item.itemVariant || "") === (chosen.itemVariant || ""),
        );

        const quantityInCart = existingCartItem ? existingCartItem.itemQty : 0;

        const handleAddToCart = () => {
          addItem({
            ...chosen,
            uomStock: item.uomStock,
            itemGroup: item.itemGroup,
            itemQty: 1,
          });
          toast({ title: "Added to cart" });
        };

        return (
          <Card
            key={item.itemCode}
            className="mx-auto w-full p-6"
          >
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-1/2">
                <div className="h-96 w-full overflow-hidden rounded-lg bg-neutral-300">
                  <img
                    src={chosen.image || item.image}
                    alt={item.itemName}
                    className="h-full w-full object-contain"
                  />
                </div>
                <Separator />
              </div>

              <div className="flex-1">
                <p className="text-xl font-semibold">{item.itemName}</p>
                <p className="mb-3 text-sm text-muted-foreground">
                  {item.itemBrand || "Brand not available"}, <span>{item.category}</span>
                </p>
                <Badge variant="outline">4.3 ★</Badge>

                {allColors.length > 0 && (
                  <div>
                    <Label>Select Color</Label>
                    <ToggleGroup
                      type="single"
                      value={selectedColor}
                      onValueChange={(val) => handleClick("color", val, availableColors)}
                      className="flex flex-wrap justify-start gap-2"
                    >
                      {allColors.map((c) => (
                        <ToggleGroupItem
                          key={c}
                          value={c}
                          disabled={!availableColors.includes(c)}
                        >
                          {c}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                )}

                {allSizes.length > 0 && (
                  <div>
                    <Label>Select Size</Label>
                    <ToggleGroup
                      type="single"
                      value={selectedSize}
                      onValueChange={(val) => handleClick("size", val, availableSizes)}
                      className="flex flex-wrap justify-start gap-2"
                    >
                      {allSizes.map((sz) => (
                        <ToggleGroupItem
                          key={sz}
                          value={sz}
                          disabled={!availableSizes.includes(sz)}
                        >
                          {sz}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                )}

                {allVariants.length > 0 && (
                  <div>
                    <Label>Select Variant</Label>
                    <ToggleGroup
                      type="single"
                      value={selectedVariant}
                      onValueChange={(val) => handleClick("variant", val, availableVariants)}
                      className="flex flex-wrap justify-start gap-2"
                    >
                      {allVariants.map((v) => (
                        <ToggleGroupItem
                          key={v}
                          value={v}
                          disabled={!availableVariants.includes(v)}
                        >
                          {v}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                )}

                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

                <div className="mt-4 flex">
                  {/* Reset Filters Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedColor("");
                      setSelectedSize("");
                      setSelectedVariant("");
                      setError("");
                    }}
                  >
                    Reset
                  </Button>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      /* buy now */
                    }}
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Add quantity display here */}
                {quantityInCart > 0 && <p className="mt-2 text-sm text-gray-500">Quantity in cart: {quantityInCart}</p>}

                <p className="mt-4 text-2xl font-bold">{formatPrice(chosen.finalSaleRate)}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default ProductDetailPage;
