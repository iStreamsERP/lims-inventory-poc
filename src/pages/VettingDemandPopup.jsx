import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Order Details Popup Component - FIXED VERSION
export const VettingDemandPopup = ({ order, open, onOpenChange }) => {
  if (!order) return null;

  // State for form fields
  const [formData, setFormData] = useState({
    cusCode: order.cusCode || "",
    demandNo: order.demandNo || "",
    date: order.demandDate || "",
    datetimeRequested: "",
    priorityCode: order.prtycd || "",
    datetimeRegistered: order.registeredOn || "",
    urgencyRef: "",
    itemCode: order.code || "",
    itemDescription: order.description || "",
    shno: order.shno || "",
    eqptItemCode: "",
    authType: order.authType || "AUTO",
    authRef: order.authRef || "",
    personalNo: "",
    closingCode: "",
    datetimeClosed: "",
    vettingRemarks: "",
    dateVetted: "",
    vettedBy: "",
    stationCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-4">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Edit Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cusCode" className="text-sm font-medium">Customer Code</Label>
                <Input
                  id="cusCode"
                  name="cusCode"
                  value={formData.cusCode}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="demandNo" className="text-sm font-medium">Demand No</Label>
                <Input
                  id="demandNo"
                  name="demandNo"
                  value={formData.demandNo}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="datetimeRequested" className="text-sm font-medium">Datetime Requested</Label>
                <Input
                  id="datetimeRequested"
                  name="datetimeRequested"
                  type="datetime-local"
                  value={formData.datetimeRequested}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Item Information Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Item Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priorityCode" className="text-sm font-medium">Priority Code</Label>
                <Select
                  value={formData.priorityCode}
                  onValueChange={(value) => handleSelectChange("priorityCode", value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P001">High (P001)</SelectItem>
                    <SelectItem value="P002">Medium (P002)</SelectItem>
                    <SelectItem value="P003">Low (P003)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="datetimeRegistered" className="text-sm font-medium">Datetime Registered</Label>
                <Input
                  id="datetimeRegistered"
                  name="datetimeRegistered"
                  type="datetime-local"
                  value={formData.datetimeRegistered}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="urgencyRef" className="text-sm font-medium">Urgency Reference</Label>
                <Input
                  id="urgencyRef"
                  name="urgencyRef"
                  value={formData.urgencyRef}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemCode" className="text-sm font-medium">Item Code</Label>
                <Input
                  id="itemCode"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemDescription" className="text-sm font-medium">Item Description</Label>
                <Input
                  id="itemDescription"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shno" className="text-sm font-medium">SHNO</Label>
                <Input
                  id="shno"
                  name="shno"
                  value={formData.shno}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Authorization Section */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Authorization Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eqptItemCode" className="text-sm font-medium">Equipment Item Code</Label>
                <Input
                  id="eqptItemCode"
                  name="eqptItemCode"
                  value={formData.eqptItemCode}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authType" className="text-sm font-medium">Auth Type</Label>
                <Select
                  value={formData.authType}
                  onValueChange={(value) => handleSelectChange("authType", value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select auth type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTO">Auto</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authRef" className="text-sm font-medium">Reference</Label>
                <Input
                  id="authRef"
                  name="authRef"
                  value={formData.authRef}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personalNo" className="text-sm font-medium">Personal No</Label>
                <Input
                  id="personalNo"
                  name="personalNo"
                  value={formData.personalNo}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="closingCode" className="text-sm font-medium">Closing Code</Label>
                <Select
                  value={formData.closingCode}
                  onValueChange={(value) => handleSelectChange("closingCode", value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select closing code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CL001">Completed (CL001)</SelectItem>
                    <SelectItem value="CL002">Cancelled (CL002)</SelectItem>
                    <SelectItem value="CL003">Pending (CL003)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="datetimeClosed" className="text-sm font-medium">Datetime Closed</Label>
                <Input
                  id="datetimeClosed"
                  name="datetimeClosed"
                  type="datetime-local"
                  value={formData.datetimeClosed}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Vetting Section */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Vetting Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vettingRemarks" className="text-sm font-medium">Vetting Remarks</Label>
                <Textarea
                  id="vettingRemarks"
                  name="vettingRemarks"
                  value={formData.vettingRemarks}
                  onChange={handleInputChange}
                  className="min-h-[120px] resize-none"
                  placeholder="Enter vetting remarks here..."
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateVetted" className="text-sm font-medium">Date Vetted</Label>
                  <Input
                    id="dateVetted"
                    name="dateVetted"
                    type="date"
                    value={formData.dateVetted}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vettedBy" className="text-sm font-medium">Vetted By</Label>
                  <Input
                    id="vettedBy"
                    name="vettedBy"
                    value={formData.vettedBy}
                    onChange={handleInputChange}
                    className="h-10"
                    placeholder="Enter name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stationCode" className="text-sm font-medium">Station Code</Label>
                  <Input
                    id="stationCode"
                    name="stationCode"
                    value={formData.stationCode}
                    onChange={handleInputChange}
                    className="h-10"
                    placeholder="Enter station code"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};