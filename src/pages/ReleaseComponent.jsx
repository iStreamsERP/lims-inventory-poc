// import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// function ReleaseComponent({
//   getIssues,
//   masterData,
//   masterDetails,
//   setSearchCustomerNo,
//   setSearchDemandNo,
//   searchCustomerNo,
//   searchDemandNo,
//   handleClick,
//   filteredData,
//   setSelectType,
//   selectType,
//   ShowDatas,
//   handleSelectData,
//   selectedMaterial
// }) {
//   return (
//     <div className="p-4">
//       <div className="flex gap-2 mb-4">
//         <Select onValueChange={(value) => setSelectType(value)}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select Gate Pass Type" />
//           </SelectTrigger>
//           <SelectContent>
//             {getIssues.map((items) => (
//               <SelectItem key={items.ITEM_VALUE} value={items.ITEM_VALUE}>
//                 {items.ITEM_LABEL}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Input
//           className="w-fit"
//           placeholder="Search Customer Code..."
//           value={searchCustomerNo}
//           onChange={(e) => setSearchCustomerNo(e.target.value)}
//         />
//         <Input
//           className="w-fit"
//           placeholder="Search Customer Demand..."
//           value={searchDemandNo}
//           onChange={(e) => setSearchDemandNo(e.target.value)}
//         />
//         <Button onClick={handleClick}>Add</Button>
//       </div>
//         { ShowDatas &&
//         (
//             <Table>
//         <TableHeader>
//           <TableRow>
            
//             <TableHead>Gate Pass No</TableHead>
//             <TableHead>Auth Ref</TableHead>
//             <TableHead>Escort name</TableHead>
//             <TableHead>Transport No</TableHead>
//             <TableHead>Transport mode</TableHead>
//             <TableHead>Transport destination</TableHead>
//             <TableHead>Remarks</TableHead>
//             <TableHead>Gate Pass key</TableHead>
//             <TableHead>Iniated By</TableHead>
//             <TableHead>DTMApproved</TableHead>
//             <TableHead>Approved By</TableHead>
//             <TableHead>Date Time Gate Out By</TableHead>
//             <TableHead>Duty Jco</TableHead>
//             <TableHead>Stock delivery key</TableHead>
//             <TableHead>CusCd</TableHead>
//             <TableHead>Demand No</TableHead>
//             <TableHead>Issue DtTm</TableHead>
//             <TableHead>Item Code</TableHead>
//             <TableHead>Rel Srl</TableHead>
//             <TableHead>Release DtTm</TableHead>
//             <TableHead>QTY</TableHead>
//             <TableHead>Hand Over By</TableHead>
//             <TableHead>DTM Taken Over</TableHead>
//             <TableHead>Taken By</TableHead>
//             <TableHead>Station Code</TableHead>
//             <TableHead>Gate Pass key</TableHead>
//             <TableHead>PKG MAKING</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filteredData.map((item, index) => (
//             <TableRow key={index}>
//               <from gate pass to duty jco will be input---></from>
//               <TableCell>{item.CUS_CD}</TableCell>
//               <TableCell>{item.DEM_NO}</TableCell>
//               <TableCell>{item.ISSUE_DTTM}</TableCell>
//               <TableCell>{item.ITEM_CODE}</TableCell>
//               <TableCell>{item.REL_SRI}</TableCell>
//               <TableCell>{item.RELEASE_DTTM}</TableCell>
//               <TableCell>{item.QTY}</TableCell>
//               <TableCell>{item.HAND_OVER_BY}</TableCell>
//               <TableCell>{item.DTM_TAKEN_OVER}</TableCell>
//               <TableCell>{item.TAKEN_BY}</TableCell>
//               <TableCell>{item.STATION_CODE}</TableCell>
//               <TableCell>
//                 <Button onClick={()=>handleSelectData(filteredData)}><Plus/></Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//         )   }     


//         <Dialog open={isOpen} close={setIsOpen}>
  
