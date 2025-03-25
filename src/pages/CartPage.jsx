import { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = storedCart.map((item) => ({
      ...item,
      qty: item.qty || 1, // Ensure qty is at least 1
      totalPrice: (item.qty || 1) * item.salesPrice, // Ensure total price is correct
    }));
    setCart(updatedCart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };
  const handleIncreaseQty = (index) => {
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, qty: item.qty + 1, totalPrice: (item.qty + 1) * item.salesPrice } : item
    );
    updateCart(updatedCart);
  };

  const handleDecreaseQty = (index) => {
    const updatedCart = cart.map((item, i) =>
      i === index && item.qty > 1
        ? { ...item, qty: item.qty - 1, totalPrice: (item.qty - 1) * item.salesPrice }
        : item
    );
    updateCart(updatedCart);
  };
  const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

  const proceedToCheckout = () => {
    navigate("/checkout", { state: { cart, totalPrice } });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-blue-300 mb-4">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-3">
              <div className="flex items-center gap-4">
                {item.image && <img src={item.image} alt={item.itemName} className="w-16 h-16 object-cover rounded-md" />}
                <div>
                  <p className="text-white font-semibold">{item.itemName}</p>
                  <p className="text-emerald-400 font-bold">₹{item.salesPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecreaseQty(index)}
                  disabled={item.qty === 1}
                  className={`p-2 rounded-md ${item.qty === 1 ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"} text-white`}
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-semibold">{item.qty}</span>
                <button
                  onClick={() => handleIncreaseQty(index)}
                  className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <Plus size={16} />
                </button>
                <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
              {/* <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-500">
                <Trash2 size={20} />
              </button> */}
            </div>
          ))}

          <div className="mt-5 flex justify-between items-center text-white font-semibold">
            <p>Total Price:</p>
            <p className="text-emerald-400 text-xl">₹{totalPrice.toFixed(2)}</p>
          </div>

          <button
            onClick={clearCart}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Clear Cart
          </button>

          <button
            onClick={proceedToCheckout}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
