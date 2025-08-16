// import React, { useState } from "react";
// import ReleaseComponent from "./ReleaseComponent";

// function Release() {
//   const [getIssues] = useState([
//     {
//       ITEM_LABEL: "Pending Preservation Debits For Gate Pass",
//       ITEM_VALUE: "pendingDebits",
//     },
//     { ITEM_LABEL: "Pending Releases For Gate Pass", ITEM_VALUE: "pendingRelease" },
//     {
//       ITEM_LABEL: "Pending Repairable Debits For Gate Pass",
//       ITEM_VALUE: "pendingRepairableDebits",
//     },
//     {
//       ITEM_LABEL: "Pending Sea Stock Deposit Packages For Gate Pass",
//       ITEM_VALUE: "pendingSeaStockDepositPackages",
//     },
//     { ITEM_LABEL: "Pending STV For Gate Pass", ITEM_VALUE: "pendingSTV" },
//     {
//       ITEM_LABEL: "Pending Transshipment For Gate Pass",
//       ITEM_VALUE: "pendingTransshipment",
//     },
//   ]);

//   const [masterData] = useState([
//     {
//       CUS_CD: "4966",
//       DEM_NO: "25Q0001",
//       ISSUE_DTTM: "08/14/2025",
//       ITEM_CODE: "CNCMT-CVA0010",
//       REL_SRI: 1,
//       RELEASE_DTTM: "08/14/2025",
//       STK_SRL: 15,
//       QTY: 1,
//       HAND_OVER_BY: "tbishstk",
//       DTM_TAKEN_OVER: "08/14/2025",
//       TAKEN_BY: "testpvk",
//       STATION_CODE: "K",
//       GATE_PASS_KEY: "GP001"
//     },
//     {
//       CUS_CD: "4966",
//       DEM_NO: "25Q0002",
//       ISSUE_DTTM: "08/14/2025",
//       ITEM_CODE: "CNCMT-CVA0015",
//       REL_SRI: 2,
//       RELEASE_DTTM: "08/14/2025",
//       STK_SRL: 16,
//       QTY: 2,
//       HAND_OVER_BY: "tbishstk",
//       DTM_TAKEN_OVER: "08/14/2025",
//       TAKEN_BY: "user2",
//       STATION_CODE: "L",
//       GATE_PASS_KEY: "GP002"
//     },
//     {
//       CUS_CD: "4970",
//       DEM_NO: "25Q0003",
//       ISSUE_DTTM: "08/14/2025",
//       ITEM_CODE: "CNCMT-CVB0020",
//       REL_SRI: 3,
//       RELEASE_DTTM: "08/14/2025",
//       STK_SRL: 17,
//       QTY: 3,
//       HAND_OVER_BY: "user3",
//       DTM_TAKEN_OVER: "08/14/2025",
//       TAKEN_BY: "user4",
//       STATION_CODE: "M",
//       GATE_PASS_KEY: "GP003"
//     },
//     {
//       CUS_CD: "4975",
//       DEM_NO: "25Q0004",
//       ISSUE_DTTM: "08/14/2025",
//       ITEM_CODE: "CNCMT-CVC0030",
//       REL_SRI: 4,
//       RELEASE_DTTM: "08/14/2025",
//       STK_SRL: 18,
//       QTY: 4,
//       HAND_OVER_BY: "user5",
//       DTM_TAKEN_OVER: "08/14/2025",
//       TAKEN_BY: "user6",
//       STATION_CODE: "N",
//       GATE_PASS_KEY: "GP004"
//     },
//     {
//       CUS_CD: "4980",
//       DEM_NO: "25Q0005",
//       ISSUE_DTTM: "08/14/2025",
//       ITEM_CODE: "CNCMT-CVD0040",
//       REL_SRI: 5,
//       RELEASE_DTTM: "08/14/2025",
//       STK_SRL: 19,
//       QTY: 5,
//       HAND_OVER_BY: "user7",
//       DTM_TAKEN_OVER: "08/14/2025",
//       TAKEN_BY: "user8",
//       STATION_CODE: "O",
//       GATE_PASS_KEY: "GP005"
//     },
//   ]);

