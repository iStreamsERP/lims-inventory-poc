import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function CustomerSelector({ openCustomer, setOpenCustomer, value, setValue, clientData, handleSelectClient }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clients based on search query
  const filteredClients = clientData.filter((client) => client.CLIENT_NAME.toLowerCase().includes(searchQuery.toLowerCase()));

  // Reset search query when dropdown closes
  useEffect(() => {
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
                      handleSelectClient(client.CLIENT_NAME);
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
