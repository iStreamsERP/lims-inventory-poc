// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Checkbox } from "@/components/ui/checkbox";

// function IssueConsolidation() {
//   const Authority = [
//     { ITEM_LABBEL: "RES", ITEM_VALUE: "RES" },
//     { ITEM_LABBEL: "PRES", ITEM_VALUE: "PRES" },
//     { ITEM_LABBEL: "REPAIRABLE", ITEM_VALUE: "REPAIRABLE" },
//   ];

//   const masterData = [
//     {
//       DEMAND_NO: "DEM20230001",
//       ITEM_CODE: "ITM1001",
//       ITEM_DESCRIPTION: "Stainless Steel Bolt 10mm",
//       STATION_CODE: "STN-A1",
//       DEMAND_DATE: "2023-05-15",
//       QUANTITY: 50,
//       UNIT_PRICE: 2.75,
//       AUTHORITY_TYPE: "RES",
//     },
//     {
//       DEMAND_NO: "DEM20230001",
//       ITEM_CODE: "ITM2045",
//       ITEM_DESCRIPTION: 'Rubber Gasket 3/4"',
//       STATION_CODE: "STN-B2",
//       DEMAND_DATE: "2023-05-16",
//       QUANTITY: 200,
//       UNIT_PRICE: 0.85,
//       AUTHORITY_TYPE: "PRES",
//     },
//   ];

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedAuthority, setSelectedAuthority] = useState('all');
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // Filter data based on search term and authority type
//   const filteredData = masterData.filter(item => {
//     const matchesSearch = Object.values(item).some(value =>
//       value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const matchesAuthority = selectedAuthority === 'all' ? true : item.AUTHORITY_TYPE === selectedAuthority;
//     return matchesSearch && matchesAuthority;
//   });

//   // Handle checkbox selection
//   const handleRowSelect = (demandNo) => {
//     setSelectedRows(prev =>
//       prev.includes(demandNo)
//         ? prev.filter(id => id !== demandNo)
//         : [...prev, demandNo]
//     );
//   };

//   // Handle select all checkboxes
//   const handleSelectAll = (checked) => {
//     if (checked) {
//       setSelectedRows(filteredData.map(item => item.DEMAND_NO));
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   // Get selected rows data for dialog
//   const selectedRowsData = masterData.filter(item => selectedRows.includes(item.DEMAND_NO));

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <div className="flex gap-4 mb-4">
//         <Input
//           placeholder="Search all fields..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//         <Select onValueChange={setSelectedAuthority} value={selectedAuthority}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Filter by Authority" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Authorities</SelectItem>
//             {Authority.map((auth) => (
//               <SelectItem key={auth.ITEM_VALUE} value={auth.ITEM_VALUE}>
//                 {auth.ITEM_LABBEL}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Button
//           onClick={() => setIsDialogOpen(true)}
//           disabled={selectedRows.length === 0}
//           className="ml-auto"
//         >
//           View Selected ({selectedRows.length})
//         </Button>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>
//               <Checkbox
//                 checked={selectedRows.length === filteredData.length && filteredData.length > 0}
//                 onCheckedChange={handleSelectAll}
//               />
//             </TableHead>
//             <TableHead>DEMAND NO</TableHead>
//             <TableHead>ITEM CODE</TableHead>
//             <TableHead>DESCRIPTION</TableHead>
//             <TableHead>STATION</TableHead>
//             <TableHead>DATE</TableHead>
//             <TableHead>QUANTITY</TableHead>
//             <TableHead>UNIT PRICE</TableHead>
//             <TableHead>AUTHORITY</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filteredData.map((item) => (
//             <TableRow key={item.DEMAND_NO}>
//               <TableCell>
//                 <Checkbox
//                   checked={selectedRows.includes(item.DEMAND_NO)}
//                   onCheckedChange={() => handleRowSelect(item.DEMAND_NO)}
//                 />
//               </TableCell>
//               <TableCell>{item.DEMAND_NO}</TableCell>
//               <TableCell>{item.ITEM_CODE}</TableCell>
//               <TableCell>{item.ITEM_DESCRIPTION}</TableCell>
//               <TableCell>{item.STATION_CODE}</TableCell>
//               <TableCell>{item.DEMAND_DATE}</TableCell>
//               <TableCell>{item.QUANTITY}</TableCell>
//               <TableCell>${item.UNIT_PRICE.toFixed(2)}</TableCell>
//               <TableCell>{item.AUTHORITY_TYPE}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Selected Rows ({selectedRows.length})</DialogTitle>
//           </DialogHeader>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>DEMAND NO</TableHead>
//                 <TableHead>ITEM CODE</TableHead>
//                 <TableHead>DESCRIPTION</TableHead>
//                 <TableHead>STATION</TableHead>
//                 <TableHead>DATE</TableHead>
//                 <TableHead>QUANTITY</TableHead>
//                 <TableHead>UNIT PRICE</TableHead>
//                 <TableHead>AUTHORITY</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {selectedRowsData.map((item) => (
//                 <TableRow key={item.DEMAND_NO}>
//                   <TableCell>{item.DEMAND_NO}</TableCell>
//                   <TableCell>{item.ITEM_CODE}</TableCell>
//                   <TableCell>{item.ITEM_DESCRIPTION}</TableCell>
//                   <TableCell>{item.STATION_CODE}</TableCell>
//                   <TableCell>{item.DEMAND_DATE}</TableCell>
//                   <TableCell>{item.QUANTITY}</TableCell>
//                   <TableCell>${item.UNIT_PRICE.toFixed(2)}</TableCell>
//                   <TableCell>{item.AUTHORITY_TYPE}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default IssueConsolidation;

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

