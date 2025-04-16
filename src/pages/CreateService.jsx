import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function CreateService() {
    const { id: itemCodeParams } = useParams();
    const { userData } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [open, setOpen] = useState(false);

    const initialProductFormData = {
        COMPANY_CODE: "1",
        BRANCH_CODE: "1",
        ITEM_CODE: "(NEW)",
        UOM_STOCK: "NOS",
        UOM_PURCHASE: "NOS",
        ITEM_F_PUINISH: "NOS",
        GROUP_LEVEL1: "",
        GROUP_LEVEL2: "consumables",
        GROUP_LEVEL3: "consumables",
        COST_CODE: "MXXXX",
        ITEM_NAME: "",
        ITEM_GROUP: "SERVICE",
        SUPPLIER_NAME: "",
        SALE_RATE: "",
        SALE_MARGIN_PTG: "",
        QTY_IN_HAND: "",
        REMARKS: "",
        img: "",
    };
    const [productFormData, setProductFormData] = useState(initialProductFormData);
    const itemType = ["Electronics", "Apparel", "Furniture", "Grocery", "Books", "Toys", "Beauty", "Stationery"];
    const validateInput = () => {
        const newError = {};
        if (!productFormData.ITEM_NAME) newError.ITEM_NAME = "Item name is required.";
        if (!productFormData.QTY_IN_HAND) newError.QTY_IN_HAND = "Quantity in hand is required.";
        else if (!/^\d+$/.test(productFormData.QTY_IN_HAND)) newError.QTY_IN_HAND = "Quantity must be a number.";
        if (!productFormData.SALE_RATE) newError.SALE_RATE = "Sale rate is required.";
        else if (!/^\d+$/.test(productFormData.SALE_RATE)) newError.SALE_RATE = "Sale rate must be a number.";
        if (!productFormData.SALE_MARGIN_PTG) newError.SALE_MARGIN_PTG = "Sale margin % is required.";
        else if (!/^\d+$/.test(productFormData.SALE_MARGIN_PTG)) newError.SALE_MARGIN_PTG = "Margin must be a number.";
        if (!productFormData.GROUP_LEVEL1) newError.GROUP_LEVEL1 = "Category is required.";
        if (!productFormData.SUPPLIER_NAME) newError.SUPPLIER_NAME = "Supplier name is required.";
        if (!productFormData.REMARKS) newError.REMARKS = "Remarks are required.";
        if (!productFormData.img) {
            newError.img = "Image is required.";
        }
        return newError;
    };
    useEffect(() => {
        if (itemCodeParams) {
            fetchProductMaterialData();
        }
    }, [itemCodeParams]);
    const fetchProductMaterialData = async () => {
        setLoading(true);
        setError({});
        try {
            const ProductDataPayload = {
                DataModelName: "INVT_MATERIAL_MASTER",
                WhereCondition: `ITEM_CODE = '${itemCodeParams}'`,
                Orderby: "",
            };
            const data = await getDataModelService(ProductDataPayload, userData.currentUserLogin, userData.clientURL);
            setProductFormData((prev) => ({
                ...prev,
                ...(data?.[0] || {}),
            }));
        } catch (error) {
            setError({ fetch: error.message });
            toast({
                variant: "destructive",
                title: `Error fetching client: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError((prev) => ({
            ...prev,
            [name]: "",
        }));
    };
    const handleProductImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProductFormData((prev) => ({ ...prev, img: imageUrl }));
            setError((prev) => ({ ...prev, img: "" }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        debugger;
        const validationErrors = validateInput();
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            console.log("Validation failed", validationErrors);
            return;
        }
        try {
            setLoading(true);
            const convertedDataModel = convertDataModelToStringData("INVT_MATERIAL_MASTER", productFormData);
            const ProductPayload = {
                UserName: userData.currentUserLogin,
                DModelData: convertedDataModel,
            };
            const saveDataServiceResponse = await saveDataService(ProductPayload, userData.currentUserLogin, userData.clientURL);
            const match = saveDataServiceResponse.match(/Item Code Ref\s*'([\w\d]+)'/);
            const newitemcode = match ? match[1] : "(NEW)";

            if (newitemcode !== "(NEW)") {
                setProductFormData((prev) => ({
                    ...prev,
                    ITEM_CODE: newitemcode,
                }));

                toast({
                    title: saveDataServiceResponse,
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
        <div className="grid h-full w-full">
            <div className="h-full w-full">
                <h1 className="title">{productFormData.ITEM_CODE === "(NEW)" ? "Create Service" : "Edit Service"}</h1>
                <form
                    onSubmit={handleSubmit}
                    className="mt-4 h-full w-full"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Details</CardTitle>
                            <CardDescription> Provide essential information to define and manage your product.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-4 lg:flex-row">
                                    <div className="flex-1">
                                        <Label htmlFor="itemcode">Item Code</Label>
                                        <Input
                                            name="ITEM_CODE"
                                            id="ITEM_CODE"
                                            type="text"
                                            placeholder="Type item code (New)"
                                            value={productFormData.ITEM_CODE === "(NEW)" ? "New" : productFormData.ITEM_CODE}
                                            onChange={handleChange}
                                            readOnly
                                        />
                                        {error.ITEM_CODE && <p className="text-xs text-red-500">{error.ITEM_CODE}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="itemname">Item Name</Label>
                                        <Input
                                            name="ITEM_NAME"
                                            id="ITEM_NAME"
                                            type="text"
                                            placeholder="Type item name"
                                            onChange={handleChange}
                                            value={productFormData.ITEM_NAME}
                                            required
                                        />
                                        {error.ITEM_NAME && <p className="text-xs text-red-500">{error.ITEM_NAME}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="SUPPLIER_NAME">Supplier Ref</Label>
                                        <Input
                                            name="SUPPLIER_NAME"
                                            id="SUPPLIER_NAME"
                                            type="text"
                                            placeholder="Type supplier ref"
                                            onChange={handleChange}
                                            value={productFormData.SUPPLIER_NAME}
                                            required
                                        />
                                        {error.SUPPLIER_NAME && <p className="text-xs text-red-500">{error.SUPPLIER_NAME}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="SALE_RATE">Sales Price</Label>
                                        <Input
                                            name="SALE_RATE"
                                            id="SALE_RATE"
                                            type="text"
                                            placeholder="Type sales price"
                                            onChange={handleChange}
                                            value={productFormData.SALE_RATE}
                                            required
                                        />
                                        {error.SALE_RATE && <p className="text-xs text-red-500">{error.SALE_RATE}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 lg:flex-row">
                                    <div className="flex-1">
                                        <Label htmlFor="margin">Margin %</Label>
                                        <Input
                                            name="SALE_MARGIN_PTG"
                                            id="SALE_MARGIN_PTG"
                                            type="text"
                                            placeholder="Type margin"
                                            onChange={handleChange}
                                            value={productFormData.SALE_MARGIN_PTG}
                                            required
                                        />
                                        {error.SALE_MARGIN_PTG && <p className="text-xs text-red-500">{error.SALE_MARGIN_PTG}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="QTY_IN_HAND">Quantity</Label>
                                        <Input
                                            name="QTY_IN_HAND"
                                            id="QTY_IN_HAND"
                                            type="text"
                                            placeholder="Type quantity"
                                            onChange={handleChange}
                                            value={productFormData.QTY_IN_HAND}
                                            required
                                        />
                                        {error.QTY_IN_HAND && <p className="text-sm text-red-500">{error.QTY_IN_HAND}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label>Category</Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between"
                                                >
                                                    {productFormData.GROUP_LEVEL1
                                                        ? itemType.find((type) => type === productFormData.GROUP_LEVEL1)
                                                        : "Select category..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search category..." className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>No category found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {itemType.map((type) => (
                                                                <CommandItem
                                                                    key={type}
                                                                    value={type}
                                                                    onSelect={(currentValue) => {
                                                                        setProductFormData((prev) => ({
                                                                            ...prev,
                                                                            GROUP_LEVEL1: currentValue,
                                                                        }));
                                                                        setOpen(false);
                                                                    }}
                                                                >
                                                                    {type}
                                                                    <Check className={`ml-auto h-4 w-4 ${productFormData.GROUP_LEVEL1 === type ? "opacity-100" : "opacity-0"}`} />
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

                                <div>
                                    <Label htmlFor="REMARKS">Remarks</Label>
                                    <Textarea
                                        name="REMARKS"
                                        id="REMARKS"
                                        placeholder="Enter item features"
                                        onChange={handleChange}
                                        value={productFormData.REMARKS}
                                    />
                                    {error.REMARKS && <p className="text-sm text-red-500">{error.REMARKS}</p>}
                                </div>

                                <div className="flex justify-center pt-5">
                                    <Button disabled={loading}>
                                        {loading ? (
                                            <BeatLoader color="#000" size={8} />
                                        ) : productFormData.ITEM_CODE === "(NEW)" ? (
                                            "Save Service"
                                        ) : (
                                            "Update Service"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
