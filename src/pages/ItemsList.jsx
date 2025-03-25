import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, Search, SquarePen, PlusCircle  } from "lucide-react";
import { useNavigate, useLocation  } from "react-router-dom";


const ItemsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem("items")) || [];
        setItems(storedItems);
        setFilteredItems(storedItems);
      }, []);

    const handleCreateItem = () => {
        navigate("/createItem");
      };

      const handleEdit = (item) => {
        navigate("/createItem", { state: { editingItem: item } });
      };
      
    
      const handleDelete = (itemCode) => {
        const updatedItems = items.filter((item) => item.itemCode !== itemCode);
        setItems(updatedItems);
        setFilteredItems(updatedItems);
        localStorage.setItem("items", JSON.stringify(updatedItems));
      };  

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = items.filter(
          (item) =>
            item.itemName.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term)
        );
        setFilteredItems(filtered);
      };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Items List</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateItem}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Item</span>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Products"
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>
  
      {filteredItems.length === 0 ? (
        <p className="text-gray-400 text-center">No items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Item Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Supplier Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.itemCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    {item.image && (
                      <img
                        className="h-10 w-10 rounded-full object-cover mr-4"
                        src={item.image}
                        alt={item.itemName}
                      />
                    )}
                    <span className="text-sm font-medium text-white">{item.itemName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.type || (item.isService ? "Service" : "Product")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item.salesPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.supplierRef}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300 mr-2">
                      <SquarePen className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(item.itemCode)}  className="text-red-400 hover:text-red-300">
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ItemsList;