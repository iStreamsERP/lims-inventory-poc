import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { callSoapService } from "@/services/callSoapService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function CustomerSelector({ openCustomer, setOpenCustomer, handleSelectClient }) {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [clientData, setClientData] = useState([]);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clients based on search query
  const filteredClients = clientData.filter((client) => client.CLIENT_NAME.toLowerCase().includes(searchQuery.toLowerCase()));

  // API call functions
  const fetchClientData = useCallback(async () => {
    try {
      const payload = { SQLQuery: `SELECT * from CLIENT_MASTER` };
      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);
      setClientData(response || []);
    } catch (error) {
      toast({ variant: "destructive", title: `Error fetching client: ${error.message}` });
    }
  }, [toast]);

  // Reset search query when dropdown closes
  useEffect(() => {
    fetchClientData();
    if (!openCustomer) {
      setSearchQuery("");
    }
  }, [openCustomer]);

  // Set search query to current value when dropdown opens
  useEffect(() => {
    if (openCustomer) {
      setSearchQuery(value);
    }
  }, [openCustomer, value]);

  return (
    <Card className="space-y-2 p-6">
      <h2 className="text-lg font-semibold">Select Customer</h2>
      <Popover
        open={openCustomer}
        onOpenChange={setOpenCustomer}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCustomer}
            className="flex w-full justify-between"
          >
            {value || "Select customer..."}
            <ChevronsUpDown className="opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              placeholder="Search customer..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9 px-3"
            />
            <CommandList>
              <CommandEmpty>No customers found.</CommandEmpty>
              <CommandGroup>
                {filteredClients.map((client) => (
                  <CommandItem
                    key={client.CLIENT_ID}
                    value={client.CLIENT_NAME}
                    onSelect={() => {
                      handleSelectClient(client);
                      setValue(client.CLIENT_NAME);
                      setOpenCustomer(false);
                    }}
                  >
                    {client.CLIENT_NAME}
                    <Check className={`ml-auto ${value === client.CLIENT_NAME ? "opacity-100" : "opacity-0"}`} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Card>
  );
}
