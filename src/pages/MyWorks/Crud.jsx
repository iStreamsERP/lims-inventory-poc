// import { Input } from "@/components/ui/input";
// import React, { useEffect, useState } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// const masterData = [
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230001",
//     ItemCode: "ITM1001",
//     ItemDescription: "Stainless Steel Bolt 10mm",
//     StationCode: "STN-A1",
//     DemandDate: "2023-05-15",
//     Quantity: 50,
//     UnitPrice: 2.75,
//   },
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230001",
//     ItemCode: "ITM2045",
//     ItemDescription: 'Rubber Gasket 3/4"',
//     StationCode: "STN-B2",
//     DemandDate: "2023-05-16",
//     Quantity: 200,
//     UnitPrice: 0.85,
//   },
//   {
//     CustomerCode: "CUST003",
//     DemandNo: "DEM20230003",
//     ItemCode: "ITM3092",
//     ItemDescription: "Aluminum Pipe 1m",
//     StationCode: "STN-C3",
//     DemandDate: "2023-05-17",
//     Quantity: 15,
//     UnitPrice: 12.5,
//   },
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230004",
//     ItemCode: "ITM1002",
//     ItemDescription: "Stainless Steel Nut 10mm",
//     StationCode: "STN-A1",
//     DemandDate: "2023-05-18",
//     Quantity: 60,
//     UnitPrice: 1.2,
//   },
//   {
//     CustomerCode: "CUST004",
//     DemandNo: "DEM20230005",
//     ItemCode: "ITM4087",
//     ItemDescription: "PVC Hose 5m",
//     StationCode: "STN-D4",
//     DemandDate: "2023-05-19",
//     Quantity: 8,
//     UnitPrice: 7.8,
//   },
//   {
//     CustomerCode: "CUST002",
//     DemandNo: "DEM20230006",
//     ItemCode: "ITM2050",
//     ItemDescription: "Copper Wire 18AWG",
//     StationCode: "STN-B2",
//     DemandDate: "2023-05-20",
//     Quantity: 150,
//     UnitPrice: 0.45,
//   },
//   {
//     CustomerCode: "CUST005",
//     DemandNo: "DEM20230007",
//     ItemCode: "ITM5001",
//     ItemDescription: "Steel Bracket L-type",
//     StationCode: "STN-E5",
//     DemandDate: "2023-05-21",
//     Quantity: 25,
//     UnitPrice: 3.25,
//   },
//   {
//     CustomerCode: "CUST003",
//     DemandNo: "DEM20230008",
//     ItemCode: "ITM3100",
//     ItemDescription: 'Brass Valve 1/2"',
//     StationCode: "STN-C3",
//     DemandDate: "2023-05-22",
//     Quantity: 10,
//     UnitPrice: 8.9,
//   },
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230009",
//     ItemCode: "ITM1005",
//     ItemDescription: "Washer 10mm",
//     StationCode: "STN-A1",
//     DemandDate: "2023-05-23",
//     Quantity: 100,
//     UnitPrice: 0.3,
//   },
//   {
//     CustomerCode: "CUST006",
//     DemandNo: "DEM20230010",
//     ItemCode: "ITM6002",
//     ItemDescription: "Plastic Container 5L",
//     StationCode: "STN-F6",
//     DemandDate: "2023-05-24",
//     Quantity: 12,
//     UnitPrice: 4.75,
//   },
// ];

// localStorage.setItem("masterData", JSON.stringify(masterData));

// const SelectType = [
//   {
//     ITEM_LABLE: "Release Issue",
//     ITEM_VALUE: "ReleaseIssue",
//   },
//   {
//     ITEM_LABLE: "Preservation Issue",
//     ITEM_VALUE: "PreservationIssue",
//   },
//   {
//     ITEM_LABLE: "Repairable Issue",
//     ITEM_VALUE: "RepairableIssue",
//   },
//   {
//     ITEM_LABLE: "Sea Stock Issue",
//     ITEM_VALUE: "SeaStockIssue",
//   },
//   {
//     ITEM_LABLE: "STV Issue",
//     ITEM_VALUE: "STVIssue",
//   },
//   {
//     ITEM_LABLE: "Transshipment Issue",
//     ITEM_VALUE: "TransshipmentIssue",
//   },
// ];

// localStorage.setItem("SelectType", JSON.stringify(SelectType));

// const masterDetails = [
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230001",
//     ItemCode: "ITM1001",
//     ItemDescription: "Metal Pipe 1m",
//     StationCode: "STN-A1",
//     DemandDate: "2023-05-15",
//     Quantity: 100,
//     UnitPrice: 1.5,
//     Remarks: "This is a test",
//     ststus: "pending",
//     scope: "Gate Pass",
//     EquipCode: "EQP001",
//     EquipDescription: "Equip 1",
//     EquipQuantity: 10,
//   },
//   {
//     CustomerCode: "CUST002",
//     DemandNo: "DEM20230002",
//     ItemCode: "ITM1002",
//     ItemDescription: "Stainless Steel Nut 10mm",
//     StationCode: "STN-B2",
//     DemandDate: "2023-05-16",
//     Quantity: 50,
//     UnitPrice: 2.0,
//     Remarks: "This is a test",
//     ststus: "pending",
//     scope: "Gate Pass",
//     EquipCode: "EQP002",
//     EquipDescription: "Equip 2",
//     EquipQuantity: 5,
//   },
//   {
//     CustomerCode: "CUST003",
//     DemandNo: "DEM20230003",
//     ItemCode: "ITM1003",
//     ItemDescription: "Copper Wire 18AWG",
//     StationCode: "STN-C3",
//     DemandDate: "2023-05-17",
//     Quantity: 75,
//     UnitPrice: 0.75,
//     Remarks: "This is a test",
//     ststus: "pending",
//     scope: "Gate Pass",
//     EquipCode: "EQP003",
//     EquipDescription: "Equip 3",
//     EquipQuantity: 7,
//   },
//   {
//     CustomerCode: "CUST004",
//     DemandNo: "DEM20230004",
//     ItemCode: "ITM1004",
//     ItemDescription: 'Brass Valve 1/2"',
//     StationCode: "STN-D4",
//     DemandDate: "2023-05-18",
//     Quantity: 25,
//     UnitPrice: 3.5,
//     Remarks: "This is a test",
//     ststus: "pending",
//     scope: "Gate Pass",
//     EquipCode: "EQP004",
//     EquipDescription: "Equip 4",
//     EquipQuantity: 2,
//   },
//   {
//     CustomerCode: "CUST005",
//     DemandNo: "DEM20230005",
//     ItemCode: "ITM1005",
//     ItemDescription: "Washer 10mm",
//     StationCode: "STN-E5",
//     DemandDate: "2023-05-19",
//     Quantity: 100,
//     UnitPrice: 0.5,
//     Remarks: "This is a test",
//     ststus: "pending",
//     scope: "Gate Pass",
//     EquipCode: "EQP005",
//     EquipDescription: "Equip 5",
//     EquipQuantity: 10,
//   },
// ];

