import { useFormik } from "formik";
import * as Yup from "yup";
import AddSubProduct from "@/components/AddSubProduct";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { cn } from "@/lib/utils";
import { callSoapService } from "@/services/callSoapService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { toTitleCase } from "@/utils/stringUtils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function ProductFormPage() {
  const initialFormData = {
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    ITEM_CODE: "(NEW)",
    ITEM_NAME: "",
    ITEM_FINISH: "",
    ITEM_SIZE: "",
    ITEM_TYPE: "",
    GROUP_LEVEL1: "",
    SUB_MATERIAL_BASED_ON: [],
    SUPPLIER_NAME: "",
    SALE_RATE: "",
    SALE_MARGIN_PTG: "",
    SUBMATERIAL_CONVRATE: 1,
    SALE_UOM: "",
    REMARKS: "",
    SUB_MATERIALS_MODE: "F",
    image_file: null,
    COST_CODE: "MXXXX",
    ITEM_GROUP: "PRODUCT",
    UOM_STOCK: "",
    UOM_PURCHASE: "",
    UOM_SUBMATERIAL: "",
    GROUP_LEVEL2: "Consumables",
    GROUP_LEVEL3: "Consumables",
  };

  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const { fetchImageFile, saveImage } = useImageAPI();

  const [loading, setLoading] = useState(false);
  const [commandInputValue, setCommandInputValue] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [openCategoryData, setOpenCategoryData] = useState(false);
  const [uomList, setUomList] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openSubMaterialDetails, setOpenSubMaterialDetails] = useState(false);
  const [subProductCount, setSubProductCount] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isNewProduct, setIsNewProduct] = useState(true);

  const [subMaterialBasedOnList] = useState([
    { name: "Color", value: "Color" },
    { name: "Size", value: "Size" },
    { name: "Variant", value: "Variant" },
  ]);

  const uom = [
    "PCS",
    "UNIT",
    "NOS",
    "PKT",
    "BOX",
    "BAG",
    "SET",
    "PR",
    "ROL",
    "L",
    "ML",
    "KG",
    "GM",
    "MT",
    "MTR",
    "CM",
    "MM",
    "SQM",
    "CUM",
    "FT",
    "IN",
    "DOZ",
    "CAN",
    "BTL",
    "TIN",
    "JAR",
    "DAY",
    "HR",
    "WK",
    "MON",
    "YR",
  ];

  // Validation Schema
  const validationSchema = Yup.object({
    ITEM_NAME: Yup.string().required("Item name is required"),
    SUPPLIER_NAME: Yup.string().required("Supplier name is required"),
    SALE_RATE: Yup.number().typeError("Sale rate must be a number").positive("Sale rate must be positive").required("Sale rate is required"),
    SALE_MARGIN_PTG: Yup.number().typeError("Margin must be a number").positive("Margin must be positive").required("Sale margin % is required"),
    GROUP_LEVEL1: Yup.string().required("Category is required"),
    SALE_UOM: Yup.string().required("UoM is required"),
    image_file: Yup.mixed()
      .test("required", "Image is required", (value) => {
        if (isNewProduct) return value !== null && value !== "";
        return true;
      })
      .test("fileType", "Unsupported file format. Supported: JPG, PNG, GIF, WEBP", (value) => {
        if (!value) return true;
        if (typeof value === "string") return true;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/octet-stream"];

        return validTypes.includes(value.type.toLowerCase());
      }),
   SUB_MATERIALS_MODE: Yup.string().oneOf(["T", "F"]).required(),
    SUB_MATERIAL_BASED_ON: Yup.array().test(
    "sub-material-required",
    "At least one option must be selected",
    function (value) {
      const { SUB_MATERIALS_MODE } = this.parent;
      if (SUB_MATERIALS_MODE === "T") {
        return value && value.length > 0;
      }
      return true;
    }
  ),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: initialFormData,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Create a copy to avoid mutation
        const submitValues = { ...values };

        // Handle sub-material based on
        if (submitValues.SUB_MATERIALS_MODE === "T") {
          submitValues.SUB_MATERIAL_BASED_ON = Array.isArray(values.SUB_MATERIAL_BASED_ON)
            ? values.SUB_MATERIAL_BASED_ON.map(toTitleCase).join(",")
            : toTitleCase(values.SUB_MATERIAL_BASED_ON);
        } else {
          submitValues.SUB_MATERIAL_BASED_ON = "";
        }

        const normalizedData = {
          ...submitValues,
          ITEM_NAME: toTitleCase(submitValues.ITEM_NAME),
          SUPPLIER_NAME: toTitleCase(submitValues.SUPPLIER_NAME),
        };

        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("INVT_MATERIAL_MASTER", normalizedData),
        };

        const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
        const match = response.match(/Item Code Ref\s*'([\w\d]+)'/);
        const newItemCode = match ? match[1] : "(NEW)";

        // Handle image
        if (submitValues.image_file && typeof submitValues.image_file !== "string") {
          try {
            await saveImage("product", newItemCode, submitValues.image_file, null, isNewProduct);
          } catch (imageError) {
            console.error("Image processing error:", imageError);
          }
        }

        if (newItemCode !== "(NEW)") {
          formik.setFieldValue("ITEM_CODE", newItemCode);
          setIsNewProduct(false);
          setSubmitCount((c) => c + 1);
          toast({ title: response });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error saving data",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    },
  });

 console.log("Formik initialized with values:", formik.values);

  // Get tab errors
  const getTabErrors = (tabName) => {
    const tabFields = {
      productdetails: ["ITEM_NAME", "SUPPLIER_NAME", "SALE_RATE", "SALE_UOM", "image_file", "SALE_MARGIN_PTG", "GROUP_LEVEL1"],
      productconfiguration: ["SUB_MATERIAL_BASED_ON"],
    };

    return tabFields[tabName].some((field) => formik.touched[field] && formik.errors[field]);
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchCategoryUsingQuery();
        await fetchUom();

        if (id) {
          await fetchProductData();
          await fetchProductImage();
          setIsNewProduct(false);
        } else {
          setIsNewProduct(true);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Initialization error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (formik.values.ITEM_CODE !== "(NEW)") {
      fetchSubProductCount();
    }
  }, [formik.values.ITEM_CODE]);

  const fetchCategoryUsingQuery = useCallback(async () => {
    try {
      const payload = {
        SQLQuery:
          "SELECT DISTINCT GROUP_LEVEL1 from INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' ORDER BY GROUP_LEVEL1",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);
      setCategoryData(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching categories: ${error.message}`,
      });
    }
  }, [userData, toast]);

  const fetchProductData = useCallback(async () => {
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${id}'`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      const client = response?.[0] || {};

      formik.setValues({
        ...initialFormData,
        ...client,
        SUB_MATERIAL_BASED_ON: client.SUB_MATERIAL_BASED_ON ? client.SUB_MATERIAL_BASED_ON.split(",").map((item) => item.trim()) : [],
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: `Error fetching product: ${err.message}`,
      });
    }
  }, [id, userData, toast, formik.setValues]);

  const fetchProductImage = useCallback(async () => {
    try {
      const imageData = await fetchImageFile("product", id);
      if (imageData) {
        formik.setFieldValue("image_file", imageData.file);
        setPreviewUrl(imageData.previewUrl);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Image fetch error",
        description: error.message,
      });
    }
  }, [id, fetchImageFile, toast, formik.setFieldValue]);

  const fetchSubProductCount = useCallback(async () => {
    try {
      const payload = {
        SQLQuery: `SELECT COUNT(*) AS count FROM INVT_SUBMATERIAL_MASTER WHERE ITEM_CODE = '${formik.values.ITEM_CODE}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);
      setSubProductCount(response[0]?.count || 0);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error fetching sub product count",
        description: err?.message || "Unknown error",
      });
    }
  }, [formik.values.ITEM_CODE, userData, toast]);

  const fetchUom = useCallback(async () => {
    try {
      const payload = {
        DataModelName: "INVT_UOM_MASTER",
        WhereCondition: "",
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setUomList(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching UOM: ${error?.message}`,
      });
    }
  }, [userData, toast]);

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    formik.setFieldValue("image_file", file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="col-span-1 h-full w-full lg:col-span-7">
        <h1 className="title">{formik.values.ITEM_CODE === "(NEW)" ? "Create Product" : "Edit Product"}</h1>
        {/* Global Error Summary */}
        {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
          <div className="mb-4 rounded-lg bg-red-50 p-1 text-red-800 text-xs">
            <h3 className="font-bold">Please fix the following errors:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(formik.errors).map(([key, error]) => (
                <li key={key}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={formik.handleSubmit}
          className="mt-4 h-full w-full"
        >
          <Tabs defaultValue="productdetails">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="productdetails"
                className={getTabErrors("productdetails") ? "border-2 border-red-500" : ""}
              >
                Product Details {getTabErrors("productdetails") && <span className="ml-2 text-red-500">•</span>}
              </TabsTrigger>
              <TabsTrigger
                value="productconfiguration"
                className={getTabErrors("productconfiguration") ? "border-2 border-red-500" : ""}
              >
                Product Configuration {getTabErrors("productconfiguration") && <span className="ml-2 text-red-500">•</span>}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="productdetails">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Provide essential information to define and manage your product.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="w-full">
                      <div className="w-full">
                        <Label htmlFor="ITEM_CODE">Item Code</Label>
                        <Input
                          name="ITEM_CODE"
                          id="ITEM_CODE"
                          type="text"
                          placeholder="Type item code (New)"
                          value={formik.values.ITEM_CODE === "(NEW)" ? "New" : formik.values.ITEM_CODE}
                          readOnly
                        />
                      </div>

                      <div className="mt-3 w-full">
                        <Label htmlFor="ITEM_NAME">Item Name<span className="text-red-500">*</span></Label>
                        <Input
                          name="ITEM_NAME"
                          id="ITEM_NAME"
                          type="text"
                          placeholder="Type item name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ITEM_NAME}
                        />
                        {formik.touched.ITEM_NAME && formik.errors.ITEM_NAME && <p className="text-xs text-red-500">{formik.errors.ITEM_NAME}</p>}
                      </div>

                      <div className="mt-3 w-full">
                        <Label htmlFor="SUPPLIER_NAME">Supplier Ref<span className="text-red-500">*</span></Label>
                        <Input
                          name="SUPPLIER_NAME"
                          id="SUPPLIER_NAME"
                          type="text"
                          placeholder="Type supplier ref"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.SUPPLIER_NAME}
                        />
                        {formik.touched.SUPPLIER_NAME && formik.errors.SUPPLIER_NAME && (
                          <p className="text-xs text-red-500">{formik.errors.SUPPLIER_NAME}</p>
                        )}
                      </div>

                      <div className="mt-3 flex w-full flex-col gap-2 lg:flex-row">
                        <div className="w-full">
                          <Label htmlFor="SALE_RATE">Sales Price<span className="text-red-500">*</span></Label>
                          <Input
                            name="SALE_RATE"
                            id="SALE_RATE"
                            type="text"
                            placeholder="Type sales price"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.SALE_RATE}
                          />
                          {formik.touched.SALE_RATE && formik.errors.SALE_RATE && <p className="text-xs text-red-500">{formik.errors.SALE_RATE}</p>}
                        </div>
                        <div className="w-full">
                          <Label>UoM<span className="text-red-500">*</span></Label>
                          <Popover
                            open={opened}
                            onOpenChange={setOpened}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={opened}
                                className="w-full justify-between"
                              >
                                {formik.values.SALE_UOM || "Select..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search uom..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No uom found.</CommandEmpty>
                                  <CommandGroup>
                                    {uom.map((type) => (
                                      <CommandItem
                                        key={type}
                                        value={type}
                                        onSelect={() => {
                                          formik.setFieldValue("SALE_UOM", type);
                                          formik.setFieldValue("UOM_STOCK", type);
                                          formik.setFieldValue("UOM_SUBMATERIAL", type);
                                          setOpened(false);
                                        }}
                                      >
                                        {type}
                                        <Check className={`ml-auto h-4 w-4 ${formik.values.SALE_UOM === type ? "opacity-100" : "opacity-0"}`} />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {formik.touched.SALE_UOM && formik.errors.SALE_UOM && <p className="text-sm text-red-500">{formik.errors.SALE_UOM}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 w-full">
                      <div className="w-full text-left">
                        <label
                          htmlFor="image_file"
                          className="flex aspect-square h-[240px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          {formik.values.image_file ? (
                            <img
                              src={previewUrl}
                              alt={formik.values.ITEM_NAME}
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
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        {formik.touched.image_file && formik.errors.image_file && <p className="text-xs text-red-500">{formik.errors.image_file}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex w-full flex-col gap-2 lg:flex-row">
                    <div className="w-full">
                      <Label htmlFor="SALE_MARGIN_PTG">Margin %<span className="text-red-500">*</span></Label>
                      <Input
                        name="SALE_MARGIN_PTG"
                        id="SALE_MARGIN_PTG"
                        type="text"
                        placeholder="Type margin"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.SALE_MARGIN_PTG}
                      />
                      {formik.touched.SALE_MARGIN_PTG && formik.errors.SALE_MARGIN_PTG && (
                        <p className="text-xs text-red-500">{formik.errors.SALE_MARGIN_PTG}</p>
                      )}
                    </div>

                    <div className="w-full">
                      <Label>Category<span className="text-red-500">*</span></Label>
                      <Popover
                        open={openCategoryData}
                        onOpenChange={setOpenCategoryData}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCategoryData}
                            className="w-full justify-between"
                          >
                            {formik.values.GROUP_LEVEL1 || "Select category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search category..."
                              className="h-9"
                              onValueChange={setCommandInputValue}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="flex items-center justify-between">
                                  <span>No category found.</span>
                                  {commandInputValue && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const newValue = toTitleCase(commandInputValue.trim());
                                        if (newValue) {
                                          setCategoryData((prev) => [...prev, { GROUP_LEVEL1: newValue }]);
                                          formik.setFieldValue("GROUP_LEVEL1", newValue);
                                          setOpenCategoryData(false);
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
                                    onSelect={() => {
                                      formik.setFieldValue("GROUP_LEVEL1", item.GROUP_LEVEL1);
                                      setOpenCategoryData(false);
                                    }}
                                  >
                                    {item.GROUP_LEVEL1}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        formik.values.GROUP_LEVEL1 === item.GROUP_LEVEL1 ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {formik.touched.GROUP_LEVEL1 && formik.errors.GROUP_LEVEL1 && (
                        <p className="text-sm text-red-500">{formik.errors.GROUP_LEVEL1}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 w-full">
                    <Label htmlFor="REMARKS">Remarks</Label>
                    <Textarea
                      name="REMARKS"
                      id="REMARKS"
                      placeholder="Enter item features"
                      onChange={formik.handleChange}
                      value={formik.values.REMARKS}
                    />
                  </div>

                  <Accordion
                    type="single"
                    collapsible
                    className="mt-4 w-full"
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
                              onChange={formik.handleChange}
                              value={formik.values.ITEM_SIZE}
                            />
                          </div>
                          <div className="w-full">
                            <Label htmlFor="ITEM_FINISH">Color</Label>
                            <Input
                              name="ITEM_FINISH"
                              id="ITEM_FINISH"
                              type="text"
                              placeholder="Type color"
                              onChange={formik.handleChange}
                              value={formik.values.ITEM_FINISH}
                            />
                          </div>
                        </div>
                        <div className="mb-3 flex flex-col gap-3 md:flex-row">
                          <div className="w-full">
                            <Label htmlFor="ITEM_TYPE">Variant</Label>
                            <Input
                              name="ITEM_TYPE"
                              id="ITEM_TYPE"
                              type="text"
                              placeholder="Type variant"
                              onChange={formik.handleChange}
                              value={formik.values.ITEM_TYPE}
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
                  <CardDescription>Customize product settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 space-y-4">
                    <div className="flex space-x-2">
                      <Checkbox
                        checked={formik.values.SUB_MATERIALS_MODE === "T"}
                        onCheckedChange={(checked) => {
                          formik.setFieldValue("SUB_MATERIALS_MODE", checked ? "T" : "F");
                        }}
                        id="subProductMode"
                        disabled={subProductCount > 0}
                      />
                      <label
                        htmlFor="subProductMode"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        This Product has sub products?
                      </label>
                    </div>

                    {(formik.values.SUB_MATERIALS_MODE === "T" || subProductCount > 0) && (
                      <>
                        <div className="mt-3 w-full">
                          <Label className="block text-sm font-medium">Select sub product details<span className="text-red-500">*</span></Label>

                          <Popover
                            open={openSubMaterialDetails}
                            onOpenChange={setOpenSubMaterialDetails}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openSubMaterialDetails}
                                className="min-h-10 w-full justify-between gap-2 text-left font-normal text-gray-400"
                              >
                                {formik.values.SUB_MATERIAL_BASED_ON?.length > 0
                                  ? formik.values.SUB_MATERIAL_BASED_ON.join(", ")
                                  : "Select sub material details"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command className="w-full justify-start">
                                <CommandInput
                                  placeholder="Search sub product details"
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No sub product details found.</CommandEmpty>
                                  <CommandGroup>
                                    {subMaterialBasedOnList.map((item, index) => (
                                      <CommandItem
                                        key={index}
                                        value={item.name}
                                        onSelect={(currentValue) => {
                                          const currentSelections = formik.values.SUB_MATERIAL_BASED_ON || [];
                                          let newSelections;

                                          if (currentSelections.includes(currentValue)) {
                                            newSelections = currentSelections.filter((val) => val !== currentValue);
                                          } else {
                                            newSelections = [...currentSelections, currentValue];
                                          }

                                          formik.setFieldValue("SUB_MATERIAL_BASED_ON", newSelections);
                                          formik.setFieldTouched("SUB_MATERIAL_BASED_ON", true);
                                        }}
                                      >
                                        {item.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            formik.values.SUB_MATERIAL_BASED_ON?.includes(item.value) ? "opacity-100" : "opacity-0",
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                         {(formik.touched.SUB_MATERIAL_BASED_ON || formik.submitCount > 0) && 
                          formik.errors.SUB_MATERIAL_BASED_ON && (
                            <p className="text-sm text-red-500">{formik.errors.SUB_MATERIAL_BASED_ON}</p>
                          )}
                        </div>

                        <div className="mt-3 w-full">
                          <Label htmlFor="UOM_SUBMATERIAL">UOM for SubMaterial</Label>
                          <Input
                            type="text"
                            name="UOM_SUBMATERIAL"
                            id="UOM_SUBMATERIAL"
                            value={formik.values.UOM_SUBMATERIAL || "Not Selected"}
                            readOnly
                          />
                        </div>

                        <div className="mt-3 w-full">
                          <Label htmlFor="SUBMATERIAL_CONVRATE">Conversion Rate</Label>
                          <Input
                            type="text"
                            name="SUBMATERIAL_CONVRATE"
                            id="SUBMATERIAL_CONVRATE"
                            value={formik.values.SUBMATERIAL_CONVRATE}
                            readOnly
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center pt-5">
            <Button
              disabled={loading || formik.isSubmitting}
              type="submit"
            >
              {loading || formik.isSubmitting ? (
                <BeatLoader
                  color="#000"
                  size={8}
                />
              ) : formik.values.ITEM_CODE === "(NEW)" ? (
                "Save Product"
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="col-span-1 mt-5 h-fit w-full lg:col-span-5 lg:mt-24">
        <AddSubProduct
          formDataProps={formik.values}
          onSubmitTrigger={submitCount}
        />
      </div>
    </div>
  );
}
