import AddSubProduct from "@/components/AddSubProduct";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getDataModelFromQueryService, getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function ProductFormPage() {
  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [commandInputValue, setCommandInputValue] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [openCategoryData, setOpenCategoryData] = useState(false);
  const [uomList, setUomList] = useState([]);
  const [openOtherNatureOfBusiness, setOpenOtherNatureOfBusiness] = useState(false);
  const [otherNatureOfBusiness, setOtherNatureOfBusiness] = useState(["color", "size", "length", "width", "height", "weight", "volume", "capacity"]);

  const initialFormData = {
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    ITEM_CODE: "(NEW)",
    UOM_STOCK: "NOS",
    UOM_PURCHASE: "NOS",
    ITEM_F_PUINISH: "NOS",

    NATURE_OF_BUSINESS2: [],
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
    image_file: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductData();
      fetchProductImage();
    }
    fetchCategoryUsingQuery();
    fetchUom();
  }, [id]);

  const validateInput = () => {
    const newError = {};
    if (!formData.ITEM_NAME) newError.ITEM_NAME = "Item name is required.";
    if (!formData.QTY_IN_HAND) newError.QTY_IN_HAND = "Quantity in hand is required.";
    else if (!/^\d+$/.test(formData.QTY_IN_HAND)) newError.QTY_IN_HAND = "Quantity must be a number.";
    if (!formData.SALE_RATE) newError.SALE_RATE = "Sale rate is required.";
    else if (!/^\d+$/.test(formData.SALE_RATE)) newError.SALE_RATE = "Sale rate must be a number.";
    if (!formData.SALE_MARGIN_PTG) newError.SALE_MARGIN_PTG = "Sale margin % is required.";
    else if (!/^\d+$/.test(formData.SALE_MARGIN_PTG)) newError.SALE_MARGIN_PTG = "Margin must be a number.";
    if (!formData.GROUP_LEVEL1) newError.GROUP_LEVEL1 = "Category is required.";
    if (!formData.SUPPLIER_NAME) newError.SUPPLIER_NAME = "Supplier name is required.";
    if (!formData.REMARKS) newError.REMARKS = "Remarks are required.";
    if (!formData.image_file) {
      newError.image_file = "Image is required.";
    }
    return newError;
  };

  const fetchCategoryUsingQuery = async () => {
    try {
      const payload = {
        SQLQuery:
          "SELECT DISTINCT GROUP_LEVEL1 from INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' ORDER BY GROUP_LEVEL1",
      };
      const response = await getDataModelFromQueryService(payload, userData.currentUserLogin, userData.clientURL);
      setCategoryData(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    }
  };

  const fetchProductData = async () => {
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${id}'`,
        Orderby: "",
      };
      const response = await getDataModelService(payload, userData.currentUserLogin, userData.clientURL);
      setFormData((prev) => ({
        ...prev,
        ...(response?.[0] || {}),
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    }
  };

  const fetchProductImage = async () => {
    try {
      const response = await axios.get(
        `https://cloud.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(userData.currentUserLogin)}&fileName=PRODUCT_IMAGE_${id}`,
        {
          responseType: "blob",
        },
      );

      const blob = response.data;

      const mimeType = blob.type;
      const extension = mimeType.split("/")[1] || "png";
      const filename = `PRODUCT_IMAGE_${id}.${extension}`;

      const file = new File([blob], filename, { type: mimeType });

      setFormData((prev) => ({
        ...prev,
        image_file: file,
      }));

      // Optional: Preview the image
      const imagePreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(imagePreviewUrl);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching product image: ${error.message}`,
      });
    }
  };

  const fetchUom = async () => {
    try {
      const payload = {
        DataModelName: "INVT_UOM_MASTER",
        WhereCondition: "",
        Orderby: "",
      };
      const response = await getDataModelService(payload, userData.currentUserLogin, userData.clientURL);

      setUomList((prev) => ({
        ...prev,
        ...response,
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching uom: ${error?.message}`,
      });
    }
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0] || null;
      setFormData((prev) => ({ ...prev, [name]: file }));
      setError((prev) => ({ ...prev, [name]: "" }));

      // generate preview URL
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImage = async (newItemCode) => {
    setLoading(true);

    const file = formData.image_file;

    try {
      if (id) {
        const payload = new FormData();
        payload.append("file", file);
        payload.append("email", userData.currentUserLogin);
        payload.append("fileName", `PRODUCT_IMAGE_DMO000014`);

        const response = await axios.put(
          `https://cloud.istreams-erp.com:4499/api/MaterialImage/update?email=${userData.currentUserLogin}&fileName=PRODUCT_IMAGE_${newItemCode}`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          toast({
            title: "Product saved and image updated!",
          });
        } else {
          toast({
            variant: "destructive",
            title: `image update failed with status: ${response.status}`,
          });
        }
      } else if (newItemCode) {
        const payload = new FormData();
        payload.append("file", file);
        payload.append("email", userData.currentUserLogin);
        payload.append("fileName", `PRODUCT_IMAGE_${newItemCode}`);

        const response = await axios.post("https://cloud.istreams-erp.com:4499/api/MaterialImage/upload", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast({
            title: "Product saved and image uploaded!",
          });
        } else {
          toast({
            variant: "destructive",
            title: `image upload failed with status: ${response.status}`,
          });
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);

      toast({
        variant: "destructive",
        title: "Error saving image.",
        description: error?.response?.data?.message || error?.message || "Unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInput();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      console.log("Validation failed", validationErrors);
      return;
    }
    try {
      setLoading(true);
      const convertedDataModel = convertDataModelToStringData("INVT_MATERIAL_MASTER", formData);

      const payload = {
        UserName: userData.currentUserLogin,
        DModelData: convertedDataModel,
      };

      const response = await saveDataService(payload, userData.currentUserLogin, userData.clientURL);
      const match = response.match(/Item Code Ref\s*'([\w\d]+)'/);
      const newItemCode = match ? match[1] : "(NEW)";

      handleImage(newItemCode);

      if (newItemCode !== "(NEW)") {
        setFormData((prev) => ({
          ...prev,
          ITEM_CODE: newItemCode,
        }));

        toast({
          title: response,
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
    <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="col-span-1 h-full w-full lg:col-span-7">
        <h1 className="title">{formData.ITEM_CODE === "(NEW)" ? "Create Product" : "Edit Product"}</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-4 h-full w-full"
        >
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
                <CardContent>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="w-full">
                      <div className="w-full">
                        <Label htmlFor="itemcode">Item Code</Label>
                        <Input
                          name="ITEM_CODE"
                          id="ITEM_CODE"
                          type="text"
                          placeholder="Type item code (New)"
                          value={formData.ITEM_CODE === "(NEW)" ? "New" : formData.ITEM_CODE}
                          onChange={handleChange}
                          readOnly
                        />
                        {error.ITEM_CODE && <p className="text-xs text-red-500">{error.ITEM_CODE}</p>}
                      </div>

                      <div className="w-full">
                        <Label htmlFor="itemname">Item Name</Label>
                        <Input
                          name="ITEM_NAME"
                          id="ITEM_NAME"
                          type="text"
                          placeholder="Type item name"
                          onChange={handleChange}
                          value={formData.ITEM_NAME}
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
                          value={formData.SUPPLIER_NAME}
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
                          value={formData.SALE_RATE}
                          required
                        />
                        {error.SALE_RATE && <p className="text-xs text-red-500">{error.SALE_RATE}</p>}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="mt-8 w-full text-left">
                        <label
                          htmlFor="image_file"
                          className="flex aspect-square h-[240px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          {formData.image_file ? (
                            <img
                              src={previewUrl}
                              alt={formData.ITEM_NAME}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-center text-xs text-gray-500 dark:text-gray-400">Click to Upload</div>
                          )}
                        </label>
                        <input
                          id="image_file"
                          name="image_file"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                        {error.image_file && <p className="text-xs text-red-500">{error.image_file}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 lg:flex-row">
                    <div className="w-full">
                      <Label htmlFor="margin">Margin %</Label>
                      <Input
                        name="SALE_MARGIN_PTG"
                        id="SALE_MARGIN_PTG"
                        type="text"
                        placeholder="Type margin"
                        onChange={handleChange}
                        value={formData.SALE_MARGIN_PTG}
                        required
                      />
                      {error.SALE_MARGIN_PTG && <p className="text-xs text-red-500">{error.SALE_MARGIN_PTG}</p>}
                    </div>

                    <div className="w-full">
                      <Label htmlFor="QTY_IN_HAND">Quantity</Label>
                      <Input
                        name="QTY_IN_HAND"
                        id="QTY_IN_HAND"
                        type="text"
                        placeholder="Type quantity"
                        onChange={handleChange}
                        value={formData.QTY_IN_HAND || 0}
                        required
                        readOnly
                      />
                      {error.QTY_IN_HAND && <p className="text-sm text-red-500">{error.QTY_IN_HAND}</p>}
                    </div>

                    <div className="w-full">
                      <Label>Category</Label>
                      <Popover
                        open={openCategoryData}
                        onOpenChange={setOpenCategoryData}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                          >
                            {formData.GROUP_LEVEL1
                              ? categoryData.find((item) => item.GROUP_LEVEL1 === formData.GROUP_LEVEL1)?.GROUP_LEVEL1
                              : "Select category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            {/* Capture command input value */}
                            <CommandInput
                              placeholder="Search category..."
                              className="h-9"
                              onValueChange={(value) => setCommandInputValue(value)}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-between">
                                  <span>No category found.</span>
                                  {commandInputValue && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const newValue = capitalizeFirstLetter(commandInputValue.trim());
                                        if (newValue) {
                                          setCategoryData((prev) => [...prev, { GROUP_LEVEL1: newValue }]);
                                          setFormData((prev) => ({
                                            ...prev,
                                            GROUP_LEVEL1: newValue,
                                          }));
                                          setOpenCategoryData(false);
                                          setError((prev) => ({
                                            ...prev,
                                            GROUP_LEVEL1: "",
                                          }));
                                        }
                                      }}
                                    >
                                      Add “{commandInputValue}”
                                    </Button>
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {categoryData.map((item, index) => (
                                  <CommandItem
                                    key={index}
                                    value={item.GROUP_LEVEL1}
                                    onSelect={(currentValue) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        GROUP_LEVEL1: currentValue,
                                      }));
                                      setOpenCategoryData(false);
                                    }}
                                  >
                                    {item.GROUP_LEVEL1}
                                    <Check
                                      className={cn("ml-auto h-4 w-4", formData.GROUP_LEVEL1 === item.GROUP_LEVEL1 ? "opacity-100" : "opacity-0")}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {error.GROUP_LEVEL1 && <p className="text-sm text-red-500">{error.GROUP_LEVEL1}</p>}
                    </div>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="REMARKS">Remarks</Label>
                    <Textarea
                      name="REMARKS"
                      id="REMARKS"
                      placeholder="Enter item features"
                      onChange={handleChange}
                      value={formData.REMARKS}
                    />
                    {error.REMARKS && <p className="text-sm text-red-500">{error.REMARKS}</p>}
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
                              value={formData.ITEM_SIZE}
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
                              value={formData.ITEM_LENGTH}
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
                              value={formData.ITEM_WIDTH}
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
                              value={formData.ITEM_THICKNESS}
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
                              value={formData.ITEM_VOLUME}
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
                              value={formData.ITEM_GROUP}
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
                              value={formData.ITEM_REF}
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
                              value={formData.ITEM_BRAND}
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
                              value={formData.ITEM_COLOR}
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
                              value={formData.MIN_STOCK_LEVEL}
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
                              value={formData.MAX_STOCK_LEVEL}
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
                              value={formData.REORDER_QTY}
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
                              value={formData.REORDER_LEVEL}
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
                              value={formData.MAX_AGE_DAYS}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex justify-center pt-5">
                    <Button disabled={loading}>
                      {loading ? (
                        <BeatLoader
                          color="#000"
                          size={8}
                        />
                      ) : formData.ITEM_CODE === "(NEW)" ? (
                        "Save Product"
                      ) : (
                        "Update Product"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="productconfiguration">
              <Card>
                <CardHeader>
                  <CardTitle>Product Configuration</CardTitle>
                  <CardDescription>Customize product settings such as options, variants, and default behaviors to suit your needs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      This Material Has SubProducts
                    </label>
                  </div>

                  <div className="mt-3 w-full md:w-1/2 mb-2">
                    <Label className="block text-sm font-medium leading-6">Select Other Nature Of Business</Label>

                    <Popover
                      open={openOtherNatureOfBusiness}
                      onOpenChange={setOpenOtherNatureOfBusiness}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openOtherNatureOfBusiness}
                          className="min-h-10 w-full justify-between gap-2 text-left font-normal text-gray-400"
                        >
                          {formData.NATURE_OF_BUSINESS2?.length > 0 ? formData.NATURE_OF_BUSINESS2.join(", ") : "Select other nature of business"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command className="w-full justify-start">
                          <CommandInput
                            placeholder="Search other nature of business"
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No other nature of business found.</CommandEmpty>
                            <CommandGroup>
                              {otherNatureOfBusiness.map((item, index) => (
                                <CommandItem
                                  key={index}
                                  value={item}
                                  onSelect={(currentValue) => {
                                    setFormData((prev) => {
                                      const currentSelections = prev.NATURE_OF_BUSINESS2 || [];
                                      const updated = currentSelections.includes(currentValue)
                                        ? currentSelections.filter((val) => val !== currentValue)
                                        : [...currentSelections, currentValue];
                                      return { ...prev, NATURE_OF_BUSINESS2: updated };
                                    });

                                    setError((prev) => ({
                                      ...prev,
                                      NATURE_OF_BUSINESS2: "",
                                    }));
                                  }}
                                >
                                  {item}
                                  <Check className={cn("ml-auto", formData.NATURE_OF_BUSINESS2.includes(item) ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Button
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? (
                        <BeatLoader
                          color="#000"
                          size={8}
                        />
                      ) : formData.ITEM_CODE === "(NEW)" ? (
                        "Save Product"
                      ) : (
                        "Update Product"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
      <div className="col-span-1 mt-5 h-fit w-full lg:col-span-5 lg:mt-24">
        <AddSubProduct itemcode={formData.ITEM_CODE} />
      </div>
    </div>
  );
}