//   const [masterDetails] = useState([
//     {
//       CUS_CD: "4966",
//       DEM_NO: "25Q0001",
//       STOCK_DELIVERY_KEY: "10:15:30 AM",
//       ISSUE_DTTM: "08/14/2025",
//       STK_REL_REL_SRL: 1,
//       QTY_CARRIED: 1,
//       GATE_PASS_KEY: "GP001",
//       PKG_MARKING: "FRAGILE",
//       STATION_CODE: "K",
//     },
//     {
//       CUS_CD: "4966",
//       DEM_NO: "25Q0002",
//       STOCK_DELIVERY_KEY: "10:30:45 AM",
//       ISSUE_DTTM: "08/14/2025",
//       STK_REL_REL_SRL: 2,
//       QTY_CARRIED: 2,
//       GATE_PASS_KEY: "GP002",
//       PKG_MARKING: "HANDLE WITH CARE",
//       STATION_CODE: "L",
//     },
//     {
//       CUS_CD: "4970",
//       DEM_NO: "25Q0003",
//       STOCK_DELIVERY_KEY: "10:45:15 AM",
//       ISSUE_DTTM: "08/14/2025",
//       STK_REL_REL_SRL: 3,
//       QTY_CARRIED: 3,
//       GATE_PASS_KEY: "GP003",
//       PKG_MARKING: "TOP LOAD",
//       STATION_CODE: "M",
//     },
//     {
//       CUS_CD: "4975",
//       DEM_NO: "25Q0004",
//       STOCK_DELIVERY_KEY: "11:00:30 AM",
//       ISSUE_DTTM: "08/14/2025",
//       STK_REL_REL_SRL: 4,
//       QTY_CARRIED: 4,
//       GATE_PASS_KEY: "GP004",
//       PKG_MARKING: "DO NOT STACK",
//       STATION_CODE: "N",
//     },
//     {
//       CUS_CD: "4980",
//       DEM_NO: "25Q0005",
//       STOCK_DELIVERY_KEY: "11:15:45 AM",
//       ISSUE_DTTM: "08/14/2025",
//       STK_REL_REL_SRL: 5,
//       QTY_CARRIED: 5,
//       GATE_PASS_KEY: "GP005",
//       PKG_MARKING: "THIS SIDE UP",
//       STATION_CODE: "O",
//     },
//   ]);

//   const [searchCustomerNo, setSearchCustomerNo] = useState("");
//   const [searchDemandNo, setSearchDemandNo] = useState("");
//   const [selectType, setSelectType] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [showData, setShowData] = useState(false);
//   const [selectedMaterial,setSelecetdMaterial]=useState([])

//   const handleClick = () => {
//     let filters = masterData;
    
//     // Apply filters
//     if (searchCustomerNo) {
//       filters = filters.filter((item) =>
//         item.CUS_CD.toLowerCase().includes(searchCustomerNo.toLowerCase())
//       );
//     }
//     if (searchDemandNo) {
//       filters = filters.filter((item) =>
//         item.DEM_NO.toLowerCase().includes(searchDemandNo.toLowerCase())
//       );
//     }
//     if (selectType) {
//       // Here you would add logic to filter based on selectType if needed
//       // For now, we'll just pass all data if a type is selected
//       filters = filters;
//     }

//     setFilteredData(filters);
//     setShowData(true);
//     console.log("filteredData", filters);
//   };

//   const handleSelectData =(material)=>{

//   }

//   return (
//     <div>
//       <ReleaseComponent
//         getIssues={getIssues}
//         masterDetails={masterDetails}
//         masterData={masterData}
//         setSearchCustomerNo={setSearchCustomerNo}
//         setSearchDemandNo={setSearchDemandNo}
//         searchCustomerNo={searchCustomerNo}
//         searchDemandNo={searchDemandNo}
//         filteredData={filteredData}
//         handleClick={handleClick}
//         setSelectType={setSelectType}
//         selectType={selectType}
//         ShowDatas={showData}
//         selectedMaterial={selectedMaterial}
//         handleSelectData={handleSelectData}
//       />
//     </div>
//   );
// }

// export default Release;


