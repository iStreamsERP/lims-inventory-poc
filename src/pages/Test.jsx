import React, { useState } from 'react';
import TextComp from './TestComp';


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
  // ... other material objects ...
];

export default function Test() {
  const initialMaterial = {
    ITEM_CODE: "",
    ITEM_NAME: "",
    DESCRIPTION: "",
    BATCH_NO: "",
    CONDCD: "",
    LOC_MAKING: "",
    QTY_LOGICAL: 0,
    QTY_GROUND: 0,
    QTY: 1,
    UNIT: "",
    SRV: "",
    SRV_CHOICE: "",
    STATION_CODE: "",
    NOT_TAKENOVER: false,
    FREEGRD_CWH: false,
    REMARKS: "",
    DATE: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(initialMaterial);
  const [material, setMaterial] = useState([]);

  const handleToggleMaterial = (selectedMaterial) => {
    setMaterial((prev) => {
      const index = prev.findIndex((m) => m.ITEM_CODE === selectedMaterial.ITEM_CODE);
      if (index > -1) {
        return prev.filter((_, i) => i !== index);
      } else {
        return [...prev, selectedMaterial];
      }
    });
    // Reset formData to initial state
    setFormData(initialMaterial);
  };

  const handleUpdateQty = (itemCode, newQty) => {
    setMaterial((prev) =>
      prev.map((m) =>
        m.ITEM_CODE === itemCode ? { ...m, QTY_LOGICAL: Number(newQty) } : m
      )
    );
  };

  return (
    <div>
      <TextComp
        handleToggleMaterial={handleToggleMaterial}
        handleUpdateQty={handleUpdateQty}
        material={material}
        all_materials={all_materials}
      />
    </div>
  );
}