// localStorage.setItem("masterDetails", JSON.stringify(masterDetails));

// const initialData = {
//   CustomerCode: "",
//   DemandNo: "",
//   ItemCode: "",
//   ItemDescription: "",
//   StationCode: "",
//   DemandDate: "",
//   Quantity: 1,
//   UnitPrice: 0,
// };

// function Crud() {
//   const [material, setMaterial] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [searchDemand, setSearchDemand] = useState("");
//   const [searchCustomer, setSearchCustomer] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterPopup, setFilterPopup] = useState([]);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [editingId, setEditingId] = useState(null);
//   const [tempQuantity, setTempQuantity] = useState(0);

//   useEffect(() => {
//     fetechTypes();
//     fetchMasterData();
//   }, []);

//   const fetchMasterData = () => {
//     const response = JSON.parse(localStorage.getItem("masterData"));
//     setMaterial(response);
//   };

//   const fetechTypes = () => {
//     const response = JSON.parse(localStorage.getItem("SelectType"));
//     setTypes(response);
//   };
//   const handleClick = () => {
//     const response = JSON.parse(localStorage.getItem("masterData")) || [];
//     const filteredData = response.filter(
//       (item) =>
//         item.DemandNo.toLowerCase().includes(searchDemand.toLowerCase()) && item.CustomerCode.toLowerCase().includes(searchCustomer.toLowerCase()),
//     );
//     setFilteredData(filteredData);
//   };

//   const handleQuantityClick = (item) => {
//     setEditingId(`${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`);
//     setTempQuantity(item.Quantity);
//   };

//   const handleQuantityChange = (e) => {
//     setTempQuantity(e.target.value);
//   };

//   const handleQuantitySave = () => {
//     // Update the masterDetails in localStorage
//     const updatedDetails = filterPopup.map((item) => {
//       const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
//       if (itemId === editingId) {
//         return { ...item, Quantity: Number(tempQuantity) };
//       }
//       return item;
//     });

//     // Update state and localStorage
//     setFilterPopup(updatedDetails);
//     localStorage.setItem("masterDetails", JSON.stringify(updatedDetails));
//     setEditingId(null);
//   };

//   // Handle save when input loses focus or Enter is pressed
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleQuantitySave();
//     }
//   };

//   //   const handleIssue = (material) => {

//   //     const filterPopup = filteredData.filter((item) => item.CustomerCode === material.CustomerCode);
//   //     setFilterPopup(filterPopup);
//   //     setIsPopupOpen(true);
//   //   };

//   const handleIssue = (material) => {
//     // Get masterDetails from localStorage and filter by CustomerCode
//     const masterDetails = JSON.parse(localStorage.getItem("masterDetails")) || [];
//     const detailsPopup = masterDetails.filter((item) => item.CustomerCode === material.CustomerCode);
//     setFilterPopup(detailsPopup);
//     setIsPopupOpen(true);
//   };

//   const handleSave = () => {

//     // Update the masterDetails in localStorage
//     const updatedDetails = filterPopup.map((item) => {
//       const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
//       if (itemId === editingId) {
//         return { ...item, Quantity: Number(tempQuantity) };
//       }
//       return item;
//     });

//     // Update state and localStorage
//     setFilterPopup(updatedDetails);
//     localStorage.setItem("masterDetails", JSON.stringify(updatedDetails));
//     setEditingId(null);
//     setIsPopupOpen(false);
//   };

//   return (
//     <div className="h-screen space-y-2 bg-slate-900 p-6 text-white">
//       <div className="flex gap-2">
//         <Select>
//           <SelectTrigger>
//             <SelectValue placeholder="slect Type" />
//           </SelectTrigger>
//           <SelectContent>
//             {types.map((items) => (
//               <SelectItem
//                 key={items.ITEM_VALUE}
//                 value={items.ITEM_VALUE}
//               >
//                 {items.ITEM_LABLE}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Input
//           className="w-full"
//           placeholder="Search demand..."
//           value={searchDemand}
//           onChange={(e) => setSearchDemand(e.target.value)}
//         />

//         <Input
//           className="w-full"
//           placeholder="Search Customer Code..."
//           value={searchCustomer}
//           onChange={(e) => setSearchCustomer(e.target.value)}
//         />

//         <Button
//           variant={"secondary"}
//           onClick={handleClick}
//         >
//           Search
//         </Button>
//       </div>