function IssueConsolidation() {
  const Authority = [
    { ITEM_LABBEL: "RES", ITEM_VALUE: "RES" },
    { ITEM_LABBEL: "PRES", ITEM_VALUE: "PRES" },
    { ITEM_LABBEL: "REPAIRABLE", ITEM_VALUE: "REPAIRABLE" },
  ];

  const masterData = [
    {
      DEMAND_NO: "DEM20230001",
      ITEM_CODE: "ITM1001",
      ITEM_DESCRIPTION: "Stainless Steel Bolt 10mm",
      STATION_CODE: "STN-A1",
      DEMAND_DATE: "2023-05-15",
      QUANTITY: 50,
      UNIT_PRICE: 2.75,
      AUTHORITY_TYPE: "RES",
    },
    {
      DEMAND_NO: "DEM20230001",
      ITEM_CODE: "ITM2045",
      ITEM_DESCRIPTION: 'Rubber Gasket 3/4"',
      STATION_CODE: "STN-B2",
      DEMAND_DATE: "2023-05-16",
      QUANTITY: 200,
      UNIT_PRICE: 0.85,
      AUTHORITY_TYPE: "PRES",
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter data based on search term and authority type
  const filteredData = masterData.filter(item => {
    const matchesSearch = Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesAuthority = selectedAuthority === 'all' ? true : item.AUTHORITY_TYPE === selectedAuthority;
    return matchesSearch && matchesAuthority;
  });

  // Handle checkbox selection
  const handleRowSelect = (demandNo) => {
    setSelectedRows(prev =>
      prev.includes(demandNo)
        ? prev.filter(id => id !== demandNo)
        : [...prev, demandNo]
    );
  };

  // Handle select all checkboxes
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(filteredData.map(item => item.DEMAND_NO));
    } else {
      setSelectedRows([]);
    }
  };

  // Get selected rows data for dialog
  const selectedRowsData = masterData.filter(item => selectedRows.includes(item.DEMAND_NO));

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search all fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setSelectedAuthority} value={selectedAuthority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Authority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authorities</SelectItem>
            {Authority.map((auth) => (
              <SelectItem key={auth.ITEM_VALUE} value={auth.ITEM_VALUE}>
                {auth.ITEM_LABBEL}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={selectedRows.length === 0}
          className="ml-auto"
        >
          View Selected ({selectedRows.length})
        </Button>
      </div>

      {selectedAuthority !== 'all' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>DEMAND NO</TableHead>
              <TableHead>ITEM CODE</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>STATION</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>QUANTITY</TableHead>
              <TableHead>UNIT PRICE</TableHead>
              <TableHead>AUTHORITY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.DEMAND_NO}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(item.DEMAND_NO)}
                    onCheckedChange={() => handleRowSelect(item.DEMAND_NO)}
                  />
                </TableCell>
                <TableCell>{item.DEMAND_NO}</TableCell>
                <TableCell>{item.ITEM_CODE}</TableCell>
                <TableCell>{item.ITEM_DESCRIPTION}</TableCell>
                <TableCell>{item.STATION_CODE}</TableCell>
                <TableCell>{item.DEMAND_DATE}</TableCell>
                <TableCell>{item.QUANTITY}</TableCell>
                <TableCell>${item.UNIT_PRICE.toFixed(2)}</TableCell>
                <TableCell>{item.AUTHORITY_TYPE}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          Please select an authority type to view the data.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selected Rows ({selectedRows.length})</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DEMAND NO</TableHead>
                <TableHead>ITEM CODE</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead>STATION</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>QUANTITY</TableHead>
                <TableHead>UNIT PRICE</TableHead>
                <TableHead>AUTHORITY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedRowsData.map((item) => (
                <TableRow key={item.DEMAND_NO}>
                  <TableCell>{item.DEMAND_NO}</TableCell>
                  <TableCell>{item.ITEM_CODE}</TableCell>
                  <TableCell>{item.ITEM_DESCRIPTION}</TableCell>
                  <TableCell>{item.STATION_CODE}</TableCell>
                  <TableCell>{item.DEMAND_DATE}</TableCell>
                  <TableCell>{item.QUANTITY}</TableCell>
                  <TableCell>${item.UNIT_PRICE.toFixed(2)}</TableCell>
                  <TableCell>{item.AUTHORITY_TYPE}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IssueConsolidation;