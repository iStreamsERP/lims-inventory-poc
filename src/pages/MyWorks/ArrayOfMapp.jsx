// import React, { useState } from 'react';
// import { Input } from '@/components/ui/input';

// const ArrayOfMapp = () => {
//   // Sample array of objects
//    const [masterData, setMasterData] = useState([
//       {
//         CustomerCode: "CUST001",
//         DemandNo: "DEM20230001",
//         ItemCode: "ITM1001",
//         ItemDescription: "Metal Pipe 1m",
//         StationCode: "STN-F1",
//         DemandDate: "2023-05-16",
//         Quantity: 100,
//         UnitPrice: 2.5,
//         AuthType: "rep",
//       },
//       {
//         CustomerCode: "CUST002",
//         DemandNo: "DEM20230002",
//         ItemCode: "ITM1002",
//         ItemDescription: "Steel Rod 2m",
//         StationCode: "STN-G2",
//         DemandDate: "2023-06-22",
//         Quantity: 150,
//         UnitPrice: 3.75,
//         AuthType: "ars",
//       },
//       {
//         CustomerCode: "CUST003",
//         DemandNo: "DEM20230003",
//         ItemCode: "ITM1003",
//         ItemDescription: "Copper Wire 50m",
//         StationCode: "STN-H3",
//         DemandDate: "2023-07-10",
//         Quantity: 200,
//         UnitPrice: 1.8,
//         AuthType: "oth",
//       },
//       {
//         CustomerCode: "CUST004",
//         DemandNo: "DEM20230004",
//         ItemCode: "ITM1004",
//         ItemDescription: "Aluminum Sheet 1x1m",
//         StationCode: "STN-F1",
//         DemandDate: "2023-08-15",
//         Quantity: 80,
//         UnitPrice: 5.0,
//         AuthType: "mmp",
//       },
//       {
//         CustomerCode: "CUST005",
//         DemandNo: "DEM20230005",
//         ItemCode: "ITM1005",
//         ItemDescription: "PVC Pipe 0.5m",
//         StationCode: "STN-J4",
//         DemandDate: "2023-09-03",
//         Quantity: 300,
//         UnitPrice: 1.2,
//         AuthType: "rep",
//       },
//       {
//         CustomerCode: "CUST006",
//         DemandNo: "DEM20230006",
//         ItemCode: "ITM1006",
//         ItemDescription: "Brass Fitting",
//         StationCode: "STN-G2",
//         DemandDate: "2023-10-12",
//         Quantity: 50,
//         UnitPrice: 4.0,
//         AuthType: "ars",
//       },
//       {
//         CustomerCode: "CUST007",
//         DemandNo: "DEM20230007",
//         ItemCode: "ITM1007",
//         ItemDescription: "Steel Bolt M10",
//         StationCode: "STN-K5",
//         DemandDate: "2023-11-20",
//         Quantity: 500,
//         UnitPrice: 0.5,
//         AuthType: "oth",
//       },
//       {
//         CustomerCode: "CUST008",
//         DemandNo: "DEM20230008",
//         ItemCode: "ITM1008",
//         ItemDescription: "Galvanized Plate",
//         StationCode: "STN-F1",
//         DemandDate: "2023-12-05",
//         Quantity: 120,
//         UnitPrice: 6.5,
//         AuthType: "mmp",
//       },
//       {
//         CustomerCode: "CUST009",
//         DemandNo: "DEM20230009",
//         ItemCode: "ITM1009",
//         ItemDescription: "Iron Angle 2m",
//         StationCode: "STN-H3",
//         DemandDate: "2024-01-18",
//         Quantity: 90,
//         UnitPrice: 3.0,
//         AuthType: "rep",
//       },
//       {
//         CustomerCode: "CUST010",
//         DemandNo: "DEM20230010",
//         ItemCode: "ITM1010",
//         ItemDescription: "Stainless Steel Tube",
//         StationCode: "STN-J4",
//         DemandDate: "2024-02-25",
//         Quantity: 70,
//         UnitPrice: 7.0,
//         AuthType: "ars",
//       },
//     ]);

//   const [items, setItems] = useState(initialData);

//   // Handle input change
//   const handleInputChange = (id, newValue) => {
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, value: newValue } : item
//       )
//     );
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">Input Array Mapping</h1>
//       <div className="space-y-4">
//         {items.map((item) => (
//           <div key={item.id} className="flex items-center space-x-2">
//             <label className="text-gray-600 w-24">{item.name}</label>
//             <Input
//               type="text"
//               value={item.value}
//               onChange={(e) => handleInputChange(item.id, e.target.value)}
//               className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
//               placeholder={`Enter value for ${item.name}`}
//             />
//           </div>
//         ))}
//       </div>
     
     
//     </div>
//   );
// };

