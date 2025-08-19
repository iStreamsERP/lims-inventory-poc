import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState } from 'react'
import BasicTable from './BasicTable';


const BasicPage = () => {
    const department = [
        {id: 1, name: "IT"},
        {id: 2, name: "HR"},
        {id: 3, name: "Sales"},
    ];

    const subDepartments = [
        { id: 101, deptId: 1, name: "Development" },
        { id: 102, deptId: 1, name: "Infrastructure" },
        { id: 201, deptId: 2, name: "Recruitment" },
        { id: 202, deptId: 2, name: "Training" },
        { id: 301, deptId: 3, name: "Inside Sales" },
        { id: 302, deptId: 3, name: "Field Sales" }
    ];
    
    const tableMasterData = [
        {id: 1, name: "IT", designation: "Developer", phone: "1234567890", email: "x2K4H@example.com", contactFor: "Development", alternativeContact: "9876543210"},
        {id: 2, name: "HR", designation: "Manager", phone: "2345678901", email: "hr@example.com", contactFor: "Recruitment", alternativeContact: "8765432109"},
        {id: 3, name: "Sales", designation: "Executive", phone: "3456789012", email: "sales@example.com", contactFor: "Inside Sales", alternativeContact: "7654321098"}
    ];

    const [selectdept, setSelectedDept] = useState("");
    const [selectsubdept, setSelectedSubDept] = useState("");

    const handledeptchange = (value) => {
        setSelectedDept(value);
        setSelectedSubDept(""); // Reset sub-dept when department changes
    }

    const handlesubdeptchange = (value) => {
        setSelectedSubDept(value);
    }

    const selectedDepID = department.find(d => d.name === selectdept)?.id;
    
  return (
    <div>
        
    <div className='flex flex-row gap-3'>
      <Select value={selectdept} onValueChange={handledeptchange}>
        <SelectTrigger className="w-xs">
            <SelectValue placeholder="Select Department"/>
        </SelectTrigger>
            <SelectContent>
                 {department.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                 ))}
            </SelectContent>
      </Select>

      
      <Select value={selectsubdept} onValueChange={handlesubdeptchange} disabled={!selectdept}>
        <SelectTrigger className="w-xs">
            <SelectValue placeholder="Select Sub Department"/>
        </SelectTrigger>
            <SelectContent>
                 {subDepartments
                    .filter(sub => sub.deptId === selectedDepID)
                    .map(sub => (
                        <SelectItem key={sub.id} value={sub.name}>
                            {sub.name}
                        </SelectItem>
                    ))
                }
            </SelectContent>
      </Select>
    </div>
    <div>        
      <BasicTable tableData={tableMasterData} />
    </div>
    </div>
  )
}

export default BasicPage








// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import React, { useState } from 'react'
// import BasicTable from './BasicTable';

// const BasicPage = () => {
//     const department = [
//         {id: 1, name: "IT"},
//         {id: 2, name: "HR"},
//         {id: 3, name: "Sales"},
//     ];

//     const subDepartments = [
//         { id: 101, deptId: 1, name: "Development" },
//         { id: 102, deptId: 1, name: "Infrastructure" },
//         { id: 201, deptId: 2, name: "Recruitment" },
//         { id: 202, deptId: 2, name: "Training" },
//         { id: 301, deptId: 3, name: "Inside Sales" },
//         { id: 302, deptId: 3, name: "Field Sales" }
//     ];
    
//     const tableMasterData = [
//         {id: 1, name: "IT", designation: "Developer", phone: "1234567890", email: "x2K4H@example.com", contactFor: "Development", alternativeContact: "9876543210"},
//         {id: 2, name: "HR", designation: "Manager", phone: "2345678901", email: "hr@example.com", contactFor: "Recruitment", alternativeContact: "8765432109"},
//         {id: 3, name: "Sales", designation: "Executive", phone: "3456789012", email: "sales@example.com", contactFor: "Inside Sales", alternativeContact: "7654321098"}
//     ];

//     const [selectdept, setSelectedDept] = useState("");
//     const [selectsubdept, setSelectedSubDept] = useState("");

//     const handledeptchange = (value) => {
//         setSelectedDept(value);
//         setSelectedSubDept(""); // Reset sub-dept when department changes
//     }

//     const handlesubdeptchange = (value) => {
//         setSelectedSubDept(value);
//     }

//     const selectedDepID = department.find(d => d.name === selectdept)?.id;
    
//   return (
//     <div>
        
//     <div className='flex flex-row gap-3'>
//       <Select value={selectdept} onValueChange={handledeptchange}>
//         <SelectTrigger className="w-xs">
//             <SelectValue placeholder="Select Department"/>
//         </SelectTrigger>
//             <SelectContent>
//                  {department.map((dept) => (
//                     <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
//                  ))}
//             </SelectContent>
//       </Select>

      
//       <Select value={selectsubdept} onValueChange={handlesubdeptchange} disabled={!selectdept}>
//         <SelectTrigger className="w-xs">
//             <SelectValue placeholder="Select Sub Department"/>
//         </SelectTrigger>
//             <SelectContent>
//                  {subDepartments
//                     .filter(sub => sub.deptId === selectedDepID)
//                     .map(sub => (
//                         <SelectItem key={sub.id} value={sub.name}>
//                             {sub.name}
//                         </SelectItem>
//                     ))
//                 }
//             </SelectContent>
//       </Select>
//     </div>
//     <div>        
//       <BasicTable tableData={tableMasterData} />
//     </div>
//     </div>
//   )
// }

// export default BasicPage
