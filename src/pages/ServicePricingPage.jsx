import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trash2, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicePricingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialServices = location.state?.services || JSON.parse(localStorage.getItem("services")) || [];
  const [services, setServices] = useState(initialServices);

  // Update localStorage whenever services change
  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const handleEdit = (product) => {
    navigate("/create-service", { state: { product } });
  };

  // Function to delete a service
  const handleDelete = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Service Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {services.length > 0 ? (
          services.map((service, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-between min-h-[480px] w-full max-w-[350px] mx-auto">
              <div>
                <h3 className="text-2xl font-bold text-blue-300 mb-3">{service.itemName}</h3>
                <p className="text-gray-400 text-sm mb-2">Code: <span className="text-white">{service.itemCode}</span></p>
                <p className="text-gray-400 text-sm mb-2">Supplier: <span className="text-white">{service.supplierRef}</span></p>
                <p className="text-gray-400 text-sm mb-2">Category: <span className="text-white">{service.category}</span></p>
              </div>

              <div className="mt-4">
                <p className="text-xl font-semibold text-green-400">Price: ₹{service.salesPrice}</p>
                <p className="text-gray-400">Margin: {service.marginPercentage}%</p>
              </div>

              {/* Features List - Displaying One by One */}
              <div className="mt-4">
                <p className="text-gray-300 text-sm mb-2">Features:</p>
                <ul className="list-disc list-inside space-y-1 text-white text-sm">
                  {service.features
                    ? service.features.split(",").map((feature, i) => (
                      <li key={i} className="text-gray-300">{feature.trim()}</li>
                    ))
                    : <li className="text-gray-400">No additional features listed</li>}
                </ul>
              </div>

              <div className="mt-6 flex items-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex-1 text-center mr-2">
                  Select Plan
                </button>
                <button onClick={() => handleEdit(service)} className="text-blue-400 hover:text-blue-300">
                  <SquarePen className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="ml-3 text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No services available.</p>
        )}
      </div>
    </div>
  );
};

export default ServicePricingPage;
