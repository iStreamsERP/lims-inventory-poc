import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Eye, Trash2, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";

const AddCustomer = ({ existingData = {}, fetchAllCustomers }) => {
  const location = useLocation();
  const { customer = {} } = location.state || {}; // Get customer data


  const natureOfBusinesss = [
    "software",
    "hardware",
    "electronics",
    "retail",
    "wholesale",
    "manufacturing",
  ];
  const countries = ["India", "USA", "UK", "Canada"];

  const [newCustomer, setNewCustomer] = useState({
    CLIENT_ID: "",
    CLIENT_NAME: "",
    EMAIL_ADDRESS: "",
    NATURE_OF_BUSINESS: "",
    TRN_VAT_NO: "",
    COUNTRY: "",
    TELEPHONE_NO: "",
    CITY_NAME: "",
    GROUP_NAME: "",
    WEB_ADDRESS: "",
    COMMUNICATION_ADDRESS: "",
    INVOICE_ADDRESS: "",
    DELIVERY_ADDRESS: "",
    CLIENT_CONTACTS: [],
  });

  useEffect(() => {
    if (existingData && JSON.stringify(existingData) !== JSON.stringify(newCustomer)) {
      setNewCustomer(existingData);
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newContact, setNewContact] = useState({
    CLIENT_ID: "",
    SERIAL_NO: "",
    NAME: "",
    DESIGNATION: "",
    EMAIL_ADDRESS: "",
    MOBILE_NO: "",
    TELEPHONE_NO: "",
    ADDRESS: "",
    CONTACT_FOR: "",
    ALTERNATIVE_CONTACT: "",
  });




  const openModal = (contact = null, index = null) => {
    if (contact) {
      setNewContact(contact);
      setEditIndex(index);
    } else {
      setNewContact({ CLIENT_ID: "", SERIAL_NO: "", NAME: "", DESIGNATION: "", EMAIL_ADDRESS: "", MOBILE_NO: "", TELEPHONE_NO: "", ADDRESS: "", CONTACT_FOR: "", ALTERNATIVE_CONTACT: "" });
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setNewContact({ CLIENT_ID: "", SERIAL_NO: "", NAME: "", DESIGNATION: "", EMAIL_ADDRESS: "", MOBILE_NO: "", TELEPHONE_NO: "", ADDRESS: "", CONTACT_FOR: "", ALTERNATIVE_CONTACT: "" });
    setEditIndex(null);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  const saveContact = () => {
    if (editIndex !== null) {
      // Update existing contact
      const updatedContacts = [...newCustomer.CLIENT_CONTACTS || []];
      updatedContacts[editIndex] = newContact;
      setNewCustomer((prevData) => ({
        ...prevData,
        CLIENT_CONTACTS: updatedContacts,
      }));
      toast.success("Contact updated successfully!");
    } else {
      // Add new contact
      setNewCustomer((prevData) => ({
        ...prevData,
        CLIENT_CONTACTS: [...(prevData.CLIENT_CONTACTS || []), newContact],
      }));
      toast.success("Contact added successfully!");
    }
    closeModal();
  };

  const deleteContact = (index) => {
    setNewCustomer((prevData) => ({
      ...prevData,
      CLIENT_CONTACTS: prevData.CLIENT_CONTACTS.filter((_, i) => i !== index),
    }));
    toast.success("Contact deleted successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    try {
      // Clone the newCustomer object excluding non-serializable properties
      const cleanCustomer = {
        CLIENT_ID: newCustomer.CLIENT_ID || "",
        CLIENT_NAME: newCustomer.CLIENT_NAME || "",
        EMAIL_ADDRESS: newCustomer.EMAIL_ADDRESS || "",
        NATURE_OF_BUSINESS: newCustomer.NATURE_OF_BUSINESS || "",
        TRN_VAT_NO: newCustomer.TRN_VAT_NO || "",
        COUNTRY: newCustomer.COUNTRY || "",
        TELEPHONE_NO: newCustomer.TELEPHONE_NO || "",
        CITY_NAME: newCustomer.CITY_NAME || "",
        GROUP_NAME: newCustomer.GROUP_NAME || "",
        WEB_ADDRESS: newCustomer.WEB_ADDRESS || "",
        COMMUNICATION_ADDRESS: newCustomer.COMMUNICATION_ADDRESS || "",
        INVOICE_ADDRESS: newCustomer.INVOICE_ADDRESS || "",
        DELIVERY_ADDRESS: newCustomer.DELIVERY_ADDRESS || "",
        CLIENT_CONTACTS: (newCustomer.CLIENT_CONTACTS || []).map(contact => ({
          CLIENT_ID: contact.CLIENT_ID || "",
          SERIAL_NO: contact.SERIAL_NO || "",
          NAME: contact.NAME || "",
          DESIGNATION: contact.DESIGNATION || "",
          EMAIL_ADDRESS: contact.EMAIL_ADDRESS || "",
          MOBILE_NO: contact.MOBILE_NO || "",
          TELEPHONE_NO: contact.TELEPHONE_NO || "",
          ADDRESS: contact.ADDRESS || "",
          CONTACT_FOR: contact.CONTACT_FOR || "",
          ALTERNATIVE_CONTACT: contact.ALTERNATIVE_CONTACT || "",
        }))
      };

      console.log("NewCustomer (Before Saving):", JSON.parse(JSON.stringify(cleanCustomer)));

      // Fetch existing customers from local storage
      const existingCustomers = JSON.parse(localStorage.getItem("customers")) || [];

      // Check if the customer already exists
      const customerIndex = existingCustomers.findIndex(c => c.CLIENT_ID === cleanCustomer.CLIENT_ID);

      if (customerIndex > -1) {
        // Update the existing customer
        existingCustomers[customerIndex] = cleanCustomer;
      } else {
        // Add new customer to the list
        existingCustomers.push(cleanCustomer);
      }

      // Save updated customers list to local storage
      localStorage.setItem("customers", JSON.stringify(existingCustomers));

      // Refresh customers list
      if (typeof fetchAllCustomers === "function") {
        fetchAllCustomers();
      }

      // Show success notification
      toast.success("Customer saved successfully!");

      // Reset the form state
      setNewCustomer({
        CLIENT_ID: "",
        CLIENT_NAME: "",
        EMAIL_ADDRESS: "",
        NATURE_OF_BUSINESS: "",
        TRN_VAT_NO: "",
        COUNTRY: "",
        TELEPHONE_NO: "",
        CITY_NAME: "",
        GROUP_NAME: "",
        WEB_ADDRESS: "",
        COMMUNICATION_ADDRESS: "",
        INVOICE_ADDRESS: "",
        DELIVERY_ADDRESS: "",
        CLIENT_CONTACTS: [],
      });

    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Error saving customer");
    }
  };

  return (
    <div className="flex gap-5 h-full w-full">
      <div className="flex flex-col md:flex-row gap-4 p-4">

        {/* Left Side - Add Customer Form */}
        <div className="basis-3/4 flex flex-col justify-between p-4 rounded-lg border border-gray-700 ">
          <h3 className="text-4xl font-bold mb-4 text-white ">
            {existingData ? "Edit Customer" : "Add Customer"}
          </h3>
          <form
            className="flex flex-col justify-between h-full gap-2"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-wrap gap-4 overflow-y-auto p-2">

              {/* Row 1 */}
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-white"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="CLIENT_NAME"
                    placeholder="Enter company name"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.CLIENT_NAME || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="EMAIL_ADDRESS"
                    placeholder="Enter email"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.EMAIL_ADDRESS || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Nature of Business
                  </label>
                  <select
                    name="NATURE_OF_BUSINESS"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.NATURE_OF_BUSINESS || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Business</option>
                    {natureOfBusinesss.map((business) => (
                      <option key={business} value={business}>
                        {business}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    VAT/GST/TAX No
                  </label>
                  <input
                    type="text"
                    name="TRN_VAT_NO"
                    placeholder="Enter tax number"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.TRN_VAT_NO || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Group of
                  </label>
                  <input
                    type="text"
                    name="GROUP_NAME"
                    placeholder="Enter group name"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.GROUP_NAME || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="TELEPHONE_NO"
                    placeholder="Enter phone number"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.TELEPHONE_NO || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    City
                  </label>
                  <input
                    type="text"
                    name="CITY_NAME"
                    placeholder="Enter city"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.CITY_NAME || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Country
                  </label>
                  <select
                    name="COUNTRY"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300 "
                    required
                    value={newCustomer.COUNTRY || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Website
                  </label>
                  <input
                    type="url"
                    name="WEB_ADDRESS"
                    placeholder="Enter website"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    value={newCustomer.WEB_ADDRESS || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Communication Address
                  </label>
                  <textarea
                    name="COMMUNICATION_ADDRESS"
                    placeholder="Enter communication address"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    value={newCustomer.COMMUNICATION_ADDRESS || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Invoice Address
                  </label>
                  <textarea
                    name="INVOICE_ADDRESS"
                    placeholder="Enter invoice address"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.INVOICE_ADDRESS || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-white">
                    Delivery Address
                  </label>
                  <textarea
                    name="DELIVERY_ADDRESS"
                    placeholder="Enter delivery address"
                    className="w-full mt-1 p-2 border rounded-md text-black bg-gray-300"
                    required
                    value={newCustomer.DELIVERY_ADDRESS || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="w-full sm:w-1/2 px-6 py-2 bg-blue-600 text-white mx-auto rounded-md hover:bg-blue-700"
              >
                {Object.keys(existingData).length > 0 ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Contact Section */}
        <div className="basis-1/4  flex flex-col justify-between p-4 rounded-lg border border-gray-700 ">
          <h3 className="text-4xl font-bold mb-4 text-white">Add Contacts</h3>
          <div className="overflow-y-auto space-y-2 h-full">
            {(newCustomer.CLIENT_CONTACTS || []).length === 0 ? (
              <p className="text-slate-100 text-center">
                No contacts found, click 'Add Contact' to add a new one.
              </p>
            ) : (
              newCustomer.CLIENT_CONTACTS.map((contact, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-md mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">{contact.NAME}</p>
                    <p className="text-gray-300 text-sm">{contact.DESIGNATION}</p>
                    <p className="text-gray-400 text-sm">{contact.EMAIL_ADDRESS}</p>
                    <p className="text-gray-400 text-sm">{contact.MOBILE_NO}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(contact, index)}
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => deleteContact(index)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 w-full px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Contact <UserPlus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur"
      >
        <DialogPanel className="bg-gray-800 e p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-white hover:text-gray-700"
          >
            <X size={20} />
          </button>
          <DialogTitle className="text-lg font-semibold text-white mb-4">
            Add Contact
          </DialogTitle>

          <div className="w-full space-y-4">
            <input
              type="text"
              name="NAME"
              placeholder="Name"
              value={newContact.NAME || ""}
              onChange={handleContactChange}
              className="p-2 border rounded-md w-full text-gray-500"
            />
            <input
              type="text"
              name="DESIGNATION"
              placeholder="Designation"
              value={newContact.DESIGNATION || ""}
              onChange={handleContactChange}
              className="p-2 border rounded-md w-full text-gray-500"
            />
            <select
              name="CONTACT_FOR"
              className="p-2 border rounded-md w-full text-gray-500"
              value={newContact.CONTACT_FOR || ""}
              onChange={handleContactChange}
              id=""
            >
              <option value=""> Contact for</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
              <option value="Transportation">Transportation</option>
              <option value="Stock Enquiry">Stock Enquiry</option>
            </select>
            <input
              type="email"
              name="EMAIL_ADDRESS"
              placeholder="Email"
              value={newContact.EMAIL_ADDRESS || ""}
              onChange={handleContactChange}
              className="p-2 border rounded-md w-full text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 mt-4 gap-4">
            <input
              type="tel"
              name="MOBILE_NO"
              placeholder="Mobile Number"
              value={newContact.MOBILE_NO || ""}
              onChange={handleContactChange}
              className="p-2 border rounded-md w-full mb-2 text-gray-500"
            />
            <input
              type="tel"
              name="ALTERNATIVE_CONTACT"
              placeholder="Alternative Number"
              className="p-2 border rounded-md w-full mb-2 text-gray-500"
              value={newContact.ALTERNATIVE_CONTACT || ""}
              onChange={handleContactChange}
            />
          </div>
          <button
            onClick={saveContact}
            className="bg-blue-500 text-white p-2 rounded-md w-full mt-4"
          >
            Save
          </button>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default AddCustomer;
