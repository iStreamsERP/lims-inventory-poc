import { useState } from 'react';
import IlmsCompClick from "@/components/IlmsCompClick";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

// Simulated large dataset of materials
const ALL_MATERIALS = [
  { ITEM_CODE: "13232", ITEM_NAME: "CSAC233", QUANTITY: 1, QUOTATION_FOR: "rep" },
  { ITEM_CODE: "1323ere2", ITEM_NAME: "weeCSACfegfe233", QUANTITY: 1, QUOTATION_FOR: "rep" },
  { ITEM_CODE: "13eevev232", ITEM_NAME: "CSevweweAC233", QUANTITY: 1, QUOTATION_FOR: "rep" },
  { ITEM_CODE: "1323eeqw22", ITEM_NAME: "CSAdavavdaC233", QUANTITY: 1, QUOTATION_FOR: "rep" },
  { ITEM_CODE: "132EE32", ITEM_NAME: "CSAEFEFC233", QUANTITY: 1, QUOTATION_FOR: "ars" },
  { ITEM_CODE: "1323ere2-ars", ITEM_NAME: "weeCSACfegfe233-ars", QUANTITY: 1, QUOTATION_FOR: "ars" },
  { ITEM_CODE: "1EE3232", ITEM_NAME: "CSACEFEFE233", QUANTITY: 1, QUOTATION_FOR: "oth" },
  { ITEM_CODE: "1323eEFEre2", ITEM_NAME: "weeCSEFEACfegfe233", QUANTITY: 1, QUOTATION_FOR: "oth" },
  { ITEM_CODE: "1323eEFEeDCDqw22", ITEM_NAME: "EF", QUANTITY: 1, QUOTATION_FOR: "oth" },
  // Simulate additional materials (e.g., up to 1000)
  ...Array.from({ length: 991 }, (_, i) => ({
    ITEM_CODE: `ITEM${i + 10}`,
    ITEM_NAME: `Material ${i + 10}`,
    QUANTITY: 1,
    QUOTATION_FOR: ["rep", "ars", "oth", "mmp"][Math.floor(Math.random() * 4)],
  })),
];

export default function Ilmsc() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { toast } = useToast();

  const initialMaterial = {
    ITEM_CODE: "",
    ITEM_NAME: "",
    QUANTITY: "",
    QUOTATION_FOR: "",
  };

  const AuthorityType = [
    { ITEM_VALUE: "ARS", ITEM_LABEL: "ARS" },
    { ITEM_VALUE: "REP", ITEM_LABEL: "REP" },
    { ITEM_VALUE: "OTH", ITEM_LABEL: "OTH" },
    { ITEM_VALUE: "MMP", ITEM_LABEL: "MMP" },
  ];

  const [openMaterialPopup, setOpenMaterialPopup] = useState(false);
  const [materialSearch, setMaterialSearch] = useState("");
  const [materialFormData, setMaterialFormData] = useState(initialMaterial);
  const [materials, setMaterials] = useState([]);
  const [editingQuantityId, setEditingQuantityId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAuthority, setSelectedAuthority] = useState("");
ssss
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuotationForChange = (type) => {
    setSelectedAuthority(type);
    setMaterialFormData((prev) => ({
      ...prev,
      QUOTATION_FOR: type,
    }));
    setMaterials([]); // Clear selected materials when authority type changes
  };

  const getCurrentMaterials = () => {
    if (!selectedAuthority) return [];
    return ALL_MATERIALS.filter(
      (material) => material.QUOTATION_FOR.toLowerCase() === selectedAuthority.toLowerCase()
    );
  };

  const handleMaterialSelect = (material) => {
    const isAlreadyAdded = materials.some(
      (m) => m.ITEM_CODE === material.ITEM_CODE
    );

    if (isAlreadyAdded) {
      toast({
        variant: "destructive",
        title: "Material already added",
        description: "This material is already in your list",
      });
      return;
    }

    const newMaterial = {
      ...material,
      ITEM_NAME: material.ITEM_NAME || material.DESCRIPTION || "",
      DESCRIPTION: material.DESCRIPTION || material.ITEM_NAME || "",
      QTY: 1,
    };

    setMaterials((prev) => [...prev, newMaterial]);
    setOpenMaterialPopup(false);
    setMaterialSearch("");
  };

  const handleQuantityChange = (itemCode, quantity) => {
    const newMaterials = materials.map((m) =>
      m.ITEM_CODE === itemCode ? { ...m, QTY: quantity } : m
    );
    setMaterials(newMaterials);
  };

  const handleRemoveMaterial = (itemCode) => {
    setMaterials(materials.filter((m) => m.ITEM_CODE !== itemCode));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (materials.length === 0) {
      alert("Please select at least one material before submitting");
      return;
    }

    const submissionData = {
      authorityType: selectedAuthority,
      materials: materials.map(m => ({
        code: m.ITEM_CODE,
        name: m.ITEM_NAME,
        quantity: m.QTY || 1
      }))
    };

    alert(JSON.stringify(submissionData, null, 2));
    console.log("Submitted data:", submissionData);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-col justify-between gap-2 lg:flex-row">
          <div className="flex w-full flex-col gap-4 lg:w-[75%]">
            <IlmsCompClick
              materialFormData={materialFormData}
              materials={materials}
              isEditMode={isEditMode}
              loading={loading}
              handleChange={handleChange}
              AuthorityType={AuthorityType}
              handleQuotationForChange={handleQuotationForChange}
              handleMaterialSelect={handleMaterialSelect}
              handleRemoveMaterial={handleRemoveMaterial}
              setEditingQuantityId={setEditingQuantityId}
              editingQuantityId={editingQuantityId}
              handleQuantityChange={handleQuantityChange}
              openMaterialPopup={openMaterialPopup}
              setOpenMaterialPopup={setOpenMaterialPopup}
              materialSearch={materialSearch}
              setMaterialSearch={setMaterialSearch}
              getCurrentMaterials={getCurrentMaterials}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={materials.length === 0}>
            Submit Materials
          </Button>
        </div>
      </form>
    </div>
  );
}