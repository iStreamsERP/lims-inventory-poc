import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelService } from "@/services/dataModelService";
import { Loader2, Plus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateProduct() {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast()
    const productToEdit = location.state?.product || null;
    const fileInputRef = useRef(null);
    const fileInput = useRef(null);

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState("");

    const [data, setData] = useState({
        COMPANY_CODE: "1",
        BRANCH_CODE: "1",
        ITEM_CODE: "(NEW)",
        UOM_STOCK: "NOS",
        UOM_PURCHASE: "NOS",
        ITEM_F_PUINISH: "NOS",
        GROUP_LEVEL1: "consumables",
        GROUP_LEVEL2: "consumables",
        GROUP_LEVEL3: "consumables",
        COST_CODE: "MXXXX",
        ITEM_NAME: "",
        SUPPLIER_NAME: "",
        SALE_RATE: "",
        SALE_MARGIN_PTG: "",
        ITEM_TYPE: "",
        QTY_IN_HAND: "",
        REMARKS: "",
        img: "",
    });

    const initialSub = {
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
    };

    const [SubData, setSubData] = useState([]);
    const [Sub, setSub] = useState(initialSub);

    const itemTypes = ["Electronics", "Jeans", "Shoe", "T-shirt", "Bags", "Suits"];

    const validateInput = () => {
        const newError = {};

        if (!data.ITEM_NAME) newError.ITEM_NAME = "Item name is required.";
        if (!data.QTY_IN_HAND) newError.QTY_IN_HAND = "Quantity in hand is required.";
        else if (!/^\d+$/.test(data.QTY_IN_HAND)) newError.QTY_IN_HAND = "Quantity must be a number.";

        if (!data.SALE_RATE) newError.SALE_RATE = "Sale rate is required.";
        else if (!/^\d+$/.test(data.SALE_RATE)) newError.SALE_RATE = "Sale rate must be a number.";

        if (!data.SALE_MARGIN_PTG) newError.SALE_MARGIN_PTG = "Sale margin % is required.";
        else if (!/^\d+$/.test(data.SALE_MARGIN_PTG)) newError.SALE_MARGIN_PTG = "Margin must be a number.";

        if (!data.ITEM_TYPE) newError.ITEM_TYPE = "Category is required.";
        if (!data.SUPPLIER_NAME) newError.SUPPLIER_NAME = "Supplier name is required.";
        if (!data.REMARKS) newError.REMARKS = "Remarks are required.";
        if (!data.img) newError.img = "Image is required.";

        setFieldErrors(newError);
        return newError;
    };

    useEffect(() => {
        if (productToEdit) {
            setData(productToEdit);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleBlur = (e) => {
        validateInput(); // validates all on blur; you may scope this to a single field if preferred
    };

    const handleSelectChange = (value) => {
        setData((prev) => ({ ...prev, ITEM_TYPE: value }));
        setFieldErrors((prev) => ({ ...prev, ITEM_TYPE: "" }));
    };

    const handleChangesSub = (e) => {
        const { name, value } = e.target;
        setSub((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setData((prev) => ({ ...prev, img: imageUrl }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSub((prev) => ({ ...prev, img: imageUrl }));
        }
    };

    const handleSave = async () => {
        const requiredFields = ["ITEM_FINISH", "ITEM_NAME", "UOM_STOCK", "UOM_PURCHASE", "COST_CODE"];
        const hasAllFields = requiredFields.every((field) => Sub[field] && Sub[field].trim() !== "");

        if (!hasAllFields) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const subMaterialPayload = {
                DataModelName: "INVT_SUBMATERIAL_MASTER",
                WhereCondition: "",
                Orderby: "",
            };

            const existingProducts = await getDataModelService(subMaterialPayload, userData.currentUserLogin, userData.clientURL);

            const isNameDuplicate = existingProducts.some(
                (product) =>
                    product.ITEM_NAME.trim().toLowerCase() === Sub.ITEM_NAME.trim().toLowerCase() &&
                    product.ITEM_CODE !== Sub.ITEM_CODE
            );

            if (isNameDuplicate) {
                toast({
                    variant: "destructive",
                    title: "Item name already exists."
                });
                return;
            }

            const result = await getDataModelService(Sub, userData.currentUserLogin, userData.clientURL);
            toast({ title: "Sub-product saved successfully" });

            const updated = [...SubData];
            if (editIndex !== null) {
                updated[editIndex] = Sub;
            } else {
                updated.push(Sub);
            }
            setSubData(updated);

            setSub(initialSub);
            setEditIndex(null);
            setError("");
            setOpenDialog(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (item) => {
        setSub(item);
        const index = SubData.findIndex((i) => i.ITEM_NAME === item.ITEM_NAME);
        setEditIndex(index);
        setOpenDialog(true);
    };

    const handleDelete = (item) => {
        setSubData((prev) => prev.filter((i) => i.ITEM_CODE !== item.ITEM_CODE));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const validationErrors = validateInput();
        if (Object.keys(validationErrors).length > 0) {
            setLoading(false);
            return;
        }

        try {
            const formdata = {
                dataModelName: "INVT_MATERIAL_MASTER",
                whereCondition: "",
                orderby: "ITEM_NAME DESC",
            };

            const existingProducts = await getDataModelService(formdata, userData.currentUserLogin, userData.clientURL);
            const isNameDuplicate = existingProducts.some(
                (product) =>
                    product.ITEM_NAME.trim().toLowerCase() === data.ITEM_NAME.trim().toLowerCase() &&
                    product.ITEM_CODE !== data.ITEM_CODE
            );

            if (isNameDuplicate) {
                toast({ title: "Item name already exists." });
                setLoading(false);
                return;
            }

            const result = await saveProductDataService(data, userData.currentUserLogin, userData.clientURL);
            toast({ title: "Product saved successfully!", result });
            navigate("/products-list");
        } catch (error) {
            toast({ title: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full text-left text-2xl font-bold">
                <h1 className="title">{productToEdit ? "Edit Product" : "Create Product"}</h1>
            </div>
            <form>
                <div className="mt-8 grid h-screen grid-cols-1 gap-2 md:grid-cols-3">
                    <div className="col-span-2">
                        <Tabs defaultValue="productdetails">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="productdetails">Product Details</TabsTrigger>
                                <TabsTrigger value="productconfiguration">Product Configuration</TabsTrigger>
                            </TabsList>
                            <TabsContent value="productdetails">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Details</CardTitle>
                                        <CardDescription> Provide essential information to define and manage your product.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                <div className="w-full">
                                                    <Label htmlFor="itemcode">Item Code</Label>
                                                    <Input
                                                        name="ITEM_CODE"
                                                        id="ITEM_CODE"
                                                        type="text"
                                                        placeholder="Type item code (New)"
                                                        value={data.ITEM_CODE}
                                                        onChange={handleChange}

                                                        readOnly
                                                    />

                                                </div>
                                                <div className="w-full">
                                                    <Label htmlFor="itemname">Item Name</Label>
                                                    <Input
                                                        name="ITEM_NAME"
                                                        id="ITEM_NAME"
                                                        type="text"
                                                        placeholder="Type item name"
                                                        onChange={handleChange}
                                                        value={data.ITEM_NAME}
                                                        onblur={handleBlur}
                                                        required
                                                    />
                                                    {fieldErrors.ITEM_NAME && (
                                                        <p className="text-sm text-red-500">{fieldErrors.ITEM_NAME}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                <div className="w-full">
                                                    <Label htmlFor="SUPPLIER_NAME">Supplier Ref</Label>
                                                    <Input
                                                        name="SUPPLIER_NAME"
                                                        id="SUPPLIER_NAME"
                                                        type="text"
                                                        placeholder="Type supplier ref"
                                                        onChange={handleChange}
                                                        value={data.SUPPLIER_NAME}
                                                        onblur={handleBlur}
                                                        required
                                                    />
                                                    {fieldErrors.SUPPLIER_NAME && (
                                                        <p className="text-sm text-red-500">{fieldErrors.SUPPLIER_NAME}</p>
                                                    )}
                                                </div>

                                                <div className="w-full">
                                                    <Label htmlFor="SALE_RATE">Sales Price</Label>
                                                    <Input
                                                        name="SALE_RATE"
                                                        id="SALE_RATE"
                                                        type="text"
                                                        placeholder="Type sales price"
                                                        onChange={handleChange}
                                                        value={data.SALE_RATE}
                                                        onblur={handleBlur}
                                                        required
                                                    />
                                                    {fieldErrors.SALE_RATE && (
                                                        <p className="text-sm text-red-500">{fieldErrors.SALE_RATE}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                <div className="w-full">
                                                    <Label htmlFor="margin">Margin %</Label>
                                                    <Input
                                                        name="SALE_MARGIN_PTG"
                                                        id="SALE_MARGIN_PTG"
                                                        type="text"
                                                        placeholder="Type margin"
                                                        onChange={handleChange}
                                                        value={data.SALE_MARGIN_PTG}
                                                        onblur={handleBlur}
                                                        required
                                                    />
                                                    {fieldErrors.SALE_MARGIN_PTG && (
                                                        <p className="text-sm text-red-500">{fieldErrors.SALE_MARGIN_PTG}</p>
                                                    )}
                                                </div>
                                                <div className="w-full">
                                                    <Label>Category</Label>
                                                    <Select
                                                        value={data.ITEM_TYPE}
                                                        onValueChange={handleSelectChange}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {itemTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    {fieldErrors.ITEM_TYPE && (
                                                        <p className="text-sm text-red-500">{fieldErrors.ITEM_TYPE}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 md:flex-row"></div>

                                            <div className="mb-3 flex w-full flex-col gap-3 md:flex-row">
                                                <div className="w-full lg:w-1/2">
                                                    <Label htmlFor="QTY_IN_HAND">Quantity</Label>
                                                    <Input
                                                        name="QTY_IN_HAND"
                                                        id="QTY_IN_HAND"
                                                        type="text"
                                                        placeholder="Type quantity"
                                                        onChange={handleChange}
                                                        value={data.QTY_IN_HAND}
                                                        onblur={handleBlur}
                                                        required
                                                    />
                                                    {fieldErrors.QTY_IN_HAND && (
                                                        <p className="text-sm text-red-500">{fieldErrors.QTY_IN_HAND}</p>
                                                    )}

                                                    <Label htmlFor="REMARKS">Remarks</Label>
                                                    <Textarea
                                                        name="REMARKS"
                                                        id="REMARKS"
                                                        placeholder="Enter item features"
                                                        onChange={handleChange}
                                                        onblur={handleBlur}
                                                        value={data.REMARKS}

                                                    />
                                                    {fieldErrors.REMARKS && (
                                                        <p className="text-sm text-red-500">{fieldErrors.REMARKS}</p>
                                                    )}
                                                </div>

                                                <div className="mt-8 w-full space-y-2 text-left lg:w-1/2">
                                                    <div
                                                        className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200"
                                                        onClick={() => fileInput.current?.click()}
                                                    >
                                                        {data.img ? (
                                                            <img
                                                                src={data.img}
                                                                alt="preview"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-center text-sm text-gray-500">Click to Upload</div>
                                                        )}
                                                    </div>
                                                    <input
                                                        name="employeeImage"
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInput}
                                                        onChange={handleProductImageUpload}
                                                        className="hidden"

                                                        required
                                                    />
                                                    {fieldErrors.img && (
                                                        <p className="text-sm text-red-500">{fieldErrors.img}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
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
                                                                onChange={handleChange}
                                                                value={data.ITEM_SIZE}
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <Label htmlFor="ITEM_LENGTH">Length</Label>
                                                            <Input
                                                                name="ITEM_LENGTH"
                                                                id="ITEM_LENGTH"
                                                                type="text"
                                                                placeholder="Type length"
                                                                onChange={handleChange}
                                                                value={data.ITEM_LENGTH}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                        <div className="w-full">
                                                            <Label htmlFor="ITEM_WIDTH">Width</Label>
                                                            <Input
                                                                name="ITEM_WIDTH"
                                                                id="ITEM_WIDTH"
                                                                type="text"
                                                                placeholder="Type width"
                                                                onChange={handleChange}
                                                                value={data.ITEM_WIDTH}
                                                            />
                                                        </div>

                                                        <div className="w-full">
                                                            <Label htmlFor="ITEM_THICKNESS">Thickness</Label>
                                                            <Input
                                                                name="ITEM_THICKNESS"
                                                                id="ITEM_THICKNESS"
                                                                type="text"
                                                                placeholder="Type thickness"
                                                                onChange={handleChange}
                                                                value={data.ITEM_THICKNESS}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                        <div className="w-1/2">
                                                            <Label htmlFor="ITEM_VOLUME">Volume</Label>
                                                            <Input
                                                                name="ITEM_VOLUME"
                                                                id="ITEM_VOLUME"
                                                                type="text"
                                                                placeholder="Type volume"
                                                                onChange={handleChange}
                                                                value={data.ITEM_VOLUME}
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger>Other Reference</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                        <div className="w-full">
                                                            <Label htmlFor="GROUP_REF">Group ref</Label>
                                                            <Input
                                                                name="GROUP_REF"
                                                                id="GROUP_REF"
                                                                type="text"
                                                                placeholder="Type group ref"
                                                                onChange={handleChange}
                                                                value={data.GROUP_REF}
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <Label htmlFor="ITEM_REF">Item ref</Label>
                                                            <Input
                                                                name="ITEM_REF"
                                                                id="ITEM_REF"
                                                                type="text"
                                                                placeholder="Type Item ref"
                                                                onChange={handleChange}
                                                                value={data.ITEM_REF}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                        <div className="w-full">
                                                            <Label htmlFor="ITEM_BRAND">Brand</Label>
                                                            <Input
                                                                name="ITEM_BRAND"
                                                                id="ITEM_BRAND"
                                                                type="text"
                                                                placeholder="Type brand"
                                                                onChange={handleChange}
                                                                value={data.ITEM_BRAND}
                                                            />
                                                        </div>

                                                        <div className="w-full">
                                                            <Label htmlFor="ITEM_COLOR">Color</Label>
                                                            <Input
                                                                name="ITEM_COLOR"
                                                                id="ITEM_COLOR"
                                                                type="text"
                                                                placeholder="Type color"
                                                                onChange={handleChange}
                                                                value={data.ITEM_COLOR}
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-3">
                                                <AccordionTrigger>Stocks</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                        <div className="w-full">
                                                            <Label htmlFor="MIN_STOCK_LEVEL">Min Quantity</Label>
                                                            <Input
                                                                name="MIN_STOCK_LEVEL"
                                                                id="MIN_STOCK_LEVEL"
                                                                type="text"
                                                                placeholder="Type Min quantity"
                                                                onChange={handleChange}
                                                                value={data.MIN_STOCK_LEVEL}
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <Label htmlFor="MAX_STOCK_LEVEL">Max Quantity</Label>
                                                            <Input
                                                                name="MAX_STOCK_LEVEL"
                                                                id="MAX_STOCK_LEVEL"
                                                                type="text"
                                                                placeholder="Type Max quantity"
                                                                onChange={handleChange}
                                                                value={data.MAX_STOCK_LEVEL}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                        <div className="w-full">
                                                            <Label htmlFor="REORDER_QTY">Re-Order Quantity</Label>
                                                            <Input
                                                                name="REORDER_QTY"
                                                                id="REORDER_QTY"
                                                                type="text"
                                                                placeholder="Type Re-Order Quantity"
                                                                onChange={handleChange}
                                                                value={data.REORDER_QTY}
                                                            />
                                                        </div>

                                                        <div className="w-full">
                                                            <Label htmlFor="REORDER_LEVEL">Re-Order Alert Quantity</Label>
                                                            <Input
                                                                name="REORDER_LEVEL"
                                                                id="REORDER_LEVEL"
                                                                type="text"
                                                                placeholder="Type Re-Order Alert Quantity"
                                                                onChange={handleChange}
                                                                value={data.REORDER_LEVEL}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                        <div className="w-1/2">
                                                            <Label htmlFor="MAX_AGE_DAYS">Max Life Days</Label>
                                                            <Input
                                                                name="MAX_AGE_DAYS"
                                                                id="MAX_AGE_DAYS"
                                                                type="text"
                                                                placeholder="Type Max Life Days"
                                                                onChange={handleChange}
                                                                value={data.MAX_AGE_DAYS}
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
                                        <CardDescription>Customize product settings such as options, variants, and default behaviors to suit your needs.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2"></CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                        <div className="flex justify-center mb-4">
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="mt-4 w-1/2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save "
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="col-span-1 mt-11">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Sub Products</CardTitle>
                                <CardDescription>Add and configure sub-products under your main product.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Dialog
                                    open={openDialog}
                                    onOpenChange={setOpenDialog}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                setEditIndex(null);
                                                setSub(initialSub);
                                                setOpenDialog(true);
                                            }}
                                        // disabled={data.ITEM_NAME === "" || data.MAX_AGE_DAYS === ""}
                                        >
                                            Add SubMaterial <Plus />
                                        </Button>
                                    </DialogTrigger>

                                    {/* List of Sub Products */}
                                    <div className="mt-4 flex flex-col flex-wrap gap-4">
                                        {Array.isArray(SubData) && SubData.length > 0 ? (
                                            SubData.map((sub) => (
                                                <Card
                                                    className="flex h-[100px] w-full flex-col justify-center gap-2 p-3"
                                                    key={sub.ITEM_CODE}
                                                >
                                                    <div className="flex justify-between">
                                                        <div className="flex w-[200px] justify-start gap-2 text-start xl:w-[200px]">
                                                            <img
                                                                src={sub.img || "https://via.placeholder.com/150"}
                                                                alt={sub.ITEM_NAME}
                                                                className="h-[50px] w-[50px] rounded"
                                                            />
                                                            <div className="flex w-[200px] flex-col">
                                                                <p className="text-xs font-semibold text-gray-500">{sub.ITEM_NAME}</p>
                                                                <div className="flex items-center">
                                                                    <p className="me-1 text-xs font-semibold text-gray-500">{sub.ITEM_CODE}</p>
                                                                    <span
                                                                        style={{ backgroundColor: sub.ITEM_FINISH }}
                                                                        className="mr-1 mt-1 rounded-full p-1"
                                                                    ></span>
                                                                    <p className="text-xs text-gray-400">{sub.ITEM_FINISH}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row gap-2">
                                                            <SquarePen
                                                                size={14}
                                                                className="cursor-pointer text-blue-700"
                                                                onClick={() => handleEdit(sub)}
                                                            />
                                                            <Trash2
                                                                size={14}
                                                                className="cursor-pointer text-red-700"
                                                                onClick={() => handleDelete(sub)}
                                                            />
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="text-center text-sm italic text-gray-500">No sub-products found. Click "Add SubMaterial" to create one.</div>
                                        )}
                                    </div>

                                    {/* Dialog for adding/editing */}
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add SubMaterial</DialogTitle>
                                            <DialogDescription>Enter the details of the sub-material you'd like to add. Click save to confirm.</DialogDescription>
                                        </DialogHeader>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label
                                                    htmlFor="itemcode"
                                                    className="text-right"
                                                >
                                                    Item code
                                                </Label>
                                                <Input
                                                    id="itemcode"
                                                    type="text"
                                                    name="ITEM_CODE"
                                                    className="col-span-3"
                                                    value={data.ITEM_CODE}
                                                    readOnly
                                                />
                                            </div>
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
                                                    value={Sub.ITEM_NAME}
                                                    onChange={handleChangesSub}
                                                />
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
                                                    value={Sub.ITEM_FINISH}
                                                    onChange={handleChangesSub}
                                                />
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
                                                    value={Sub.ITEM_SIZE}
                                                    onChange={handleChangesSub}
                                                />
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
                                                    value={Sub.QTY}
                                                    onChange={handleChangesSub}
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload Preview */}
                                        <div className="mt-4 w-full space-y-2 text-left">
                                            <div
                                                className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {Sub.img ? (
                                                    <img
                                                        src={Sub.img}
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
                                            <Button onClick={handleSave}>Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