// export default ArrayOfMapp;

// import React, { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';

// const ArrayOfMapp = () => {
//   const [masterData, setMasterData] = useState([
//     {
//       CustomerCode: "CUST001",
//       DemandNo: "DEM20230001",
//       ItemCode: "ITM1001",
//       ItemDescription: "Metal Pipe 1m",
//       StationCode: "STN-F1",
//       DemandDate: "2023-05-16",
//       Quantity: 100,
//       UnitPrice: 2.5,
//       AuthType: "rep",
//     },
//     {
//       CustomerCode: "CUST002",
//       DemandNo: "DEM20230002",
//       ItemCode: "ITM1002",
//       ItemDescription: "Steel Rod 2m",
//       StationCode: "STN-G2",
//       DemandDate: "2023-06-22",
//       Quantity: 150,
//       UnitPrice: 3.75,
//       AuthType: "ars",
//     },
//     {
//       CustomerCode: "CUST003",
//       DemandNo: "DEM20230003",
//       ItemCode: "ITM1003",
//       ItemDescription: "Copper Wire 50m",
//       StationCode: "STN-H3",
//       DemandDate: "2023-07-10",
//       Quantity: 200,
//       UnitPrice: 1.8,
//       AuthType: "oth",
//     },
//     {
//       CustomerCode: "CUST004",
//       DemandNo: "DEM20230004",
//       ItemCode: "ITM1004",
//       ItemDescription: "Aluminum Sheet 1x1m",
//       StationCode: "STN-F1",
//       DemandDate: "2023-08-15",
//       Quantity: 80,
//       UnitPrice: 5.0,
//       AuthType: "mmp",
//     },
//     {
//       CustomerCode: "CUST005",
//       DemandNo: "DEM20230005",
//       ItemCode: "ITM1005",
//       ItemDescription: "PVC Pipe 0.5m",
//       StationCode: "STN-J4",
//       DemandDate: "2023-09-03",
//       Quantity: 300,
//       UnitPrice: 1.2,
//       AuthType: "rep",
//     },
//     {
//       CustomerCode: "CUST006",
//       DemandNo: "DEM20230006",
//       ItemCode: "ITM1006",
//       ItemDescription: "Brass Fitting",
//       StationCode: "STN-G2",
//       DemandDate: "2023-10-12",
//       Quantity: 50,
//       UnitPrice: 4.0,
//       AuthType: "ars",
//     },
//     {
//       CustomerCode: "CUST007",
//       DemandNo: "DEM20230007",
//       ItemCode: "ITM1007",
//       ItemDescription: "Steel Bolt M10",
//       StationCode: "STN-K5",
//       DemandDate: "2023-11-20",
//       Quantity: 500,
//       UnitPrice: 0.5,
//       AuthType: "oth",
//     },
//     {
//       CustomerCode: "CUST008",
//       DemandNo: "DEM20230008",
//       ItemCode: "ITM1008",
//       ItemDescription: "Galvanized Plate",
//       StationCode: "STN-F1",
//       DemandDate: "2023-12-05",
//       Quantity: 120,
//       UnitPrice: 6.5,
//       AuthType: "mmp",
//     },
//     {
//       CustomerCode: "CUST009",
//       DemandNo: "DEM20230009",
//       ItemCode: "ITM1009",
//       ItemDescription: "Iron Angle 2m",
//       StationCode: "STN-H3",
//       DemandDate: "2024-01-18",
//       Quantity: 90,
//       UnitPrice: 3.0,
//       AuthType: "rep",
//     },
//     {
//       CustomerCode: "CUST010",
//       DemandNo: "DEM20230010",
//       ItemCode: "ITM1010",
//       ItemDescription: "Stainless Steel Tube",
//       StationCode: "STN-J4",
//       DemandDate: "2024-02-25",
//       Quantity: 70,
//       UnitPrice: 7.0,
//       AuthType: "ars",
//     },
//   ]);

//   const [submittedData, setSubmittedData] = useState([]);

//   // Handle quantity change
//   const handleQuantityChange = (index, newValue) => {
//     setMasterData((prevData) =>
//       prevData.map((item, i) =>
//         i === index ? { ...item, Quantity: parseInt(newValue) || 0 } : item
//       )
//     );
//   };