import React, { useState } from "react";
import ReleaseComponent from "./ReleaseComponent";


 const getIssues = [
  {
    ITEM_LABEL: "Pending Preservation Debits For Gate Pass",
    ITEM_VALUE: "pendingDebits",
  },
  { ITEM_LABEL: "Pending Releases For Gate Pass", ITEM_VALUE: "pendingRelease" },
  {
    ITEM_LABEL: "Pending Repairable Debits For Gate Pass",
    ITEM_VALUE: "pendingRepairableDebits",
  },
  {
    ITEM_LABEL: "Pending Sea Stock Deposit Packages For Gate Pass",
    ITEM_VALUE: "pendingSeaStockDepositPackages",
  },
  { ITEM_LABEL: "Pending STV For Gate Pass", ITEM_VALUE: "pendingSTV" },
  {
    ITEM_LABEL: "Pending Transshipment For Gate Pass",
    ITEM_VALUE: "pendingTransshipment",
  },
];

 const masterData = [
  {
    CUS_CD: "4966",
    DEM_NO: "25Q0001",
    ISSUE_DTTM: "08/14/2025",
    ITEM_CODE: "CNCMT-CVA0010",
    REL_SRI: 1,
    RELEASE_DTTM: "08/14/2025",
    STK_SRL: 15,
    QTY: 1,
    HAND_OVER_BY: "tbishstk",
    DTM_TAKEN_OVER: "08/14/2025",
    TAKEN_BY: "testpvk",
    STATION_CODE: "K",
    GATE_PASS_KEY: "GP001",
    STOCK_DELIVERY_KEY: "SD001",
    PKG_MARKING: "FRAGILE"
  },
  {
    CUS_CD: "4966",
    DEM_NO: "25Q0002",
    ISSUE_DTTM: "08/14/2025",
    ITEM_CODE: "CNCMT-CVA0015",
    REL_SRI: 2,
    RELEASE_DTTM: "08/14/2025",
    STK_SRL: 16,
    QTY: 2,
    HAND_OVER_BY: "tbishstk",
    DTM_TAKEN_OVER: "08/14/2025",
    TAKEN_BY: "user2",
    STATION_CODE: "L",
    GATE_PASS_KEY: "GP002",
    STOCK_DELIVERY_KEY: "SD002",
    PKG_MARKING: "HANDLE WITH CARE"
  },
  {
    CUS_CD: "4970",
    DEM_NO: "25Q0003",
    ISSUE_DTTM: "08/14/2025",
    ITEM_CODE: "CNCMT-CVB0020",
    REL_SRI: 3,
    RELEASE_DTTM: "08/14/2025",
    STK_SRL: 17,
    QTY: 3,
    HAND_OVER_BY: "user3",
    DTM_TAKEN_OVER: "08/14/2025",
    TAKEN_BY: "user4",
    STATION_CODE: "M",
    GATE_PASS_KEY: "GP003",
    STOCK_DELIVERY_KEY: "SD003",
    PKG_MARKING: "TOP LOAD"
  },
  {
    CUS_CD: "4975",
    DEM_NO: "25Q0004",
    ISSUE_DTTM: "08/14/2025",
    ITEM_CODE: "CNCMT-CVC0030",
    REL_SRI: 4,
    RELEASE_DTTM: "08/14/2025",
    STK_SRL: 18,
    QTY: 4,
    HAND_OVER_BY: "user5",
    DTM_TAKEN_OVER: "08/14/2025",
    TAKEN_BY: "user6",
    STATION_CODE: "N",
    GATE_PASS_KEY: "GP004",
    STOCK_DELIVERY_KEY: "SD004",
    PKG_MARKING: "DO NOT STACK"
  },
  {
    CUS_CD: "4980",
    DEM_NO: "25Q0005",
    ISSUE_DTTM: "08/14/2025",
    ITEM_CODE: "CNCMT-CVD0040",
    REL_SRI: 5,
    RELEASE_DTTM: "08/14/2025",
    STK_SRL: 19,
    QTY: 5,
    HAND_OVER_BY: "user7",
    DTM_TAKEN_OVER: "08/14/2025",
    TAKEN_BY: "user8",
    STATION_CODE: "O",
    GATE_PASS_KEY: "GP005",
    STOCK_DELIVERY_KEY: "SD005",
    PKG_MARKING: "THIS SIDE UP"
  },
];

 const masterDetails = [
  {
    CUS_CD: "4966",
    DEM_NO: "25Q0001",
    STOCK_DELIVERY_KEY: "10:15:30 AM",
    ISSUE_DTTM: "08/14/2025",
    STK_REL_REL_SRL: 1,
    QTY_CARRIED: 1,
    GATE_PASS_KEY: "GP001",
    PKG_MARKING: "FRAGILE",
    STATION_CODE: "K",
  },
  {
    CUS_CD: "4966",
    DEM_NO: "25Q0002",
    STOCK_DELIVERY_KEY: "10:30:45 AM",
    ISSUE_DTTM: "08/14/2025",
    STK_REL_REL_SRL: 2,
    QTY_CARRIED: 2,
    GATE_PASS_KEY: "GP002",
    PKG_MARKING: "HANDLE WITH CARE",
    STATION_CODE: "L",
  },
  {
    CUS_CD: "4970",
    DEM_NO: "25Q0003",
    STOCK_DELIVERY_KEY: "10:45:15 AM",
    ISSUE_DTTM: "08/14/2025",
    STK_REL_REL_SRL: 3,
    QTY_CARRIED: 3,
    GATE_PASS_KEY: "GP003",
    PKG_MARKING: "TOP LOAD",
    STATION_CODE: "M",
  },
  {
    CUS_CD: "4975",
    DEM_NO: "25Q0004",
    STOCK_DELIVERY_KEY: "11:00:30 AM",
    ISSUE_DTTM: "08/14/2025",
    STK_REL_REL_SRL: 4,
    QTY_CARRIED: 4,
    GATE_PASS_KEY: "GP004",
    PKG_MARKING: "DO NOT STACK",
    STATION_CODE: "N",
  },
  {
    CUS_CD: "4980",
    DEM_NO: "25Q0005",
    STOCK_DELIVERY_KEY: "11:15:45 AM",
    ISSUE_DTTM: "08/14/2025",
    STK_REL_REL_SRL: 5,
    QTY_CARRIED: 5,
    GATE_PASS_KEY: "GP005",
    PKG_MARKING: "THIS SIDE UP",
    STATION_CODE: "O",
  },
];
const Release = () => {
  const [searchCustomerNo, setSearchCustomerNo] = useState("");
  const [searchDemandNo, setSearchDemandNo] = useState("");
  const [selectType, setSelectType] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    let filters = masterData;
    
    if (searchCustomerNo) {
      filters = filters.filter((item) =>
        item.CUS_CD.toLowerCase().includes(searchCustomerNo.toLowerCase())
      );
    }
    if (searchDemandNo) {
      filters = filters.filter((item) =>
        item.DEM_NO.toLowerCase().includes(searchDemandNo.toLowerCase())
      );
    }
    if (selectType) {
      filters = filters;
    }

    setFilteredData(filters);
    setShowData(true);
  };

  const handleSelectData = (material) => {
    const matchingMasterData = masterData.filter(
      item => item.CUS_CD === material.CUS_CD && item.DEM_NO === material.DEM_NO
    );
    
    const matchingMasterDetails = masterDetails.filter(
      item => item.CUS_CD === material.CUS_CD && item.DEM_NO === material.DEM_NO
    );
    
    const combinedData = matchingMasterData.map(masterItem => {
      const detailItem = matchingMasterDetails.find(
        detail => detail.STK_REL_REL_SRL === masterItem.REL_SRI
      );
      
      return {
        ...masterItem,
        ...detailItem
      };
    });
    
    setSelectedMaterial(combinedData);
  };

  return (
    <div>
      <ReleaseComponent
        getIssues={getIssues}
        masterDetails={masterDetails}
        masterData={masterData}
        setSearchCustomerNo={setSearchCustomerNo}
        setSearchDemandNo={setSearchDemandNo}
        searchCustomerNo={searchCustomerNo}
        searchDemandNo={searchDemandNo}
        filteredData={filteredData}
        handleClick={handleClick}
        setSelectType={setSelectType}
        selectType={selectType}
        ShowDatas={showData}
        selectedMaterial={selectedMaterial}
        handleSelectData={handleSelectData}
        setSelectedMaterial={setSelectedMaterial}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Release;