import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { deleteDataModelService, getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
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
    img: "",
  }

  const { userData } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, SetError] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);
  const fileInputRef = useRef(null);

  const [subMaterialForm, setSubMaterialForm] = useState(initialFormData);
  const [subMaterialProducts, setSubMaterialProducts] = useState([]);

  useEffect(() => {
    if (itemcode !== "(NEW)") {
      setIsEnabled(true);
      setSubMaterialForm((prev) => ({
        ...prev,
        ITEM_CODE: itemcode,
      }));
      fetchSubmaterialProduct();
    }
  }, [itemcode]);

  const fetchSubmaterialProduct = async () => {
    try {
      const submaterialPayload = {
        DataModelName: "INVT_SUBMATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${itemcode}'`,
        Orderby: "",
      };
      const subMaterialResponse = await getDataModelService(submaterialPayload, userData.currentUserLogin, userData.clientURL);
      setSubMaterialProducts(subMaterialResponse);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error Fetching Sub Product: ${error.message}`,
      });
    }
  };

  const validateSubMaterialForm = () => {
    const newError = {};
    if (!subMaterialForm.ITEM_NAME?.trim()) {
      newError.ITEM_NAME = "Item Name is required.";
    }
    if (!subMaterialForm.ITEM_FINISH?.trim()) {
      newError.ITEM_FINISH = "Color is required.";
    }
    if (!subMaterialForm.ITEM_SIZE?.trim()) {
      newError.ITEM_SIZE = "Size is required.";
    }
    if (!subMaterialForm.QTY?.toString().trim()) {
      newError.QTY = "Quantity is required.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(subMaterialForm.QTY)) {
      newError.QTY = "Quantity must be a valid number.";
    }
    if (!subMaterialForm.img) {
      newError.img = "Image is required.";
    }
    SetError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubMaterialForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    SetError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSubMaterialForm((prev) => ({ ...prev, img: imageUrl }));
      SetError((prev) => ({ ...prev, img: "" }));
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
      await fetchSubmaterialProduct();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleProductDialogClose = () => {
    setSubMaterialForm(initialFormData);
    setIsDialogOpen(false);
    fetchSubmaterialProduct();
  };

  const handleEdit = async (subMaterialproduct) => {
    setIsDialogOpen(true)
    setSubMaterialForm({
      ITEM_CODE: itemcode,
      SUB_MATERIAL_NO: subMaterialproduct.SUB_MATERIAL_NO,
      ITEM_FINISH: subMaterialproduct.ITEM_FINISH,
      ITEM_NAME: subMaterialproduct.ITEM_NAME,
      ITEM_SIZE: subMaterialproduct.ITEM_SIZE,
      QTY: subMaterialproduct.QTY,
      img: subMaterialproduct.img,
    })
  }

  const handleSumbit = async () => {
    const isValid = validateSubMaterialForm();
    if (!isValid) return;
    try {
      setLoading(true);
      const convertedDataModel = convertDataModelToStringData("INVT_SUBMATERIAL_MASTER", subMaterialForm);
      const subMaterialPayload = {
        UserName: userData.currentUserLogin,
        DModelData: convertedDataModel,
      }
      console.log(subMaterialPayload);
      const subMaterialSaveResponse = await saveDataService(subMaterialPayload, userData.currentUserLogin, userData.clientURL);
      toast({
        title: subMaterialSaveResponse,
      })
      await fetchSubmaterialProduct();
      setSubMaterialForm(initialFormData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.", error,
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
                    src={Submaterialproduct.img || "https://images.meesho.com/images/products/412300271/ib6hh_1200.jpg"}
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
                      value={subMaterialForm?.ITEM_NAME}
                      onChange={handleInputChange}
                      required
                    />
                    {error.ITEM_NAME && <p className="text-xs  text-red-500">{error.ITEM_NAME}</p>}

                  </div>
                  <div className="w-full">
                    <Label htmlFor="color" className="text-right">
                      Color
                    </Label>
                    <Input
                      id="color"
                      type="text"
                      name="ITEM_FINISH"
                      className="col-span-3"
                      value={subMaterialForm?.ITEM_FINISH}
                      onChange={handleInputChange}
                      required
                    />
                    {error.ITEM_FINISH && <p className="text-xs text-red-500">{error.ITEM_FINISH}</p>}
                  </div>
                  <div className="w-full">
                    <Label htmlFor="size" className="text-right">
                      Size
                    </Label>
                    <Input
                      id="size"
                      name="ITEM_SIZE"
                      type="text"
                      className="col-span-3"
                      value={subMaterialForm?.ITEM_SIZE}
                      onChange={handleInputChange}
                      required
                    />
                    {error.ITEM_SIZE && <p className="text-xs text-red-500">{error.ITEM_SIZE}</p>}
                  </div>
                  <div className="w-full">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      name="QTY"
                      type="text"
                      className="col-span-3"
                      value={subMaterialForm?.QTY}
                      onChange={handleInputChange}
                      required
                    />
                    {error.QTY && <p className="text-xs text-red-500">{error.QTY}</p>}
                  </div>
                </div>
                <div className="mt-4 w-full space-y-2 text-left">
                  <div
                    className="flex h-[100%] w-[100%] aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {subMaterialForm.img ? (
                      <img src={subMaterialForm.img} alt="preview" className="h-full object-cover" />
                    ) : (
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">Click to Upload</div>
                    )}
                  </div>
                  <input
                    name="employeeImage"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                  {error.img && <p className="text-xs text-red-500">{error.img}</p>}
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