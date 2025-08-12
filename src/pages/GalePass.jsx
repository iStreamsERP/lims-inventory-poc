import React, { useState } from 'react';

const GalePass = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [importedData, setImportedData] = useState([]);

  // Sample data for the popup table
  const demandData = [
    { id: 1, sri: '001', internalDemand: 'DEM-2023-001', custCode: 'CUST001', itemName: 'Steel Pipe', itemCode: 'ITM001', handover: 'John Doe' },
    { id: 2, sri: '002', internalDemand: 'DEM-2023-002', custCode: 'CUST002', itemName: 'Copper Wire', itemCode: 'ITM002', handover: 'Jane Smith' },
    { id: 3, sri: '003', internalDemand: 'DEM-2023-003', custCode: 'CUST003', itemName: 'Aluminum Sheet', itemCode: 'ITM003', handover: 'Mike Johnson' },
    { id: 4, sri: '004', internalDemand: 'DEM-2023-004', custCode: 'CUST004', itemName: 'PVC Pipe', itemCode: 'ITM004', handover: 'Sarah Williams' },
  ];

  // Sample data for StockDelivery table
  const stockDeliveryData = [
    { 
      id: 1,
      date: '1',
      stockDeliveryKey: 'OCRIT-2:HALL',
      quick: '4000',
      dimitrio: '100,000',
      insurfices: '6.9,000.5',
      market: '1',
      oyCamed: '1',
      collectorKey: '-',
      playlistKey: '-',
      sourceCode: '<',
      internalDemand: 'DEM-2023-001' // Added to match with demand data
    },
    { 
      id: 2,
      date: '2',
      stockDeliveryKey: 'OCRIT-COLTO2013',
      quick: '4000',
      dimitrio: '100,000',
      insurfices: '8.9,000.5',
      market: '4',
      oyCamed: '1',
      collectorKey: '-',
      playlistKey: '-',
      sourceCode: '<',
      internalDemand: 'DEM-2023-002' // Added to match with demand data
    },
    { 
      id: 3,
      date: '3',
      stockDeliveryKey: 'OCRIT-COLTO2014',
      quick: '5000',
      dimitrio: '200,000',
      insurfices: '9.9,000.5',
      market: '5',
      oyCamed: '2',
      collectorKey: '-',
      playlistKey: '-',
      sourceCode: '<',
      internalDemand: 'DEM-2023-003' // Added to match with demand data
    }
  ];

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleImport = () => {
    // Get the internal demand numbers of selected rows
    const selectedDemandNumbers = demandData
      .filter(item => selectedRows.includes(item.id))
      .map(item => item.internalDemand);
    
    // Filter stock delivery data based on matching internal demand numbers
    const imported = stockDeliveryData.filter(item => 
      selectedDemandNumbers.includes(item.internalDemand)
    );
    
    setImportedData(imported);
    setShowPopup(false);
    setSelectedRows([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">GalePass</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Getty Images</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="mb-2">
              <span className="font-medium">Auto Ref</span>
              <div className="ml-4">Auto Ref</div>
            </div>
            <div className="mb-2">
              <span className="font-medium">Temporary No</span>
              <div className="ml-4">Temporary No</div>
            </div>
            <div className="mb-2">
              <span className="font-medium">Full Name</span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-medium">Auto Pay No</span>
              <div className="ml-4">SIG On STOP GETTING</div>
            </div>
            <div className="mb-2">
              <span className="font-medium">The Appended</span>
              <div className="ml-4">SIG ON STOP GETTING</div>
            </div>
            <div className="mb-2">
              <span className="font-medium">Dimitrios Gas Out</span>
            </div>
            <div className="mb-2">
              <span className="font-medium">O'Donnell's</span>
              <div className="ml-4">O's Partners</div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Event Name</h2>
        <div className="mb-4">
          <div className="mb-2">
            <span className="font-medium">Export Name</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Dimensions</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Destination</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Name By Name</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="mb-2">
              <span className="font-medium">Appended by</span>
              <div className="ml-4">Share</div>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-medium">Buy (X)</span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Share Code</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">StockDelivery ID</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Stock Delivery Key</th>
                <th className="border px-4 py-2">Quick</th>
                <th className="border px-4 py-2">Dimitrio</th>
                <th className="border px-4 py-2">Insurfices</th>
                <th className="border px-4 py-2">Market</th>
                <th className="border px-4 py-2">O'y Camed</th>
                <th className="border px-4 py-2">Collector/Key</th>
                <th className="border px-4 py-2">Playlist/Key</th>
                <th className="border px-4 py-2">Source Code</th>
              </tr>
            </thead>
            <tbody>
              {stockDeliveryData.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.date}</td>
                  <td className="border px-4 py-2">{item.stockDeliveryKey}</td>
                  <td className="border px-4 py-2">{item.quick}</td>
                  <td className="border px-4 py-2">{item.dimitrio}</td>
                  <td className="border px-4 py-2">{item.insurfices}</td>
                  <td className="border px-4 py-2">{item.market}</td>
                  <td className="border px-4 py-2">{item.oyCamed}</td>
                  <td className="border px-4 py-2">{item.collectorKey}</td>
                  <td className="border px-4 py-2">{item.playlistKey}</td>
                  <td className="border px-4 py-2">{item.sourceCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => setShowPopup(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search Demand
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Year of Terms Concerning all GalePass</h3>
        <p>Source in stockbuy</p>
      </div>

      {/* Popup for Search Demand */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">Demand Data</h2>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Select</th>
                    <th className="border px-4 py-2">SRI</th>
                    <th className="border px-4 py-2">Internal Demand</th>
                    <th className="border px-4 py-2">Cust Code</th>
                    <th className="border px-4 py-2">Item Name</th>
                    <th className="border px-4 py-2">Item Code</th>
                    <th className="border px-4 py-2">Handover</th>
                  </tr>
                </thead>
                <tbody>
                  {demandData.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="border px-4 py-2">{item.sri}</td>
                      <td className="border px-4 py-2">{item.internalDemand}</td>
                      <td className="border px-4 py-2">{item.custCode}</td>
                      <td className="border px-4 py-2">{item.itemName}</td>
                      <td className="border px-4 py-2">{item.itemCode}</td>
                      <td className="border px-4 py-2">{item.handover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selectedRows.length === 0}
                className={`px-4 py-2 rounded ${selectedRows.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display imported data */}
      {importedData.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Imported Stock Delivery Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Stock Delivery Key</th>
                  <th className="border px-4 py-2">Quick</th>
                  <th className="border px-4 py-2">Dimitrio</th>
                  <th className="border px-4 py-2">Insurfices</th>
                  <th className="border px-4 py-2">Market</th>
                  <th className="border px-4 py-2">O'y Camed</th>
                  <th className="border px-4 py-2">Collector/Key</th>
                  <th className="border px-4 py-2">Playlist/Key</th>
                  <th className="border px-4 py-2">Source Code</th>
                </tr>
              </thead>
              <tbody>
                {importedData.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">{item.stockDeliveryKey}</td>
                    <td className="border px-4 py-2">{item.quick}</td>
                    <td className="border px-4 py-2">{item.dimitrio}</td>
                    <td className="border px-4 py-2">{item.insurfices}</td>
                    <td className="border px-4 py-2">{item.market}</td>
                    <td className="border px-4 py-2">{item.oyCamed}</td>
                    <td className="border px-4 py-2">{item.collectorKey}</td>
                    <td className="border px-4 py-2">{item.playlistKey}</td>
                    <td className="border px-4 py-2">{item.sourceCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalePass;