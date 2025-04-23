import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { deleteDataModelService, getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import axios from "axios";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"

const AddSubProduct = ({ formDataProps, onSubmitTrigger }) => {
  const { ITEM_CODE, ITEM_NAME } = formDataProps;

  const { userData } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSalePriceChecked, setIsSalePriceChecked] = useState(false);
  const initialFormData = useMemo(() => ({
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    ITEM_TYPE: "",
    ITEM_CODE,
    SUB_MATERIAL_NO: -1,
    ITEM_FINISH: "",
    ITEM_NAME,
    UOM_STOCK: "NOS",
    UOM_PURCHASE: "NOS",
    COST_CODE: "MXXXX",
    ITEM_SIZE: "",
    image_file: null,
  }), [ITEM_CODE, ITEM_NAME, isSalePriceChecked]);

  const [subProductFormData, setSubProductFormData] = useState(initialFormData);
  const [productFormData, setProductFormData] = useState(null);
  const [subProductList, setSubProductList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setSubProductFormData((prev) => {
      const updated = { ...prev }

      if (isSalePriceChecked) {
        updated.SALE_RATE = prev.SALE_RATE !== undefined ? prev.SALE_RATE : 0;
      } else {
        delete updated.SALE_RATE
      }

      return updated
    })
  }, [isSalePriceChecked])

  useEffect(() => {
    setSubProductFormData(f => ({ ...f, ITEM_CODE, ITEM_NAME }));

    // now load fresh data based on the new code
    fetchProductData();
    fetchSubProductData();
  }, [onSubmitTrigger, ITEM_CODE]);

  useEffect(() => {
    if (!productFormData) return;
    setIsEnabled(productFormData.SUB_MATERIALS_MODE === "T");
  }, [productFormData?.SUB_MATERIALS_MODE]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchProductData = async () => {
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${ITEM_CODE}'`,
        Orderby: "",
      };
      const response = await getDataModelService(payload, userData.currentUserLogin, userData.clientURL);

      const client = response?.[0] || {};

      setProductFormData((prev) => ({
        ...prev,
        ...client,
        SUB_MATERIAL_BASED_ON: client.SUB_MATERIAL_BASED_ON
          ? client.SUB_MATERIAL_BASED_ON.split(',').map((item) => item.trim())
          : [],
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    }
  };

  const fetchSubProductData = async () => {
    try {
      const payload = {
        DataModelName: "INVT_SUBMATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${ITEM_CODE}'`,
        Orderby: "",
      };

      const response = await getDataModelService(payload, userData.currentUserLogin, userData.clientURL);

      const updatedProducts = await Promise.all(
        response.map(async (product) => {
          const { file, previewUrl } = await fetchSubProductImage(product.ITEM_CODE, product.SUB_MATERIAL_NO);
          return {
            ...product,
            image_file: file,
            previewUrl,
          };
        })
      );

      setSubProductList(updatedProducts);
    } catch (errors) {
      toast({
        variant: "destructive",
        title: `Error Fetching Sub Product: ${errors.message}`,
      });
    }
  };

  const fetchSubProductImage = async (itemcode, subMaterialNo) => {
    try {
      const response = await axios.get(
        `https://cloud.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(userData.currentUserLogin)}&fileName=SUB_PRODUCT_IMAGE_${itemcode}_${subMaterialNo}`,
        { responseType: "blob" }
      );

      const blob = response.data;
      const mimeType = blob.type;
      const extension = mimeType.split("/")[1] || "png";
      const filename = `SUB_PRODUCT_IMAGE_${itemcode}_${subMaterialNo}.${extension}`;
      const file = new File([blob], filename, { type: mimeType });
      const previewUrl = URL.createObjectURL(file);

      return { file, previewUrl };
    } catch (error) {
      console.error(`Failed to fetch image for ${subMaterialNo}`, error);
      return { file: null, previewUrl: null };
    }
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {

      const file = files[0] || null;
      setSubProductFormData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: "" }));

      // generate preview URL
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setSubProductFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDelete = async (product) => {
    const result = window.confirm("Are you sure you want to delete this product? This action cannot be undone.")

    if (!result) {
      return
    }
    try {
      const deleteDataModelServicePayload = {
        UserName: userData.currentUserLogin,
        DataModelName: "INVT_SUBMATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${formDataProps?.ITEM_CODE}' AND SUB_MATERIAL_NO = ${product.SUB_MATERIAL_NO}`,
      }
      const deleteDataModelServiceResponse = await deleteDataModelService(deleteDataModelServicePayload, userData.currentUserLogin, userData.clientURL);
      toast({
        variant: "destructive",
        title: deleteDataModelServiceResponse,
      })
      await handleImageDelete(product.ITEM_CODE, product.SUB_MATERIAL_NO);
      await fetchSubProductData();
    } catch (errors) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${errors.message}`,
      });
    }
  }

  const handleImageDelete = async (itemCode, subMaterialNo) => {
    try {
      const email = encodeURIComponent(userData.currentUserLogin);
      const fileName = encodeURIComponent(`SUB_PRODUCT_IMAGE_${itemCode}_${subMaterialNo}`);
      const url = `https://cloud.istreams-erp.com:4499/api/MaterialImage/delete?email=${email}&fileName=${fileName}`;

      const response = await axios.delete(url);

      if (response.status === 200) {
        toast({
          title: response.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: `Image delete failed with status: ${response.status}`,
        });
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting image.",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Unknown error occurred.",
      });
    }
  };

  const handleEdit = async (subMaterialProduct) => {
    setIsDialogOpen(true)
    const hasSaleRate = typeof subMaterialProduct.SALE_RATE !== 'undefined' && subMaterialProduct.SALE_RATE !== null;

    setIsSalePriceChecked(hasSaleRate);
    const cleanItemName = subMaterialProduct.ITEM_NAME.replace(/[-–—].*$/, '').trim();

    setSubProductFormData({
      ...subMaterialProduct,
      ITEM_NAME: subMaterialProduct.ITEM_NAME.replace(/[-–—].*$/, '').trim(),
      SALE_RATE: hasSaleRate ? subMaterialProduct.SALE_RATE : undefined,
    });
    setPreviewUrl(subMaterialProduct.previewUrl);
  }

  const handleDialogClose = () => {
    setSubProductFormData(initialFormData);
    setIsSalePriceChecked(false);
    setIsDialogOpen(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    fetchSubProductData();
  };

  const handleUploadImage = async (serialNo, isNew) => {
    const file = subProductFormData.image_file;

    if (!file) return;

    const payload = new FormData();
    payload.append("file", file);
    payload.append("email", userData.currentUserLogin);
    const filename = `SUB_PRODUCT_IMAGE_${ITEM_CODE}_${serialNo}`;
    payload.append("fileName", filename);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const response = isNew
        ? await axios.post("https://cloud.istreams-erp.com:4499/api/MaterialImage/upload", payload, config)
        : await axios.put(`https://cloud.istreams-erp.com:4499/api/MaterialImage/update?email=${userData.currentUserLogin}&fileName=${filename}`, payload, config);

      if (response.status === 200) {
        toast({
          title: `Image ${isNew ? 'uploaded' : 'updated'} successfully!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: `Error ${isNew ? 'uploading' : 'updating'} image.`,
          description: errors?.response?.data?.message || errors?.message,
        });
      }
    } catch (errors) {
      toast({
        variant: "destructive",
        title: "Error saving image.",
        description:
          errors?.response?.data?.message ||
          errors?.message ||
          "Unknown errors occurred.",
      });
    }
  };

  const formatFullItemName = (subProductFormData) => {
    return [subProductFormData.ITEM_NAME, subProductFormData.ITEM_FINISH, subProductFormData.ITEM_SIZE, subProductFormData.ITEM_TYPE]
      .filter(Boolean)
      .map((val) => val.trim().toLowerCase())
      .join("-");
  };

  useEffect(() => {
    setSubProductFormData((prev) => ({
      ...prev,
      ITEM_NAME: formatFullItemName(prev),
    }));
  }, []);

  const desiredOrder = ["Color", "Size", "Variant"];

  const sortedFields = (productFormData?.SUB_MATERIAL_BASED_ON || [])
    .slice()                                 // copy so you don’t mutate original
    .sort((a, b) =>
      desiredOrder.indexOf(a) - desiredOrder.indexOf(b)
    );

  const dynamicFields = {
    Color: {
      label: "Color",
      id: "ITEM_FINISH",
      name: "ITEM_FINISH",
      valueKey: "ITEM_FINISH",
      errorKey: "ITEM_FINISH",
    },
    Size: {
      label: "Size",
      id: "ITEM_SIZE",
      name: "ITEM_SIZE",
      valueKey: "ITEM_SIZE",
      errorKey: "ITEM_SIZE",
    },
    Variant: {
      label: "Variant",
      id: "ITEM_TYPE",
      name: "ITEM_TYPE",
      valueKey: "ITEM_TYPE",
      errorKey: "ITEM_TYPE",
    },
  };

  const handleSumbit = async () => {
    try {
      const isNewProduct = subProductFormData.SUB_MATERIAL_NO === -1;
      const updatedFormData = {
        ...subProductFormData,
        ITEM_NAME: formatFullItemName(subProductFormData),
      }

      const convertedDataModel = convertDataModelToStringData("INVT_SUBMATERIAL_MASTER", updatedFormData);
      const payload = {
        UserName: userData.currentUserLogin,
        DModelData: convertedDataModel,
      }
      const response = await saveDataService(payload, userData.currentUserLogin, userData.clientURL);

      // Extract serial number from response
      const serialNoMatch = response.match(/\/(\d+)'/);
      const serialNo = serialNoMatch?.[1];

      toast({ title: response })

      if (serialNo) {
        await handleUploadImage(serialNo, isNewProduct);
      }

      await fetchSubProductData();

      setSubProductFormData(initialFormData)
    } catch (errors) {
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.", errors,
      })
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>Create Sub Products</CardTitle>
        <CardDescription>Add and configure sub-products under your main product.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[535px] overflow-y-scroll space-y-2">
          {subProductList.map((item, index) => (
            <Card
              className="p-3"
              key={index}
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex w-full justify-start gap-2  text-start">
                  <img
                    src={item.previewUrl}
                    alt={item.ITEM_NAME}
                    className="h-[50px] w-[50px] mt-1 rounded object-cover"
                  />
                  <div className="flex w-full flex-col items-start">
                    <p className="text-lg font-bold mb-1">{item.ITEM_NAME}</p>
                    <div className="flex flex-row">
                      <p className="me-1 text-xs font-semibold text-gray-400">{item.ITEM_TYPE} |</p>
                      <p className="me-1 text-xs font-semibold text-gray-400">{item.ITEM_SIZE} |</p>
                      <p className="text-xs text-gray-400">{item.ITEM_FINISH}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <SquarePen
                    size={16}
                    className="cursor-pointer hover:text-blue-700"
                    onClick={() => handleEdit(item)}
                  />
                  <Trash2
                    size={16}
                    className="cursor-pointer text-red-700"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <CardFooter className="flex w-full h-full overflow-y-scroll items-center justify-center" id="addSubMaterial">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleDialogClose();
              setIsDialogOpen(open);
            }}
          >
            <DialogContent className="w-[80%] md:w-[100%] h-[400px] md:h-[80%] z-[100] overflow-y-scroll overflow-x-scroll " >
              <DialogHeader>
                <DialogTitle>Add Sub Product</DialogTitle>
                <DialogDescription>
                  Enter the details of the sub-product you'd like to add. Click save to confirm.
                </DialogDescription>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="SALE_RATE"
                    checked={isSalePriceChecked}
                    onCheckedChange={(checked) => {
                      setIsSalePriceChecked(!!checked);
                      if (!checked) {
                        setSubProductFormData(prev => {
                          const newData = { ...prev };
                          delete newData.SALE_RATE;
                          return newData;
                        });
                      }
                    }}
                  />
                  <label
                    htmlFor="SALE_RATE"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Custom sale price
                  </label>
                </div>

              </DialogHeader>
              <div className="w-full h-full flex lg:flex-row flex-col gap-2 overflow-y-scroll p-1">
                <div className="grid grid-cols-1 w-full h-fit gap-2">
                  <div className="w-full">
                    <Label htmlFor="itemname" className="text-right">
                      Item Name
                    </Label>
                    <Input
                      id="ITEM_NAME"
                      name="ITEM_NAME"
                      type="text"
                      className="col-span-3"
                      value={formatFullItemName(subProductFormData)}
                      onChange={handleChange}
                      required
                      readOnly={true}
                    />
                    {errors.ITEM_NAME && <p className="text-xs text-red-500">{errors.ITEM_NAME}</p>}
                  </div>

                  {sortedFields.map((field) => {
                    const fieldData = dynamicFields[field];
                    if (!fieldData) return null;

                    return (
                      <>
                        <div className="w-full" key={field}>
                          <Label htmlFor={fieldData.id} className="text-right">
                            {fieldData.label}
                          </Label>
                          <Input
                            id={fieldData.id}
                            name={fieldData.name}
                            type="text"
                            className="col-span-3"
                            value={subProductFormData?.[fieldData.valueKey] || ""}
                            onChange={handleChange}
                            required
                          />
                          {errors?.[fieldData.errorKey] && (
                            <p className="text-xs text-red-500">{errors[fieldData.errorKey]}</p>
                          )}
                        </div>
                      </>

                    );
                  })}

                  {
                    isSalePriceChecked && (
                      <div className="w-full">
                        <Label htmlFor="SALE_RATE" className="text-right">
                          Sale Price
                        </Label>
                        <Input
                          id="SALE_RATE"
                          name="SALE_RATE"
                          type="number"
                          className="col-span-3"
                          value={subProductFormData?.SALE_RATE || ""}
                          onChange={handleChange}
                        />
                        {errors.SALE_RATE && <p className="text-xs text-red-500">{errors.SALE_RATE}</p>}
                      </div>
                    )
                  }
                </div>

                <div className="mt-4 w-full space-y-2 text-left">
                  <div className="w-full">
                    <label className="relative flex aspect-square h-[220px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                      {previewUrl ? (
                        <img src={previewUrl} alt={subProductFormData.ITEM_NAME} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                          Click to Upload
                        </div>
                      )}
                      <input
                        id="image_file"
                        name="image_file"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>

                    {errors.image_file && <p className="text-xs text-red-500">{errors.image_file}</p>}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSumbit}>
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
            {
              isEnabled ? (
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-7"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Add Sub Product <Plus />
                  </Button>
                </DialogTrigger>
              ) : (
                <Button
                  variant="outline"
                  className="w-full mt-7"
                  onClick={() => window.alert("Please enable sub product in the main product configuration.")}
                >
                  Add Sub Product <Plus />
                </Button>
              )
            }
          </Dialog>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default AddSubProduct