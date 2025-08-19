import React, { useState } from 'react';
import BasicPopup from './BasicPopup';

const BasicTable = ({ tableData }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (cardId, status) => {
    console.log(`Status changed for card ${cardId} to ${status}`);
    // You can add API call here to update status if needed
  };

  return (
    <div className='mt-4'>
      <table className="min-w-full border border-gray-200">
        <thead className="">
          <tr className="text-sm font-medium">
            <th className="px-6 py-3 text-left">ID</th>
            <th className="px-6 py-3 text-left">Department</th>
            <th className="px-6 py-3 text-left">Designation</th>
            <th className="px-6 py-3 text-left">Phone</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Contact For</th>
            <th className="px-6 py-3 text-left">Alt. Contact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tableData.map((item, index) => (
            <tr key={index} className="text-sm">
              <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button 
                  onClick={() => handleClick(item)} 
                  className={`px-3 py-1 rounded ${
                    item.designation.toLowerCase().includes('manager') 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : item.designation.toLowerCase().includes('developer')
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {item.designation}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.contactFor}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.alternativeContact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BasicPopup
        selectedItem={selectedItem}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default BasicTable;