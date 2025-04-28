import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelFromQueryService, saveDataService } from "@/services/dataModelService";
import { cartesianProduct } from "@/utils/cartesian";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { toTitleCase } from "@/utils/stringUtils";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const AddSubProductDialog = ({ open, onClose, subProduct, isEditMode, config = [] }) => {
    const { userData } = useAuth();
    const { toast } = useToast();

    const [errors, setErrors] = useState({});
    const [isSalePriceChecked, setIsSalePriceChecked] = useState(false);
    const [hasCsvInput, setHasCsvInput] = useState(false);

    const initialFormData = useMemo(() => ({
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
        ITEM_SIZE: "",
        rawImage: null,
    }), [open, subProduct]);
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
            ? config.split(",").map(s => s.trim()).filter(Boolean)
            : [];

    const sortedFields = configArray
        .slice()
        .sort((a, b) =>
            inputFieldOrder.indexOf(a) - inputFieldOrder.indexOf(b)
        );

    const formatFullItemName = (formData) => {
        const baseName = subProduct?.ITEM_NAME?.split("-")[0] || "";

        const parts = [
            toTitleCase(baseName),
            toTitleCase(formData.ITEM_FINISH),
            toTitleCase(formData.ITEM_SIZE),
            toTitleCase(formData.ITEM_TYPE),
        ]
            .filter(Boolean);

        const unique = parts.filter((p, i) => i === 0 || p !== parts[i - 1]);

        return unique.join("-");
    };

    const previewNames = useMemo(() => {
        const base = subProduct?.ITEM_NAME?.split("-")[0] || "";

        // build axes just like in handleMultipleSubmit
        const axes = sortedFields.map(field => {
            const key = dynamicFields[field].valueKey;
            return (subProductFormData[key] || "")
                .split(",")
                .map(s => toTitleCase(s))
                .filter(Boolean);
        })
            .filter(arr => arr.length > 0);

        // if there is no “multiple” CSV, just show single
        if (axes.length === 0) {
            return [formatFullItemName(subProductFormData, subProductFormData.SUB_MATERIAL_NO !== -1)];
        }

        // else do the cartesian product
        const combos = cartesianProduct(axes);
        return combos.map(combo => [base, ...combo].join("-"));
    }, [subProduct.ITEM_NAME, subProductFormData, sortedFields]);

    useEffect(() => {
        setSubProductFormData(initialFormData);

        if (subProduct?.SUB_MATERIAL_NO >= 0) {
            const nameParts = subProduct.ITEM_NAME?.split("-") || [];

            setSubProductFormData(fd => ({
                ...fd,
                SUB_MATERIAL_NO: subProduct.SUB_MATERIAL_NO,
                // only prefill Color if Color is in your config
                ITEM_FINISH: configArray.includes("Color")
                    ? (subProduct.ITEM_FINISH || nameParts[1] || "")
                    : "",
                // only prefill Size if Size is in your config
                ITEM_SIZE: configArray.includes("Size")
                    ? (subProduct.ITEM_SIZE || nameParts[2] || "")
                    : "",
                // only prefill Variant if Variant is in your config
                ITEM_TYPE: configArray.includes("Variant")
                    ? (subProduct.ITEM_TYPE || nameParts[3] || "")
                    : "",
                rawImage: subProduct.rawImage || "",
            }));
        }
        setPreviewUrl(subProduct?.previewUrl || "");
    }, [open, subProduct, initialFormData]); // <-- Here closing the useEffect

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

    console.log(subProductFormData);

    // whenever the form data or the sortedFields change, detect any commas
    useEffect(() => {
        const found = sortedFields.some((field) => {
            const key = dynamicFields[field].valueKey;
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

    const handleUploadImage = async (serialNo, isNew) => {
        const file = subProductFormData.rawImage;

        if (!file) return;

        const payload = new FormData();
        payload.append("file", file);
        payload.append("email", userData.currentUserLogin);
        const filename = `SUB_PRODUCT_IMAGE_${subProduct?.ITEM_CODE}_${serialNo}`;
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

    const fetchExistingProduct = async (itemName) => {
        try {
            const payload = {
                SQLQuery: `SELECT ITEM_NAME FROM INVT_SUBMATERIAL_MASTER WHERE ITEM_CODE = '${subProduct?.ITEM_CODE}' AND ITEM_NAME = '${itemName}'`,
            };
            const response = await getDataModelFromQueryService(
                payload,
                userData.currentUserLogin,
                userData.clientURL
            );

            return response?.[0]?.ITEM_NAME || null;

        } catch (error) {
            toast({
                variant: "destructive",
                title: `Error fetching client: ${error.message}`,
            });
        }
    };

    const handleSingleSubmit = async () => {
        if (subProductFormData.image_file === null) {
            toast({ variant: "destructive", title: "Please upload an image." });
            return false;
        }

        let existingProductName = "";

        try {
            const isNewProduct = subProductFormData.SUB_MATERIAL_NO === -1;
            const updatedFormData = {
                ...subProductFormData,
                ITEM_NAME: formatFullItemName(subProductFormData, !isNewProduct),
            }

            existingProductName = await fetchExistingProduct(updatedFormData.ITEM_NAME);

            if (existingProductName && existingProductName.trim() !== "") {
                toast({
                    variant: "destructive",
                    title: "Error saving data. Please try again.",
                    description: `Product with name ${existingProductName} already exists.`,
                });
                return false;
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

            setSubProductFormData(initialFormData);
        } catch (errors) {
            toast({
                variant: "destructive",
                title: "Error saving data. Please try again.", errors,
            })
        } finally {
            onClose();
        }
    };

    const handleMultipleSubmit = async () => {
        if (!subProductFormData.rawImage) {
            toast({ variant: "destructive", title: "Please upload an image." });
            return false;
        }

        const axes = sortedFields
            .map(field => {
                const key = dynamicFields[field].valueKey;
                const arr = (subProductFormData[key] || "")
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean);
                return { key, values: arr };
            })
            .filter(ax => ax.values.length > 0);

        if (!axes.length) {
            toast({ variant: "destructive", title: "Enter at least color or size or varaint any one of them." });
            return;
        }

        // all combos
        const combos = cartesianProduct(axes.map(ax => ax.values));
        const useSameImage = combos.length > 1
            ? window.confirm("Do you want same image for all sub-products?")
            : true;

        // remember if we came in “edit” mode
        const startedWithExisting = subProductFormData.SUB_MATERIAL_NO >= 0;

        const duplicates = [];
        let createdCount = 0;

        for (let i = 0; i < combos.length; i++) {
            const combo = combos[i];
            // copy the formData
            const data = { ...subProductFormData };

            // if this is the 2nd+ combo, force create new
            if (i > 0) data.SUB_MATERIAL_NO = -1;

            // merge each axis value
            axes.forEach((ax, idx) => data[ax.key] = combo[idx]);

            // recompute the name
            data.ITEM_NAME = formatFullItemName(data);


            const existingProductName = await fetchExistingProduct(data.ITEM_NAME);

            if (existingProductName) {
                duplicates.push(data.ITEM_NAME);
                continue;
            }

            // send it
            const converted = convertDataModelToStringData("INVT_SUBMATERIAL_MASTER", data);
            const payload = { UserName: userData.currentUserLogin, DModelData: converted };

            try {
                const response = await saveDataService(payload, userData.currentUserLogin, userData.clientURL);

                // parse the returned serial#
                const match = response.match(/\/(\d+)'/);
                const serialNo = match?.[1];

                // upload image: always for first if editing, or for all if user said yes
                const shouldUpload = serialNo && (useSameImage || i === 0);
                if (shouldUpload) {
                    // if we started with an existing record, only the 0th is an update; 
                    // but if we started fresh, the 0th is also new
                    const isNewUpload = startedWithExisting ? (i > 0) : true;
                    await handleUploadImage(serialNo, isNewUpload);
                }

                createdCount++;
            } catch (err) {
                console.error("save failed for", data, err);
                toast({ variant: "destructive", title: `Failed: ${data.ITEM_NAME}` });
            }
        }

        setSubProductFormData(initialFormData);

        // summary toast (replace the two above)
        let message = `Created ${createdCount} new sub-products.`;
        if (duplicates.length) {
            message += ` Skipped duplicates: ${duplicates.join(", ")}`;
        }
        toast({ title: message });

        onClose();
    };

    return (
        <DialogContent className="sm:max-w-[60%] h-[80%] sm:max-h-[90%] z-[99] overflow-y-auto p-4">
            <DialogHeader>
                <DialogTitle>Add Sub Product</DialogTitle>
                <DialogDescription>
                    Enter the details of the sub-product you'd like to add. Click save to confirm.
                </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left section - Form fields */}
                <div className="w-full lg:w-2/3 space-y-2">
                    {previewNames.length > 0 && (
                        <div className="p-2 border border-gray-800 rounded ">
                            <p className="font-medium mb-2">Item Name Preview:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {previewNames.map(name => (
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
                                {errors?.[fieldData.errorKey] && (
                                    <p className="text-xs text-red-500">{errors[fieldData.errorKey]}</p>
                                )}
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
                        <label htmlFor="SALE_RATE" className="text-sm font-medium">
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
                            <span className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Click to Upload
                            </span>
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

            <DialogFooter className="w-full sm:justify-center mt-6">
                <div className="flex flex-col items-center gap-1">
                    {
                        !isEditMode && (
                            <div>
                                <Button
                                    type="button"
                                    className="w-full sm:w-auto"
                                    disabled={!hasCsvInput}
                                    onClick={handleMultipleSubmit}
                                >
                                    Create As Multiple Products <br />
                                </Button>
                                <p className="text-xs mt-1">(Each Color, Size, Variant combination)</p>

                                <div className="flex items-center w-full">
                                    <Separator orientation="horizontal" className="flex-1 h-px bg-gray-300" />
                                    <span className="px-3 text-sm text-gray-500">Or</span>
                                    <Separator orientation="horizontal" className="flex-1 h-px bg-gray-300" />
                                </div>
                            </div>
                        )
                    }

                    <Button
                        type="button"
                        onClick={handleSingleSubmit}
                        className="w-full sm:w-auto"
                    >
                        {isEditMode ? 'Update Product' : 'Create Single Product'}
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    )
}

export default AddSubProductDialog