//   // Handle auth type change
//   const handleAuthTypeChange = (index, newValue) => {
//     setMasterData((prevData) =>
//       prevData.map((item, i) =>
//         i === index ? { ...item, AuthType: newValue } : item
//       )
//     );
//   };

//   // Handle submit
//   const handleSubmit = () => {
//     setSubmittedData([...masterData]);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">Demand Management</h1>
      
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Customer Code</TableHead>
//             <TableHead>Demand No</TableHead>
//             <TableHead>Item Code</TableHead>
//             <TableHead>Item Description</TableHead>
//             <TableHead>Station Code</TableHead>
//             <TableHead>Demand Date</TableHead>
//             <TableHead>Quantity</TableHead>
//             <TableHead>Unit Price</TableHead>
//             <TableHead>Auth Type</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {masterData.map((item, index) => (
//             <TableRow key={index}>
//               <TableCell>{item.CustomerCode}</TableCell>
//               <TableCell>{item.DemandNo}</TableCell>
//               <TableCell>{item.ItemCode}</TableCell>
//               <TableCell>{item.ItemDescription}</TableCell>
//               <TableCell>{item.StationCode}</TableCell>
//               <TableCell>{item.DemandDate}</TableCell>
//               <TableCell>
//                 <Input
//                   type="number"
//                   value={item.Quantity}
//                   onChange={(e) => handleQuantityChange(index, e.target.value)}
//                   className="w-24 border-gray-300 focus:ring-2 focus:ring-blue-500"
//                 />
//               </TableCell>
//               <TableCell>{item.UnitPrice}</TableCell>
//               <TableCell>
//                 <Select
//                   value={item.AuthType}
//                   onValueChange={(value) => handleAuthTypeChange(index, value)}
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="rep">Rep</SelectItem>
//                     <SelectItem value="ars">Ars</SelectItem>
//                     <SelectItem value="oth">Oth</SelectItem>
//                     <SelectItem value="mmp">Mmp</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Button onClick={handleSubmit} className="mt-4 bg-blue-500 hover:bg-blue-600">
//         Submit
//       </Button>

//       {submittedData.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4 text-gray-800">Submitted Data</h2>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Customer Code</TableHead>
//                 <TableHead>Demand No</TableHead>
//                 <TableHead>Item Code</TableHead>
//                 <TableHead>Item Description</TableHead>
//                 <TableHead>Station Code</TableHead>
//                 <TableHead>Demand Date</TableHead>
//                 <TableHead>Quantity</TableHead>
//                 <TableHead>Unit Price</TableHead>
//                 <TableHead>Auth Type</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {submittedData.map((item, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{item.CustomerCode}</TableCell>
//                   <TableCell>{item.DemandNo}</TableCell>
//                   <TableCell>{item.ItemCode}</TableCell>
//                   <TableCell>{item.ItemDescription}</TableCell>
//                   <TableCell>{item.StationCode}</TableCell>
//                   <TableCell>{item.DemandDate}</TableCell>
//                   <TableCell>{item.Quantity}</TableCell>
//                   <TableCell>{item.UnitPrice}</TableCell>
//                   <TableCell>{item.AuthType}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArrayOfMapp;

// import React, { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';

