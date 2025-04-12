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

  const [SubMaterialForm, setSubMaterialForm] = useState(initialFormData);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubMaterialForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSub((prev) => ({ ...prev, img: imageUrl }));
    }
  };

  const handleDelete = async (product) => {
    alert("Are you sure you want to delete this product? This action cannot be undone.")

    try {
      setLoading(true);
      const deleteDataModelServicePayload = {
        UserName: userData.currentUserLogin,
        DataModelName: "INVT_SUBMATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = ${itemcode} AND SUB_MATERIAL_NO = ${product.SUB_MATERIAL_NO}`,
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

  const handleEdit = async (Submaterialproduct) => {
    setIsDialogOpen(true)
    setSubMaterialForm({
      ITEM_CODE: itemcode,
      SUB_MATERIAL_NO: Submaterialproduct.SUB_MATERIAL_NO,
      ITEM_FINISH: Submaterialproduct.ITEM_FINISH,
      ITEM_NAME: Submaterialproduct.ITEM_NAME,
      QTY: Submaterialproduct.QTY,
      img: Submaterialproduct.img,

    })
  }

  const handleSumbit = async () => {
    try {
      setLoading(true);
      const convertedDataModel = convertDataModelToStringData("INVT_SUBMATERIAL_MASTER", SubMaterialForm);
      const subMaterialPayload = {
        UserName: userData.currentUserLogin,
        DModelData: convertedDataModel,
      }

      const SubMaterialSaveResponse = await saveDataService(subMaterialPayload, userData.currentUserLogin, userData.clientURL);

      toast({
        title: SubMaterialSaveResponse,
      })

      await fetchSubmaterialProduct();

      setSubMaterialForm({
        COMPANY_CODE: "1",
        BRANCH_CODE: "0",
        SUB_MATERIAL_NO: "0",
        ITEM_CODE: "",
        ITEM_FINISH: "",
        ITEM_NAME: "",
        UOM_STOCK: "NOS",
        UOM_PURCHASE: "NOS",
        GROUP_LEVEL1: "consumables",
        GROUP_LEVEL2: "consumables",
        GROUP_LEVEL3: "consumables",
        COST_CODE: "MXXXX",
        QTY: "",
        img: "",
      })

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
    <Card>
      <CardHeader>
        <CardTitle>Create Sub Products</CardTitle>
        <CardDescription>Add and configure sub-products under your main product.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* List of Sub Products */}
        <div className="mt-4 flex flex-col flex-wrap gap-4">
          {subMaterialProducts.map((Submaterialproduct, index) => (
            <Card
              className="flex h-[100px] w-full flex-col justify-center gap-2 p-3"
              key={index}
            >
              <div className="flex justify-between">
                <div className="flex w-[200px] justify-start gap-2 text-start xl:w-[200px]">
                  <img
                    src="https://images.meesho.com/images/products/412300271/ib6hh_1200.jpg"
                    alt={Submaterialproduct.ITEM_NAME}
                    className="h-[50px] w-[50px] rounded"
                  />
                  <div className="flex w-[200px] flex-col items-start">
                    <p className="text-xl font-semibold text-gray-500">{Submaterialproduct.ITEM_NAME}</p>
                    <div className="flex items-center">
                      <p className="me-1 text-xs font-semibold text-gray-500">{Submaterialproduct.ITEM_CODE}</p>
                      <span
                        style={{ backgroundColor: Submaterialproduct.ITEM_FINISH }}
                        className="mr-1 mt-1 rounded-full p-1"
                      ></span>
                      <p className="text-xs text-gray-400">{Submaterialproduct.ITEM_FINISH}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
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

        <CardFooter
          className="flex items-center justify-center"
          id="addSubMaterial">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleProductDialogClose();
              setIsDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsDialogOpen(true)}
                disabled={!isEnabled}
              >
                Add SubMaterial <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add SubMaterial</DialogTitle>
                <DialogDescription>Enter the details of the sub-material you'd like to add. Click save to confirm.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="itemname"
                    className="text-right"
                  >
                    Item Name
                  </Label>
                  <Input
                    id="itemname"
                    type="text"
                    name="ITEM_NAME"
                    className="col-span-3"
                    value={SubMaterialForm.ITEM_NAME}
                    onChange={handleInputChange}
                  />
                  {/* {error.ITEM_NAME && <p className="text-sm text-red-500">{error.ITEM_NAME}</p>} */}
                </div>
                <div>
                  <Label
                    htmlFor="color"
                    className="text-right"
                  >
                    Color
                  </Label>
                  <Input
                    id="color"
                    type="text"
                    name="ITEM_FINISH"
                    className="col-span-3"
                    value={SubMaterialForm.ITEM_FINISH}
                    onChange={handleInputChange}
                  />
                  {/* {error.ITEM_FINISH && <p className="text-sm text-red-500">{error.ITEM_FINISH}</p>} */}

                </div>
                <div>
                  <Label
                    htmlFor="size"
                    className="text-right"
                  >
                    Size
                  </Label>
                  <Input
                    id="size"
                    name="ITEM_SIZE"
                    type="text"
                    className="col-span-3"
                    value={SubMaterialForm.ITEM_SIZE}
                    onChange={handleInputChange}
                  />
                  {/* {error.ITEM_SIZE && <p className="text-sm text-red-500">{error.ITEM_SIZE}</p>} */}
                </div>
                <div>
                  <Label
                    htmlFor="quantity"
                    className="text-right"
                  >
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="QTY"
                    type="text"
                    className="col-span-3"
                    value={SubMaterialForm.QTY}
                    onChange={handleInputChange}
                  />
                  {/* {error.QTY && <p className="text-sm text-red-500">{error.QTY}</p>} */}
                </div>
              </div>

              {/* Image Upload Preview */}
              <div className="mt-4 w-full space-y-2 text-left">
                <div
                  className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {SubMaterialForm.img ? (
                    <img
                      src={SubMaterialForm.img}
                      alt="preview"
                      className="h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-sm text-gray-500">Click to Upload</div>
                  )}
                </div>
                <input
                  name="employeeImage"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSumbit}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
export default AddSubProduct