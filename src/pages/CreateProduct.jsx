import AddSubProduct from "@/components/AddSubProduct";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function CreateProduct() {
  const { id: itemCodeParams } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const fileInput = useRef(null);

  const initialProductFormData = {
    COMPANY_CODE: "1",
    BRANCH_CODE: "1",
    ITEM_CODE: "(NEW)",
    UOM_STOCK: "NOS",
    UOM_PURCHASE: "NOS",
    ITEM_F_PUINISH: "NOS",
    GROUP_LEVEL1: "",
    GROUP_LEVEL2: "consumables",
    GROUP_LEVEL3: "consumables",
    COST_CODE: "MXXXX",
    ITEM_NAME: "",
    ITEM_GROUP: "PRODUCT",
    SUPPLIER_NAME: "",
    SALE_RATE: "",
    SALE_MARGIN_PTG: "",
    QTY_IN_HAND: "",
    REMARKS: "",
    img: "",
  };

  const [productFormData, setProductFormData] = useState(initialProductFormData);

  const itemType = ["Electronics", "Apparel", "Furniture", "Grocery", "Books", "Toys", "Beauty", "Stationery"];

  const validateInput = () => {
    const newError = {};

    if (!productFormData.ITEM_NAME) newError.ITEM_NAME = "Item name is required.";
    if (!productFormData.QTY_IN_HAND) newError.QTY_IN_HAND = "Quantity in hand is required.";
    else if (!/^\d+$/.test(productFormData.QTY_IN_HAND)) newError.QTY_IN_HAND = "Quantity must be a number.";

    if (!productFormData.SALE_RATE) newError.SALE_RATE = "Sale rate is required.";
    else if (!/^\d+$/.test(productFormData.SALE_RATE)) newError.SALE_RATE = "Sale rate must be a number.";

    if (!productFormData.SALE_MARGIN_PTG) newError.SALE_MARGIN_PTG = "Sale margin % is required.";
    else if (!/^\d+$/.test(productFormData.SALE_MARGIN_PTG)) newError.SALE_MARGIN_PTG = "Margin must be a number.";

    if (!productFormData.GROUP_LEVEL1) newError.GROUP_LEVEL1 = "Category is required.";
    if (!productFormData.SUPPLIER_NAME) newError.SUPPLIER_NAME = "Supplier name is required.";
    if (!productFormData.REMARKS) newError.REMARKS = "Remarks are required.";

    if (!productFormData.img) {
      newError.img = "Image is required.";
    }

    return newError;
  };

  useEffect(() => {
    if (itemCodeParams) {
      fetchProductMaterialData();
    }
  }, [itemCodeParams]);

  const fetchProductMaterialData = async () => {
    setLoading(true);
    setError({});
    try {
      const ProductDataPayload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${itemCodeParams}'`,
        Orderby: "",
      };

      const data = await getDataModelService(ProductDataPayload, userData.currentUserLogin, userData.clientURL);
      setProductFormData((prev) => ({
        ...prev,
        ...(data?.[0] || {}),
      }));
    } catch (error) {
      setError({ fetch: error.message });
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProductFormData((prev) => ({ ...prev, img: imageUrl }));
      setError((prev) => ({ ...prev, img: "" })); // Clear image error
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger;
    const validationErrors = validateInput();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      console.log("Validation failed", validationErrors);
      return;
    }
    try {
      setLoading(true);
      const convertedDataModel = convertDataModelToStringData("INVT_MATERIAL_MASTER", productFormData);
      const ProductPayload = {
        UserName: userData.currentUserLogin,
        DModelData: convertedDataModel,
      };
      const saveDataServiceResponse = await saveDataService(ProductPayload, userData.currentUserLogin, userData.clientURL);
      const match = saveDataServiceResponse.match(/Item Code Ref\s*'([\w\d]+)'/);
      const newitemcode = match ? match[1] : "(NEW)";

      if (newitemcode !== "(NEW)") {
        setProductFormData((prev) => ({
          ...prev,
          ITEM_CODE: newitemcode,
        }));

        toast({
          title: saveDataServiceResponse,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">{productFormData.ITEM_CODE === "(NEW)" ? "Create Product" : "Edit Product"}</h1>
      <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-[70%]"
        >
          <div className="col-span-2">
            <Tabs defaultValue="productdetails">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="productdetails">Product Details</TabsTrigger>
                <TabsTrigger value="productconfiguration">Product Configuration</TabsTrigger>
              </TabsList>
              <TabsContent value="productdetails">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription> Provide essential information to define and manage your product.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="mb-1 flex flex-col gap-3 md:flex-row">
                        <div className="w-full">
                          <div className="w-full">
                            <Label htmlFor="itemcode">Item Code</Label>
                            <Input
                              name="ITEM_CODE"
                              id="ITEM_CODE"
                              type="text"
                              placeholder="Type item code (New)"
                              value={productFormData.ITEM_CODE}
                              onChange={handleChange}
                              readOnly
                            />
                            {error.ITEM_CODE && <p className="text-xs text-red-500">{error.ITEM_CODE}</p>}

                            <Label htmlFor="itemname">Item Name</Label>
                            <Input
                              name="ITEM_NAME"
                              id="ITEM_NAME"
                              type="text"
                              placeholder="Type item name"
                              onChange={handleChange}
                              value={productFormData.ITEM_NAME}
                              required
                            />
                            {error.ITEM_NAME && <p className="text-xs text-red-500">{error.ITEM_NAME}</p>}
                          </div>

                          <div className="w-full">
                            <Label htmlFor="SUPPLIER_NAME">Supplier Ref</Label>
                            <Input
                              name="SUPPLIER_NAME"
                              id="SUPPLIER_NAME"
                              type="text"
                              placeholder="Type supplier ref"
                              onChange={handleChange}
                              value={productFormData.SUPPLIER_NAME}
                              required
                            />
                            {error.SUPPLIER_NAME && <p className="text-xs text-red-500">{error.SUPPLIER_NAME}</p>}
                          </div>

                          <div className="w-full">
                            <Label htmlFor="SALE_RATE">Sales Price</Label>
                            <Input
                              name="SALE_RATE"
                              id="SALE_RATE"
                              type="text"
                              placeholder="Type sales price"
                              onChange={handleChange}
                              value={productFormData.SALE_RATE}
                              required
                            />
                            {error.SALE_RATE && <p className="text-xs text-red-500">{error.SALE_RATE}</p>}
                          </div>

                          <div className="w-full">
                            <Label htmlFor="margin">Margin %</Label>
                            <Input
                              name="SALE_MARGIN_PTG"
                              id="SALE_MARGIN_PTG"
                              type="text"
                              placeholder="Type margin"
                              onChange={handleChange}
                              value={productFormData.SALE_MARGIN_PTG}
                              required
                            />
                            {error.SALE_MARGIN_PTG && <p className="text-xs text-red-500">{error.SALE_MARGIN_PTG}</p>}
                          </div>
                        </div>
                        <div className="mt-8 w-full text-left">
                          <div
                            className="flex aspect-square h-[100%] w-[100%] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 lg:aspect-video 2xl:h-[300px] 2xl:w-[800px]"
                            onClick={() => fileInput.current?.click()}
                          >
                            {productFormData.img ? (
                              <img
                                src={productFormData.img}
                                alt="Product preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="text-center text-xs text-gray-500 dark:text-gray-400">Click to Upload</div>
                            )}
                          </div>

                          <input
                            name="productImage"
                            type="file"
                            accept="image/*"
                            ref={fileInput}
                            onChange={handleProductImageUpload}
                            className="hidden"
                          />

                          {error.img && <p className="text-xs text-red-500">{error.img}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 md:flex-row">
                        <div className="w-full">
                          <Label>Category</Label>
                          <Select
                            value={productFormData.GROUP_LEVEL1}
                            onValueChange={(value) =>
                              setProductFormData((prev) => ({
                                ...prev,
                                GROUP_LEVEL1: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {itemType.map((type) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                >
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {error.GROUP_LEVEL1 && <p className="text-sm text-red-500">{error.GROUP_LEVEL1}</p>}
                        </div>
                        <div className="w-full">
                          <Label htmlFor="QTY_IN_HAND">Quantity</Label>
                          <Input
                            name="QTY_IN_HAND"
                            id="QTY_IN_HAND"
                            type="text"
                            placeholder="Type quantity"
                            onChange={handleChange}
                            value={productFormData.QTY_IN_HAND}
                            required
                          />
                          {error.QTY_IN_HAND && <p className="text-sm text-red-500">{error.QTY_IN_HAND}</p>}
                        </div>
                      </div>
                      <div className="mb-3 flex w-full flex-col gap-3 md:flex-row">
                        <div className="w-full">
                          <Label htmlFor="REMARKS">Remarks</Label>
                          <Textarea
                            name="REMARKS"
                            id="REMARKS"
                            placeholder="Enter item features"
                            onChange={handleChange}
                            value={productFormData.REMARKS}
                          />
                          {error.REMARKS && <p className="text-sm text-red-500">{error.REMARKS}</p>}
                        </div>
                      </div>
                    </div>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Specifications</AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-full">
                              <Label htmlFor="ITEM_SIZE">Size</Label>
                              <Input
                                name="ITEM_SIZE"
                                id="ITEM_SIZE"
                                type="text"
                                placeholder="Type size"
                                onChange={handleChange}
                                value={productFormData.ITEM_SIZE}
                              />
                            </div>
                            <div className="w-full">
                              <Label htmlFor="ITEM_LENGTH">Length</Label>
                              <Input
                                name="ITEM_LENGTH"
                                id="ITEM_LENGTH"
                                type="text"
                                placeholder="Type length"
                                onChange={handleChange}
                                value={productFormData.ITEM_LENGTH}
                              />
                            </div>
                          </div>

                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-full">
                              <Label htmlFor="ITEM_WIDTH">Width</Label>
                              <Input
                                name="ITEM_WIDTH"
                                id="ITEM_WIDTH"
                                type="text"
                                placeholder="Type width"
                                onChange={handleChange}
                                value={productFormData.ITEM_WIDTH}
                              />
                            </div>

                            <div className="w-full">
                              <Label htmlFor="ITEM_THICKNESS">Thickness</Label>
                              <Input
                                name="ITEM_THICKNESS"
                                id="ITEM_THICKNESS"
                                type="text"
                                placeholder="Type thickness"
                                onChange={handleChange}
                                value={productFormData.ITEM_THICKNESS}
                              />
                            </div>
                          </div>

                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-1/2">
                              <Label htmlFor="ITEM_VOLUME">Volume</Label>
                              <Input
                                name="ITEM_VOLUME"
                                id="ITEM_VOLUME"
                                type="text"
                                placeholder="Type volume"
                                onChange={handleChange}
                                value={productFormData.ITEM_VOLUME}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Other Reference</AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-full">
                              <Label htmlFor="ITEM_GROUP">Group ref</Label>
                              <Input
                                name="ITEM_GROUP"
                                id="ITEM_GROUP"
                                type="text"
                                placeholder="Type group ref"
                                onChange={handleChange}
                                value={productFormData.ITEM_GROUP}
                                readOnly
                              />
                            </div>
                            <div className="w-full">
                              <Label htmlFor="ITEM_REF">Item ref</Label>
                              <Input
                                name="ITEM_REF"
                                id="ITEM_REF"
                                type="text"
                                placeholder="Type Item ref"
                                onChange={handleChange}
                                value={productFormData.ITEM_REF}
                              />
                            </div>
                          </div>
                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-full">
                              <Label htmlFor="ITEM_BRAND">Brand</Label>
                              <Input
                                name="ITEM_BRAND"
                                id="ITEM_BRAND"
                                type="text"
                                placeholder="Type brand"
                                onChange={handleChange}
                                value={productFormData.ITEM_BRAND}
                              />
                            </div>

                            <div className="w-full">
                              <Label htmlFor="ITEM_COLOR">Color</Label>
                              <Input
                                name="ITEM_COLOR"
                                id="ITEM_COLOR"
                                type="text"
                                placeholder="Type color"
                                onChange={handleChange}
                                value={productFormData.ITEM_COLOR}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Stocks</AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-full">
                              <Label htmlFor="MIN_STOCK_LEVEL">Min Quantity</Label>
                              <Input
                                name="MIN_STOCK_LEVEL"
                                id="MIN_STOCK_LEVEL"
                                type="text"
                                placeholder="Type Min quantity"
                                onChange={handleChange}
                                value={productFormData.MIN_STOCK_LEVEL}
                              />
                            </div>
                            <div className="w-full">
                              <Label htmlFor="MAX_STOCK_LEVEL">Max Quantity</Label>
                              <Input
                                name="MAX_STOCK_LEVEL"
                                id="MAX_STOCK_LEVEL"
                                type="text"
                                placeholder="Type Max quantity"
                                onChange={handleChange}
                                value={productFormData.MAX_STOCK_LEVEL}
                              />
                            </div>
                          </div>

                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-full">
                              <Label htmlFor="REORDER_QTY">Re-Order Quantity</Label>
                              <Input
                                name="REORDER_QTY"
                                id="REORDER_QTY"
                                type="text"
                                placeholder="Type Re-Order Quantity"
                                onChange={handleChange}
                                value={productFormData.REORDER_QTY}
                              />
                            </div>

                            <div className="w-full">
                              <Label htmlFor="REORDER_LEVEL">Re-Order Alert Quantity</Label>
                              <Input
                                name="REORDER_LEVEL"
                                id="REORDER_LEVEL"
                                type="text"
                                placeholder="Type Re-Order Alert Quantity"
                                onChange={handleChange}
                                value={productFormData.REORDER_LEVEL}
                              />
                            </div>
                          </div>

                          <div className="mb-3 flex flex-col gap-3 md:flex-row">
                            <div className="w-1/2">
                              <Label htmlFor="MAX_AGE_DAYS">Max Life Days</Label>
                              <Input
                                name="MAX_AGE_DAYS"
                                id="MAX_AGE_DAYS"
                                type="text"
                                placeholder="Type Max Life Days"
                                onChange={handleChange}
                                value={productFormData.MAX_AGE_DAYS}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="productconfiguration">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Configuration</CardTitle>
                    <CardDescription>Customize product settings such as options, variants, and default behaviors to suit your needs.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2"></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="mb-4 mt-4 flex w-full justify-center">
              <Button disabled={loading}>
                {loading ? (
                  <BeatLoader
                    color="#000"
                    size={8}
                  />
                ) : productFormData.ITEM_CODE === "(NEW)" ? (
                  "Save Product"
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </div>
        </form>

        <AddSubProduct itemcode={productFormData.ITEM_CODE} />
      </div>
    </div>
  );
}
