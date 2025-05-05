import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { getDataModelFromQueryService, getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { toTitleCase } from "@/utils/stringUtils";
import { Check, ChevronsUpDown, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const initialFormData = {
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    ITEM_CODE: "(NEW)",
    UOM_STOCK: "NOS",
    UOM_PURCHASE: "NOS",
    ITEM_F_PUINISH: "NOS",
    GROUP_LEVEL1: "",
    GROUP_LEVEL2: "Consumables",
    GROUP_LEVEL3: "Consumables",
    COST_CODE: "MXXXX",
    ITEM_NAME: "",
    ITEM_GROUP: "SERVICE",
    SALE_RATE: "",
    SALE_UOM: "",
    SUPPLIER_NAME: "",
    SALE_MARGIN_PTG: "",
    REMARKS: "",
    FEATURES: "",
    img: "",
};


export default function ServiceFormPage() {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [open, setOpen] = useState(false);
    const [opened, setOpened] = useState(false);
    const [featureInput, setFeatureInput] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [openCategoryData, setOpenCategoryData] = useState(false);
    const [commandInputValue, setCommandInputValue] = useState("");
    const { id } = useParams();
    const { userData } = useAuth();
    const { toast } = useToast();

    const timePeriod = ["Daily", "Weekly", "Monthly", "Yearly"];

    const validateInput = () => {
        const newError = {};
        if (!formData.ITEM_NAME) newError.ITEM_NAME = "Service name is required.";
        if (!formData.SALE_RATE) newError.SALE_RATE = "Sale rate is required.";
        else if (!/^\d+$/.test(formData.SALE_RATE)) newError.SALE_RATE = "Sale rate must be a number.";
        if (!formData.SALE_MARGIN_PTG) newError.SALE_MARGIN_PTG = "Sale margin % is required.";
        else if (!/^\d+$/.test(formData.SALE_MARGIN_PTG)) newError.SALE_MARGIN_PTG = "Margin must be a number.";
        if (!formData.GROUP_LEVEL1) newError.GROUP_LEVEL1 = "Category is required.";
        if (!formData.SUPPLIER_NAME) newError.SUPPLIER_NAME = "Supplier name is required.";
        if (!formData.REMARKS) newError.REMARKS = "Remarks are required.";
        return newError;
    };

    useEffect(() => {
        if (id) {
            fetchProductMaterialData();
        }
        fetchCategoryList();
    }, [id]);

    const fetchProductMaterialData = async () => {
        setLoading(true);
        setError({});
        try {
            const payload = {
                DataModelName: "INVT_MATERIAL_MASTER",
                WhereCondition: `ITEM_CODE = '${id}'`,
                Orderby: "",
            };
            const response = await getDataModelService(payload, userData.currentUserLogin, userData.clientURL);
            const data = response?.[0] || {};

            setFormData((prev) => ({
                ...prev,
                ...data,
                FEATURES: data.FEATURES ? data.FEATURES.split(",") : [],
            }));

        } catch (error) {
            toast({
                variant: "destructive",
                title: `Error fetching client: ${error?.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryList = async () => {
        try {
            const payload = {
                SQLQuery: "SELECT DISTINCT GROUP_LEVEL1 from INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' AND ITEM_GROUP = 'SERVICE' ORDER BY GROUP_LEVEL1",
            };
            const response = await getDataModelFromQueryService(
                payload,
                userData.currentUserLogin,
                userData.clientURL
            );
            setCategoryList(response);
        } catch (error) {
            toast({
                variant: "destructive",
                title: `Error fetching client: ${error.message}`,
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInput();
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            console.log("Validation failed", validationErrors);
            return;
        }
        try {
            setLoading(true);
            const convertedDataModel = convertDataModelToStringData("INVT_MATERIAL_MASTER", formData);
            const ProductPayload = {
                UserName: userData.currentUserLogin,
                DModelData: convertedDataModel,
            };
            const saveDataServiceResponse = await saveDataService(ProductPayload, userData.currentUserLogin, userData.clientURL);
            const match = saveDataServiceResponse.match(/Item Code Ref\s*'([\w\d]+)'/);
            const newitemcode = match ? match[1] : "(NEW)";

            if (newitemcode !== "(NEW)") {
                setFormData((prev) => ({
                    ...prev,
                    ITEM_CODE: newitemcode,
                }));

                setTimeout(() => {
                    setFormData(initialFormData);
                }, 2000);

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
                <h1 className="title">{formData.ITEM_CODE === "(NEW)" ? "Create Service" : "Edit Service"}</h1>
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
                            <div className="space-y-2">

                                <div className="flex flex-col gap-4 lg:flex-row">
                                    <div className="flex-1">
                                        <Label htmlFor="itemcode">Service Code</Label>
                                        <Input
                                            name="ITEM_CODE"
                                            id="ITEM_CODE"
                                            type="text"
                                            placeholder="Type service code (New)"
                                            value={formData.ITEM_CODE === "(NEW)" ? "New" : formData.ITEM_CODE}
                                            onChange={handleChange}
                                            readOnly
                                        />
                                        {error.ITEM_CODE && <p className="text-xs text-red-500">{error.ITEM_CODE}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="itemname">Service Name</Label>
                                        <Input
                                            name="ITEM_NAME"
                                            id="ITEM_NAME"
                                            type="text"
                                            placeholder="Type service name"
                                            onChange={handleChange}
                                            value={formData.ITEM_NAME}
                                            required
                                        />
                                        {error.ITEM_NAME && <p className="text-xs text-red-500">{error.ITEM_NAME}</p>}
                                    </div>


                                </div>

                                <div className="flex flex-col gap-4 lg:flex-row">
                                    <div className="flex-1">
                                        <Label htmlFor="SUPPLIER_NAME">Supplier Ref</Label>
                                        <Input
                                            name="SUPPLIER_NAME"
                                            id="SUPPLIER_NAME"
                                            type="text"
                                            placeholder="Type supplier ref"
                                            onChange={handleChange}
                                            value={formData.SUPPLIER_NAME}
                                            required
                                        />
                                        {error.SUPPLIER_NAME && <p className="text-xs text-red-500">{error.SUPPLIER_NAME}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="margin">Margin %</Label>
                                        <Input
                                            name="SALE_MARGIN_PTG"
                                            id="SALE_MARGIN_PTG"
                                            type="text"
                                            placeholder="Type margin"
                                            onChange={handleChange}
                                            value={formData.SALE_MARGIN_PTG}
                                            required
                                        />
                                        {error.SALE_MARGIN_PTG && <p className="text-xs text-red-500">{error.SALE_MARGIN_PTG}</p>}
                                    </div>

                                    <div className="flex flex-col lg:w-[49%] justify-between gap-1 md:flex-row lg:flex-row">
                                        <div className="flex-1 ">
                                            <Label htmlFor="SALE_RATE">Sale Price</Label>
                                            <Input
                                                name="SALE_RATE"
                                                id="SALE_RATE"
                                                type="text"
                                                placeholder="Type sale price"
                                                onChange={handleChange}
                                                value={formData.SALE_RATE}
                                                required
                                            />
                                            {error.SALE_RATE && <p className="text-xs text-red-500">{error.SALE_RATE}</p>}
                                        </div>
                                        <div className="flex-1 ">
                                            <Label>UoM</Label>
                                            <Popover
                                                open={opened}
                                                onOpenChange={setOpened}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-full justify-between"
                                                        disabled={!formData.SALE_RATE}
                                                    >
                                                        {formData.SALE_UOM ? timePeriod.find((period) => period === formData.SALE_UOM) : "Select..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search uom..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No uom found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {timePeriod.map((type) => (
                                                                    <CommandItem
                                                                        key={type}
                                                                        value={type}
                                                                        onSelect={(currentValue) => {
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                SALE_UOM: currentValue,
                                                                            }));
                                                                            setOpened(false);
                                                                        }}
                                                                    >
                                                                        {type}
                                                                        <Check className={`ml-auto h-4 w-4 ${formData.SALE_UOM === type ? "opacity-100" : "opacity-0"}`} />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            {error.SALE_UOM && <p className="text-sm text-red-500">{error.SALE_UOM}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 w-full lg:flex-row">
                                    <div className="flex flex-col gap-1 mt-[14px] w-full">
                                        <Label>Category</Label>
                                        <Popover open={openCategoryData} onOpenChange={setOpenCategoryData}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCategoryData}
                                                    className=" w-full justify-between"
                                                >
                                                    {formData.GROUP_LEVEL1
                                                        ? categoryList.find(item => item.GROUP_LEVEL1 === formData.GROUP_LEVEL1)?.GROUP_LEVEL1
                                                        : "Select a category..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    {/* Capture command input value */}
                                                    <CommandInput
                                                        placeholder="Search category..."
                                                        className="h-9"
                                                        onValueChange={(value) => setCommandInputValue(value)}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            <div className="flex items-center justify-between">
                                                                <span>No category found.</span>
                                                                {
                                                                    commandInputValue && (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newValue = toTitleCase(commandInputValue.trim());
                                                                                if (newValue) {
                                                                                    setCategoryList(prev => [
                                                                                        ...prev,
                                                                                        { GROUP_LEVEL1: newValue },
                                                                                    ]);
                                                                                    setFormData(prev => ({
                                                                                        ...prev,
                                                                                        GROUP_LEVEL1: newValue,
                                                                                    }));
                                                                                    setOpenCategoryData(false);
                                                                                    setError(prev => ({
                                                                                        ...prev,
                                                                                        GROUP_LEVEL1: "",
                                                                                    }));
                                                                                }
                                                                            }}
                                                                        >
                                                                            Add “{commandInputValue}”
                                                                        </Button>
                                                                    )
                                                                }
                                                            </div>
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {categoryList.map((item, index) => (
                                                                <CommandItem
                                                                    key={index}
                                                                    value={item.GROUP_LEVEL1}
                                                                    onSelect={(currentValue) => {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            GROUP_LEVEL1: currentValue,
                                                                        }));
                                                                        setOpenCategoryData(false);
                                                                    }}
                                                                >
                                                                    {item.GROUP_LEVEL1}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            formData.GROUP_LEVEL1 === item.GROUP_LEVEL1 ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        {error.GROUP_LEVEL1 && <p className="text-sm text-red-500">{error.GROUP_LEVEL1}</p>}
                                    </div>

                                    <div className="w-full">
                                        <Label htmlFor="FEATURES">Features</Label>
                                        <div className="flex gap-1">
                                            <Input
                                                name="FEATURES"
                                                id="FEATURES"
                                                placeholder="Enter features"
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                className="mb-2 flex-1"
                                            />
                                            <Button
                                                type="button"
                                                className="h-fit w-fit"
                                                onClick={() => {
                                                    const trimmed = featureInput.trim();
                                                    if (trimmed !== "") {
                                                        const updatedFeatures = [...(formData.FEATURES || []), trimmed];
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            FEATURES: updatedFeatures,
                                                        }));
                                                        setFeatureInput("");
                                                    }
                                                }}
                                            >
                                                Add <PlusIcon className="ml-1 h-4 w-4" />
                                            </Button>
                                        </div>
                                        {error.FEATURES && <p className="text-sm text-red-500">{error.FEATURES}</p>}
                                        {/* Display features as removable chips */}
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(formData.FEATURES || []).map((feature, index) => (
                                                <Badge
                                                    variant={"outline"}
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    <span>
                                                        {feature}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = formData.FEATURES.filter((_, i) => i !== index);
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                FEATURES: updated,
                                                            }));
                                                        }}
                                                        className="ml-1 text-red-500 hover:text-red-800"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>

                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="REMARKS">Remarks</Label>
                                    <Textarea
                                        name="REMARKS"
                                        id="REMARKS"
                                        placeholder="Enter Remarks"
                                        onChange={handleChange}
                                        value={formData.REMARKS}
                                    />
                                    {error.REMARKS && <p className="text-sm text-red-500">{error.REMARKS}</p>}
                                </div>

                                <div className="flex justify-center pt-5">
                                    <Button disabled={loading}>
                                        {loading ? (
                                            <BeatLoader
                                                color="#000"
                                                size={8}
                                            />
                                        ) : formData.ITEM_CODE === "(NEW)" ? (
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
