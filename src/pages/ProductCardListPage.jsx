import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { callSoapService } from "@/api/callSoapService";
import { formatPrice } from "@/utils/formatPrice";
import { Filter, X, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { addItem } from "@/slices/cartSlice";

const PLACEHOLDER_IMAGE =
  "data:image/png;base64,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";

export default function ProductCardListPage() {
  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const { fetchImageUrl } = useImageAPI();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [tabLoading, setTabLoading] = useState(false);
  const [priceFilter, setPriceFilter] = useState("");
  const [hasVariantsFilter, setHasVariantsFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: id, path: `/category/${id}` },
  ];

  useEffect(() => {
    fetchSubCategories();
    fetchProductList();
    return () => {
      productList.forEach((product) => {
        if (product.imageUrl) URL.revokeObjectURL(product.imageUrl);
      });
    };
  }, [id, activeTab, priceFilter, hasVariantsFilter, minPrice, maxPrice]);

  // Check scroll position
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    // Check scroll position after a short delay to ensure DOM is fully rendered
    const timeout = setTimeout(checkScroll, 300);

    return () => {
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeout);
    };
  }, [subCategories]);

  // Fetch distinct sub-categories
  const fetchSubCategories = async () => {
    setTabLoading(true);
    try {
      const payload = {
        SQLQuery: `SELECT DISTINCT GROUP_LEVEL2 FROM INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 = '${id}' AND GROUP_LEVEL2 IS NOT NULL AND GROUP_LEVEL2 != '' AND ITEM_GROUP = 'PRODUCT'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);
      const categories = response.map((item) => item.GROUP_LEVEL2);
      setSubCategories(categories);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching sub-categories: ${error?.message || "An error occurred"}`,
      });
    } finally {
      setTabLoading(false);
    }
  };

  // Fetch products
  const fetchProductList = async () => {
    setLoading(true);
    try {
      let whereCondition = `GROUP_LEVEL1 = '${id}' AND COST_CODE = 'MXXXX' AND ITEM_GROUP = 'PRODUCT'`;

      if (activeTab !== "ALL") {
        whereCondition += ` AND GROUP_LEVEL2 = '${activeTab}'`;
      }

      if (priceFilter) {
        whereCondition += ` AND SALE_RATE ${
          priceFilter === "under-50"
            ? "< 50"
            : priceFilter === "50-100"
              ? "BETWEEN 50 AND 100"
              : priceFilter === "100-200"
                ? "BETWEEN 100 AND 200"
                : "> 200"
        }`;
      }

      if (hasVariantsFilter) {
        whereCondition += " AND ITEM_CODE IN (SELECT DISTINCT ITEM_CODE FROM INVT_SUBMATERIAL_MASTER)";
      }

      if (minPrice) {
        whereCondition += ` AND SALE_RATE >= ${parseFloat(minPrice)}`;
      }

      if (maxPrice) {
        whereCondition += ` AND SALE_RATE <= ${parseFloat(maxPrice)}`;
      }

      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: whereCondition,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      const updatedList = await Promise.all(
        response.map(async (item) => {
          try {
            const imageUrl = await fetchImageUrl("product", item.ITEM_CODE);
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
      return 0;
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const clearFilters = () => {
    setPriceFilter("");
    setHasVariantsFilter(false);
    setMinPrice("");
    setMaxPrice("");
  };

  const handleAddToCart = (product) => {
    // Create cart item payload
    const cartItem = {
      ITEM_CODE: product.ITEM_CODE,
      ITEM_NAME: product.ITEM_NAME,
      ITEM_GROUP: product.ITEM_GROUP,
      ITEM_SIZE: product.ITEM_SIZE,
      ITEM_FINISH: product.ITEM_FINISH,
      ITEM_TYPE: product.ITEM_TYPE,
      finalSaleRate: product.SALE_RATE,
      itemQty: 1,
      // Add other necessary fields from your cart slice
    };

    dispatch(addItem(cartItem));

    toast({
      title: "Added to cart",
      description: `${product.ITEM_NAME} has been added to your cart`,
    });
  };

  const filteredProducts = productList.filter((product) => {
    if (priceFilter === "under-50" && product.SALE_RATE >= 50) return false;
    if (priceFilter === "50-100" && (product.SALE_RATE < 50 || product.SALE_RATE > 100)) return false;
    if (priceFilter === "100-200" && (product.SALE_RATE < 100 || product.SALE_RATE > 200)) return false;
    if (priceFilter === "over-200" && product.SALE_RATE <= 200) return false;
    if (hasVariantsFilter && product.subProductCount === 0) return false;
    if (minPrice && product.SALE_RATE < parseFloat(minPrice)) return false;
    if (maxPrice && product.SALE_RATE > parseFloat(maxPrice)) return false;
    return true;
  });

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Price Range</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {["under-50", "50-100", "100-200", "over-200"].map((range) => (
              <Button
                key={range}
                variant={priceFilter === range ? "default" : "outline"}
                className="h-8 text-xs"
                onClick={() => setPriceFilter(priceFilter === range ? "" : range)}
              >
                {range === "under-50" ? "Under $50" : range === "50-100" ? "$50-$100" : range === "100-200" ? "$100-$200" : "Over $200"}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Custom Price Range</p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-8 text-xs"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Product Attributes</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="variants"
            checked={hasVariantsFilter}
            onCheckedChange={(checked) => setHasVariantsFilter(checked)}
          />
          <Label
            htmlFor="variants"
            className="text-sm font-medium"
          >
            Has Variants
          </Label>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-2 overflow-x-hidden">
      <h1 className="title">Explore {id}</h1>

      <div className="flex flex-col gap-2 lg:flex-row">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden w-full flex-shrink-0 lg:block lg:w-72">
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
            <FilterSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filters Button */}
          <div className="mb-2 flex justify-end lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px]"
              >
                <SheetHeader>
                  <SheetTitle>Product Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sub-category Tabs */}
          <div className="relative mb-2">
            <div className="relative">
              {showLeftScroll && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleScroll("left")}
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}

              <div
                ref={scrollContainerRef}
                className="scrollbar-hide flex w-full gap-2 overflow-x-auto scroll-smooth pb-2"
                onScroll={() => {
                  if (scrollContainerRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                    setShowLeftScroll(scrollLeft > 0);
                    setShowRightScroll(scrollLeft < scrollWidth - clientWidth);
                  }
                }}
              >
                <Button
                  variant={activeTab === "ALL" ? "default" : "outline"}
                  onClick={() => setActiveTab("ALL")}
                  className="min-w-[80px] flex-shrink-0"
                >
                  ALL
                </Button>

                {tabLoading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-10 w-24 flex-shrink-0 animate-pulse rounded-lg bg-gray-200"
                        />
                      ))
                  : subCategories.map((subCat, index) => (
                      <Button
                        key={index}
                        variant={activeTab === subCat ? "default" : "outline"}
                        onClick={() => setActiveTab(subCat)}
                        className="min-w-[100px] flex-shrink-0 whitespace-nowrap"
                      >
                        {subCat}
                      </Button>
                    ))}
              </div>

              {showRightScroll && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleScroll("right")}
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(priceFilter || hasVariantsFilter || minPrice || maxPrice) && (
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium">Active filters:</span>

              {priceFilter && (
                <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  Price:{" "}
                  {priceFilter === "under-50"
                    ? "Under $50"
                    : priceFilter === "50-100"
                      ? "$50-$100"
                      : priceFilter === "100-200"
                        ? "$100-$200"
                        : "Over $200"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-blue-800 hover:bg-blue-200"
                    onClick={() => setPriceFilter("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {(minPrice || maxPrice) && (
                <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  Price: {minPrice ? `$${minPrice}` : "Any"} - {maxPrice ? `$${maxPrice}` : "Any"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-blue-800 hover:bg-blue-200"
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {hasVariantsFilter && (
                <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  Has Variants
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-blue-800 hover:bg-blue-200"
                    onClick={() => setHasVariantsFilter(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <Button
                variant="link"
                className="h-auto p-0 text-sm text-red-600"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <Card
                    key={index}
                    className="animate-pulse"
                  >
                    <div className="aspect-square w-full rounded-t-lg bg-gray-200" />
                    <CardContent className="p-3">
                      <div className="mb-2 h-4 rounded bg-gray-200" />
                      <div className="h-4 w-1/2 rounded bg-gray-200" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-gray-100" />
              <div className="mb-2 text-lg font-medium text-gray-800">No products found</div>
              <p className="mb-6 max-w-md text-gray-600">Try adjusting your filters or selecting a different category</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md">
                      <Link to={`/product-detail/${product.ITEM_CODE}`}>
                        <div className="relative flex aspect-square items-center justify-center bg-gray-50">
                          {product?.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.ITEM_NAME}
                              loading="lazy"
                              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <div className="h-16 w-16 rounded-lg bg-gray-200" />
                              <span className="mt-2 text-xs">No Image</span>
                            </div>
                          )}

                          {product.subProductCount > 0 && (
                            <div className="absolute right-2 top-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              {product.subProductCount} variants
                            </div>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-3">
                        <Link to={`/product-detail/${product.ITEM_CODE}`}>
                          <h2
                            className="mb-1 line-clamp-1 text-sm font-medium text-gray-800"
                            title={product.ITEM_NAME}
                          >
                            {product.ITEM_NAME}
                          </h2>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">{formatPrice(product.SALE_RATE)}</span>
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