//       <div className="h-[calc(100vh-200px)] overflow-auto rounded-lg border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Customer Code</TableHead>
//               <TableHead>Demand No</TableHead>
//               <TableHead>Item Code</TableHead>
//               <TableHead>Item Description</TableHead>
//               <TableHead>Station Code</TableHead>
//               <TableHead>Demand Date</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Unit Price</TableHead>
//               <TableHead>Issue</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredData.map((item) => (
//               <TableRow key={item.CustomerCode}>
//                 <TableCell>{item.CustomerCode}</TableCell>
//                 <TableCell>{item.DemandNo}</TableCell>
//                 <TableCell>{item.ItemCode}</TableCell>
//                 <TableCell>{item.ItemDescription}</TableCell>
//                 <TableCell>{item.StationCode}</TableCell>
//                 <TableCell>{item.DemandDate}</TableCell>
//                 <TableCell>{item.Quantity}</TableCell>
//                 <TableCell>{item.UnitPrice}</TableCell>
//                 <TableCell>
//                   <Button
//                     onClick={() => handleIssue(item)}
//                     className="bg-green-900"
//                   >
//                     Issue
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* <Dialog
//         open={isPopupOpen}
//         onOpenChange={setIsPopupOpen}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Are you absolutely sure?</DialogTitle>
//             <DialogDescription>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Customer Code</TableHead>
//                     <TableHead>Demand No</TableHead>
//                     <TableHead>Item Code</TableHead>
//                     <TableHead>Item Description</TableHead>
//                     <TableHead>Station Code</TableHead>
//                     <TableHead>Demand Date</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>Unit Price</TableHead>
//                     <TableHead>Issue</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filterPopup.map((item) => (
//                     <TableRow key={`${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`}>
//                       <TableCell>{item.CustomerCode}</TableCell>
//                       <TableCell>{item.DemandNo}</TableCell>
//                       <TableCell>{item.ItemCode}</TableCell>
//                       <TableCell>{item.ItemDescription}</TableCell>
//                       <TableCell>{item.StationCode}</TableCell>
//                       <TableCell>{item.DemandDate}</TableCell>
//                       <TableCell>{item.Quantity}</TableCell>
//                       <TableCell>{item.UnitPrice}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog> */}

//       <Dialog
//         open={isPopupOpen}
//         onOpenChange={setIsPopupOpen}
//       >
//         <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-auto">
//           <DialogHeader>
//             <DialogTitle>Item Details</DialogTitle>
//             <DialogDescription>View and edit item details below</DialogDescription>
//           </DialogHeader>

//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Customer Code</TableHead>
//                   <TableHead>Demand No</TableHead>
//                   <TableHead>Item Code</TableHead>
//                   <TableHead>Item Description</TableHead>
//                   <TableHead>Station Code</TableHead>
//                   <TableHead>Demand Date</TableHead>
//                   <TableHead>Quantity</TableHead>
//                   <TableHead>Unit Price</TableHead>
//                   <TableHead>Remarks</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Scope</TableHead>
//                   <TableHead>Equipment Code</TableHead>
//                   <TableHead>Equipment Description</TableHead>
//                   <TableHead>Equipment Quantity</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filterPopup.map((item) => {
//                   const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
//                   const isEditing = editingId === itemId;

//                   return (
//                     <TableRow key={itemId}>
//                       <TableCell>{item.CustomerCode}</TableCell>
//                       <TableCell>{item.DemandNo}</TableCell>
//                       <TableCell>{item.ItemCode}</TableCell>
//                       <TableCell>{item.ItemDescription}</TableCell>
//                       <TableCell>{item.StationCode}</TableCell>
//                       <TableCell>{item.DemandDate}</TableCell>
//                       <TableCell
//                         onClick={() => handleQuantityClick(item)}
//                         className="cursor-pointer"
//                       >
//                         {isEditing ? (
//                           <Input
//                             type="number"
//                             value={tempQuantity}
//                             onChange={handleQuantityChange}
//                             onBlur={handleQuantitySave}
//                             onKeyDown={handleKeyDown}
//                             autoFocus
//                             className="w-20"
//                           />
//                         ) : (
//                           item.Quantity
//                         )}
//                       </TableCell>
//                       <TableCell>{item.UnitPrice}</TableCell>
//                       <TableCell>{item.Remarks}</TableCell>
//                       <TableCell>{item.status}</TableCell> {/* Fixed typo from 'ststus' */}
//                       <TableCell>{item.scope}</TableCell>
//                       <TableCell>{item.EquipCode}</TableCell>
//                       <TableCell>{item.EquipDescription}</TableCell>
//                       <TableCell>{item.EquipQuantity}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//           <Button onClick={handleSave}>Save</Button>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default Crud;

// import { Input } from "@/components/ui/input";
// import React, { useEffect, useState } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Checkbox } from "@/components/ui/checkbox";

// const masterData = [
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230001",
//     ItemCode: "ITM1001",
//     ItemDescription: "Stainless Steel Bolt 10mm",
//     StationCode: "STN-A1",
//     DemandDate: "2023-05-15",
//     Quantity: 50,
//     UnitPrice: 2.75,
//   },
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230001",
//     ItemCode: "ITM2045",
//     ItemDescription: 'Rubber Gasket 3/4"',
//     StationCode: "STN-B2",
//     DemandDate: "2023-05-16",
//     Quantity: 200,
//     UnitPrice: 0.85,
//   },
//   // ... (rest of your masterData array remains the same)
// ];

// localStorage.setItem("masterData", JSON.stringify(masterData));

// const SelectType = [
//   {
//     ITEM_LABLE: "Release Issue",
//     ITEM_VALUE: "ReleaseIssue",
//   },
//   {
//     ITEM_LABLE: "Preservation Issue",
//     ITEM_VALUE: "PreservationIssue",
//   },
//   // ... (rest of your SelectType array remains the same)
// ];

// localStorage.setItem("SelectType", JSON.stringify(SelectType));

