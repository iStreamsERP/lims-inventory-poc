import { useState } from "react";
import AutoSuggestInput from "@/components/common/AutoSuggestInput";
import DateInput from "@/components/common/DateInput";
import Dropdown from "@/components/common/Dropdown";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextareaInput from "@/components/common/TextareaInput";
import TextInput from "@/components/common/TextInput";
import { ArrowRight } from "lucide-react";

export const PurchaseOrderPage = () => {
  const [formData, setFormData] = useState({
    orderNo: "PO-001",
    orderDate: "2025-08-04",
    orderRef: "REF-12345",
    quotationRefNo: "QTN-67890",
    quotationDate: "2025-07-30",
    createdby: "Ajeeth",
    modeOfTransport: "Air",
    shippingCode: "SHP-456",
    deliveryDate: "2025-08-10",
    deliveryTo: "No.12, Chennai Industrial Estate, TN",
    division: "Electronics",
    projectNo: "PRJ-009",
    projectDetails: "Solar panel installation project",
    orderDescription: "Bulk solar panels with warranty",
    attnTo: "Mr. Rajesh Kumar",
    email: "rajesh@sample.com",
    mobileNo: "+91 9876543210",
    termsAndConditions: "Delivery within 10 days. Advance required.",
    modeOfPayment: "NEFT",
    creditDays: "30",
    advance: "20%",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-2">Purchase Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* First Container */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 border rounded-xl">
            <TextInput
              label="Order No"
              name="orderNo"
              value={formData.orderNo}
              onChange={(val) => handleChange("orderNo", val)}
            />
            <DateInput
              label="Order Date"
              name="orderDate"
              value={formData.orderDate}
              onChange={(val) => handleChange("orderDate", val)}
            />
            <div className="col-span-2">
              <TextInput
                label="Order Ref"
                name="orderRef"
                value={formData.orderRef}
                onChange={(val) => handleChange("orderRef", val)}
              />
            </div>
            <TextInput
              label="Quotation Ref No"
              name="quotationRefNo"
              value={formData.quotationRefNo}
              onChange={(val) => handleChange("quotationRefNo", val)}
            />
            <DateInput
              label="Quotation Date"
              name="quotationDate"
              value={formData.quotationDate}
              onChange={(val) => handleChange("quotationDate", val)}
            />
            <TextInput
              label="Created by"
              name="createdby"
              value={formData.createdby}
              onChange={(val) => handleChange("createdby", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 border rounded-xl">
            <Dropdown
              label="Mode Of Transport"
              name="modeOfTransport"
              value={formData.modeOfTransport}
              onChange={(val) => handleChange("modeOfTransport", val)}
              options={["Air", "Ship", "Road", "Courier"]}
            />
            <TextInput
              label="Shipping Code"
              name="shippingCode"
              value={formData.shippingCode}
              onChange={(val) => handleChange("shippingCode", val)}
            />
            <DateInput
              label="Delivery Date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={(val) => handleChange("deliveryDate", val)}
            />
            <div className="col-span-2">
              <TextareaInput
                label="Delivery to"
                name="deliveryTo"
                value={formData.deliveryTo}
                onChange={(val) => handleChange("deliveryTo", val)}
              />
            </div>
          </div>
        </div>

        {/* Second Container (Placeholder) */}
        <div>{/* Future: SupplierSelection component */}</div>

        {/* Third Container */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 border rounded-xl">
            <Dropdown
              label="Division"
              name="division"
              value={formData.division}
              onChange={(val) => handleChange("division", val)}
              options={["Electronics", "Mechanical", "IT"]}
            />
            <AutoSuggestInput
              label="Project No"
              name="projectNo"
              value={formData.projectNo}
              onChange={(val) => handleChange("projectNo", val)}
              suggestions={["PRJ-009", "PRJ-010", "PRJ-011"]}
            />
            <TextInput
              label="Project Details"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={(val) => handleChange("projectDetails", val)}
            />
            <TextInput
              label="Order Description"
              name="orderDescription"
              value={formData.orderDescription}
              onChange={(val) => handleChange("orderDescription", val)}
            />
            <TextInput
              label="Attn to"
              name="attnTo"
              value={formData.attnTo}
              onChange={(val) => handleChange("attnTo", val)}
            />
            <Dropdown
              label="Email"
              name="email"
              value={formData.email}
              onChange={(val) => handleChange("email", val)}
              options={["rajesh@sample.com", "info@sample.com", "admin@sample.com"]}
            />
            <Dropdown
              label="Mobile No"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={(val) => handleChange("mobileNo", val)}
              options={["+91 9876543210", "+91 9123456789"]}
            />
            <div className="col-span-2">
              <TextareaInput
                label="Terms and conditions"
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={(val) => handleChange("termsAndConditions", val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 items-end mt-4">
        <Dropdown
          label="Mode Of Payment"
          name="modeOfPayment"
          value={formData.modeOfPayment}
          onChange={(val) => handleChange("modeOfPayment", val)}
          options={["NEFT", "UPI", "Cash", "Cheque"]}
        />
        <TextInput
          label="Credit Days"
          name="creditDays"
          value={formData.creditDays}
          onChange={(val) => handleChange("creditDays", val)}
        />
        <TextInput
          label="Advance"
          name="advance"
          value={formData.advance}
          onChange={(val) => handleChange("advance", val)}
        />
        <PrimaryButton type="submit">
          Next <ArrowRight />
        </PrimaryButton>
      </div>
    </>
  );
};
