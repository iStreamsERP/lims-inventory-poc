import React, { useState } from 'react';
import GatePassComp from './GatePassComp';

function GatePass() {
  const all_materials = [
  {
    STK_SRI: 14,
    SHNo: "K45",
    ITEM_CODE: "CNCMT-CVA001",
    BATCH_NO: "Wed Aug 13 2025",
    CONDCD: "NEW",
    LOC_MAKING: "L4C252",
    QTY_LOGICAL: 1,
    QTY_GROUND: 1,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "",
    SRV: "16K45SS00280",
    SRV_CHOICE: "X",
    STATION_CODE: "K"
  },
  {
    STK_SRI: 15,
    SHNo: "M72",
    ITEM_CODE: "CNCMT-CVB002",
    BATCH_NO: "Wed Aug 13 2025",
    CONDCD: "NEW",
    LOC_MAKING: "L5D123",
    QTY_LOGICAL: 5,
    QTY_GROUND: 4,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "WH1",
    SRV: "16M72SS00321",
    SRV_CHOICE: "Y",
    STATION_CODE: "M"
  },
  {
    STK_SRI: 16,
    SHNo: "P19",
    ITEM_CODE: "CNCMT-CVC003",
    BATCH_NO: "Tue Aug 12 2025",
    CONDCD: "USED",
    LOC_MAKING: "L3B456",
    QTY_LOGICAL: 3,
    QTY_GROUND: 3,
    NOT_TAKENOVER: "Pending",
    FREEGRD_CWH: "",
    SRV: "16P19SS00456",
    SRV_CHOICE: "X",
    STATION_CODE: "P"
  },
  {
    STK_SRI: 17,
    SHNo: "T33",
    ITEM_CODE: "CNCMT-CVD004",
    BATCH_NO: "Wed Aug 13 2025",
    CONDCD: "NEW",
    LOC_MAKING: "L6A789",
    QTY_LOGICAL: 10,
    QTY_GROUND: 8,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "WH2",
    SRV: "16T33SS00789",
    SRV_CHOICE: "Z",
    STATION_CODE: "T"
  },
  {
    STK_SRI: 18,
    SHNo: "R88",
    ITEM_CODE: "CNCMT-CVE005",
    BATCH_NO: "Mon Aug 11 2025",
    CONDCD: "REFURB",
    LOC_MAKING: "L2C101",
    QTY_LOGICAL: 2,
    QTY_GROUND: 2,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "",
    SRV: "16R88SS00912",
    SRV_CHOICE: "X",
    STATION_CODE: "R"
  },
  {
    STK_SRI: 19,
    SHNo: "S22",
    ITEM_CODE: "CNCMT-CVF006",
    BATCH_NO: "Wed Aug 13 2025",
    CONDCD: "NEW",
    LOC_MAKING: "L7D234",
    QTY_LOGICAL: 7,
    QTY_GROUND: 6,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "WH3",
    SRV: "16S22SS01045",
    SRV_CHOICE: "Y",
    STATION_CODE: "S"
  },
  {
    STK_SRI: 20,
    SHNo: "Q11",
    ITEM_CODE: "CNCMT-CVG007",
    BATCH_NO: "Tue Aug 12 2025",
    CONDCD: "USED",
    LOC_MAKING: "L1A567",
    QTY_LOGICAL: 4,
    QTY_GROUND: 3,
    NOT_TAKENOVER: "Pending",
    FREEGRD_CWH: "",
    SRV: "16Q11SS01178",
    SRV_CHOICE: "X",
    STATION_CODE: "Q"
  },
  {
    STK_SRI: 21,
    SHNo: "U44",
    ITEM_CODE: "CNCMT-CVH008",
    BATCH_NO: "Wed Aug 13 2025",
    CONDCD: "NEW",
    LOC_MAKING: "L8B890",
    QTY_LOGICAL: 12,
    QTY_GROUND: 12,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "WH4",
    SRV: "16U44SS01301",
    SRV_CHOICE: "Z",
    STATION_CODE: "U"
  },
  {
    STK_SRI: 22,
    SHNo: "V66",
    ITEM_CODE: "CNCMT-CVI009",
    BATCH_NO: "Mon Aug 11 2025",
    CONDCD: "REFURB",
    LOC_MAKING: "L9C345",
    QTY_LOGICAL: 6,
    QTY_GROUND: 5,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "",
    SRV: "16V66SS01434",
    SRV_CHOICE: "X",
    STATION_CODE: "V"
  },
  {
    STK_SRI: 23,
    SHNo: "W99",
    ITEM_CODE: "CNCMT-CVJ010",
    BATCH_NO: "Wed Aug 13 2025",
    CONDCD: "NEW",
    LOC_MAKING: "L0D678",
    QTY_LOGICAL: 9,
    QTY_GROUND: 9,
    NOT_TAKENOVER: "",
    FREEGRD_CWH: "WH5",
    SRV: "16W99SS01567",
    SRV_CHOICE: "Y",
    STATION_CODE: "W"
  }
];

  const initialMaterial = {
    ITEM_CODE: "",
    ITEM_NAME: "",
    DESCRIPTION: "",
    BATCH_NO: "",
    CONDCD: "", // Condition code
    LOC_MAKING: "", // Location
    QTY_LOGICAL: 0, // Logical quantity
    QTY_GROUND: 0, // Physical quantity
    QTY: 1, // Default quantity for gate pass
    UNIT: "", // Measurement unit
    SRV: "", // Service reference
    SRV_CHOICE: "", // Service choice
    STATION_CODE: "", // Station/Department code
    NOT_TAKENOVER: false, // Flag for items not taken over
    FREEGRD_CWH: false, // Flag for free ground warehouse
    REMARKS: "", // Any additional remarks
    DATE: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
  };

  const [openMaterialPopup, setOpenMaterialPopup] = useState(false);
  const [materialSearch, setMaterialSearch] = useState("");
  const [materialFormData, setMaterialFormData] = useState(initialMaterial);
  const [materials, setMaterials] = useState([]);
  const [editingQuantityId, setEditingQuantityId] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [popupMaterial, setPopupMaterial] = useState([]);

  const toast = ({ variant, title, description }) => {
    console.log(variant, title, description);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    setSelectedMaterial(material);

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

  const handleQuantityChange = (locMaking, quantity) => {
    const newMaterials = materials.map((m) =>
      m.LOC_MAKING === locMaking ? { ...m, QTY_LOGICAL: quantity } : m
    );
    setMaterials(newMaterials);

    const newPopupMaterial = popupMaterial.map((m) =>
      m.LOC_MAKING === locMaking ? { ...m, QTY_LOGICAL: quantity } : m
    );
    setPopupMaterial(newPopupMaterial);
  };

  const handleSelectDAtas = (locMaking) => {
    const selected = materials.find((m) => m.LOC_MAKING === locMaking);
    if (selected) {
      setPopupMaterial([selected]);
      setIsDialogOpen(true);
    }
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
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex w-full flex-col justify-between gap-2 lg:flex-row">
          <div className="flex w-full flex-col gap-4 lg:w-[75%]">
            <GatePassComp
              materialFormData={materialFormData}
              materials={materials}
              isEditMode={isEditMode}
              loading={loading}
              handleChange={handleChange}
              handleMaterialSelect={handleMaterialSelect}
              handleSelectDAtas={handleSelectDAtas}
              setEditingQuantityId={setEditingQuantityId}
              editingQuantityId={editingQuantityId}
              handleQuantityChange={handleQuantityChange}
              openMaterialPopup={openMaterialPopup}
              setOpenMaterialPopup={setOpenMaterialPopup}
              materialSearch={materialSearch}
              setMaterialSearch={setMaterialSearch}
              all_materials={all_materials}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              popupMaterial={popupMaterial}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default GatePass;