// const masterDetails = [
//   {
//     CustomerCode: "CUST001",
//     DemandNo: "DEM20230001",
//     ItemCode: "ITM1001",
//     ItemDescription: "Metal Pipe 1m",
//     StationCode: "STN-A1",
//     DemandDate: "2023-05-15",
//     Quantity: 100,
//     UnitPrice: 1.5,
//     Remarks: "This is a test",
//     status: "pending",
//     scope: "Gate Pass",
//     EquipCode: "EQP001",
//     EquipDescription: "Equip 1",
//     EquipQuantity: 10,
//   },
//   // ... (rest of your masterDetails array remains the same)
// ];

// localStorage.setItem("masterDetails", JSON.stringify(masterDetails));

// function Crud() {
//   const [material, setMaterial] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [searchDemand, setSearchDemand] = useState("");
//   const [searchCustomer, setSearchCustomer] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterPopup, setFilterPopup] = useState([]);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     type: "",
//     CustomerCode: "",
//     DemandNo: "",
//     ItemCode: "",
//     ItemDescription: "",
//     StationCode: "",
//     DemandDate: "",
//     Quantity: 1,
//     UnitPrice: 0,
//     Remarks: "",
//     status: "pending",
//     scope: "",
//     EquipCode: "",
//     EquipDescription: "",
//     EquipQuantity: 0,
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [tempQuantity, setTempQuantity] = useState(0);
//   const [savedIssues, setSavedIssues] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentIssueId, setCurrentIssueId] = useState(null);

//   useEffect(() => {
//     fetechTypes();
//     fetchMasterData();
//     fetchSavedIssues();
//   }, []);

//   const fetchMasterData = () => {
//     const response = JSON.parse(localStorage.getItem("masterData")) || [];
//     setMaterial(response);
//   };

//   const fetechTypes = () => {
//     const response = JSON.parse(localStorage.getItem("SelectType")) || [];
//     setTypes(response);
//   };

//   const fetchSavedIssues = () => {
//     const response = JSON.parse(localStorage.getItem("savedIssues")) || [];
//     setSavedIssues(response);
//   };

//   const handleTypeChange = (value) => {
//     setFormData({ ...formData, type: value });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleClick = () => {
//     const response = JSON.parse(localStorage.getItem("masterData")) || [];
//     const filteredData = response.filter(
//       (item) =>
//         item.DemandNo.toLowerCase().includes(searchDemand.toLowerCase()) &&
//         item.CustomerCode.toLowerCase().includes(searchCustomer.toLowerCase())
//     );
//     setFilteredData(filteredData);
//   };

//   const handleQuantityClick = (item) => {
//     setEditingId(`${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`);
//     setTempQuantity(item.Quantity);
//   };

//   const handleQuantityChange = (e) => {
//     setTempQuantity(e.target.value);
//   };

//   const handleQuantitySave = () => {
//     const updatedDetails = filterPopup.map((item) => {
//       const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
//       if (itemId === editingId) {
//         return { ...item, Quantity: Number(tempQuantity) };
//       }
//       return item;
//     });

//     setFilterPopup(updatedDetails);
//     localStorage.setItem("masterDetails", JSON.stringify(updatedDetails));
//     setEditingId(null);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleQuantitySave();
//     }
//   };

//   const handleIssue = (material) => {
//     const masterDetails = JSON.parse(localStorage.getItem("masterDetails")) || [];
//     const detailsPopup = masterDetails.filter((item) => item.CustomerCode === material.CustomerCode);
//     setFilterPopup(detailsPopup);
//     setIsPopupOpen(true);
//     setIsEditMode(false);
//     setCurrentIssueId(null);
//   };

//   const handleEditIssue = (issue) => {
//     setFormData({
//       type: issue.type,
//       ...issue.items[0] // Assuming we're editing the first item for simplicity
//     });
//     setFilterPopup(issue.items);
//     setIsPopupOpen(true);
//     setIsEditMode(true);
//     setCurrentIssueId(issue.timestamp);
//   };

//   const handleDeleteIssue = (timestamp) => {
//     const updatedIssues = savedIssues.filter(issue => issue.timestamp !== timestamp);
//     localStorage.setItem("savedIssues", JSON.stringify(updatedIssues));
//     setSavedIssues(updatedIssues);
//   };

//   const handleSave = () => {
//     const updatedItems = filterPopup.map(item => ({
//       ...item,
//       Quantity: `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}` === editingId ? 
//                 Number(tempQuantity) : item.Quantity
//     }));

//     const dataToSave = {
//       type: formData.type,
//       items: updatedItems,
//       timestamp: isEditMode ? currentIssueId : new Date().toISOString()
//     };

//     let updatedData;
//     if (isEditMode) {
//       updatedData = savedIssues.map(issue => 
//         issue.timestamp === currentIssueId ? dataToSave : issue
//       );
//     } else {
//       updatedData = [...savedIssues, dataToSave];
//     }

//     localStorage.setItem("savedIssues", JSON.stringify(updatedData));
//     setSavedIssues(updatedData);

//     // Update masterDetails in localStorage
//     localStorage.setItem("masterDetails", JSON.stringify(updatedItems));

//     // Reset states
//     setFilterPopup([]);
//     setEditingId(null);
//     setIsPopupOpen(false);
//     setIsEditMode(false);
//     setCurrentIssueId(null);
//     setFormData({
//       type: "",
//       CustomerCode: "",
//       DemandNo: "",
//       ItemCode: "",
//       ItemDescription: "",
//       StationCode: "",
//       DemandDate: "",
//       Quantity: 1,
//       UnitPrice: 0,
//       Remarks: "",
//       status: "pending",
//       scope: "",
//       EquipCode: "",
//       EquipDescription: "",
//       EquipQuantity: 0,
//     });
//   };

//   return (
//     <div className="h-screen space-y-2 bg-slate-900 p-6 text-white">
//       <div className="flex gap-2">
//         <Select 
//           value={formData.type}
//           onValueChange={handleTypeChange}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select Type" />
//           </SelectTrigger>
//           <SelectContent>
//             {types.map((items) => (
//               <SelectItem
//                 key={items.ITEM_VALUE}
//                 value={items.ITEM_VALUE}
//               >
//                 {items.ITEM_LABLE}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Input
//           className="w-full"
//           placeholder="Search demand..."
//           value={searchDemand}
//           onChange={(e) => setSearchDemand(e.target.value)}
//         />