//   <DialogContent>
//      <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>CusCd</TableHead>
//             <TableHead>CusCd</TableHead>
//             <TableHead>Demand No</TableHead>
//             <TableHead>Issue DtTm</TableHead>
//             <TableHead>Item Code</TableHead>
//             <TableHead>Rel Srl</TableHead>
//             <TableHead>Release DtTm</TableHead>
//             <TableHead>QTY</TableHead>
//             <TableHead>Hand Over By</TableHead>
//             <TableHead>DTM Taken Over</TableHead>
//             <TableHead>Taken By</TableHead>
//             <TableHead>Station Code</TableHead>
//             <TableHead>Gate Pass</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {selectedMaterial.map((item, index) => (
//             <TableRow key={index}>
//               <TableCell>{item.CUS_CD}</TableCell>
//               <TableCell>{item.DEM_NO}</TableCell>
//               <TableCell>{item.ISSUE_DTTM}</TableCell>
//               <TableCell>{item.ITEM_CODE}</TableCell>
//               <TableCell>{item.REL_SRI}</TableCell>
//               <TableCell>{item.RELEASE_DTTM}</TableCell>
//               <TableCell>{item.QTY}</TableCell>
//               <TableCell>{item.HAND_OVER_BY}</TableCell>
//               <TableCell>{item.DTM_TAKEN_OVER}</TableCell>
//               <TableCell>{item.TAKEN_BY}</TableCell>
//               <TableCell>{item.STATION_CODE}</TableCell>
           
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//   </DialogContent>
// </Dialog>
      
//     </div>
//   );
// }

