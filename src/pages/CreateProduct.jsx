import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
export default function CreateProduct() {
    return (
        <div className="w-full">
            <div className="w-full text-left text-2xl font-bold">
                <h1 className="title">Create Product</h1>
            </div>
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
                                                    name="itemcode"
                                                    id="itemcode"
                                                    type="text"
                                                    placeholder="Type item code"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <Label htmlFor="itemname">Item Name</Label>
                                                <Input
                                                    name="itemname"
                                                    id="itemname"
                                                    type="text"
                                                    placeholder="Type item name"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                            <div className="w-full">
                                                <Label htmlFor="supplierref">Supplier Ref</Label>
                                                <Input
                                                    name="supplierref"
                                                    id="supplierref"
                                                    type="text"
                                                    placeholder="Type supplier ref"
                                                />
                                            </div>

                                            <div className="w-full">
                                                <Label htmlFor="salesprice">Sales Price</Label>
                                                <Input
                                                    name="salesprice"
                                                    id="salesprice"
                                                    type="text"
                                                    placeholder="Type sales price"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                            <div className="w-full">
                                                <Label htmlFor="margin">Margin %</Label>
                                                <Input
                                                    name="margin"
                                                    id="margin"
                                                    type="text"
                                                    placeholder="Type margin"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <Label>Category</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                                        <SelectItem value="Jeans">Jeans</SelectItem>
                                                        <SelectItem value="Shoe">Shoe</SelectItem>
                                                        <SelectItem value="T-shirt">T-shirt</SelectItem>
                                                        <SelectItem value="Bags">Bags</SelectItem>
                                                        <SelectItem value="Suits">Suits</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className=" flex flex-col gap-3 md:flex-row">

                                        </div>

                                        <div className="mb-3 flex w-full flex-col gap-3 md:flex-row">
                                            <div className="lg:w-1/2 w-full">


                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input
                                                    name="quantity"
                                                    id="quantity"
                                                    type="text"
                                                    placeholder="Type quantity"
                                                />

                                                <Label htmlFor="features">Remarks</Label>
                                                <Textarea
                                                    name="features"
                                                    id="features"
                                                    placeholder="Enter item features"
                                                />


                                            </div>

                                            <div className="lg:w-1/2 w-full text-left mt-8">
                                                <div className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200">
                                                    <div className="text-center text-sm text-gray-500">Click to Upload</div>
                                                </div>
                                                <input
                                                    name="employeeImage"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                />
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
                                                        <Label htmlFor="size">Size</Label>
                                                        <Input
                                                            name="size"
                                                            id="size"
                                                            type="text"
                                                            placeholder="Type size"
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <Label htmlFor="length">Length</Label>
                                                        <Input
                                                            name="length"
                                                            id="length"
                                                            type="text"
                                                            placeholder="Type length"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                    <div className="w-full">
                                                        <Label htmlFor="width">Width</Label>
                                                        <Input
                                                            name="width"
                                                            id="width"
                                                            type="text"
                                                            placeholder="Type width"
                                                        />
                                                    </div>

                                                    <div className="w-full">
                                                        <Label htmlFor="thickness">Thickness</Label>
                                                        <Input
                                                            name="thickness"
                                                            id="thickness"
                                                            type="text"
                                                            placeholder="Type thickness"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                    <div className="w-1/2">
                                                        <Label htmlFor="volume">Volume</Label>
                                                        <Input
                                                            name="volume"
                                                            id="volume"
                                                            type="text"
                                                            placeholder="Type volume"
                                                        />
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>Other Reference</AccordionTrigger>
                                            <AccordionContent>
                                                {" "}
                                                <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                    <div className="w-full">
                                                        <Label htmlFor="groupref">Group ref</Label>
                                                        <Input
                                                            name="groupref"
                                                            id="groupref"
                                                            type="text"
                                                            placeholder="Type group ref"
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <Label htmlFor="itemref">Item ref</Label>
                                                        <Input
                                                            name="itemref"
                                                            id="itemref"
                                                            type="text"
                                                            placeholder="Type Item ref"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                    <div className="w-full">
                                                        <Label htmlFor="brand">Brand</Label>
                                                        <Input
                                                            name="brand"
                                                            id="brand"
                                                            type="text"
                                                            placeholder="Type brand"
                                                        />
                                                    </div>

                                                    <div className="w-full">
                                                        <Label htmlFor="color">Color</Label>
                                                        <Input
                                                            name="color"
                                                            id="color"
                                                            type="text"
                                                            placeholder="Type color"
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
                                                        <Label htmlFor="minquantity">Min Quantity</Label>
                                                        <Input
                                                            name="minquantity"
                                                            id="minquantity"
                                                            type="text"
                                                            placeholder="Type Min quantity"
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <Label htmlFor="maxquantity">Max Quantity</Label>
                                                        <Input
                                                            name="maxquantity"
                                                            id="maxquantity"
                                                            type="text"
                                                            placeholder="Type Max quantity"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                    <div className="w-full">
                                                        <Label htmlFor="reorderquantity">Re-Order Quantity</Label>
                                                        <Input
                                                            name="reorderquantity"
                                                            id="reorderquantity"
                                                            type="text"
                                                            placeholder="Type Re-Order Quantity"
                                                        />
                                                    </div>

                                                    <div className="w-full">
                                                        <Label htmlFor="reorderalertquantity">Re-Order Alert Quantity</Label>
                                                        <Input
                                                            name="reorderalertquantity"
                                                            id="reorderalertquantity"
                                                            type="text"
                                                            placeholder="Type Re-Order Alert Quantity"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex flex-col gap-3 md:flex-row">
                                                    <div className="w-1/2">
                                                        <Label htmlFor="maxlifedays">Max Life Days</Label>
                                                        <Input
                                                            name="maxlifedays"
                                                            id="maxlifedays"
                                                            type="text"
                                                            placeholder="Type Max Life Days"
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
                </div>

                <div className="col-span-1 mt-11">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Sub Products</CardTitle>
                            <CardDescription> Add and configure sub-products under your main product.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">Add SubMaterial <Plus /></Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] ">
                                    <DialogHeader>
                                        <DialogTitle>Add SubMaterial</DialogTitle>
                                        <DialogDescription>Enter the details of the sub-material you'd like to add. Click save to confirm.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-2">
                                        <div >
                                            <Label
                                                htmlFor="color"
                                                className="text-right"
                                            >
                                                Color
                                            </Label>
                                            <Input
                                                id="color"
                                                type="text"
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div >
                                            <Label
                                                htmlFor="size"
                                                className="text-right"
                                            >
                                                Size
                                            </Label>
                                            <Input
                                                id="size"
                                                type="text"
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div >
                                            <Label
                                                htmlFor="quantity"
                                                className="text-right"
                                            >
                                                Quantity
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="text"
                                                className="col-span-3"
                                            />
                                        </div>



                                    </div>

                                    <div className="w-full space-y-0 text-left">
                                        <div className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200">
                                            <div className="text-center text-sm text-gray-500">Click to Upload</div>
                                        </div>
                                        <input
                                            name="employeeImage"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>


                                    <DialogFooter>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