//         <Input
//           className="w-full"
//           placeholder="Search Customer Code..."
//           value={searchCustomer}
//           onChange={(e) => setSearchCustomer(e.target.value)}
//         />

//         <Button
//           variant={"secondary"}
//           onClick={handleClick}
//         >
//           Search
//         </Button>
//       </div>

//       <div className="h-[calc(100vh-200px)] overflow-auto rounded-lg border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead><Checkbox  /></TableHead>
//               <TableHead>Customer Code</TableHead>
//               <TableHead>Demand No</TableHead>
//               <TableHead>Item Code</TableHead>
//               <TableHead>Item Description</TableHead>
//               <TableHead>Station Code</TableHead>
//               <TableHead>Demand Date</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Unit Price</TableHead>
//               <TableHead>Issue</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredData.map((item) => (
//               <TableRow key={`${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`}>
//                 <TableCell><Checkbox  /></TableCell>
//                 <TableCell>{item.CustomerCode}</TableCell>
//                 <TableCell>{item.DemandNo}</TableCell>
//                 <TableCell>{item.ItemCode}</TableCell>
//                 <TableCell>{item.ItemDescription}</TableCell>
//                 <TableCell>{item.StationCode}</TableCell>
//                 <TableCell>{item.DemandDate}</TableCell>
//                 <TableCell>{item.Quantity}</TableCell>
//                 <TableCell>{item.UnitPrice}</TableCell>
//                 <TableCell>
//                   <Button
//                     onClick={() => handleIssue(item)}
//                     className="bg-green-900"
//                   >
//                     Issue
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="mt-4">
//         <h2 className="text-xl font-bold mb-2">Saved Issues</h2>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Type</TableHead>
//               <TableHead>Customer Code</TableHead>
//               <TableHead>Items Count</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {savedIssues.map((issue) => (
//               <TableRow key={issue.timestamp}>
//                 <TableCell>{issue.type}</TableCell>
//                 <TableCell>{issue.items[0]?.CustomerCode}</TableCell>
//                 <TableCell>{issue.items.length}</TableCell>
//                 <TableCell>{new Date(issue.timestamp).toLocaleString()}</TableCell>
//                 <TableCell className="space-x-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleEditIssue(issue)}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => handleDeleteIssue(issue.timestamp)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <Dialog
//         open={isPopupOpen}
//         onOpenChange={(open) => {
//           if (!open) {
//             setIsPopupOpen(false);
//             setIsEditMode(false);
//             setCurrentIssueId(null);
//             setFormData({
//               type: "",
//               CustomerCode: "",
//               DemandNo: "",
//               ItemCode: "",
//               ItemDescription: "",
//               StationCode: "",
//               DemandDate: "",
//               Quantity: 1,
//               UnitPrice: 0,
//               Remarks: "",
//               status: "pending",
//               scope: "",
//               EquipCode: "",
//               EquipDescription: "",
//               EquipQuantity: 0,
//             });
//           }
//         }}
//       >
//         <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {isEditMode ? "Edit Issue" : "Create New Issue"}
//             </DialogTitle>
//             <DialogDescription>
//               {isEditMode ? "Modify the issue details below" : "Fill in the issue details below"}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <Select 
//               value={formData.type}
//               onValueChange={handleTypeChange}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 {types.map((items) => (
//                   <SelectItem
//                     key={items.ITEM_VALUE}
//                     value={items.ITEM_VALUE}
//                   >
//                     {items.ITEM_LABLE}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Input
//               name="Remarks"
//               placeholder="Remarks"
//               value={formData.Remarks}
//               onChange={handleInputChange}
//             />

//             <Input
//               name="scope"
//               placeholder="Scope"
//               value={formData.scope}
//               onChange={handleInputChange}
//             />

//             <Input
//               name="status"
//               placeholder="Status"
//               value={formData.status}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Customer Code</TableHead>
//                   <TableHead>Demand No</TableHead>
//                   <TableHead>Item Code</TableHead>
//                   <TableHead>Item Description</TableHead>
//                   <TableHead>Station Code</TableHead>
//                   <TableHead>Demand Date</TableHead>
//                   <TableHead>Quantity</TableHead>
//                   <TableHead>Unit Price</TableHead>
//                   <TableHead>Equipment Code</TableHead>
//                   <TableHead>Equipment Description</TableHead>
//                   <TableHead>Equipment Quantity</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filterPopup.map((item) => {
//                   const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
//                   const isEditing = editingId === itemId;

//                   return (
//                     <TableRow key={itemId}>
//                       <TableCell>{item.CustomerCode}</TableCell>
//                       <TableCell>{item.DemandNo}</TableCell>
//                       <TableCell>{item.ItemCode}</TableCell>
//                       <TableCell>{item.ItemDescription}</TableCell>
//                       <TableCell>{item.StationCode}</TableCell>
//                       <TableCell>{item.DemandDate}</TableCell>
//                       <TableCell
//                         onClick={() => handleQuantityClick(item)}
//                         className="cursor-pointer"
//                       >
//                         {isEditing ? (
//                           <Input
//                             type="number"
//                             value={tempQuantity}
//                             onChange={handleQuantityChange}
//                             onBlur={handleQuantitySave}
//                             onKeyDown={handleKeyDown}
//                             autoFocus
//                             className="w-20"
//                           />
//                         ) : (
//                           item.Quantity
//                         )}
//                       </TableCell>
//                       <TableCell>{item.UnitPrice}</TableCell>
//                       <TableCell>{item.EquipCode}</TableCell>
//                       <TableCell>{item.EquipDescription}</TableCell>
//                       <TableCell>{item.EquipQuantity}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//           <Button onClick={handleSave}>
//             {isEditMode ? "Update Issue" : "Save Issue"}
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default Crud;


