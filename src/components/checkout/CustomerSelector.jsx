import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { callSoapService } from "@/api/callSoapService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function CustomerSelector({ selectedClientName, openClient, setOpenClient, handleSelectClient }) {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [clientData, setClientData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch client data
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
    if (!openClient) {
      setSearchQuery("");
    }
  }, [openClient, fetchClientData]);

  // Filter clients
  const filteredClients = useMemo(
    () => clientData.filter((client) => client.CLIENT_NAME?.toLowerCase().includes(searchQuery.toLowerCase())),
    [clientData, searchQuery],
  );

  return (
    <Card className="space-y-2 p-6">
      <h2 className="text-lg font-semibold">Select Customer</h2>
      <Popover
        open={openClient}
        onOpenChange={setOpenClient}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openClient}
            className="flex w-full justify-between"
          >
            {selectedClientName || "Select customer..."}
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
                      setOpenClient(false);
                    }}
                  >
                    {client.CLIENT_NAME}
                    <Check className={`ml-auto ${selectedClientName === client.CLIENT_NAME ? "opacity-100" : "opacity-0"}`} />
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
