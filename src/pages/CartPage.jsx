import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sony PlayStation 5 Pro",
      category: "PlayStation consoles",
      price: 499.99,
      quantity: 1,
      image:
        "https://t3.ftcdn.net/jpg/04/83/25/50/360_F_483255019_m1r1ujM8EOkr8PamCHF85tQ0rHG3Fiqz.jpg",
    },
    {
      id: 2,
      name: "Sony PlayStation 5 Pro",
      category: "PlayStation consoles",
      price: 499.99,
      quantity: 1,
      image:
        "https://t3.ftcdn.net/jpg/04/83/25/50/360_F_483255019_m1r1ujM8EOkr8PamCHF85tQ0rHG3Fiqz.jpg",
    },
  ]);

  const taxRate = 0.018; // 1.8% tax

  const updateQuantity = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4 flex items-start gap-4 relative w-full">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => removeItem(item.id)}
              >
                <X size={18} />
              </button>

              <div className="h-full w-32 rounded-lg bg-slate-900 p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">{item.category}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-6 w-8 ${item.quantity === 1 ? "hidden" : "flex"}`}
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={16} />
                    </Button>
                    <p className="text-lg">{item.quantity}</p>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  <p className="text-3xl font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="col-span-1 space-y-4">
          <Card className="p-4 flex flex-col w-full gap-4">
            <CardTitle>Order Summary</CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm font-medium">₹{subtotal.toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between w-full">
                <p className="text-sm">Discount</p>
                <p className="text-sm text-green-600 font-medium">-₹{subtotal.toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="text-sm flex items-center gap-1 text-gray-400">
                  <p className="text-sm">Tax</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp size={14} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tax calculated at {taxRate * 100}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-gray-400">₹{tax.toFixed(2)}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between w-full">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold">₹{total.toFixed(2)}</p>
              </div>
            </div>


            <div className="flex flex-col gap-2 mt-6">
              <Button variant="outline">
                Save my order
              </Button>
              <Button onClick={() => navigate("proceed-to-check")}>
                Proceed to checkout
                <ShoppingCart />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