import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const masterData = [
  {
    CustomerCode: "CUST001",
    DemandNo: "DEM20230001",
    ItemCode: "ITM1001",
    ItemDescription: "Stainless Steel Bolt 10mm",
    StationCode: "STN-A1",
    DemandDate: "2023-05-15",
    Quantity: 50,
    UnitPrice: 2.75,
  },
  {
    CustomerCode: "CUST001",
    DemandNo: "DEM20230001",
    ItemCode: "ITM2045",
    ItemDescription: 'Rubber Gasket 3/4"',
    StationCode: "STN-B2",
    DemandDate: "2023-05-16",
    Quantity: 200,
    UnitPrice: 0.85,
  },
  {
    CustomerCode: "CUST003",
    DemandNo: "DEM20230003",
    ItemCode: "ITM3092",
    ItemDescription: "Aluminum Pipe 1m",
    StationCode: "STN-C3",
    DemandDate: "2023-05-17",
    Quantity: 15,
    UnitPrice: 12.5,
  },
  {
    CustomerCode: "CUST001",
    DemandNo: "DEM20230004",
    ItemCode: "ITM1002",
    ItemDescription: "Stainless Steel Nut 10mm",
    StationCode: "STN-A1",
    DemandDate: "2023-05-18",
    Quantity: 60,
    UnitPrice: 1.2,
  },
  {
    CustomerCode: "CUST004",
    DemandNo: "DEM20230005",
    ItemCode: "ITM4087",
    ItemDescription: "PVC Hose 5m",
    StationCode: "STN-D4",
    DemandDate: "2023-05-19",
    Quantity: 8,
    UnitPrice: 7.8,
  },
  {
    CustomerCode: "CUST002",
    DemandNo: "DEM20230006",
    ItemCode: "ITM2050",
    ItemDescription: "Copper Wire 18AWG",
    StationCode: "STN-B2",
    DemandDate: "2023-05-20",
    Quantity: 150,
    UnitPrice: 0.45,
  },
  {
    CustomerCode: "CUST005",
    DemandNo: "DEM20230007",
    ItemCode: "ITM5001",
    ItemDescription: "Steel Bracket L-type",
    StationCode: "STN-E5",
    DemandDate: "2023-05-21",
    Quantity: 25,
    UnitPrice: 3.25,
  },
  {
    CustomerCode: "CUST003",
    DemandNo: "DEM20230008",
    ItemCode: "ITM3100",
    ItemDescription: 'Brass Valve 1/2"',
    StationCode: "STN-C3",
    DemandDate: "2023-05-22",
    Quantity: 10,
    UnitPrice: 8.9,
  },
  {
    CustomerCode: "CUST001",
    DemandNo: "DEM20230009",
    ItemCode: "ITM1005",
    ItemDescription: "Washer 10mm",
    StationCode: "STN-A1",
    DemandDate: "2023-05-23",
    Quantity: 100,
    UnitPrice: 0.3,
  },
  {
    CustomerCode: "CUST006",
    DemandNo: "DEM20230010",
    ItemCode: "ITM6002",
    ItemDescription: "Plastic Container 5L",
    StationCode: "STN-F6",
    DemandDate: "2023-05-24",
    Quantity: 12,
    UnitPrice: 4.75,
  },
];

localStorage.setItem("masterData", JSON.stringify(masterData));

const SelectType = [
  {
    ITEM_LABLE: "Release Issue",
    ITEM_VALUE: "ReleaseIssue",
  },
  {
    ITEM_LABLE: "Preservation Issue",
    ITEM_VALUE: "PreservationIssue",
  },
  {
    ITEM_LABLE: "Repairable Issue",
    ITEM_VALUE: "RepairableIssue",
  },
  {
    ITEM_LABLE: "Sea Stock Issue",
    ITEM_VALUE: "SeaStockIssue",
  },
  {
    ITEM_LABLE: "STV Issue",
    ITEM_VALUE: "STVIssue",
  },
  {
    ITEM_LABLE: "Transshipment Issue",
    ITEM_VALUE: "TransshipmentIssue",
  },
];

localStorage.setItem("SelectType", JSON.stringify(SelectType));

const masterDetails = [
  {
    CustomerCode: "CUST001",
    DemandNo: "DEM20230001",
    ItemCode: "ITM1001",
    ItemDescription: "Metal Pipe 1m",
    StationCode: "STN-A1",
    DemandDate: "2023-05-15",
    Quantity: 100,
    UnitPrice: 1.5,
    Remarks: "This is a test",
    status: "pending",
    scope: "Gate Pass",
    EquipCode: "EQP001",
    EquipDescription: "Equip 1",
    EquipQuantity: 10,
  },
  {
    CustomerCode: "CUST002",
    DemandNo: "DEM20230002",
    ItemCode: "ITM1002",
    ItemDescription: "Stainless Steel Nut 10mm",
    StationCode: "STN-B2",
    DemandDate: "2023-05-16",
    Quantity: 50,
    UnitPrice: 2.0,
    Remarks: "This is a test",
    status: "pending",
    scope: "Gate Pass",
    EquipCode: "EQP002",
    EquipDescription: "Equip 2",
    EquipQuantity: 5,
  },
  {
    CustomerCode: "CUST003",
    DemandNo: "DEM20230003",
    ItemCode: "ITM1003",
    ItemDescription: "Copper Wire 18AWG",
    StationCode: "STN-C3",
    DemandDate: "2023-05-17",
    Quantity: 75,
    UnitPrice: 0.75,
    Remarks: "This is a test",
    status: "pending",
    scope: "Gate Pass",
    EquipCode: "EQP003",
    EquipDescription: "Equip 3",
    EquipQuantity: 7,
  },
  {
    CustomerCode: "CUST004",
    DemandNo: "DEM20230004",
    ItemCode: "ITM1004",
    ItemDescription: 'Brass Valve 1/2"',
    StationCode: "STN-D4",
    DemandDate: "2023-05-18",
    Quantity: 25,
    UnitPrice: 3.5,
    Remarks: "This is a test",
    status: "pending",
    scope: "Gate Pass",
    EquipCode: "EQP004",
    EquipDescription: "Equip 4",
    EquipQuantity: 2,
  },
  {
    CustomerCode: "CUST005",
    DemandNo: "DEM20230005",
    ItemCode: "ITM1005",
    ItemDescription: "Washer 10mm",
    StationCode: "STN-E5",
    DemandDate: "2023-05-19",
    Quantity: 100,
    UnitPrice: 0.5,
    Remarks: "This is a test",
    status: "pending",
    scope: "Gate Pass",
    EquipCode: "EQP005",
    EquipDescription: "Equip 5",
    EquipQuantity: 10,
  },
];

localStorage.setItem("masterDetails", JSON.stringify(masterDetails));

function Crud() {
  const [material, setMaterial] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchDemand, setSearchDemand] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterPopup, setFilterPopup] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    CustomerCode: "",
    DemandNo: "",
    ItemCode: "",
    ItemDescription: "",
    StationCode: "",
    DemandDate: "",
    Quantity: 1,
    UnitPrice: 0,
    Remarks: "",
    status: "pending",
    scope: "",
    EquipCode: "",
    EquipDescription: "",
    EquipQuantity: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [savedIssues, setSavedIssues] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetechTypes();
    fetchMasterData();
    fetchSavedIssues();
  }, []);

  const fetchMasterData = () => {
    const response = JSON.parse(localStorage.getItem("masterData")) || [];
    setMaterial(response);
  };

  const fetechTypes = () => {
    const response = JSON.parse(localStorage.getItem("SelectType")) || [];
    setTypes(response);
  };

  const fetchSavedIssues = () => {
    const response = JSON.parse(localStorage.getItem("savedIssues")) || [];
    setSavedIssues(response);
  };

  const handleTypeChange = (value) => {
    setFormData({ ...formData, type: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClick = () => {
    const response = JSON.parse(localStorage.getItem("masterData")) || [];
    const filteredData = response.filter(
      (item) =>
        item.DemandNo.toLowerCase().includes(searchDemand.toLowerCase()) &&
        item.CustomerCode.toLowerCase().includes(searchCustomer.toLowerCase())
    );
    setFilteredData(filteredData);
    setSelectedItems([]);
  };

  const handleQuantityClick = (item) => {
    setEditingId(`${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`);
    setTempQuantity(item.Quantity);
  };

  const handleQuantityChange = (e) => {
    setTempQuantity(e.target.value);
  };

  const handleQuantitySave = () => {
    const updatedDetails = filterPopup.map((item) => {
      const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
      if (itemId === editingId) {
        return { ...item, Quantity: Number(tempQuantity) };
      }
      return item;
    });

    setFilterPopup(updatedDetails);
    localStorage.setItem("masterDetails", JSON.stringify(updatedDetails));
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleQuantitySave();
    }
  };

  const handleCheckboxChange = (item, isChecked) => {
    if (isChecked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter(
        selected => !(
          selected.CustomerCode === item.CustomerCode && 
          selected.DemandNo === item.DemandNo && 
          selected.ItemCode === item.ItemCode
        )
      ));
    }
  };

  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      setSelectedItems([...filteredData]);
    } else {
      setSelectedItems([]);
    }
  };

  const handleOpenPopupWithSelected = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }
    
    const popupItems = selectedItems.map(item => {
      const masterDetails = JSON.parse(localStorage.getItem("masterDetails")) || [];
      const detail = masterDetails.find(d => 
        d.CustomerCode === item.CustomerCode && 
        d.DemandNo === item.DemandNo && 
        d.ItemCode === item.ItemCode
      );
      
      return detail || {
        ...item,
        Remarks: "",
        status: "pending",
        scope: "",
        EquipCode: "",
        EquipDescription: "",
        EquipQuantity: 0,
      };
    });
    
    setFilterPopup(popupItems);
    setIsPopupOpen(true);
    setIsEditMode(false);
    setCurrentIssueId(null);
  };

  const handleIssue = (material) => {
    const masterDetails = JSON.parse(localStorage.getItem("masterDetails")) || [];
    const detailsPopup = masterDetails.filter((item) => item.CustomerCode === material.CustomerCode);
    setFilterPopup(detailsPopup);
    setIsPopupOpen(true);
    setIsEditMode(false);
    setCurrentIssueId(null);
  };

  const handleEditIssue = (issue) => {
    setFormData({
      type: issue.type,
      ...issue.items[0]
    });
    setFilterPopup(issue.items);
    setIsPopupOpen(true);
    setIsEditMode(true);
    setCurrentIssueId(issue.timestamp);
  };

  const handleDeleteIssue = (timestamp) => {
    const updatedIssues = savedIssues.filter(issue => issue.timestamp !== timestamp);
    localStorage.setItem("savedIssues", JSON.stringify(updatedIssues));
    setSavedIssues(updatedIssues);
  };

  const handleSave = () => {
    const updatedItems = filterPopup.map(item => ({
      ...item,
      Quantity: `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}` === editingId ? 
                Number(tempQuantity) : item.Quantity
    }));

    const dataToSave = {
      type: formData.type,
      items: updatedItems,
      timestamp: isEditMode ? currentIssueId : new Date().toISOString()
    };

    let updatedData;
    if (isEditMode) {
      updatedData = savedIssues.map(issue => 
        issue.timestamp === currentIssueId ? dataToSave : issue
      );
    } else {
      updatedData = [...savedIssues, dataToSave];
    }

    localStorage.setItem("savedIssues", JSON.stringify(updatedData));
    setSavedIssues(updatedData);
    localStorage.setItem("masterDetails", JSON.stringify(updatedItems));

    setFilterPopup([]);
    setEditingId(null);
    setIsPopupOpen(false);
    setIsEditMode(false);
    setCurrentIssueId(null);
    setFormData({
      type: "",
      CustomerCode: "",
      DemandNo: "",
      ItemCode: "",
      ItemDescription: "",
      StationCode: "",
      DemandDate: "",
      Quantity: 1,
      UnitPrice: 0,
      Remarks: "",
      status: "pending",
      scope: "",
      EquipCode: "",
      EquipDescription: "",
      EquipQuantity: 0,
    });
    setSelectedItems([]);
  };

  return (
    <div className="h-screen space-y-2 bg-slate-900 p-6 text-white">
      <div className="flex gap-2">
        <Select 
          value={formData.type}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((items) => (
              <SelectItem
                key={items.ITEM_VALUE}
                value={items.ITEM_VALUE}
              >
                {items.ITEM_LABLE}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          className="w-full"
          placeholder="Search demand..."
          value={searchDemand}
          onChange={(e) => setSearchDemand(e.target.value)}
        />

        <Input
          className="w-full"
          placeholder="Search Customer Code..."
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />

        <Button
          variant={"secondary"}
          onClick={handleClick}
        >
          Search
        </Button>

        <Button
          variant={"default"}
          onClick={handleOpenPopupWithSelected}
          disabled={selectedItems.length === 0}
        >
          Issue Selected ({selectedItems.length})
        </Button>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox 
                  checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                  onCheckedChange={handleSelectAllChange}
                />
              </TableHead>
              <TableHead>Customer Code</TableHead>
              <TableHead>Demand No</TableHead>
              <TableHead>Item Code</TableHead>
              <TableHead>Item Description</TableHead>
              <TableHead>Station Code</TableHead>
              <TableHead>Demand Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Issue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => {
              const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
              const isSelected = selectedItems.some(
                selected => 
                  selected.CustomerCode === item.CustomerCode && 
                  selected.DemandNo === item.DemandNo && 
                  selected.ItemCode === item.ItemCode
              );
              
              return (
                <TableRow key={itemId}>
                  <TableCell>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => handleCheckboxChange(item, checked)}
                    />
                  </TableCell>
                  <TableCell>{item.CustomerCode}</TableCell>
                  <TableCell>{item.DemandNo}</TableCell>
                  <TableCell>{item.ItemCode}</TableCell>
                  <TableCell>{item.ItemDescription}</TableCell>
                  <TableCell>{item.StationCode}</TableCell>
                  <TableCell>{item.DemandDate}</TableCell>
                  <TableCell>{item.Quantity}</TableCell>
                  <TableCell>{item.UnitPrice}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleIssue(item)}
                      className="bg-green-900"
                    >
                      Issue
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Saved Issues</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Customer Code</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedIssues.map((issue) => (
              <TableRow key={issue.timestamp}>
                <TableCell>{issue.type}</TableCell>
                <TableCell>{issue.items[0]?.CustomerCode}</TableCell>
                <TableCell>{issue.items.length}</TableCell>
                <TableCell>{new Date(issue.timestamp).toLocaleString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditIssue(issue)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteIssue(issue.timestamp)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isPopupOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsPopupOpen(false);
            setIsEditMode(false);
            setCurrentIssueId(null);
            setFormData({
              type: "",
              CustomerCode: "",
              DemandNo: "",
              ItemCode: "",
              ItemDescription: "",
              StationCode: "",
              DemandDate: "",
              Quantity: 1,
              UnitPrice: 0,
              Remarks: "",
              status: "pending",
              scope: "",
              EquipCode: "",
              EquipDescription: "",
              EquipQuantity: 0,
            });
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Issue" : "Create New Issue"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Modify the issue details below" : "Fill in the issue details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select 
              value={formData.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((items) => (
                  <SelectItem
                    key={items.ITEM_VALUE}
                    value={items.ITEM_VALUE}
                  >
                    {items.ITEM_LABLE}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              name="Remarks"
              placeholder="Remarks"
              value={formData.Remarks}
              onChange={handleInputChange}
            />

            <Input
              name="scope"
              placeholder="Scope"
              value={formData.scope}
              onChange={handleInputChange}
            />

            <Input
              name="status"
              placeholder="Status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Code</TableHead>
                  <TableHead>Demand No</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Description</TableHead>
                  <TableHead>Station Code</TableHead>
                  <TableHead>Demand Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Equipment Code</TableHead>
                  <TableHead>Equipment Description</TableHead>
                  <TableHead>Equipment Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterPopup.map((item) => {
                  const itemId = `${item.CustomerCode}-${item.DemandNo}-${item.ItemCode}`;
                  const isEditing = editingId === itemId;

                  return (
                    <TableRow key={itemId}>
                      <TableCell>{item.CustomerCode}</TableCell>
                      <TableCell>{item.DemandNo}</TableCell>
                      <TableCell>{item.ItemCode}</TableCell>
                      <TableCell>{item.ItemDescription}</TableCell>
                      <TableCell>{item.StationCode}</TableCell>
                      <TableCell>{item.DemandDate}</TableCell>
                      <TableCell
                        onClick={() => handleQuantityClick(item)}
                        className="cursor-pointer"
                      >
                        {isEditing ? (
                          <Input
                            type="number"
                            value={tempQuantity}
                            onChange={handleQuantityChange}
                            onBlur={handleQuantitySave}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-20"
                          />
                        ) : (
                          item.Quantity
                        )}
                      </TableCell>
                      <TableCell>{item.UnitPrice}</TableCell>
                      <TableCell>{item.EquipCode}</TableCell>
                      <TableCell>{item.EquipDescription}</TableCell>
                      <TableCell>{item.EquipQuantity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleSave}>
            {isEditMode ? "Update Issue" : "Save Issue"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Crud;