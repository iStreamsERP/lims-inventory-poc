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
import { useEffect, useRef, useState } from "react";

const AddSubProduct = ({ itemcode }) => {
  const initialFormData = {
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    ITEM_CODE: itemcode,
    SUB_MATERIAL_NO: -1,
    ITEM_FINISH: "",
    ITEM_NAME: "",
    UOM_STOCK: "NOS",
    UOM_PURCHASE: "NOS",
    COST_CODE: "MXXXX",
    ITEM_SIZE: "",
    QTY: "",
    image_file: null,
  }

  const { userData } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [subMaterialProducts, setSubMaterialProducts] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (itemcode !== "(NEW)") {
      setIsEnabled(true);
      setFormData((prev) => ({
        ...prev,
        ITEM_CODE: itemcode,
      }));
      fetchSubMaterialProduct();
      fetchSubProductImage();
    }
  }, [itemcode]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  const validateSubMaterialForm = () => {
    const newError = {};
    if (!formData.ITEM_NAME?.trim()) {
      newError.ITEM_NAME = "Item Name is required.";
    }
    if (!formData.ITEM_FINISH?.trim()) {
      newError.ITEM_FINISH = "Color is required.";
    }
    if (!formData.ITEM_SIZE?.trim()) {
      newError.ITEM_SIZE = "Size is required.";
    }
    if (!formData.QTY?.toString().trim()) {
      newError.QTY = "Quantity is required.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.QTY)) {
      newError.QTY = "Quantity must be a valid number.";
    }
    if (!formData.image_file) {
      newError.image_file = "Image is required.";
    }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const fetchSubMaterialProduct = async () => {
    try {
      const payload = {
        DataModelName: "INVT_SUBMATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${itemcode}'`,
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

      setSubMaterialProducts(updatedProducts);
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

      console.log(previewUrl);

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
      setFormData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: "" }));

      // generate preview URL
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDelete = async (product) => {
    alert("Are you sure you want to delete this product? This action cannot be undone.")
    try {
      setLoading(true);
      const deleteDataModelServicePayload = {
        UserName: userData.currentUserLogin,
        DataModelName: "INVT_SUBMATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${itemcode}' AND SUB_MATERIAL_NO = ${product.SUB_MATERIAL_NO}`,
      }
      const deleteDataModelServiceResponse = await deleteDataModelService(deleteDataModelServicePayload, userData.currentUserLogin, userData.clientURL);
      toast({
        variant: "destructive",
        title: deleteDataModelServiceResponse,
      })
      await handleImageDelete(product.ITEM_CODE, product.SUB_MATERIAL_NO);
      await fetchSubMaterialProduct();
    } catch (errors) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${errors.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleImageDelete = async (itemCode, subMaterialNo) => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (subMaterialProduct) => {
    setIsDialogOpen(true)
    setFormData({
      ITEM_CODE: itemcode,
      SUB_MATERIAL_NO: subMaterialProduct.SUB_MATERIAL_NO,
      ITEM_FINISH: subMaterialProduct.ITEM_FINISH,
      ITEM_NAME: subMaterialProduct.ITEM_NAME,
      ITEM_SIZE: subMaterialProduct.ITEM_SIZE,
      QTY: subMaterialProduct.QTY,
      image_file: subMaterialProduct.image_file,
    });
    setPreviewUrl(subMaterialProduct.image_file);
  }

  const handleProductDialogClose = () => {
    setFormData(initialFormData);
    setIsDialogOpen(false);
    fetchSubMaterialProduct();
  };

  const handleUploadImage = async (serialNo) => {
    console.log("Uploading image...", itemcode, serialNo);

    setLoading(true);

    const file = formData.image_file;
    const payload = new FormData();
    payload.append("file", file);
    payload.append("email", userData.currentUserLogin);
    payload.append("fileName", `SUB_PRODUCT_IMAGE_${itemcode}_${serialNo}`);

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
      console.log(errors);

      toast({
        variant: "destructive",
        title: "Error saving image.",
        description:
          errors?.response?.data?.message ||
          errors?.message ||
          "Unknown errors occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSumbit = async () => {
    const isValid = validateSubMaterialForm();
    if (!isValid) return;

    try {
      setLoading(true);

      const convertedDataModel = convertDataModelToStringData("INVT_SUBMATERIAL_MASTER", formData);
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

      await fetchSubMaterialProduct();

      setFormData(initialFormData)
    } catch (errors) {
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.", errors,
      })
    } finally {
      setIsDialogOpen(false);
      setLoading(false);
    }
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>Create Sub Products</CardTitle>
        <CardDescription>Add and configure sub-products under your main product.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[535px] overflow-y-scroll">
          {subMaterialProducts.map((Submaterialproduct, index) => (
            <Card
              className="flex w-full mb-3  flex-col justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              key={index}
            >
              <div className="flex justify-between  w-full">
                <div className="flex w-full justify-start gap-2  text-start">
                  <img
                    src={Submaterialproduct.previewUrl}
                    alt={Submaterialproduct.ITEM_NAME}
                    className="h-[50px] w-[50px] mt-1 rounded"
                  />
                  <div className="flex w-full flex-col items-start">
                    <p className="text-sm font-bold mb-1">{Submaterialproduct.ITEM_NAME}</p>
                    <p className="me-1 text-xs font-semibold text-gray-400">{Submaterialproduct.ITEM_CODE}</p>
                    <div className="flex items-center">
                      <span
                        style={{ backgroundColor: Submaterialproduct.ITEM_FINISH }}
                        className="mr-1 mt-1 rounded-full p-1"
                      ></span>
                      <p className="text-xs text-gray-400">{Submaterialproduct.ITEM_FINISH}</p>
                    </div>
                  </div>
                </div>
                <div className="flex  flex-row gap-2">
                  <SquarePen
                    size={14}
                    className="cursor-pointer text-blue-700"
                    onClick={() => handleEdit(Submaterialproduct)}
                  />
                  <Trash2
                    size={14}
                    className="cursor-pointer text-red-700"
                    onClick={() => handleDelete(Submaterialproduct)}
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
              <div className="w-full h-full flex lg:flex-row flex-col gap-2 overflow-y-scroll">
                <div className="grid grid-cols-1 w-full ">
                  <div className="w-full">
                    <Label htmlFor="itemname" className="text-right">
                      Item Name
                    </Label>
                    <Input
                      id="itemname"
                      type="text"
                      name="ITEM_NAME"
                      className="col-span-3"
                      value={formData?.ITEM_NAME}
                      onChange={handleChange}
                      required
                    />
                    {errors.ITEM_NAME && <p className="text-xs  text-red-500">{errors.ITEM_NAME}</p>}

                  </div>

                  <div className="w-full">
                    <Label htmlFor="ITEM_FINISH" className="text-right">
                      Color
                    </Label>
                    <Input
                      id="ITEM_FINISH"
                      type="text"
                      name="ITEM_FINISH"
                      className="col-span-3"
                      value={formData?.ITEM_FINISH}
                      onChange={handleChange}
                      required
                    />
                    {errors.ITEM_FINISH && <p className="text-xs text-red-500">{errors.ITEM_FINISH}</p>}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="ITEM_SIZE" className="text-right">
                      Size
                    </Label>
                    <Input
                      id="ITEM_SIZE"
                      name="ITEM_SIZE"
                      type="text"
                      className="col-span-3"
                      value={formData?.ITEM_SIZE}
                      onChange={handleChange}
                      required
                    />
                    {errors.ITEM_SIZE && <p className="text-xs text-red-500">{errors.ITEM_SIZE}</p>}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="QTY" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="QTY"
                      name="QTY"
                      type="text"
                      className="col-span-3"
                      value={formData?.QTY}
                      onChange={handleChange}
                      required
                    />
                    {errors.QTY && <p className="text-xs text-red-500">{errors.QTY}</p>}
                  </div>
                </div>

                <div className="mt-4 w-full space-y-2 text-left">
                  <div className="w-full">
                    <label className="relative flex aspect-square h-[240px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                      {previewUrl ? (
                        <img src={previewUrl} alt={formData.ITEM_NAME} className="h-full w-full object-cover" />
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
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-7"
                onClick={() => setIsDialogOpen(true)}
                disabled={!isEnabled}
              >
                Add SubMaterial <Plus />
              </Button>
            </DialogTrigger>
          </Dialog>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
export default AddSubProduct