// const ArrayOfMapp = () => {
//   const [masterData, setMasterData] = useState([
//     {
//       CustomerCode: "CUST001",
//       DemandNo: "DEM20230001",
//       ItemCode: "ITM1001",
//       ItemDescription: "Metal Pipe 1m",
//       StationCode: "STN-F1",
//       DemandDate: "2023-05-16",
//       Quantity: 100,
//       UnitPrice: 2.5,
//       AuthType: "rep",
//     },
//     {
//       CustomerCode: "CUST002",
//       DemandNo: "DEM20230002",
//       ItemCode: "ITM1002",
//       ItemDescription: "Steel Rod 2m",
//       StationCode: "STN-G2",
//       DemandDate: "2023-06-22",
//       Quantity: 150,
//       UnitPrice: 3.75,
//       AuthType: "ars",
//     },
//     {
//       CustomerCode: "CUST003",
//       DemandNo: "DEM20230003",
//       ItemCode: "ITM1003",
//       ItemDescription: "Copper Wire 50m",
//       StationCode: "STN-H3",
//       DemandDate: "2023-07-10",
//       Quantity: 200,
//       UnitPrice: 1.8,
//       AuthType: "oth",
//     },
//     {
//       CustomerCode: "CUST004",
//       DemandNo: "DEM20230004",
//       ItemCode: "ITM1004",
//       ItemDescription: "Aluminum Sheet 1x1m",
//       StationCode: "STN-F1",
//       DemandDate: "2023-08-15",
//       Quantity: 80,
//       UnitPrice: 5.0,
//       AuthType: "mmp",
//     },
//     {
//       CustomerCode: "CUST005",
//       DemandNo: "DEM20230005",
//       ItemCode: "ITM1005",
//       ItemDescription: "PVC Pipe 0.5m",
//       StationCode: "STN-J4",
//       DemandDate: "2023-09-03",
//       Quantity: 300,
//       UnitPrice: 1.2,
//       AuthType: "rep",
//     },
//     {
//       CustomerCode: "CUST006",
//       DemandNo: "DEM20230006",
//       ItemCode: "ITM1006",
//       ItemDescription: "Brass Fitting",
//       StationCode: "STN-G2",
//       DemandDate: "2023-10-12",
//       Quantity: 50,
//       UnitPrice: 4.0,
//       AuthType: "ars",
//     },
//     {
//       CustomerCode: "CUST007",
//       DemandNo: "DEM20230007",
//       ItemCode: "ITM1007",
//       ItemDescription: "Steel Bolt M10",
//       StationCode: "STN-K5",
//       DemandDate: "2023-11-20",
//       Quantity: 500,
//       UnitPrice: 0.5,
//       AuthType: "oth",
//     },
//     {
//       CustomerCode: "CUST008",
//       DemandNo: "DEM20230008",
//       ItemCode: "ITM1008",
//       ItemDescription: "Galvanized Plate",
//       StationCode: "STN-F1",
//       DemandDate: "2023-12-05",
//       Quantity: 120,
//       UnitPrice: 6.5,
//       AuthType: "mmp",
//     },
//     {
//       CustomerCode: "CUST009",
//       DemandNo: "DEM20230009",
//       ItemCode: "ITM1009",
//       ItemDescription: "Iron Angle 2m",
//       StationCode: "STN-H3",
//       DemandDate: "2024-01-18",
//       Quantity: 90,
//       UnitPrice: 3.0,
//       AuthType: "rep",
//     },
//     {
//       CustomerCode: "CUST010",
//       DemandNo: "DEM20230010",
//       ItemCode: "ITM1010",
//       ItemDescription: "Stainless Steel Tube",
//       StationCode: "STN-J4",
//       DemandDate: "2024-02-25",
//       Quantity: 70,
//       UnitPrice: 7.0,
//       AuthType: "ars",
//     },
//   ]);

//   const [submittedData, setSubmittedData] = useState([]);

//   // Handle quantity change
//   const handleQuantityChange = (demandNo, newValue) => {
//     setMasterData((prevData) =>
//       prevData.map((item) =>
//         item.DemandNo === demandNo
//           ? { ...item, Quantity: Math.max(0, parseInt(newValue) || 0) } // Prevent negative quantities
//           : item
//       )
//     );
//   };

//   // Handle auth type changeయ

//   const handleAuthTypeChange = (demandNo, newValue) => {
//     setMasterData((prevData) =>
//       prevData.map((item) =>
//         item.DemandNo === demandNo ? { ...item, AuthType: newValue } : item
//       )
//     );
//   };

//   // Handle submit
//   const handleSubmit = () => {
//     setSubmittedData([...masterData]);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">Demand Management</h1>
      
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Customer Code</TableHead>
//             <TableHead>Demand No</TableHead>
//             <TableHead>Item Code</TableHead>
//             <TableHead>Item Description</TableHead>
//             <TableHead>Station Code</TableHead>
//             <TableHead>Demand Date</TableHead>
//             <TableHead>Quantity</TableHead>
//             <TableHead>Unit Price</TableHead>
//             <TableHead>Auth Type</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {masterData.map((item) => (
//             <TableRow key={item.DemandNo}>
//               <TableCell>{item.CustomerCode}</TableCell>
//               <TableCell>{item.DemandNo}</TableCell>
//               <TableCell>{item.ItemCode}</TableCell>
//               <TableCell>{item.ItemDescription}</TableCell>
//               <TableCell>{item.StationCode}</TableCell>
//               <TableCell>{item.DemandDate}</TableCell>
//               <TableCell>
//                 <Input
//                   type="number"
//                   value={item.Quantity}
//                   onChange={(e) => handleQuantityChange(item.DemandNo, e.target.value)}
//                   className="w-24 border-gray-300 focus:ring-2 focus:ring-blue-500"
//                   min="0"
//                 />
//               </TableCell>
//               <TableCell>{item.UnitPrice}</TableCell>
//               <TableCell>
//                 <Select
//                   value={item.AuthType}
//                   onValueChange={(value) => handleAuthTypeChange(item.DemandNo, value)}
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="rep">Rep</SelectItem>
//                     <SelectItem value="ars">Ars</SelectItem>
//                     <SelectItem value="oth">Oth</SelectItem>
//                     <SelectItem value="mmp">Mmp</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Button onClick={handleSubmit} className="mt-4 bg-blue-500 hover:bg-blue-600">
//         Submit
//       </Button>

