import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export  function ItemDialog() {
  const [data, setData] = useState({
    itemcode: "",
    itemname: "",
    type: "",
    supplierref: "",
    salesprice: "",
    margin: "",
    category: "",
    quantity: "",
    features: "",
    employeeImage: null,
    previewImage: "", // For showing image preview
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({
        ...data,
        employeeImage: file,
        previewImage: URL.createObjectURL(file), // Create a preview URL
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let existingData = localStorage.getItem("itemData");// Retrieve existing data
    let itemsArray = existingData ? JSON.parse(existingData) : [];// Parse existing data
  
    // Ensure it's always an array
    if (!Array.isArray(itemsArray)) {
      itemsArray = [];
    }
  
    // Add the new item to the array
    itemsArray.push(data);
  
    // Save back to localStorage
    localStorage.setItem("itemData", JSON.stringify(itemsArray));
  
    // Reset form fields
    setData({
      itemcode: "",
      itemname: "",
      type: "",
      supplierref: "",
      salesprice: "",
      margin: "",
      category: "",
      quantity: "",
      features: "",
      employeeImage: null,
      previewImage: "",
    });
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-sm w-full text-xs sm:w-full md:ms-0 md:w-32 lg:ms-4 lg:w-32">
          <Plus />
          Create Item
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-[80vh] overflow-y-scroll md:max-w-[40%]">
        <DialogHeader>
          <DialogTitle>Create Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full">
              <Label htmlFor="itemcode">Item Code</Label>
              <Input
                name="itemcode"
                id="itemcode"
                type="text"
                placeholder="Type item code"
                value={data.itemcode}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="itemname">Item Name</Label>
              <Input
                name="itemname"
                id="itemname"
                type="text"
                placeholder="Type item name"
                value={data.itemname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full">
              <Label>Type</Label>
              <Select onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label htmlFor="supplierref">Supplier Ref</Label>
              <Input
                name="supplierref"
                id="supplierref"
                type="text"
                placeholder="Type supplier ref"
                value={data.supplierref}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full">
              <Label htmlFor="salesprice">Sales Price</Label>
              <Input
                name="salesprice"
                id="salesprice"
                type="text"
                placeholder="Type sales price"
                value={data.salesprice}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="margin">Margin %</Label>
              <Input
                name="margin"
                id="margin"
                type="text"
                placeholder="Type margin"
                value={data.margin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full">
              <Label>Category</Label>
              <Select onValueChange={(value) => handleSelectChange("category", value)}>
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
            <div className="w-full">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                name="quantity"
                id="quantity"
                type="text"
                placeholder="Type quantity"
                value={data.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-3 w-full">
            <div className="w-full">
              <Label htmlFor="features">Features</Label>
              <Textarea
                name="features"
                id="features"
                className="h-24"
                placeholder="Enter item features"
                value={data.features}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col items-center w-full">
              <Label>Upload Picture</Label>
              <div className="h-24 w-24 rounded-full border-2 border-gray-300 bg-gray-100">
                <img
                  src={data.previewImage || "https://via.placeholder.com/96"}
                  alt="Preview"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <Button className="mt-2" onClick={() => document.getElementById("fileInput").click()}>
                Select Image
              </Button>
              <Input
                id="fileInput"
                name="employeeImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end">
            <Button type="button">Close</Button>
            <Button type="submit">Save Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
