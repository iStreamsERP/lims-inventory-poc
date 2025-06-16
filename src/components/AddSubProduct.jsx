import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import axios from "axios";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import AddSubProductDialog from "./dialog/AddSubProductDialog";
import { useImageAPI } from "@/hooks/useImageAPI";

const AddSubProduct = ({ formDataProps, onSubmitTrigger }) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { fetchImageFile, deleteImage } = useImageAPI();

  const [subProductList, setSubProductList] = useState([]);
  const [mainProductConfig, setMainProductConfig] = useState({});
  const [selectedSubProduct, setSelectedSubProduct] = useState({
    ITEM_CODE: formDataProps?.ITEM_CODE,
    ITEM_NAME: formDataProps?.ITEM_NAME,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Cleanup image preview URLs
  useEffect(() => {
    return () => {
      subProductList.forEach((product) => {
        if (product.previewUrl) URL.revokeObjectURL(product.previewUrl);
      });
    };
  }, [subProductList]);

  useEffect(() => {
    setSelectedSubProduct((prev) => ({
      ...prev,
      ITEM_CODE: formDataProps?.ITEM_CODE,
      ITEM_NAME: formDataProps?.ITEM_NAME,
    }));

    fetchSubProductData();
    fetchMainProductData();
  }, [onSubmitTrigger, formDataProps?.ITEM_CODE]);

  const fetchSubProductData = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        DataModelName: "INVT_SUBMATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${formDataProps?.ITEM_CODE}'`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);

      // Fetch all images in parallel
      const updated = await Promise.all(
        response.map(async (product) => {
          try {
            const imageData = await fetchImageFile("subproduct", product.ITEM_CODE, product.SUB_MATERIAL_NO);

            return {
              ...product,
              rawImage: imageData?.file || null,
              previewUrl: imageData?.previewUrl || null,
            };
          } catch (error) {
            console.error(`Image fetch failed for ${product.SUB_MATERIAL_NO}`, error);
            return {
              ...product,
              rawImage: null,
              previewUrl: null,
            };
          }
        }),
      );

      setSubProductList(updated);
    } catch (errors) {
      toast({
        variant: "destructive",
        title: "Error Fetching Sub Products",
        description: error.message || "Failed to load sub-products",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formDataProps?.ITEM_CODE, userData, toast, fetchImageFile]);

  const fetchMainProductData = useCallback(async () => {
    try {
      const payload = {
        SQLQuery: `SELECT ITEM_NAME AS itemName, SUB_MATERIAL_BASED_ON AS subMaterialBasedOn, SUB_MATERIALS_MODE AS isSubMaterialEnabled FROM INVT_MATERIAL_MASTER WHERE ITEM_CODE = '${formDataProps?.ITEM_CODE}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      setMainProductConfig(response?.[0]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Fetching Product Config",
        description: error.message || "Failed to load product configuration",
      });
    }
  }, [formDataProps?.ITEM_CODE, userData, toast]);

  const handleDelete = useCallback(
    async (product) => {
      const result = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");

      if (!result) {
        return;
      }

      try {
        const payload = {
          UserName: userData.userEmail,
          DataModelName: "INVT_SUBMATERIAL_MASTER",
          WhereCondition: `ITEM_CODE = '${formDataProps?.ITEM_CODE}' AND SUB_MATERIAL_NO = ${product.SUB_MATERIAL_NO}`,
        };

        const response = await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

        // Delete image from storage
        await deleteImage("subproduct", product.ITEM_CODE, product.SUB_MATERIAL_NO);

        // Optimistic UI update
        setSubProductList((prev) => prev.filter((p) => p.SUB_MATERIAL_NO !== product.SUB_MATERIAL_NO));

        toast({
          variant: "destructive",
          title: "Sub-product deleted successfully!",
          description: response,
        });
      } catch (errors) {
        toast({
          variant: "destructive",
          title: `Error fetching client: ${errors.message}`,
        });
      }
    },
    [formDataProps?.ITEM_CODE, userData, deleteImage, toast],
  );

  const handleEdit = useCallback(
    (subProduct) => {
      setIsEditMode(true);
      setSelectedSubProduct((prev) => ({
        ...prev,
        ...subProduct,
      }));
      setIsDialogOpen(true);
    },
    [formDataProps],
  );

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setSelectedSubProduct({
      ITEM_CODE: formDataProps?.ITEM_CODE,
      ITEM_NAME: formDataProps?.ITEM_NAME,
    });
    fetchSubProductData();
  }, [formDataProps, fetchSubProductData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Sub Products</CardTitle>
        <CardDescription>Add and configure sub-products under your main product.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[535px] space-y-2 overflow-y-scroll">
          {isLoading ? (
            <BarLoader
              color="#36d399"
              height={2}
              width="100%"
            />
          ) : (
            subProductList.map((item, index) => (
              <Card
                className="p-3"
                key={index}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex w-full justify-start gap-2 text-start">
                    <img
                      src={item.previewUrl}
                      alt={item.ITEM_NAME}
                      className="mt-1 h-[50px] w-[50px] rounded object-cover"
                    />
                    <div className="flex w-full flex-col items-start">
                      <p className="mb-1 text-lg font-bold">{item.ITEM_NAME}</p>
                      <div className="flex gap-1">
                        {item.ITEM_FINISH && <p className="text-xs text-gray-400">{item.ITEM_FINISH} |</p>}
                        {item.ITEM_SIZE && <p className="me-1 text-xs text-gray-400">{item.ITEM_SIZE} |</p>}
                        {item.ITEM_TYPE && <p className="me-1 text-xs text-gray-400">{item.ITEM_TYPE}</p>}
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
            ))
          )}
        </div>

        <div className="flex justify-center">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleDialogClose();
              setIsDialogOpen(open);
            }}
          >
            {mainProductConfig?.isSubMaterialEnabled === "T" ? (
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Add Sub Product <Plus />
                </Button>
              </DialogTrigger>
            ) : (
              <Button
                variant="outline"
                className="mt-7 w-full"
                onClick={() => window.alert("Please enable sub product in the main product configuration.")}
              >
                Add Sub Product <Plus className="ml-2 h-4 w-4" />
              </Button>
            )}

            <AddSubProductDialog
              open={isDialogOpen}
              onClose={handleDialogClose}
              subProduct={selectedSubProduct}
              config={mainProductConfig?.subMaterialBasedOn}
              isEditMode={isEditMode}
            />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddSubProduct;

// Case sensitive updated
