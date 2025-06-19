import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { callSoapService } from "@/services/callSoapService";
import { formatPrice } from "@/utils/formatPrice";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const { cart, addItem } = useCart();
  const { fetchImageUrl } = useImageAPI();

  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [error, setError] = useState("");

  // Cleanup object URLs when component unmounts or variants change
  useEffect(() => {
    return () => {
      variants.forEach((variant) => {
        if (variant.image) URL.revokeObjectURL(variant.image);
        variant.subProducts.forEach((sub) => {
          if (sub.image) URL.revokeObjectURL(sub.image);
        });
      });
    };
  }, [variants]);

  // Set default selections when variants change
  useEffect(() => {
    if (variants.length) {
      const subs = variants[0].subProducts;

      const allColors = [...new Set(subs.map((s) => s.ITEM_FINISH))].filter(Boolean);
      const allSizes = [...new Set(subs.map((s) => s.ITEM_SIZE))].filter(Boolean);
      const allVariants = [...new Set(subs.map((s) => s.ITEM_TYPE))].filter(Boolean);

      setSelectedColor(allColors[0] || "");
      setSelectedSize(allSizes[0] || "");
      setSelectedVariant(allVariants[0] || "");
    }
  }, [variants]);

  const fetchProductVariants = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        SQLQuery: `SELECT 
          m.ITEM_CODE, 
          m.ITEM_NAME, 
          m.SALE_RATE AS mainSaleRate,
          m.ITEM_BRAND,
          m.GROUP_LEVEL1,
          m.UOM_STOCK,
          m.ITEM_GROUP,
          (
            SELECT 
              s.ITEM_CODE,
              s.ITEM_NAME, 
              s.SUB_MATERIAL_NO,
              s.ITEM_FINISH, 
              s.ITEM_SIZE, 
              s.ITEM_TYPE,
              COALESCE(s.SALE_RATE, m.SALE_RATE) AS finalSaleRate
            FROM INVT_SUBMATERIAL_MASTER s
            WHERE s.ITEM_CODE = m.ITEM_CODE
            FOR JSON PATH
          ) AS subProducts
        FROM INVT_MATERIAL_MASTER m
        WHERE m.ITEM_CODE = '${id}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      // Process variants with images
      const normalized = await Promise.all(
        response.map(async (item) => {
          const parsed = item.subProducts && typeof item.subProducts === "string" ? JSON.parse(item.subProducts) : [];

          // Fetch main image once per item
          const mainImage = await fetchImageUrl("product", item.ITEM_CODE);

          const subs = parsed.length
            ? parsed
            : [
                {
                  ITEM_CODE: item.ITEM_CODE,
                  ITEM_NAME: item.ITEM_NAME,
                  SUB_MATERIAL_NO: null,
                  ITEM_FINISH: null,
                  ITEM_SIZE: null,
                  ITEM_TYPE: null,
                  finalSaleRate: item.mainSaleRate,
                },
              ];

          const subsWithImages = await Promise.all(
            subs.map(async (sub) => {
              let image = null;

              try {
                if (sub.SUB_MATERIAL_NO && String(sub.SUB_MATERIAL_NO).trim() !== "") {
                  image = await fetchImageUrl("subproduct", sub.ITEM_CODE, sub.SUB_MATERIAL_NO);
                } else {
                  image = mainImage;
                }
              } catch (error) {
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
  }, [id, userData, fetchImageUrl, toast]);

  useEffect(() => {
    fetchProductVariants();
  }, [fetchProductVariants]);

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
        const allColors = Array.from(new Set(subs.map((s) => s.ITEM_FINISH))).filter(Boolean);
        const allSizes = Array.from(new Set(subs.map((s) => s.ITEM_SIZE))).filter(Boolean);
        const allVariants = Array.from(new Set(subs.map((s) => s.ITEM_TYPE))).filter(Boolean);

        const availableColors = allColors.filter((c) =>
          subs.some(
            (s) => s.ITEM_FINISH === c && (!selectedSize || s.ITEM_SIZE === selectedSize) && (!selectedVariant || s.ITEM_TYPE === selectedVariant),
          ),
        );

        const availableSizes = allSizes.filter((sz) =>
          subs.some(
            (s) => s.ITEM_SIZE === sz && (!selectedColor || s.ITEM_FINISH === selectedColor) && (!selectedVariant || s.ITEM_TYPE === selectedVariant),
          ),
        );

        const availableVariants = allVariants.filter((v) =>
          subs.some(
            (s) => s.ITEM_TYPE === v && (!selectedColor || s.ITEM_FINISH === selectedColor) && (!selectedSize || s.ITEM_SIZE === selectedSize),
          ),
        );

        const chosen = subs.find((s) => s.ITEM_FINISH === selectedColor && s.ITEM_SIZE === selectedSize && s.ITEM_TYPE === selectedVariant) || subs[0];

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
            item.ITEM_CODE === chosen.ITEM_CODE &&
            (item.ITEM_FINISH || "") === (chosen.ITEM_FINISH || "") &&
            (item.ITEM_SIZE || "") === (chosen.ITEM_SIZE || "") &&
            (item.ITEM_TYPE || "") === (chosen.ITEM_TYPE || ""),
        );

        const quantityInCart = existingCartItem ? existingCartItem.itemQty : 0;

        const handleAddToCart = () => {
          addItem({
            ...chosen,
            image: undefined,
            UOM_STOCK: item.UOM_STOCK,
            ITEM_GROUP: item.ITEM_GROUP,
            itemQty: 1,
          });
          toast({ title: "Added to cart" });
        };

        return (
          <Card
            key={item.ITEM_CODE}
            className="mx-auto w-full p-6"
          >
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-1/2">
                <div className="h-96 w-full overflow-hidden rounded-lg bg-neutral-300">
                  <img
                    src={chosen.image || item.image}
                    alt={item.ITEM_NAME}
                    className="h-full w-full object-contain"
                  />
                </div>
                <Separator />
              </div>

              <div className="flex-1">
                <p className="text-xl font-semibold">{item.ITEM_NAME}</p>
                <p className="mb-3 text-sm text-muted-foreground">
                  {item.ITEM_BRAND || "Brand not available"}, <span>{item.GROUP_LEVEL1}</span>
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