// export default ReleaseComponent;

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const ReleaseComponent = ({
  getIssues,
  masterData,
  masterDetails,
  setSearchCustomerNo,
  setSearchDemandNo,
  searchCustomerNo,
  searchDemandNo,
  handleClick,
  filteredData,
  setSelectType,
  selectType,
  ShowDatas,
  handleSelectData,
  selectedMaterial,
  setSelectedMaterial,
  isOpen,
  setIsOpen
}) => {
  const [editingQty, setEditingQty] = useState(null);
  const [tempQty, setTempQty] = useState("");

  const handleQtyClick = (index, qty) => {
    setEditingQty(index);
    setTempQty(qty);
  };

  const handleQtyChange = (e) => {
    setTempQty(e.target.value);
  };

  const handleQtyBlur = (index) => {
    const updatedMaterials = [...selectedMaterial];
    updatedMaterials[index].QTY = tempQty;
    setSelectedMaterial(updatedMaterials);
    setEditingQty(null);
  };

  const handleQtyKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      handleQtyBlur(index);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Select onValueChange={(value) => setSelectType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Gate Pass Type" />
          </SelectTrigger>
          <SelectContent>
            {getIssues.map((items) => (
              <SelectItem key={items.ITEM_VALUE} value={items.ITEM_VALUE}>
                {items.ITEM_LABEL}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="w-fit"
          placeholder="Search Customer Code..."
          value={searchCustomerNo}
          onChange={(e) => setSearchCustomerNo(e.target.value)}
        />
        <Input
          className="w-fit"
          placeholder="Search Customer Demand..."
          value={searchDemandNo}
          onChange={(e) => setSearchDemandNo(e.target.value)}
        />
        <Button onClick={handleClick}>Add</Button>
      </div>
      {ShowDatas && (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gate Pass No</TableHead>
                <TableHead>Auth Ref</TableHead>
                <TableHead>Escort name</TableHead>
                <TableHead>Transport No</TableHead>
                <TableHead>Transport mode</TableHead>
                <TableHead>Transport destination</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Gate Pass key</TableHead>
                <TableHead>Iniated By</TableHead>
                <TableHead>DTMApproved</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Date Time Gate Out By</TableHead>
                <TableHead>Duty Jco</TableHead>
                <TableHead>Stock delivery key</TableHead>
                <TableHead>CusCd</TableHead>
                <TableHead>Demand No</TableHead>
                <TableHead>Issue DtTm</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Rel Srl</TableHead>
                <TableHead>Release DtTm</TableHead>
                <TableHead>QTY</TableHead>
                <TableHead>Hand Over By</TableHead>
                <TableHead>DTM Taken Over</TableHead>
                <TableHead>Taken By</TableHead>
                <TableHead>Station Code</TableHead>
                <TableHead>Gate Pass key</TableHead>
                <TableHead>PKG MAKING</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell><Input placeholder="Gate Pass No" /></TableCell>
                  <TableCell><Input placeholder="Auth Ref" /></TableCell>
                  <TableCell><Input placeholder="Escort name" /></TableCell>
                  <TableCell><Input placeholder="Transport No" /></TableCell>
                  <TableCell><Input placeholder="Transport mode" /></TableCell>
                  <TableCell><Input placeholder="Transport destination" /></TableCell>
                  <TableCell><Input placeholder="Remarks" /></TableCell>
                  <TableCell><Input placeholder="Gate Pass key" /></TableCell>
                  <TableCell><Input placeholder="Iniated By" /></TableCell>
                  <TableCell><Input placeholder="DTMApproved" /></TableCell>
                  <TableCell><Input placeholder="Approved By" /></TableCell>
                  <TableCell><Input placeholder="Date Time Gate Out By" /></TableCell>
                  <TableCell><Input placeholder="Duty Jco" /></TableCell>
                  
                  <TableCell>{item.STOCK_DELIVERY_KEY}</TableCell>
                  <TableCell>{item.CUS_CD}</TableCell>
                  <TableCell>{item.DEM_NO}</TableCell>
                  <TableCell>{item.ISSUE_DTTM}</TableCell>
                  <TableCell>{item.ITEM_CODE}</TableCell>
                  <TableCell>{item.REL_SRI}</TableCell>
                  <TableCell>{item.RELEASE_DTTM}</TableCell>
                  <TableCell>{item.QTY}</TableCell>
                  <TableCell>{item.HAND_OVER_BY}</TableCell>
                  <TableCell>{item.DTM_TAKEN_OVER}</TableCell>
                  <TableCell>{item.TAKEN_BY}</TableCell>
                  <TableCell>{item.STATION_CODE}</TableCell>
                  <TableCell>{item.GATE_PASS_KEY}</TableCell>
                  <TableCell>{item.PKG_MARKING}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      handleSelectData(item);
                      setIsOpen(true);
                    }}>
                      <Plus/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}     

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
            <DialogDescription>
              View and edit material quantities
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CusCd</TableHead>
                <TableHead>Demand No</TableHead>
                <TableHead>Issue DtTm</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Rel Srl</TableHead>
                <TableHead>Release DtTm</TableHead>
                <TableHead>QTY</TableHead>
                <TableHead>Hand Over By</TableHead>
                <TableHead>DTM Taken Over</TableHead>
                <TableHead>Taken By</TableHead>
                <TableHead>Station Code</TableHead>
                <TableHead>Gate Pass</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedMaterial.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.CUS_CD}</TableCell>
                  <TableCell>{item.DEM_NO}</TableCell>
                  <TableCell>{item.ISSUE_DTTM}</TableCell>
                  <TableCell>{item.ITEM_CODE}</TableCell>
                  <TableCell>{item.REL_SRI}</TableCell>
                  <TableCell>{item.RELEASE_DTTM}</TableCell>
                  <TableCell>
                    {editingQty === index ? (
                      <Input
                        value={tempQty}
                        onChange={handleQtyChange}
                        onBlur={() => handleQtyBlur(index)}
                        onKeyDown={(e) => handleQtyKeyDown(e, index)}
                        autoFocus
                      />
                    ) : (
                      <div 
                        onClick={() => handleQtyClick(index, item.QTY)}
                        className="cursor-pointer p-2"
                      >
                        {item.QTY}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.HAND_OVER_BY}</TableCell>
                  <TableCell>{item.DTM_TAKEN_OVER}</TableCell>
                  <TableCell>{item.TAKEN_BY}</TableCell>
                  <TableCell>{item.STATION_CODE}</TableCell>
                  <TableCell>{item.GATE_PASS_KEY}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReleaseComponent;