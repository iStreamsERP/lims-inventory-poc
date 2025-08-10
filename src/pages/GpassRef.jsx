// import React, { useState } from 'react';
// import TableDetailComponent from './TableDetailComponent';
// import { Button } from '@components/ui/Button';
// import { Checkbox } from '@components/ui/Checkbox';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@components/ui/command';
// import TextInput from '@components/common/TextInput';

// export const DemandPopupGatePass = () => {
//   const [formData, setFormData] = useState({
//     dateRaisedTo: '',
//     isDetailsRaised: false,
//     generalQuery: '',
//     searchDemand: '',
//     itemsShow: false,
//   });

//   const tableDetailDataConstant = [
//     {
//       id: 1,
//       dateRaisedFrom: '2025-08-07',
//       type: 'General Query',
//       internalDemandNo: '1234567890123456',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'John Doe',
//     },
//     {
//       id: 2,
//       dateRaisedFrom: '2025-08-07',
//       type: 'General Query',
//       internalDemandNo: '1234567890123457',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'Jane Doe',
//     },
//     {
//       id: 3,
//       dateRaisedFrom: '2025-08-07',
//       type: 'General Query',
//       internalDemandNo: '1234567890123458',
//       raisedForDept: 'Sales',
//       demandType 'PO',
//       raisedBy: 'John Smith',
//     },
//     {
//       id: 4,
//       dateRaisedFrom: '2025-08-07',
//       type: 'General Query',
//       internalDemandNo: '1234567890123459',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'Alice Johnson',
//     },
//     {
//       id: 5,
//       dateRaisedFrom: '2025-08-07',
//       type: 'General Query',
//       internalDemandNo: '1234567890123460',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'Bob Wilson',
//     },
//   ];

//   const initialFormat = {
//     dateRaisedFrom: '2025-08-07',
//     type: 'General Query',
//     internalDemandNo: '',
//   };

//   const handleChange = (name,value) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = (e) => {
//     const { value } = e.target;
//     setFormData((prev) => ({ ...prev, searchDemand: value }));
//   };

//   const handleShowItems = (checked) => {
//     setFormData((prev) => ({ ...prev, itemsShow: checked }));
//   };

//   // Filter table data based on searchDemand
//   const filteredTableData = tableDetailDataConstant.filter(item =>
//     item.internalDemandNo.includes(formData.searchDemand)
//   );

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
//       <div className="col-span-2">
//         <TextInput
//           label="Date Raised To"
//           name="dateRaisedTo"
//           value={formData.dateRaisedTo}
//           onChange={(val)=>{handleChange('dateRaisedTo',val)}}
//         />
//       </div>
//       <div className="col-span-2">
//         <Command>
//           <CommandInput
//             label="General Query"
//             name="generalQuery"
//             value={formData.generalQuery}
        
//             options={['General Query', 'Shipment Status', 'Pending Demand', 'Cart Items']}
//           />
//         </Command>
//       </div>
//       <div className="col-span-2">
//         <TextInput
//           label="Search Demand No"
//           name="searchDemand"
//           value={formData.searchDemand}
//           onChange={(val)=>{handleSearch("searchdemand",val)}}
//         />
//       </div>
//       <div className="col-span-6">
//         <Checkbox
//           label="Show items"
//           name="show-items"
//           checked={formData.itemsShow}
//           onCheckedChange={handleShowItems}
//         />
//       </div>
//       <TableDetailComponent tableData={filteredTableData} onClick={handleShowItems} />
//     </div>
//   );
// };


// export default DemandPopupGatePass;


// import React, { useState } from 'react';
// import TableDetailComponent from './TableDetailComponent';
// import { Button } from '@components/ui/Button';
// import { Checkbox } from '@components/ui/Checkbox';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@components/ui/command';
// import TextInput from '@components/common/TextInput';

// export const DemandPopupGatePass = () => {
//   const [formData, setFormData] = useState({
//     dateRaisedTo: '',
//     isDetailsRaised: false,
//     generalQuery: '',
//     searchDemand: '',
//     itemsShow: false,
//   });

//   const tableDetailDataConstant = [
//     {
//       id: 1,
//       dateRaisedFrom: '2025-08-07',
//       type: 'General Query',
//       internalDemandNo: '1234567890123456',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'John Doe',
//     },
//     {
//       id: 2,
//       dateRaisedFrom: '2025-08-07',
//       type: 'Shipment Status',
//       internalDemandNo: '1234567890123457',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'Jane Doe',
//     },
//     {
//       id: 3,
//       dateRaisedFrom: '2025-08-07',
//       type: 'Pending Demand',
//       internalDemandNo: '1234567890123458',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'John Smith',
//     },
//     {
//       id: 4,
//       dateRaisedFrom: '2025-08-07',
//       type: 'Cart Items',
//       internalDemandNo: '1234567890123459',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'Alice Johnson',
//     },
//     {
//       id: 5,
//       dateRaisedFrom: '2025-08-07',
//       type: 'General Query',
//       internalDemandNo: '1234567890123460',
//       raisedForDept: 'Sales',
//       demandType: 'PO',
//       raisedBy: 'Bob Wilson',
//     },
//   ];

//   const handleChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (value) => {
//     setFormData((prev) => ({ ...prev, generalQuery: value }));
//   };

//   const handleSearch = (value) => {
//     setFormData((prev) => ({ ...prev, searchDemand: value }));
//   };

//   const handleShowItems = (checked) => {
//     setFormData((prev) => ({ ...prev, itemsShow: checked }));
//   };

//   // Filter table data based on both generalQuery and searchDemand
//   const filteredTableData = tableDetailDataConstant.filter(item => {
//     const matchesType = formData.generalQuery ? item.type === formData.generalQuery : true;
//     const matchesDemand = formData.searchDemand ? 
//       item.internalDemandNo.includes(formData.searchDemand) : true;
//     return matchesType && matchesDemand;
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
//       <div className="col-span-2">
//         <TextInput
//           label="Date Raised To"
//           name="dateRaisedTo"
//           value={formData.dateRaisedTo}
//           onChange={(val) => handleChange('dateRaisedTo', val)}
//         />
//       </div>
//       <div className="col-span-2">
//         <Command>
//           <CommandInput
//             placeholder="Select Query Type"
//             value={formData.generalQuery}
//             onValueChange={(val) => handleSelectChange(val)}
//           />
//           <CommandGroup>
//             <CommandEmpty>No query types found.</CommandEmpty>
//             {['General Query', 'Shipment Status', 'Pending Demand', 'Cart Items'].map((option) => (
//               <CommandItem
//                 key={option}
//                 value={option}
//                 onSelect={() => handleSelectChange(option)}
//               >
//                 {option}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </div>
//       <div className="col-span-2">
//         <TextInput
//           label="Search Demand No"
//           name="searchDemand"
//           value={formData.searchDemand}
//           onChange={(val) => handleSearch(val)}
//         />
//       </div>
//       <div className="col-span-6">
//         <Checkbox
//           label="Show items"
//           name="show-items"
//           checked={formData.itemsShow}
//           onCheckedChange={handleShowItems}
//         />
//       </div>
//       <TableDetailComponent tableData={filteredTableData} onClick={handleShowItems} />
//     </div>
//   );
// };

// export default DemandPopupGatePass;