import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { callSoapService } from '@/api/callSoapService';

const BasicPopup = ({ 
  selectedItem, 
  isOpen, 
  onOpenChange,
  onStatusChange 
}) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [additionalDropdownValues, setAdditionalDropdownValues] = useState({});
  const [cardData, setCardData] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [loading, setLoading] = useState({
    cardData: false,
    dropdownOptions: false,
    saving: false
  });
  const [error, setError] = useState({
    cardData: null,
    dropdownOptions: null,
    saving: null
  });

  // Fetch main card data
  const fetchCardData = async (params) => {
    if (!params) return;
    
    setLoading(prev => ({...prev, cardData: true}));
    setError(prev => ({...prev, cardData: null}));
    try {
      const response = await callSoapService(
        'your-service-endpoint',
        'GetCardData', 
        {
          dept: params.department,
          designation: params.designation,
          email: params.email
        }
      );
      
      const transformedData = response.map(item => ({
        id: item.id,
        dateTimeOBD: item.obdDate || 'N/A',
        shNo: item.shNumber || 'N/A',
        demandNo: item.demandNumber || 'N/A',
        price: `$${item.price?.toFixed(2) || '0.00'}`,
        unitPrice: `$${item.unitPrice?.toFixed(2) || '0.00'}`,
        statusOptions: item.statusOptions || ['Pending', 'Approved', 'Rejected']
      }));
      
      setCardData(transformedData);
    } catch (err) {
      setError(prev => ({...prev, cardData: 'Failed to fetch card data'}));
      console.error('API Error:', err);
      setCardData([]);
    } finally {
      setLoading(prev => ({...prev, cardData: false}));
    }
  };

  // Fetch additional dropdown options
  const fetchDropdownOptions = async () => {
    setLoading(prev => ({...prev, dropdownOptions: true}));
    setError(prev => ({...prev, dropdownOptions: null}));
    try {
      const response = await callSoapService(
        'your-service-endpoint',
        'GetDropdownOptions',
        { context: 'additional_options' }
      );
      
      setDropdownOptions(response.map(option => ({
        value: option.id,
        label: option.name
      })));
    } catch (err) {
      setError(prev => ({...prev, dropdownOptions: 'Failed to fetch dropdown options'}));
      console.error('Dropdown API Error:', err);
      setDropdownOptions([]);
    } finally {
      setLoading(prev => ({...prev, dropdownOptions: false}));
    }
  };

  // Save all changes
  const handleSave = async () => {
    setLoading(prev => ({...prev, saving: true}));
    setError(prev => ({...prev, saving: null}));
    try {
      const savePayload = {
        userId: selectedItem.id,
        statusUpdates: Object.entries(selectedValues).map(([cardId, status]) => ({
          cardId,
          status
        })),
        additionalOptions: Object.entries(additionalDropdownValues).map(([cardId, option]) => ({
          cardId,
          option
        }))
      };

      const saveResponse = await callSoapService(
        'your-service-endpoint',
        'SaveAllChanges',
        savePayload
      );

      console.log('Save successful:', saveResponse);
      // Optionally close the popup after successful save
      // onOpenChange(false);
    } catch (err) {
      setError(prev => ({...prev, saving: 'Failed to save changes'}));
      console.error('Save Error:', err);
    } finally {
      setLoading(prev => ({...prev, saving: false}));
    }
  };

  const handleSelectChange = (cardId, value) => {
    setSelectedValues(prev => ({
      ...prev,
      [cardId]: value
    }));
    onStatusChange?.(cardId, value);
  };

  const handleAdditionalDropdownChange = (cardId, value) => {
    setAdditionalDropdownValues(prev => ({
      ...prev,
      [cardId]: value
    }));
  };

  useEffect(() => {
    if (isOpen && selectedItem) {
      fetchCardData({
        department: selectedItem.department,
        designation: selectedItem.designation,
        email: selectedItem.email
      });
      fetchDropdownOptions();
    } else {
      setCardData([]);
      setSelectedValues({});
      setAdditionalDropdownValues({});
    }
  }, [isOpen, selectedItem]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="z-[99] h-[80%] overflow-y-auto p-4 sm:max-h-[90%] sm:max-w-[70%]">
        <DialogHeader>
          <DialogTitle>
            {selectedItem?.designation} Details
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Department: {selectedItem?.department} | Email: {selectedItem?.email}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        {loading.cardData ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error.cardData ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">{error.cardData}</div>
        ) : (
          <div className="space-y-4">
            {cardData.map((card) => (
              <div key={card.id} className="w-full rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date Time OBD</p>
                    <p className="text-sm font-medium">{card.dateTimeOBD}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">SH No</p>
                    <p className="text-sm font-medium">{card.shNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Demand No</p>
                    <p className="text-sm font-medium">{card.demandNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-sm font-medium">{card.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Unit Price</p>
                    <p className="text-sm font-medium">{card.unitPrice}</p>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="col-span-2 mt-2">
                    <Select 
                      value={selectedValues[card.id] || ''}
                      onValueChange={(value) => handleSelectChange(card.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {card.statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Additional Dropdown */}
                  <div className="col-span-2 mt-2">
                    <Select
                      value={additionalDropdownValues[card.id] || ''}
                      onValueChange={(value) => handleAdditionalDropdownChange(card.id, value)}
                      disabled={loading.dropdownOptions || dropdownOptions.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          loading.dropdownOptions ? "Loading options..." : 
                          dropdownOptions.length === 0 ? "No options available" : "Select option"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error.dropdownOptions && (
                      <p className="text-xs text-red-500 mt-1">{error.dropdownOptions}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Save Button in Footer */}
        <DialogFooter>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading.saving || loading.cardData}
            >
              {loading.saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </div>
          {error.saving && (
            <div className="text-red-500 p-2 bg-red-50 rounded mt-2">
              {error.saving}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BasicPopup;

// import { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { callSoapService } from '@/api/callSoapService';

// const BasicPopup = ({ 
//   selectedItem, 
//   isOpen, 
//   onOpenChange,
//   onStatusChange 
// }) => {
//   const [selectedValues, setSelectedValues] = useState({});
//   const [cardData, setCardData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchCardData = async (params) => {
//     if (!params) return;
    
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await callSoapService(
//         'your-service-endpoint',
//         'GetCardData', 
//         {
//           dept: params.department,
//           designation: params.designation,
//           email: params.email
//         }
//       );
      
//       const transformedData = response.map(item => ({
//         id: item.id,
//         dateTimeOBD: item.obdDate || 'N/A',
//         shNo: item.shNumber || 'N/A',
//         demandNo: item.demandNumber || 'N/A',
//         price: `$${item.price?.toFixed(2) || '0.00'}`,
//         unitPrice: `$${item.unitPrice?.toFixed(2) || '0.00'}`,
//         statusOptions: item.statusOptions || ['Pending', 'Approved', 'Rejected']
//       }));
      
//       setCardData(transformedData);
//     } catch (err) {
//       setError('Failed to fetch card data');
//       console.error('API Error:', err);
//       setCardData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectChange = (cardId, value) => {
//     setSelectedValues(prev => ({
//       ...prev,
//       [cardId]: value
//     }));
//     onStatusChange?.(cardId, value);
//   };

//   useEffect(() => {
//     if (isOpen && selectedItem) {
//       fetchCardData({
//         department: selectedItem.department,
//         designation: selectedItem.designation,
//         email: selectedItem.email
//       });
//     } else {
//       setCardData([]);
//       setSelectedValues({});
//     }
//   }, [isOpen, selectedItem]);

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="z-[99] h-[80%] overflow-y-auto p-4 sm:max-h-[90%] sm:max-w-[70%]">
//         <DialogHeader>
//           <DialogTitle>
//             {selectedItem?.designation} Details
//             <span className="block text-sm font-normal text-gray-500 mt-1">
//               Department: {selectedItem?.department} | Email: {selectedItem?.email}
//             </span>
//           </DialogTitle>
//         </DialogHeader>
        
//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
//         ) : (
//           <div className="space-y-4">
//             {cardData.map((card) => (
//               <div key={card.id} className="w-full rounded-lg border border-gray-200 p-4 shadow-sm">
//                 <div className="grid grid-cols-4 gap-4">
//                   <div>
//                     <p className="text-xs text-gray-500">Date Time OBD</p>
//                     <p className="text-sm font-medium">{card.dateTimeOBD}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">SH No</p>
//                     <p className="text-sm font-medium">{card.shNo}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Demand No</p>
//                     <p className="text-sm font-medium">{card.demandNo}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Price</p>
//                     <p className="text-sm font-medium">{card.price}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Unit Price</p>
//                     <p className="text-sm font-medium">{card.unitPrice}</p>
//                   </div>
                  
//                   <div className="col-span-4 mt-2">
//                     <Select 
//                       value={selectedValues[card.id] || ''}
//                       onValueChange={(value) => handleSelectChange(card.id, value)}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {card.statusOptions.map((option) => (
//                           <SelectItem key={option} value={option}>
//                             {option}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BasicPopup;