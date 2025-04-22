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

const AddSubProduct = ({ formDataProps, onSubmitTrigger }) => {
  const { ITEM_CODE, ITEM_NAME } = formDataProps;

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
    QTY: "",
    image_file: null,
  }), [ITEM_CODE, ITEM_NAME]);

  const { userData } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);

  const [subProductFormData, setSubProductFormData] = useState(initialFormData);
  const [productFormData, setProductFormData] = useState(null);
  const [subProductList, setSubProductList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

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
    alert("Are you sure you want to delete this product? This action cannot be undone.")
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
    setSubProductFormData({
      ITEM_CODE: subMaterialProduct.ITEM_CODE,
      SUB_MATERIAL_NO: subMaterialProduct.SUB_MATERIAL_NO,
      ITEM_FINISH: subMaterialProduct.ITEM_FINISH,
      ITEM_NAME: subMaterialProduct.ITEM_NAME,
      ITEM_SIZE: subMaterialProduct.ITEM_SIZE,
      ITEM_TYPE: subMaterialProduct.ITEM_TYPE,
      image_file: subMaterialProduct.image_file,
    });
    setPreviewUrl(subMaterialProduct.previewUrl);
  }

  const handleProductDialogClose = () => {
    setSubProductFormData(initialFormData);
    setIsDialogOpen(false);
    fetchSubProductData();
  };

  const handleUploadImage = async (serialNo) => {
    const file = subProductFormData.image_file;
    const payload = new FormData();
    payload.append("file", file);
    payload.append("email", userData.currentUserLogin);
    payload.append("fileName", `SUB_PRODUCT_IMAGE_${ITEM_CODE}_${serialNo}`);

    try {
      const response = await axios.post(
        "https://cloud.istreams-erp.com:4499/api/MaterialImage/upload",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        toast({
          title: "Sub product saved and image uploaded!",
        });
      } else {
        toast({
          variant: "destructive",
          title: `image upload failed with status: ${response.status}`,
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
    return [subProductFormData.ITEM_NAME, subProductFormData.ITEM_TYPE, subProductFormData.ITEM_FINISH, subProductFormData.ITEM_SIZE]
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

  const handleSumbit = async () => {
    try {
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

      const serialNo = response.match(/\/(\d+)'/);

      toast({ title: response })

      if (serialNo) {
        await handleUploadImage(serialNo[1]);
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

  return (
    <Card >
      <CardHeader>
        <CardTitle>Create Sub Products</CardTitle>
        <CardDescription>Add and configure sub-products under your main product.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[535px] overflow-y-scroll">
          {subProductList.map((item, index) => (
            <Card
              className="flex w-full mb-3  flex-col justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              key={index}
            >
              <div className="flex justify-between  w-full">
                <div className="flex w-full justify-start gap-2  text-start">
                  <img
                    src={item.previewUrl}
                    alt={item.ITEM_NAME}
                    className="h-[50px] w-[50px] mt-1 rounded"
                  />
                  <div className="flex w-full flex-col items-start">
                    <p className="text-sm font-bold mb-1">{item.ITEM_NAME}</p>
                    <p className="me-1 text-xs font-semibold text-gray-400">{item.ITEM_CODE}</p>
                    <div className="flex items-center">
                      <span
                        style={{ backgroundColor: item.ITEM_FINISH }}
                        className="mr-1 mt-1 rounded-full p-1"
                      ></span>
                      <p className="text-xs text-gray-400">{item.ITEM_FINISH}</p>
                    </div>
                  </div>
                </div>
                <div className="flex  flex-row gap-2">
                  <SquarePen
                    size={14}
                    className="cursor-pointer text-blue-700"
                    onClick={() => handleEdit(item)}
                  />
                  <Trash2
                    size={14}
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
              if (!open) handleProductDialogClose();
              setIsDialogOpen(open);
            }}
          >
            <DialogContent className="lg:w-[40%]  xl:w-[40%] 2xl:w-[30%] md:h-[450px] w-[90%] h-[400px] md:w-[400px] z-[100] overflow-y-scroll overflow-x-scroll " >
              <DialogHeader>
                <DialogTitle>Add SubMaterial</DialogTitle>
                <DialogDescription>
                  Enter the details of the sub-material you'd like to add. Click save to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="w-full h-full flex lg:flex-row flex-col gap-2 overflow-y-scroll p-1">
                <div className="grid grid-cols-1 w-full">
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

                  {productFormData?.SUB_MATERIAL_BASED_ON?.map((field) => {
                    const fieldData = dynamicFields[field];
                    if (!fieldData) return null;

                    return (
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
                    );
                  })}
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
              <DialogFooter className={"mt-4"}>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSumbit}>
                  Save changes
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