//       {submittedData.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4 text-gray-800">Submitted Data</h2>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Customer Code</TableHead>
//                 <TableHead>Demand No</TableHead>
//                 <TableHead>Item Code</TableHead>
//                 <TableHead>Item Description</TableHead>
//                 <TableHead>Station Code</TableHead>
//                 <TableHead>Demand Date</TableHead>
//                 <TableHead>Quantity</TableHead>
//                 <TableHead>Unit Price</TableHead>
//                 <TableHead>Auth Type</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {submittedData.map((item) => (
//                 <TableRow key={item.DemandNo}>
//                   <TableCell>{item.CustomerCode}</TableCell>
//                   <TableCell>{item.DemandNo}</TableCell>
//                   <TableCell>{item.ItemCode}</TableCell>
//                   <TableCell>{item.ItemDescription}</TableCell>
//                   <TableCell>{item.StationCode}</TableCell>
//                   <TableCell>{item.DemandDate}</TableCell>
//                   <TableCell>{item.Quantity}</TableCell>
//                   <TableCell>{item.UnitPrice}</TableCell>
//                   <TableCell>{item.AuthType}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArrayOfMapp;

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const ArrayOfMapp = () => {
  const [masterData, setMasterData] = useState([
    {
      CustomerCode: "CUST001",
      DemandNo: "DEM20230001",
      ItemCode: "ITM1001",
      ItemDescription: "Metal Pipe 1m",
      StationCode: "STN-F1",
      DemandDate: "2023-05-16",
      Quantity: 100,
      UnitPrice: 2.5,
      AuthType: "rep",
    },
    {
      CustomerCode: "CUST002",
      DemandNo: "DEM20230002",
      ItemCode: "ITM1002",
      ItemDescription: "Steel Rod 2m",
      StationCode: "STN-G2",
      DemandDate: "2023-06-22",
      Quantity: 150,
      UnitPrice: 3.75,
      AuthType: "ars",
    },
    {
      CustomerCode: "CUST003",
      DemandNo: "DEM20230003",
      ItemCode: "ITM1003",
      ItemDescription: "Copper Wire 50m",
      StationCode: "STN-H3",
      DemandDate: "2023-07-10",
      Quantity: 200,
      UnitPrice: 1.8,
      AuthType: "oth",
    },
    {
      CustomerCode: "CUST004",
      DemandNo: "DEM20230004",
      ItemCode: "ITM1004",
      ItemDescription: "Aluminum Sheet 1x1m",
      StationCode: "STN-F1",
      DemandDate: "2023-08-15",
      Quantity: 80,
      UnitPrice: 5.0,
      AuthType: "mmp",
    },
    {
      CustomerCode: "CUST005",
      DemandNo: "DEM20230005",
      ItemCode: "ITM1005",
      ItemDescription: "PVC Pipe 0.5m",
      StationCode: "STN-J4",
      DemandDate: "2023-09-03",
      Quantity: 300,
      UnitPrice: 1.2,
      AuthType: "rep",
    },
    {
      CustomerCode: "CUST006",
      DemandNo: "DEM20230006",
      ItemCode: "ITM1006",
      ItemDescription: "Brass Fitting",
      StationCode: "STN-G2",
      DemandDate: "2023-10-12",
      Quantity: 50,
      UnitPrice: 4.0,
      AuthType: "ars",
    },
    {
      CustomerCode: "CUST007",
      DemandNo: "DEM20230007",
      ItemCode: "ITM1007",
      ItemDescription: "Steel Bolt M10",
      StationCode: "STN-K5",
      DemandDate: "2023-11-20",
      Quantity: 500,
      UnitPrice: 0.5,
      AuthType: "oth",
    },
    {
      CustomerCode: "CUST008",
      DemandNo: "DEM20230008",
      ItemCode: "ITM1008",
      ItemDescription: "Galvanized Plate",
      StationCode: "STN-F1",
      DemandDate: "2023-12-05",
      Quantity: 120,
      UnitPrice: 6.5,
      AuthType: "mmp",
    },
    {
      CustomerCode: "CUST009",
      DemandNo: "DEM20230009",
      ItemCode: "ITM1009",
      ItemDescription: "Iron Angle 2m",
      StationCode: "STN-H3",
      DemandDate: "2024-01-18",
      Quantity: 90,
      UnitPrice: 3.0,
      AuthType: "rep",
    },
    {
      CustomerCode: "CUST010",
      DemandNo: "DEM20230010",
      ItemCode: "ITM1010",
      ItemDescription: "Stainless Steel Tube",
      StationCode: "STN-J4",
      DemandDate: "2024-02-25",
      Quantity: 70,
      UnitPrice: 7.0,
      AuthType: "ars",
    },
  ]);

  const [submittedData, setSubmittedData] = useState([]);
  const [editingQuantity, setEditingQuantity] = useState(null); // Track which DemandNo is being edited

  // Handle quantity change
  const handleQuantityChange = (demandNo, newValue) => {
    setMasterData((prevData) =>
      prevData.map((item) =>
        item.DemandNo === demandNo
          ? { ...item, Quantity: Math.max(0, parseInt(newValue) || 0) }
          : item
      )
    );
  };

  // Handle auth type change
  const handleAuthTypeChange = (demandNo, newValue) => {
    setMasterData((prevData) =>
      prevData.map((item) =>
        item.DemandNo === demandNo ? { ...item, AuthType: newValue } : item
      )
    );
  };

  // Handle submit
  const handleSubmit = () => {
    setSubmittedData([...masterData]);
    setEditingQuantity(null); // Reset editing state on submit
  };

  // Handle click to edit quantity
  const handleQuantityClick = (demandNo) => {
    setEditingQuantity(demandNo);
  };

  // Handle blur or enter key to exit editing
  const handleQuantityBlurOrEnter = (demandNo, e) => {
    if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
      setEditingQuantity(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Demand Management</h1>

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
            <TableHead>Auth Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {masterData.map((item) => (
            <TableRow key={item.DemandNo}>
              <TableCell>{item.CustomerCode}</TableCell>
              <TableCell>{item.DemandNo}</TableCell>
              <TableCell>{item.ItemCode}</TableCell>
              <TableCell>{item.ItemDescription}</TableCell>
              <TableCell>{item.StationCode}</TableCell>
              <TableCell>{item.DemandDate}</TableCell>
              <TableCell>
                {editingQuantity === item.DemandNo ? (
                  <Input
                    type="number"
                    value={item.Quantity}
                    onChange={(e) => handleQuantityChange(item.DemandNo, e.target.value)}
                    onBlur={(e) => handleQuantityBlurOrEnter(item.DemandNo, e)}
                    onKeyDown={(e) => handleQuantityBlurOrEnter(item.DemandNo, e)}
                    className="w-24 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    min="0"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => handleQuantityClick(item.DemandNo)}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    {item.Quantity}
                  </span>
                )}
              </TableCell>
              <TableCell>{item.UnitPrice}</TableCell>
              <TableCell>
                <Select
                  value={item.AuthType}
                  onValueChange={(value) => handleAuthTypeChange(item.DemandNo, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rep">Rep</SelectItem>
                    <SelectItem value="ars">Ars</SelectItem>
                    <SelectItem value="oth">Oth</SelectItem>
                    <SelectItem value="mmp">Mmp</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={handleSubmit} className="mt-4 bg-blue-500 hover:bg-blue-600">
        Submit
      </Button>

      {submittedData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Submitted Data</h2>
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
                <TableHead>Auth Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submittedData.map((item) => (
                <TableRow key={item.DemandNo}>
                  <TableCell>{item.CustomerCode}</TableCell>
                  <TableCell>{item.DemandNo}</TableCell>
                  <TableCell>{item.ItemCode}</TableCell>
                  <TableCell>{item.ItemDescription}</TableCell>
                  <TableCell>{item.StationCode}</TableCell>
                  <TableCell>{item.DemandDate}</TableCell>
                  <TableCell>{item.Quantity}</TableCell>
                  <TableCell>{item.UnitPrice}</TableCell>
                  <TableCell>{item.AuthType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ArrayOfMapp;