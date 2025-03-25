import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";



const EnquiryForm = () => {
  const [enquiry, setEnquiry] = useState({
    name: "",
    emailId: "",
    phoneNumber: "",
    companyName: "",
    subject: "",
    description: "",
    details: "",
  });

  const handleChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enquiry Submitted:", enquiry);
    toast.success("Enquiry submitted successfully!");

    // Reset form after submission
    setEnquiry({
      name: "",
      emailId: "",
      phoneNumber: "",
      companyName: "",
      subject: "",
      description: "",
      details: "",
    });
  };


  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-blue-300">
        Enquiry Form
      </h2>

      <div className="flex flex-col md:flex-row gap-6">

        <div className="bg-gray-900 p-6 rounded-lg w-full shadow-md">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Row 1: Item Code & Item Name */}
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="w-full md:w-1/2">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={enquiry.name}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="w-full md:w-1/2">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="emailId"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={enquiry.emailId}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Row 2: Product & Supplier Ref */}
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="w-full md:w-1/2">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="phoneNumber"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={enquiry.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="w-full md:w-1/2">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="companyName"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={enquiry.companyName}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Row 3: Sales Price & Margin */}
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="w-full md:w-1/2">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="subject"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={enquiry.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="w-full md:w-1/2">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={enquiry.description}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            {/* Details */}
            <div className="w-full">
              <label htmlFor="details" className="block text-sm font-medium text-gray-300">
                Details
              </label>
              <textarea
                id="details"
                name="details"
                value={enquiry.details}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md flex items-center justify-center"
            >
              Submit Enquiry
            </button>
          </form>
        </div>


      </div>
    </motion.div>
  );
};

export default EnquiryForm;
