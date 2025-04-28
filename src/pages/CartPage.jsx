import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { getDataModelFromQueryService, saveDataService } from '@/services/dataModelService';
import { formatPrice } from '@/utils/formatPrice';
import { Check, ChevronsUpDown, Minus, MoveRight, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { convertDataModelToStringData } from '@/utils/dataModelConverter';

const CartPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { toast } = useToast();
  const { cart, removeItem, updateItemQuantity } = useCart();

  const [clientData, setClientData] = useState([]);
  const [value, setValue] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cart totals
  const taxRate = 0.018;
  const subtotal = cart.reduce((sum, i) => sum + i.finalSaleRate * i.itemQty, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const totalItem = cart.reduce((sum, i) => sum + i.itemQty, 0);

  const [formData, setFormData] = useState({
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    SALES_ORDER_SERIAL_NO: 0,
    ORDER_NO: "123",
    CLIENT_ID: selectedClient?.CLIENT_ID,
    CLIENT_NAME: selectedClient?.CLIENT_NAME,
    TOTAL_VALUE: 0,
    DISCOUNT_VALUE: 0,
    USER_NAME: userData.currentUserLogin,
    ENT_DATE: "",
    OTHER_REF1: "MXXXX"
  });

  useEffect(() => {
    setFormData(fd => ({
      ...fd,
      CLIENT_ID: selectedClient?.CLIENT_ID ?? null,
      CLIENT_NAME: selectedClient?.CLIENT_NAME ?? '',
      TOTAL_VALUE: subtotal,
      DISCOUNT_VALUE: 0
    }));
  }, [selectedClient, subtotal]);

  // Filter list based on dropdown input value
  const filteredClients = clientData.filter(client =>
    client.CLIENT_NAME.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelectClient = (clientName) => {
    const client = clientData.find(c => c.CLIENT_NAME === clientName);
    setValue(clientName);
    setSelectedClient(client || null);
    setOpenCustomer(false);
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const payload = {
        SQLQuery: `SELECT CLIENT_ID, CLIENT_NAME, COUNTRY, CITY_NAME, TELEPHONE_NO from CLIENT_MASTER`,
      };
      const response = await getDataModelFromQueryService(
        payload,
        userData.currentUserLogin,
        userData.clientURL
      );
      setClientData(response || []);
    } catch (error) {
      toast({ variant: "destructive", title: `Error fetching client: ${error.message}` });
    }
  };

  const handleSaveOrder = async () => {
    if (selectedClient === null) {
      return toast({ variant: "destructive", title: "Please select a client." });
    }

    try {
      setLoading(true);

      const payloadModel = {
        ...formData,
        TOTAL_VALUE: subtotal,
        CLIENT_ID: selectedClient.CLIENT_ID,
        CLIENT_NAME: selectedClient.CLIENT_NAME
      };

      const convertedDataModel = convertDataModelToStringData("SALES_ORDER_MASTER", payloadModel);

      console.log(convertedDataModel);


      const payload = {
        UserName: userData.currentUserLogin,
        DModelData: convertedDataModel,
      };

      const response = await saveDataService(payload, userData.currentUserLogin, userData.clientURL);

      console.log(response);

      toast({
        title: "Order Saved Successfully",
        description: response, // Optional: you can show the response here
      });

    } catch (error) {
      console.error(error); // Good practice to log it
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.",
        description: error?.message || "Unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4">
      <div className="grid gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-sm text-gray-500">Review items and proceed to checkout.</p>
          </div>
          <Button variant="link" onClick={() => navigate(-1)}>
            Continue Shopping <MoveRight />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Cart Items */}
          <div className="col-span-2 space-y-6">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400">Your cart is empty.</p>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="grid grid-cols-[2fr_1fr_1fr] items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.itemName}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                        style={{ aspectRatio: '1/1' }}
                      />
                      <div>
                        <h3 className="font-medium">{item.itemName}</h3>
                        {item.itemColor && <p className="text-xs text-gray-500">Color: {item.itemColor}</p>}
                        {item.itemSize && <p className="text-xs text-gray-500">Size: {item.itemSize}</p>}
                        {item.itemVariant && <p className="text-xs text-gray-500">Variant: {item.itemVariant}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-8"
                        onClick={() => updateItemQuantity(item.subProductNo, item.itemQty - 1)}
                      >
                        <Minus size={14} />
                      </Button>
                      <span>{item.itemQty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-8"
                        onClick={() => updateItemQuantity(item.subProductNo, item.itemQty + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>

                    <div className="text-right font-semibold">
                      {formatPrice(item.finalSaleRate * item.itemQty)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => removeItem(item.subProductNo)}
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))
            )}
          </div>

          {/* Customer & Summary */}
          <div className="space-y-6">
            {/* Customer Selector */}
            <Card className="p-6 space-y-2">
              <h2 className="text-lg font-semibold">Select Customer</h2>

              <Popover open={openCustomer} onOpenChange={setOpenCustomer}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCustomer}
                    className="w-full flex justify-between"
                  >
                    {value || 'Select customer...'}
                    <ChevronsUpDown className="opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search customer..."
                      value={value}
                      onValueChange={setValue}
                      className="h-9 px-3"
                    />
                    <CommandList>
                      <CommandEmpty>No customers found.</CommandEmpty>
                      <CommandGroup>
                        {filteredClients.map(client => (
                          <CommandItem
                            key={client.CLIENT_ID}
                            value={client.CLIENT_NAME}
                            onSelect={handleSelectClient}
                          >
                            {client.CLIENT_NAME}
                            <Check className={`ml-auto ${value === client.CLIENT_NAME ? 'opacity-100' : 'opacity-0'}`} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedClient && (
                <div className="text-sm space-y-1 pt-2">
                  <p><span className="font-semibold">City:</span> {selectedClient.CITY_NAME}</p>
                  <p><span className="font-semibold">Country:</span> {selectedClient.COUNTRY}</p>
                  <p><span className="font-semibold">Phone:</span> {selectedClient.TELEPHONE_NO}</p>
                </div>
              )}
            </Card>

            {/* Order Summary */}
            <Card className="p-6 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Items</span>
                <span>{totalItem}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (1.8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="space-y-3 pt-4">
                <Button variant="outline" className="w-full" onClick={handleSaveOrder}>Save my order</Button>
                <Button className="w-full">Proceed to Checkout</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
