import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { Loader2, UploadIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { convertServiceDate } from "@/utils/dateUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { callSoapService } from "@/api/callSoapService";

import PopoverTable from "@/components/PopoverTable";
import VendorPopoverTable from "@/components/VendorPopover";
import { PrintPreviewDialog } from "@/components/rfq/PrintPreviewDialog";



export default function Rfq() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { toast } = useToast();

  const initialMaterial = {
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    QUOTATION_REF_NO: id || -1,
    QUOTATION_REF_DATE: new Date().toISOString().split("T")[0],
    SERIAL_NO: 1,
    ITEM_CODE: "",
    ITEM_NAME: "",
    UOM_STOCK: "",
    QTY: 1,
    RECEIVED_STATUS: false,
    CLOSED_STATUS: false,
    USER_NAME: "",
    ENT_DATE: "",
    EXPECTED_DATE: new Date().toISOString().split("T")[0],
    WORK_REF_SERIAL_NO: "",
    EST_EXT_COMPONENTS_SNO: null,
    SPECIFICATION: "",
    SUPPLIER_REF: "",
    SELECTED_RATE: 0,
    SELECTED_VENDOR: "",
    SELECTED_VENDOR_NAME: "",
    SUGGESTED_VENDOR_ID: null,
    SUGGESTED_VENDOR_NAME: "",
    SUGGESTED_RATE: 0,
    REVIEWED_USER_NAME: "",
    REVIEWED_DATE: "",
    MR_REQUISITION_NO: "",
    MR_REQUISITION_DATE: null,
    MR_REQUISITION_SERIAL_NO: null,
    SUB_MATERIAL_NO: null,
    MR_REF_NO: null,
    QUOTATION_FOR: "Raw",
  };

  const initialVendor = {
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    QUOTATION_REF_NO: initialMaterial.QUOTATION_REF_NO,
    QUOTATION_REF_DATE: initialMaterial.QUOTATION_REF_DATE,
    QUOTATION_SERIAL_NO: 1,
    VENDOR_ID: "",
    ITEM_CODE: "",
    QTY: 0.0,
    RATE: 0.0,
    DISCOUNT_RATE: 0.0,
    EXPECTED_DATE: "",
    RECEIVED_DATE: "",
    VENDOR_OFFER: "",
    RECEIVED_STATUS: false,
    SELECTED_STATUS: false,
    CLOSED_STATUS: false,
    USER_NAME: "",
    ENT_DATE: "",
    WORK_REF_SERIAL_NO: null,
    EST_EXT_COMPONENTS_SNO: null,
    QUOTATION_STATUS: null,
    VENDOR_NAME: null,
    COUNTRY_NAME: null,
    CREDIT_DAYS: null,
    NO_OF_PAYMENTS: null,
    DELIVERY_DAYS: null,
    DISCOUNT_PTG: null,
    ATTN_TO: null,
    EMAIL_ADDRESS: null,
    DESCRIPTION: null,
    UOM: null,
    FILE_PATH: null,
    FILE_NAME: null,
    VALUE: null,
    TOTAL_VALUE: null,
    DISCOUNT_VALUE: null,
    NET_VALUE: null,
    FILE_PATH_PDF: null,
    FILE_NAME_PDF: null,
  };

  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [openVendorPopup, setOpenVendorPopup] = useState(false);
  const [materialFormData, setMaterialFormData] = useState(initialMaterial);
  const [materials, setMaterials] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [editingQuantityId, setEditingQuantityId] = useState(null);
  const [selectedVendorForPopup, setSelectedVendorForPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextMaterialSerialNo, setNextMaterialSerialNo] = useState(1);
  const [nextVendorSerialNo, setNextVendorSerialNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [actionLoading, setActionLoading] = useState({});
  const [openMaterialPopup, setOpenMaterialPopup] = useState(false);
  const [materialSearch, setMaterialSearch] = useState("");

  useEffect(() => {
    fetchVendors();
    if (id) {
      setIsEditMode(true);
      fetchQuotationData(id);
    }
  }, [id]);

  const fetchVendors = async () => {
    try {
      const payload = {
        DataModelName: "VENDOR_MASTER",
        WhereCondition: "",
        Orderby: "",
      };
      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );
      setVendors(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch vendors",
        description: error.message,
      });
    }
  };

  const fetchRawMaterials = useCallback(async () => {
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER_VIEW",
        WhereCondition: "",
        Orderby: "",
      };
      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );
      setRawMaterials(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch raw materials",
        description: error.message,
      });
    }
  }, [userData.clientURL]);

  const fetchPurchaseRequisitions = useCallback(async () => {
    try {
      const payload = {
        DataModelName: "INVT_PO_REQUISITIONLIST",
        WhereCondition: "",
        Orderby: "",
      };
      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );
      setPurchaseRequisitions(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch purchase requisitions",
        description: error.message,
      });
    }
  }, [userData.clientURL]);

  const fetchQuotationData = async (quotationId) => {
    setLoading(true);
    try {
      const masterPayload = {
        DataModelName: "INVT_PURCHASE_QUOTMASTER",
        WhereCondition: `QUOTATION_REF_NO = '${quotationId}'`,
        Orderby: "",
      };

      const masterResponse = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        masterPayload
      );

      if (masterResponse.length > 0) {
        const masterData = masterResponse[0];
        setMaterialFormData({
          ...masterData,
          QUOTATION_REF_DATE: convertServiceDate(masterData.QUOTATION_REF_DATE),
          EXPECTED_DATE: convertServiceDate(masterData.EXPECTED_DATE),
          QUOTATION_FOR: masterData.QUOTATION_FOR || "Raw",
          SPECIFICATION: masterData.SPECIFICATION || "",
          SUB_MATERIAL_NO: masterData.SUB_MATERIAL_NO || null,
          ITEM_NAME: masterData.DESCRIPTION || "",
          UOM_STOCK: masterData.UOM || masterData.UOM_STOCK || "",
        });

        const detailsPayload = {
          DataModelName: "INVT_PURCHASE_QUOTDETAILS",
          WhereCondition: `QUOTATION_REF_NO = '${quotationId}'`,
          Orderby: "",
        };

        const detailsResponse = await callSoapService(
          userData.clientURL,
          "DataModel_GetData",
          detailsPayload
        );

        processEditData(masterResponse, detailsResponse);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading quotation",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const processEditData = (masterData, detailsData) => {
    const materialsMap = new Map();
    const vendorsMap = new Map();

    const masterDataMap = {};
    masterData.forEach((master) => {
      masterDataMap[master.ITEM_CODE] = master;
    });

    detailsData.forEach((detail) => {
      const masterItem = masterDataMap[detail.ITEM_CODE] || {};

      if (!materialsMap.has(detail.ITEM_CODE)) {
        materialsMap.set(detail.ITEM_CODE, {
          ITEM_CODE: detail.ITEM_CODE,
          ITEM_NAME:
            detail.DESCRIPTION ||
            detail.ITEM_NAME ||
            masterItem.ITEM_NAME ||
            "",
          UOM_STOCK:
            detail.UOM ||
            detail.UOM_STOCK ||
            masterItem.UOM ||
            masterItem.UOM_STOCK ||
            "Kg",
          DESCRIPTION: detail.DESCRIPTION || "",
          UOM: detail.UOM || masterItem.UOM || "",
          QTY: detail.QTY,
          SPECIFICATION: detail.SPECIFICATION || "",
          SUGGESTED_VENDOR_ID: detail.VENDOR_ID,
          SUGGESTED_VENDOR_NAME: detail.VENDOR_NAME,
          SUGGESTED_RATE: detail.RATE,
          SERIAL_NO: detail.QUOTATION_SERIAL_NO,
          SUB_MATERIAL_NO: masterItem.SUB_MATERIAL_NO || null,
        });
      }

      if (!vendorsMap.has(detail.VENDOR_ID)) {
        vendorsMap.set(detail.VENDOR_ID, {
          VENDOR_ID: detail.VENDOR_ID,
          VENDOR_NAME: detail.VENDOR_NAME,
          COUNTRY_NAME: detail.COUNTRY_NAME,
          QUOTATION_SERIAL_NO: detail.QUOTATION_SERIAL_NO,
          materials: [],
        });
      }
    });

    detailsData.forEach((detail) => {
      const vendor = vendorsMap.get(detail.VENDOR_ID);
      if (vendor) {
        vendor.materials.push({
          ITEM_CODE: detail.ITEM_CODE,
          ITEM_NAME: detail.DESCRIPTION || detail.ITEM_NAME || "",
          DESCRIPTION: detail.DESCRIPTION || "",
          UOM_STOCK: detail.UOM || detail.UOM_STOCK || "",
          UOM: detail.UOM || "",
          QTY: detail.QTY,
          RATE: detail.RATE,
          DISCOUNT_RATE: detail.DISCOUNT_RATE,
          EXPECTED_DATE: detail.EXPECTED_DATE,
          SUB_MATERIAL_NO: detail.SUB_MATERIAL_NO || null,
        });
      }
    });

    setMaterials(Array.from(materialsMap.values()));
    setSelectedVendors(Array.from(vendorsMap.values()));
    setNextMaterialSerialNo(materialsMap.size + 1);
    setNextVendorSerialNo(vendorsMap.size + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuotationForChange = (type) => {
    setMaterialFormData((prev) => ({
      ...prev,
      QUOTATION_FOR: type,
    }));
    setMaterials([]);
    setSelectedVendors([]);
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
      SERIAL_NO: nextMaterialSerialNo,
      QUOTATION_REF_NO: materialFormData.QUOTATION_REF_NO,
      QUOTATION_REF_DATE: materialFormData.QUOTATION_REF_DATE,
      EXPECTED_DATE: materialFormData.EXPECTED_DATE,
    };

    setMaterials((prev) => [...prev, newMaterial]);
    setNextMaterialSerialNo(nextMaterialSerialNo + 1);

    setSelectedVendors((prevSelected) => {
      return prevSelected.map((vendor) => ({
        ...vendor,
        materials: [
          ...vendor.materials,
          {
            ...newMaterial,
            VENDOR_ID: vendor.VENDOR_ID,
            VENDOR_NAME: vendor.VENDOR_NAME,
            RATE: newMaterial.SUGGESTED_RATE,
            DISCOUNT_RATE: 0,
            EXPECTED_DATE: materialFormData.EXPECTED_DATE,
          },
        ],
      }));
    });

    setOpenMaterialPopup(false);
    setMaterialSearch("");
  };

  const handleRemoveMaterial = (itemCode) => {
    try {
      if (isEditMode && id) {
        const payload = {
          UserName: userData.userName,
          DataModelName: "INVT_PURCHASE_QUOTDETAILS",
          WhereCondition: `QUOTATION_REF_NO = '${materialFormData.QUOTATION_REF_NO}' AND ITEM_CODE = '${itemCode}'`,
        };

        callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

        const masterPayload = {
          UserName: userData.userName,
          DataModelName: "INVT_PURCHASE_QUOTMASTER",
          WhereCondition: `QUOTATION_REF_NO = '${materialFormData.QUOTATION_REF_NO}'`,
        };

        callSoapService(
          userData.clientURL,
          "DataModel_DeleteData",
          masterPayload
        );
      }
      setMaterials((prev) => {
        const updated = prev.filter((m) => m.ITEM_CODE !== itemCode);
        return updated.map((m, index) => ({
          ...m,
          SERIAL_NO: index + 1,
        }));
      });

      setNextMaterialSerialNo(materials.length);

      setSelectedVendors((prev) =>
        prev
          .map((vendor) => ({
            ...vendor,
            materials: vendor.materials.filter((m) => m.ITEM_CODE !== itemCode),
          }))
          .filter((vendor) => vendor.materials.length > 0)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveVendorMaterial = async (material) => {
    if (!selectedVendorForPopup) return;

    try {
      if (isEditMode && id) {
        const deleteDetailsPayload = {
          UserName: userData.userName,
          DataModelName: "INVT_PURCHASE_QUOTDETAILS",
          WhereCondition: `QUOTATION_REF_NO = '${id}' AND VENDOR_ID = '${selectedVendorForPopup.VENDOR_ID}' AND ITEM_CODE = '${material.ITEM_CODE}'`,
        };

        await callSoapService(
          userData.clientURL,
          "DataModel_DeleteData",
          deleteDetailsPayload
        );

        const remainingVendorsForMaterial = selectedVendors.filter(
          (vendor) =>
            vendor.VENDOR_ID !== selectedVendorForPopup.VENDOR_ID &&
            vendor.materials.some((m) => m.ITEM_CODE === material.ITEM_CODE)
        );

        if (remainingVendorsForMaterial.length === 0) {
          const deleteMasterPayload = {
            UserName: userData.userName,
            DataModelName: "INVT_PURCHASE_QUOTMASTER",
            WhereCondition: `QUOTATION_REF_NO = '${id}' AND ITEM_CODE = '${material.ITEM_CODE}'`,
          };

          await callSoapService(
            userData.clientURL,
            "DataModel_DeleteData",
            deleteMasterPayload
          );
        }
      }

      const updatedVendors = selectedVendors.map((vendor) => {
        if (vendor.VENDOR_ID === selectedVendorForPopup.VENDOR_ID) {
          return {
            ...vendor,
            materials: vendor.materials.filter(
              (m) => m.ITEM_CODE !== material.ITEM_CODE
            ),
          };
        }
        return vendor;
      });

      const materialExistsInOtherVendors = updatedVendors.some((vendor) =>
        vendor.materials.some((m) => m.ITEM_CODE === material.ITEM_CODE)
      );

      if (!materialExistsInOtherVendors) {
        setMaterials((prevMaterials) =>
          prevMaterials.filter((m) => m.ITEM_CODE !== material.ITEM_CODE)
        );
      }

      setSelectedVendors(
        updatedVendors.filter((vendor) => vendor.materials.length > 0)
      );

      setSelectedVendorForPopup((prev) => ({
        ...prev,
        materials: prev.materials.filter(
          (m) => m.ITEM_CODE !== material.ITEM_CODE
        ),
      }));

      toast({
        title: "Material removed successfully",
        description: `Material ${material.ITEM_CODE} removed from vendor ${
          selectedVendorForPopup.VENDOR_NAME
        }${isEditMode ? " and database" : ""}`,
      });
    } catch (error) {
      console.error("Error removing vendor material:", error);
      toast({
        variant: "destructive",
        title: "Error removing material",
        description:
          error.message || "Failed to remove material from the system.",
      });
    }
  };

  const handleQuantityChange = (itemCode, quantity) => {
    const newMaterials = materials.map((m) =>
      m.ITEM_CODE === itemCode ? { ...m, QTY: quantity } : m
    );

    setMaterials(newMaterials);

    setSelectedVendors((prev) =>
      prev.map((vendor) => ({
        ...vendor,
        materials: vendor.materials.map((m) =>
          m.ITEM_CODE === itemCode ? { ...m, QTY: quantity } : m
        ),
      }))
    );
  };

  const handleVendorSelection = (vendor) => {
    const isAlreadySelected = selectedVendors.some(
      (v) => v.VENDOR_ID === vendor.VENDOR_ID
    );

    if (isAlreadySelected) {
      toast({
        variant: "destructive",
        title: "Vendor already added",
        description: "This vendor is already in your list",
      });
      return;
    }

    const vendorWithMaterials = {
      ...vendor,
      QUOTATION_SERIAL_NO: nextVendorSerialNo,
      materials: materials.map((m) => ({
        ...m,
        VENDOR_ID: vendor.VENDOR_ID,
        VENDOR_NAME: vendor.VENDOR_NAME,
        RATE: m.SUGGESTED_RATE || 0,
        DISCOUNT_RATE: 0,
        EXPECTED_DATE: materialFormData.EXPECTED_DATE,
      })),
    };

    setSelectedVendors((prevSelected) => [
      ...prevSelected,
      vendorWithMaterials,
    ]);
    setNextVendorSerialNo(nextVendorSerialNo + 1);
  };

  const handleRemoveVendor = async (vendorId) => {
    try {
      if (isEditMode && id) {
        const deleteDetailsPayload = {
          DataModelName: "INVT_PURCHASE_QUOTDETAILS",
          WhereCondition: `QUOTATION_REF_NO = '${id}' AND VENDOR_ID = '${vendorId}'`,
        };

        await callSoapService(
          userData.clientURL,
          "DataModel_DeleteData",
          deleteDetailsPayload
        );

        const remainingVendorsForMaterials = selectedVendors.filter(
          (v) => v.VENDOR_ID !== vendorId
        );

        const materialsToRemoveFromMaster = [];
        const vendorToRemove = selectedVendors.find(
          (v) => v.VENDOR_ID === vendorId
        );

        if (vendorToRemove) {
          vendorToRemove.materials.forEach((material) => {
            const hasOtherVendors = remainingVendorsForMaterials.some(
              (vendor) =>
                vendor.materials.some((m) => m.ITEM_CODE === material.ITEM_CODE)
            );

            if (!hasOtherVendors) {
              materialsToRemoveFromMaster.push(material.ITEM_CODE);
            }
          });
        }

        for (const itemCode of materialsToRemoveFromMaster) {
          const masterDeletePayload = {
            DataModelName: "INVT_PURCHASE_QUOTMASTER",
            WhereCondition: `QUOTATION_REF_NO = '${id}' AND ITEM_CODE = '${itemCode}'`,
          };

          await callSoapService(
            userData.clientURL,
            "DataModel_DeleteData",
            masterDeletePayload
          );
        }
      }

      setSelectedVendors((prev) => {
        const updated = prev.filter((v) => v.VENDOR_ID !== vendorId);
        return updated.map((v, index) => ({
          ...v,
          QUOTATION_SERIAL_NO: index + 1,
        }));
      });

      const remainingVendors = selectedVendors.filter(
        (v) => v.VENDOR_ID !== vendorId
      );
      const vendorToRemove = selectedVendors.find(
        (v) => v.VENDOR_ID === vendorId
      );

      if (vendorToRemove) {
        const materialsToRemove = [];
        vendorToRemove.materials.forEach((material) => {
          const hasOtherVendors = remainingVendors.some((vendor) =>
            vendor.materials.some((m) => m.ITEM_CODE === material.ITEM_CODE)
          );

          if (!hasOtherVendors) {
            materialsToRemove.push(material.ITEM_CODE);
          }
        });

        if (materialsToRemove.length > 0) {
          setMaterials((prev) =>
            prev.filter((m) => !materialsToRemove.includes(m.ITEM_CODE))
          );
        }
      }

      setNextVendorSerialNo(selectedVendors.length);

      toast({
        title: "Vendor removed successfully",
        description: `Vendor has been removed from the quotation${
          isEditMode ? " and database" : ""
        }.`,
      });
    } catch (error) {
      console.error("Error removing vendor:", error);
      toast({
        variant: "destructive",
        title: "Error removing vendor",
        description:
          error.message || "Failed to remove vendor from the system.",
      });
    }
  };

  const handleBadgeClick = (vendor) => {
    setSelectedVendorForPopup(vendor);
    setOpenVendorPopup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateQuotation();
      } else {
        await createQuotation();
      }

      toast({
        title: `Quotation ${isEditMode ? "updated" : "created"} successfully`,
        variant: "default",
      });
      navigate("/rfq-list");
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${isEditMode ? "updating" : "creating"} quotation`,
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createQuotation = async () => {
    let materialSerialNo = 1;
    let vendorSerialNo = 1;
    let refno = -1;

    for (const material of materials) {
      for (const vendor of selectedVendors) {
        const vendorMaterial = vendor.materials.find(
          (m) => m.ITEM_CODE === material.ITEM_CODE
        );
        if (!vendorMaterial) continue;

        const materialData = {
          ...materialFormData,
          USER_NAME: userData.username,
          ENT_DATE: new Date().toISOString().split("T")[0],
          ITEM_CODE: material.ITEM_CODE,
          DESCRIPTION: material.ITEM_NAME,
          SERIAL_NO: materialSerialNo,
          QTY: material.QTY,
          UOM: material.UOM_STOCK,
          EXPECTED_DATE: material.EXPECTED_DATE,
          SPECIFICATION: material.SPECIFICATION,
          SUGGESTED_VENDOR_ID: material.SUGGESTED_VENDOR_ID,
          SUGGESTED_VENDOR_NAME: material.SUGGESTED_VENDOR_NAME,
          SUGGESTED_RATE: material.SUGGESTED_RATE,
          SELECTED_VENDOR: vendor.VENDOR_ID,
          SELECTED_VENDOR_NAME: vendor.VENDOR_NAME,
          SELECTED_RATE: vendorMaterial.RATE || material.SUGGESTED_RATE,
          QUOTATION_REF_NO: refno,
          SUB_MATERIAL_NO: material.SUB_MATERIAL_NO,
        };

        const convertedMaterialData = convertDataModelToStringData(
          "INVT_PURCHASE_QUOTMASTER",
          materialData
        );

        const payload = {
          UserName: userData.userEmail,
          DModelData: convertedMaterialData,
        };

        const response = await callSoapService(
          userData.clientURL,
          "DataModel_SaveData",
          payload
        );

        if (refno === -1 && response) {
          const parts = response.split(" ");
          const extractedRef = parts[6]?.trim().replace(/'/g, "");
          if (extractedRef) {
            refno = extractedRef;
          }
        }

        const vendorData = {
          ...initialVendor,
          QUOTATION_REF_NO: refno,
          QUOTATION_REF_DATE: materialData.QUOTATION_REF_DATE,
          QUOTATION_SERIAL_NO: materialData.SERIAL_NO,
          VENDOR_ID: vendor.VENDOR_ID,
          VENDOR_NAME: vendor.VENDOR_NAME,
          ITEM_CODE: material.ITEM_CODE,
          DESCRIPTION: material.ITEM_NAME,
          UOM: material.UOM,
          QTY: material.QTY,
          COUNTRY_NAME: vendor.COUNTRY_NAME,
          RATE: vendorMaterial.RATE || material.SUGGESTED_RATE,
          EXPECTED_DATE: materialFormData.EXPECTED_DATE,
          USER_NAME: userData.username,
          ENT_DATE: new Date().toISOString().split("T")[0],
        };

        const convertedVendorData = convertDataModelToStringData(
          "INVT_PURCHASE_QUOTDETAILS",
          vendorData
        );

        const vendorPayload = {
          UserName: userData.userEmail,
          DModelData: convertedVendorData,
        };

        await callSoapService(
          userData.clientURL,
          "DataModel_SaveData",
          vendorPayload
        );

        materialSerialNo++;
      }
      vendorSerialNo++;
    }
  };

  const updateQuotation = async () => {
    let materialSerialNo = 1;
    let refno = id || -1;

    try {
      if (isEditMode && refno !== -1) {
        const deleteDetailsPayload = {
          DataModelName: "INVT_PURCHASE_QUOTDETAILS",
          WhereCondition: `QUOTATION_REF_NO = '${refno}'`,
        };

        try {
          await callSoapService(
            userData.clientURL,
            "DataModel_DeleteData",
            deleteDetailsPayload
          );
        } catch (error) {
          console.error("Error deleting quotation details:", error);
        }

        const deleteMasterPayload = {
          DataModelName: "INVT_PURCHASE_QUOTMASTER",
          WhereCondition: `QUOTATION_REF_NO = '${refno}'`,
        };

        try {
          await callSoapService(
            userData.clientURL,
            "DataModel_DeleteData",
            deleteMasterPayload
          );
        } catch (error) {
          console.error("Error deleting quotation master:", error);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const processedCombinations = new Set();

      for (const material of materials) {
        for (const vendor of selectedVendors) {
          const vendorMaterial = vendor.materials.find(
            (m) => m.ITEM_CODE === material.ITEM_CODE
          );
          if (!vendorMaterial) continue;

          const combinationKey = `${material.ITEM_CODE}-${vendor.VENDOR_ID}`;
          if (processedCombinations.has(combinationKey)) {
            continue;
          }
          processedCombinations.add(combinationKey);

          const materialData = {
            ...materialFormData,
            USER_NAME: userData.userName || userData.username,
            ENT_DATE: new Date().toISOString().split("T")[0],
            ITEM_CODE: material.ITEM_CODE,
            DESCRIPTION: material.ITEM_NAME,
            SERIAL_NO: materialSerialNo,
            QTY: material.QTY,
            UOM: material.UOM_STOCK,
            SUB_MATERIAL_NO: material.SUB_MATERIAL_NO,
            EXPECTED_DATE:
              material.EXPECTED_DATE || materialFormData.EXPECTED_DATE,
            SPECIFICATION:
              material.SPECIFICATION || materialFormData.SPECIFICATION,
            SUGGESTED_VENDOR_ID: material.SUGGESTED_VENDOR_ID,
            SUGGESTED_VENDOR_NAME: material.SUGGESTED_VENDOR_NAME,
            SUGGESTED_RATE: material.SUGGESTED_RATE,
            SELECTED_VENDOR: vendor.VENDOR_ID,
            SELECTED_VENDOR_NAME: vendor.VENDOR_NAME,
            SELECTED_RATE: vendorMaterial.RATE || material.SUGGESTED_RATE,
            QUOTATION_REF_NO: refno,
          };

          const convertedMaterialData = convertDataModelToStringData(
            "INVT_PURCHASE_QUOTMASTER",
            materialData
          );

          const masterPayload = {
            UserName: userData.userEmail,
            DModelData: convertedMaterialData,
          };

          await callSoapService(
            userData.clientURL,
            "DataModel_SaveData",
            masterPayload
          );

          const vendorData = {
            ...initialVendor,
            QUOTATION_REF_NO: refno,
            QUOTATION_REF_DATE: materialFormData.QUOTATION_REF_DATE,
            QUOTATION_SERIAL_NO: materialSerialNo,
            VENDOR_ID: vendor.VENDOR_ID,
            VENDOR_NAME: vendor.VENDOR_NAME,
            ITEM_CODE: material.ITEM_CODE,
            DESCRIPTION: material.DESCRIPTION,
            UOM: material.UOM,
            QTY: material.QTY,
            COUNTRY_NAME: vendor.COUNTRY_NAME,
            RATE: vendorMaterial.RATE || material.SUGGESTED_RATE,
            DISCOUNT_RATE: vendorMaterial.DISCOUNT_RATE || 0,
            EXPECTED_DATE: materialFormData.EXPECTED_DATE,
            USER_NAME: userData.userName || userData.username,
            ENT_DATE: new Date().toISOString().split("T")[0],
          };

          const convertedVendorData = convertDataModelToStringData(
            "INVT_PURCHASE_QUOTDETAILS",
            vendorData
          );

          const detailPayload = {
            UserName: userData.userEmail,
            DModelData: convertedVendorData,
          };

          await callSoapService(
            userData.clientURL,
            "DataModel_SaveData",
            detailPayload
          );

          materialSerialNo++;
        }
      }
    } catch (error) {
      console.error("Error in updateQuotation:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (userData?.clientURL) {
      fetchRawMaterials();
      fetchPurchaseRequisitions();
    }
  }, [userData?.clientURL, fetchRawMaterials, fetchPurchaseRequisitions]);

  const materialColumns = [
    { key: "index", header: "S.No", width: "10%", align: "center" },
    { key: "ITEM_CODE", header: "Item Code", width: "15%" },
    { key: "ITEM_NAME", header: "Description", width: "25%" },
    { key: "UOM_STOCK", header: "UOM", width: "15%", align: "right" },
    {
      key: "QTY",
      header: "Quantity",
      width: "20%",
      align: "right",
      render: (item, index, editingId, setEditingId, onDelete, onEdit) => {
        const isEditing = editingId === item.ITEM_CODE;
        return (
          <div
            className="flex h-6 w-20 cursor-pointer items-center justify-end px-2"
            onClick={() => setEditingId(item.ITEM_CODE)}
          >
            {isEditing ? (
              <Input
                type="number"
                value={item.QTY || 1}
                onChange={(e) => onEdit(item.ITEM_CODE, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    setEditingId(null);
                  }
                }}
                className="h-6 w-20 text-right"
                min="1"
                autoFocus
              />
            ) : (
              <span>{item.QTY || 1}</span>
            )}
          </div>
        );
      },
    },
    {
      key: "SUB_MATERIAL_NO",
      header: "Sub Material",
      width: "15%",
      align: "center",
    },
    {
      key: "actions",
      header: "Actions",
      width: "10%",
      align: "right",
      render: (item, index, editingId, setEditingId, onDelete) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDelete(item.ITEM_CODE, e)}
          disabled={actionLoading[`material-${item.ITEM_CODE}`]}
        >
          {actionLoading[`material-${item.ITEM_CODE}`] ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3 text-red-500" />
          )}
        </Button>
      ),
    },
  ];

  const vendorDetailsColumns = [
    {
      key: "index",
      header: "S.No",
      width: "10%",
      align: "center",
      render: (item, index) => index + 1,
    },
    { key: "ITEM_CODE", header: "Item Code", width: "20%" },
    { key: "ITEM_NAME", header: "Description", width: "30%" },
    { key: "UOM_STOCK", header: "UOM", width: "15%", align: "right" },
    { key: "QTY", header: "Qty", width: "15%", align: "right" },
    {
      key: "RATE",
      header: "Rate",
      width: "15%",
      align: "right",
      render: (item) => (item.RATE || item.SUGGESTED_RATE || 0).toFixed(2),
    },
    {
      key: "actions",
      header: "Actions",
      width: "10%",
      align: "right",
      render: (item, index, onRemove) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item)}
          disabled={actionLoading[`vendor-material-${item.ITEM_CODE}`]}
        >
          {actionLoading[`vendor-material-${item.ITEM_CODE}`] ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3 text-red-500" />
          )}
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-col justify-between gap-2 lg:flex-row">
          <div className="flex w-full flex-col gap-4 lg:w-[75%]">
            <div className="rounded-lg border bg-card p-4 shadow-lg dark:bg-slate-950">
              <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
                <div className="text-base font-semibold">
                  {isEditMode ? "Edit" : "Create"} RFQ (Request For Quotation) -
                  Ref No:{" "}
                  <span className="text-purple-500">
                    {materialFormData.QUOTATION_REF_NO === -1
                      ? "New"
                      : materialFormData.QUOTATION_REF_NO}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3 text-xs">
                    <Checkbox
                      id="rawmaterials"
                      checked={materialFormData.QUOTATION_FOR === "Raw"}
                      onCheckedChange={(checked) => {
                        handleQuotationForChange(checked ? "Raw" : "Purchase");
                      }}
                    />
                    <Label htmlFor="rawmaterials">Raw Materials</Label>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Checkbox
                      id="purchaserequisition"
                      checked={materialFormData.QUOTATION_FOR === "Purchase"}
                      onCheckedChange={(checked) => {
                        handleQuotationForChange(checked ? "Purchase" : "Raw");
                      }}
                    />
                    <Label htmlFor="purchaserequisition">
                      Purchase Requisition
                    </Label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex w-full flex-col gap-1 sm:min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Label
                      className="flex-shrink-0 whitespace-nowrap text-xs"
                      htmlFor="referencedate"
                    >
                      Quote Ref Date
                    </Label>
                    <Input
                      id="referencedate"
                      name="QUOTATION_REF_DATE"
                      type="date"
                      value={materialFormData.QUOTATION_REF_DATE}
                      onChange={handleChange}
                      className="h-6 flex-1 rounded-none border-0 border-b border-gray-500 bg-white px-0 py-0.5 text-xs focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-slate-950"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1 sm:min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Label
                      className="flex-shrink-0 whitespace-nowrap text-xs"
                      htmlFor="expecteddate"
                    >
                      Expected Date
                    </Label>
                    <Input
                      id="expecteddate"
                      name="EXPECTED_DATE"
                      type="date"
                      value={materialFormData.EXPECTED_DATE}
                      onChange={handleChange}
                      className="h-6 flex-1 rounded-none border-0 border-b border-gray-500 bg-white px-0 py-0.5 text-xs focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-slate-950"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <PopoverTable
                  data={materials}
                  onSelectData={handleMaterialSelect}
                  onEditData={handleQuantityChange}
                  onDeleteData={handleRemoveMaterial}
                  columns={materialColumns}
                  searchFields={[
                    "ITEM_CODE",
                    "ITEM_NAME",
                    "UOM_STOCK",
                    "SUB_MATERIAL_NO",
                  ]}
                  uniqueKey="ITEM_CODE"
                  placeholderText="Search materials..."
                  emptyMessage="No materials selected. Please select materials to add to the quotation."
                  popoverWidth="750px"
                  dataModelName={
                    materialFormData.QUOTATION_FOR === "Raw"
                      ? "INVT_MATERIAL_MASTER_VIEW"
                      : "INVT_PO_REQUISITIONLIST"
                  }
                  dataModelType="DataModel_GetData"
                  editingId={editingQuantityId}
                  setEditingId={setEditingQuantityId}
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[25%]">
            <VendorPopoverTable
              selectedData={selectedVendors}
              onSelectData={handleVendorSelection}
              onRemoveData={handleRemoveVendor}
              onBadgeClick={handleBadgeClick}
              onRemoveMaterial={handleRemoveVendorMaterial}
              vendorDetailsColumns={vendorDetailsColumns}
              searchFields={["VENDOR_NAME", "COUNTRY_NAME", "VENDOR_ID"]}
              uniqueKey="VENDOR_ID"
              placeholderText="Select a vendor..."
              emptyMessage="No vendors selected."
              noDataMessage="Select materials first"
              popoverWidth="400px"
              dataModelName="VENDOR_MASTER"
              dataModelType="DataModel_GetData"
              isDisabled={materials.length === 0}
              openVendorPopup={openVendorPopup}
              setOpenVendorPopup={setOpenVendorPopup}
              selectedVendorForPopup={selectedVendorForPopup}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <PrintPreviewDialog
              masterData={materialFormData}
              materials={materials}
              vendors={selectedVendors}
            >
              <Button className="px-6">
                Export To PDF <UploadIcon className="ml-2 h-4 w-4" />
              </Button>
            </PrintPreviewDialog>
            <Button
              className="px-6"
              disabled={
                materials.length === 0 ||
                selectedVendors.length === 0 ||
                isSubmitting
              }
            >
              Export To Excel <UploadIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Button
            type="submit"
            className="px-6"
            disabled={
              materials.length === 0 ||
              selectedVendors.length === 0 ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadIcon className="mr-2 h-4 w-4" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}