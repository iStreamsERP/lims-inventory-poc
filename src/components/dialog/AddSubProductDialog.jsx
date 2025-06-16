import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useImageAPI } from "@/hooks/useImageAPI";
import { callSoapService } from "@/services/callSoapService";
import { cartesianProduct } from "@/utils/cartesian";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { toTitleCase } from "@/utils/stringUtils";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const AddSubProductDialog = ({ open, onClose, subProduct, isEditMode, config = [] }) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { saveImage } = useImageAPI();

  const [errors, setErrors] = useState({});
  const [isSalePriceChecked, setIsSalePriceChecked] = useState(false);
  const [hasCsvInput, setHasCsvInput] = useState(false);

  const initialFormData = useMemo(
    () => ({
      COMPANY_CODE: 1,
      BRANCH_CODE: 1,
      ITEM_TYPE: "",
      ITEM_CODE: subProduct?.ITEM_CODE,
      SUB_MATERIAL_NO: -1,
      ITEM_FINISH: "",
      ITEM_NAME: "",
      UOM_STOCK: "NOS",
      UOM_PURCHASE: "NOS",
      COST_CODE: "MXXXX",
      ITEM_GROUP: "PRODUCT",
      ITEM_SIZE: "",
      rawImage: null,
    }),
    [open, subProduct],
  );
  const [subProductFormData, setSubProductFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputFieldOrder = ["Color", "Size", "Variant"];

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

  const configArray = Array.isArray(config)
    ? config
    : typeof config === "string"
      ? config
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const sortedFields = configArray.slice().sort((a, b) => inputFieldOrder.indexOf(a) - inputFieldOrder.indexOf(b));

  const formatFullItemName = (formData) => {
    const baseName = subProduct?.ITEM_NAME?.split("-")[0] || "";

    const parts = [toTitleCase(baseName), toTitleCase(formData.ITEM_FINISH), toTitleCase(formData.ITEM_SIZE), toTitleCase(formData.ITEM_TYPE)].filter(
      Boolean,
    );

    const unique = parts.filter((p, i) => i === 0 || p !== parts[i - 1]);

    return unique.join("-");
  };

  const previewNames = useMemo(() => {
    const base = subProduct?.ITEM_NAME?.split("-")[0] || "";

    // build axes just like in handleMultipleSubmit
    const axes = sortedFields
      .map((field) => {
        const key = dynamicFields[field]?.valueKey;
        return (subProductFormData[key] || "")
          .split(",")
          .map((s) => toTitleCase(s))
          .filter(Boolean);
      })
      .filter((arr) => arr.length > 0);

    // if there is no “multiple” CSV, just show single
    if (axes.length === 0) {
      return [formatFullItemName(subProductFormData, subProductFormData.SUB_MATERIAL_NO !== -1)];
    }

    // else do the cartesian product
    const combos = cartesianProduct(axes);
    return combos.map((combo) => [base, ...combo].join("-"));
  }, [subProduct.ITEM_NAME, subProductFormData, sortedFields]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setSubProductFormData(initialFormData);

    if (subProduct?.SUB_MATERIAL_NO >= 0) {
      const nameParts = subProduct.ITEM_NAME?.split("-") || [];

      setSubProductFormData((fd) => ({
        ...fd,
        SUB_MATERIAL_NO: subProduct.SUB_MATERIAL_NO,
        // only prefill Color if Color is in your config
        ITEM_FINISH: configArray.includes("Color") ? subProduct.ITEM_FINISH || nameParts[1] || "" : "",
        // only prefill Size if Size is in your config
        ITEM_SIZE: configArray.includes("Size") ? subProduct.ITEM_SIZE || nameParts[2] || "" : "",
        // only prefill Variant if Variant is in your config
        ITEM_TYPE: configArray.includes("Variant") ? subProduct.ITEM_TYPE || nameParts[3] || "" : "",
        rawImage: subProduct.rawImage || "",
      }));
    }
    setPreviewUrl(subProduct?.previewUrl || "");
  }, [open, subProduct, initialFormData]); // <-- Here closing the useEffect

  useEffect(() => {
    setSubProductFormData((prev) => {
      const updated = { ...prev };

      if (isSalePriceChecked) {
        updated.SALE_RATE = prev.SALE_RATE !== undefined ? prev.SALE_RATE : 0;
      } else {
        delete updated.SALE_RATE;
      }

      return updated;
    });
  }, [isSalePriceChecked]);

  // whenever the form data or the sortedFields change, detect any commas
  useEffect(() => {
    const found = sortedFields.some((field) => {
      const key = dynamicFields[field]?.valueKey;
      const v = subProductFormData[key];
      return typeof v === "string" && v.includes(",");
    });
    setHasCsvInput(found);
  }, [subProductFormData, sortedFields]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0] || null;
      setSubProductFormData((prev) => ({ ...prev, [name]: file }));

      // generate preview URL
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setSubProductFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchExistingProduct = async (itemName) => {
    try {
      const payload = {
        SQLQuery: `SELECT ITEM_NAME FROM INVT_SUBMATERIAL_MASTER WHERE ITEM_CODE = '${subProduct?.ITEM_CODE}' AND ITEM_NAME = '${itemName}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      return response?.[0]?.ITEM_NAME || null;
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    }
  };

  const validateDynamicFields = () => {
    const newErrors = {};
    sortedFields.forEach((field) => {
      const { valueKey, label, errorKey } = dynamicFields[field];
      const val = subProductFormData[valueKey];
      if (!val || !val.toString().trim()) {
        newErrors[errorKey] = `${label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSingleSubmit = async () => {
    if (!validateDynamicFields()) {
      toast({ variant: "destructive", title: "Please fill all required fields." });
      return;
    }
    if (!subProductFormData.rawImage) {
      toast({ variant: "destructive", title: "Please upload an image." });
      return;
    }

    const originalName = subProduct?.ITEM_NAME;
    const isNewProduct = subProductFormData.SUB_MATERIAL_NO === -1;
    const updatedFormData = {
      ...subProductFormData,
      ITEM_NAME: formatFullItemName(subProductFormData, !isNewProduct),
    };
    const newName = updatedFormData.ITEM_NAME;

    try {
      const existingProductName = await fetchExistingProduct(newName);
      if (existingProductName && existingProductName.trim() !== "" && existingProductName !== originalName) {
        toast({
          variant: "destructive",
          title: "Error saving data. Please try again.",
          description: `Product with name ${existingProductName} already exists.`,
        });
        return false;
      }

      // save (create or update) record
      const convertedDataModel = convertDataModelToStringData("INVT_SUBMATERIAL_MASTER", updatedFormData);

      const payload = {
        UserName: userData.userEmail,
        DModelData: convertedDataModel,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);

      // extract serialNo & upload image
      const serialNo = response.match(/\/(\d+)'/)?.[1];
      toast({ title: response });

      if (serialNo && subProductFormData.rawImage) {
        await saveImage("subproduct", subProduct?.ITEM_CODE, subProductFormData.rawImage, serialNo, isNewProduct);
      }
      // reset & close
      setSubProductFormData(initialFormData);
      onClose();
    } catch (err) {
      toast({ variant: "destructive", title: "Error saving data. Please try again.", description: err.message });
    }
  };

  const handleMultipleSubmit = async () => {
    if (!validateDynamicFields()) {
      toast({
        variant: "destructive",
        title: "Please fill all required fields.",
      });
      return;
    }
    if (!subProductFormData.rawImage) {
      toast({ variant: "destructive", title: "Please upload an image." });
      return;
    }

    // 2. Build your axes (e.g. color, size, …)
    const axes = sortedFields
      .map((f) => {
        const key = dynamicFields[f].valueKey;
        const values = (subProductFormData[key] || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return values.length ? { key, values } : null;
      })
      .filter(Boolean);

    if (axes.length === 0) {
      toast({
        variant: "destructive",
        title: "Enter at least color or size or variant.",
      });
      return;
    }

    // 3. Generate all combinations
    const combos = cartesianProduct(axes.map((a) => a.values));

    // 4. Ask once if we should reuse the image
    const useSameImage = combos.length <= 1 || window.confirm("Use same image for all?");

    if (combos.length > 1 && !useSameImage) {
      toast({ title: "Aborted: no items were created." });
      return;
    }

    const startedWithExisting = subProductFormData.SUB_MATERIAL_NO >= 0;

    // 5. Process each combo sequentially
    const summary = {
      created: 0,
      duplicates: [],
      failed: [],
      imageFailures: [],
    };

    for (let i = 0; i < combos.length; i++) {
      const combo = combos[i];
      const data = { ...subProductFormData };

      // if not the first, force “new” mode
      if (i > 0) data.SUB_MATERIAL_NO = -1;

      // assign each axis value into data
      axes.forEach((ax, idx) => {
        data[ax.key] = combo[idx];
      });

      data.ITEM_NAME = formatFullItemName(data);

      // 5a. skip duplicates
      if (await fetchExistingProduct(data.ITEM_NAME)) {
        summary.duplicates.push(data.ITEM_NAME);
        continue;
      }

      // 5b. save and maybe upload image
      try {
        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("INVT_SUBMATERIAL_MASTER", data),
        };

        const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
        const serialNo = response.match(/\/(\d+)'/)?.[1];
        const shouldUpload = serialNo && (useSameImage || i === 0);

        if (shouldUpload) {
          // when editing, only uploads for new items (i>0); when fresh, always new
          const isNewUpload = startedWithExisting ? i > 0 : true;
          try {
            await saveImage("subproduct", subProduct?.ITEM_CODE, subProductFormData.rawImage, serialNo, isNewUpload);
          } catch (imageError) {
            summary.imageFailures.push(data.ITEM_NAME);
          }
        }

        summary.created++;
      } catch (err) {
        console.error("Failed", data.ITEM_NAME, err);
        summary.failed.push(data.ITEM_NAME);
      }
    }

    // 6. Reset & notify
    setSubProductFormData(initialFormData);
    onClose();

    let message = `Created ${summary.created} sub-products.`;
    if (summary.duplicates.length) {
      message += ` Skipped duplicates: ${summary.duplicates.join(", ")}.`;
    }

    if (summary.failed.length) {
      message += ` Errors: ${summary.failed.join(", ")}.`;
    }

    if (summary.imageFailures.length) {
      message += ` Image upload failures: ${summary.imageFailures.join(", ")}.`;
    }
    toast({ title: message });
  };

  return (
    <DialogContent className="z-[99] h-[80%] overflow-y-auto p-4 sm:max-h-[90%] sm:max-w-[60%]">
      <DialogHeader>
        <DialogTitle>Add Sub Product</DialogTitle>
        <DialogDescription>Enter the details of the sub-product you'd like to add. Click save to confirm.</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Left section - Form fields */}
        <div className="w-full space-y-2 lg:w-2/3">
          {previewNames.length > 0 && (
            <div className="rounded border border-gray-800 p-2">
              <p className="mb-2 font-medium">Item Name Preview:</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {previewNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {sortedFields.map((field) => {
            const fieldData = dynamicFields[field];
            if (!fieldData) return null;
            return (
              <div key={field}>
                <Label htmlFor={fieldData.id}>{fieldData.label}</Label>
                <Input
                  id={fieldData.id}
                  name={fieldData.name}
                  type="text"
                  value={subProductFormData?.[fieldData.valueKey] || ""}
                  onChange={handleChange}
                />
                {errors?.[fieldData.errorKey] && <p className="text-xs text-red-500">{errors[fieldData.errorKey]}</p>}
              </div>
            );
          })}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="SALE_RATE"
              checked={isSalePriceChecked}
              onCheckedChange={(checked) => {
                setIsSalePriceChecked(!!checked);
                if (!checked) {
                  setSubProductFormData((prev) => {
                    const newData = { ...prev };
                    delete newData.SALE_RATE;
                    return newData;
                  });
                }
              }}
            />
            <label
              htmlFor="SALE_RATE"
              className="text-sm font-medium"
            >
              Custom sale price
            </label>
          </div>

          {isSalePriceChecked && (
            <div>
              <Label htmlFor="SALE_RATE">Sale Price</Label>
              <Input
                id="SALE_RATE"
                name="SALE_RATE"
                type="number"
                value={subProductFormData?.SALE_RATE || ""}
                onChange={handleChange}
              />
              {errors.SALE_RATE && <p className="text-xs text-red-500">{errors.SALE_RATE}</p>}
            </div>
          )}
        </div>

        {/* Right section - Image Upload */}
        <div className="w-full lg:w-1/3">
          <label className="relative flex aspect-square h-[220px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={subProductFormData.ITEM_NAME}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-center text-sm text-gray-500 dark:text-gray-400">Click to Upload</span>
            )}
            <input
              id="rawImage"
              name="rawImage"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="sr-only"
            />
          </label>
          {errors.rawImage && <p className="text-xs text-red-500">{errors.rawImage}</p>}
        </div>
      </div>

      <DialogFooter className="mt-6 w-full sm:justify-center">
        <div className="flex flex-col items-center gap-1">
          {!isEditMode && (
            <div>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={!hasCsvInput}
                onClick={handleMultipleSubmit}
              >
                Create As Multiple Products <br />
              </Button>
              <p className="mt-1 text-xs">(Each Color, Size, Variant combination)</p>

              <div className="flex w-full items-center">
                <Separator
                  orientation="horizontal"
                  className="h-px flex-1 bg-gray-300"
                />
                <span className="px-3 text-sm text-gray-500">Or</span>
                <Separator
                  orientation="horizontal"
                  className="h-px flex-1 bg-gray-300"
                />
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleSingleSubmit}
            className="w-full sm:w-auto"
          >
            {isEditMode ? "Update Product" : "Create Single Product"}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddSubProductDialog;
