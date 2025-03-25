import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AddCustomer from "../components/AddCustomer";

const AddCustomerPages = () => {
  const location = useLocation();
  const { customer = {} } = location.state || {};

  const [customers, setCustomers] = useState([]);

  // Function to fetch customers from local storage
  const fetchAllCustomers = () => {
    const storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomers(storedCustomers);
  };

  // Fetch customers when the component mounts
  useEffect(() => {
    fetchAllCustomers();
  }, []);


  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-lg p-6 border border-gray-700 h-full flex md:flex-row flex-col gap-4 justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <AddCustomer existingData={customer || {}} fetchAllCustomers={fetchAllCustomers} />

    </motion.div>
  );
};

export default AddCustomerPages;
