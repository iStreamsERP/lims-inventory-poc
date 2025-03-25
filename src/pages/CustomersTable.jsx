import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Trash2, Plus, X} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";


const CustomersTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    // Fetch customers from local storage
    const storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    setFilteredCustomers(storedCustomers);
  }, []);

  const fetchAllCustomers = () => {
    const storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    setFilteredCustomers(storedCustomers);
  };
  
  // Call it inside useEffect to load customers when the component mounts
  useEffect(() => {
    fetchAllCustomers();
  }, []);
  

  const openDeleteModal = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCustomerToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    // Fetch customers from local storage and filter based on search term
    const storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const filtered = storedCustomers.filter(customer =>
      customer.CLIENT_NAME.toLowerCase().includes(value) ||
      customer.EMAIL_ADDRESS.toLowerCase().includes(value) ||
      customer.NATURE_OF_BUSINESS.toLowerCase().includes(value) ||
      customer.COUNTRY.toLowerCase().includes(value) ||
      customer.CITY_NAME.toLowerCase().includes(value)
    );
  
    setFilteredCustomers(filtered);
  };

  const handleEdit = (customer) => {
    // Navigate to the add customer form with state (preloaded customer data)
    navigate("/pages", { state: { customer } });
  };

  const handleDelete = () => {
    if (!customerToDelete) return;
  
    // Get customers from local storage
    let storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
  
    // Remove the selected customer
    storedCustomers = storedCustomers.filter(customer => customer.CLIENT_ID !== customerToDelete.CLIENT_ID);
  
    // Save updated customers back to local storage
    localStorage.setItem("customers", JSON.stringify(storedCustomers));
  
    // Update state
    setFilteredCustomers(storedCustomers);
    
    toast.success("Customer deleted successfully!");
    
    closeDeleteModal();
  };

  

  

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Customers</h2>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => navigate("/pages")}
          >
            <Plus size={18} /> Add Customer
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nature of Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredCustomers.map((customer, index) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {1001 + index}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {customer.CLIENT_NAME}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {customer.EMAIL_ADDRESS}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {customer.NATURE_OF_BUSINESS}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {customer.TELEPHONE_NO}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {customer.COUNTRY}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {customer.CITY_NAME}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEdit(customer)}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => openDeleteModal(customer)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Customer Modal */}
      {isDeleteModalOpen && (
        <Dialog
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
           </button>
            <DialogTitle className="text-lg font-semibold text-gray-700 mb-4">
              Confirm Deletion
            </DialogTitle>
            <p className="text-gray-600">
              Are you sure you want to delete {customerToDelete?.CLIENT_NAME}?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      )}
    </motion.div>
  );
};

export default CustomersTable;
