import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PackageSearch, Trash2Icon } from "lucide-react";

export default function Ilmscomp({
  materialFormData,
  materials,
  isEditMode,
  loading,
  handleChange,
  AuthorityType,
  handleQuotationForChange,
  handleMaterialSelect,
  handleRemoveMaterial,
  setEditingQuantityId,
  editingQuantityId,
  handleQuantityChange,
  openMaterialPopup,
  setOpenMaterialPopup,
  materialSearch,
  setMaterialSearch,
  getCurrentMaterials,
}) {
  return (
    <Card className="h-full w-full bg-white shadow-lg dark:bg-slate-950 md:h-[68vh] md:overflow-hidden">
      <CardHeader className="border-b px-4 pb-2 pt-3">
      </CardHeader>

      <CardContent className="flex h-full flex-col space-y-2 overflow-hidden p-4 pt-2 md:h-[calc(75vh-100px)]">
        <Select
          value={materialFormData.QUOTATION_FOR}
          onValueChange={(val) => handleQuotationForChange(val)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {AuthorityType.map((item, i) => (
                <SelectItem key={i} value={item.ITEM_VALUE}>
                  {item.ITEM_LABEL}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover open={openMaterialPopup} onOpenChange={setOpenMaterialPopup}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="h-8 w-full justify-between bg-white text-xs dark:bg-slate-950"
              disabled={loading || !materialFormData.QUOTATION_FOR}
            >
              {loading ? (
                "Loading materials..."
              ) : materialFormData.QUOTATION_FOR ? (
                "Select material..."
              ) : (
                "Please select a type first"
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] bg-white p-0 dark:bg-slate-950 md:w-[750px]">
            <Command className="bg-white dark:bg-slate-950">
              <CommandInput
                placeholder="Search material..."
                className="h-9"
                value={materialSearch}
                onValueChange={setMaterialSearch}
                disabled={loading}
              />
              <CommandList>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                    <span className="ml-2">Loading materials...</span>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No material found.</CommandEmpty>
                    <CommandGroup>
                      {getCurrentMaterials()
                        .filter((material) => {
                          const search = materialSearch.toLowerCase();
                          return (
                            String(material.ITEM_NAME || "")
                              .toLowerCase()
                              .includes(search) ||
                            String(material.ITEM_CODE || "")
                              .toLowerCase()
                              .includes(search)
                          );
                        })
                        .map((material) => (
                          <CommandItem
                            key={material.ITEM_CODE}
                            value={`${material.ITEM_NAME || ""} ${material.ITEM_CODE || ""}`}
                            onSelect={() => handleMaterialSelect(material)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{material.ITEM_NAME}</span>
                              <div className="flex gap-2 text-xs text-gray-500">
                                <span>Code: {material.ITEM_CODE}</span>
                                <span>•</span>
                                <span>Quantity: {material.QUANTITY}</span>
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                materials.some((m) => m.ITEM_CODE === material.ITEM_CODE)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <Table className="text-xs">
              <TableHeader className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                <TableRow className="h-8">
                  <TableHead className="w-16 px-2 py-1 text-center">S.No</TableHead>
                  <TableHead className="min-w-[100px] px-2 py-1">Item Code</TableHead>
                  <TableHead className="min-w-[200px] px-2 py-1">Description</TableHead>
                  <TableHead className="w-24 px-2 py-1 text-right">Quantity</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length > 0 ? (
                  materials.map((m, index) => (
                    <TableRow key={`${m.ITEM_CODE}-${index}`} className="h-8">
                      <TableCell className="px-2 py-1 text-center">{index + 1}</TableCell>
                      <TableCell className="px-2 py-1">{m.ITEM_CODE}</TableCell>
                      <TableCell className="px-2 py-1">{m.ITEM_NAME || m.DESCRIPTION || "-"}</TableCell>
                      <TableCell className="px-2 py-1 text-right">
                        {editingQuantityId === m.ITEM_CODE ? (
                          <Input
                            type="number"
                            min="1"
                            autoFocus
                            defaultValue={m.QTY || 1}
                            onBlur={(e) => {
                              handleQuantityChange(m.ITEM_CODE, Number(e.target.value));
                              setEditingQuantityId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleQuantityChange(m.ITEM_CODE, Number(e.target.value));
                                setEditingQuantityId(null);
                              }
                            }}
                            className="h-6 w-20 text-right"
                          />
                        ) : (
                          <div
                            className="flex h-6 w-20 cursor-pointer items-center justify-end px-2"
                            onClick={() => setEditingQuantityId(m.ITEM_CODE)}
                          >
                            {m.QTY || 1}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-1 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleRemoveMaterial(m.ITEM_CODE)}
                          className="h-6 w-6 rounded-full hover:bg-red-100 dark:hover:bg-red-800"
                        >
                          <Trash2Icon className="h-3 w-3 rounded-full text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="h-8">
                    <TableCell
                      colSpan={5}
                      className="h-full py-4 text-center text-gray-400 md:h-[35vh]"
                    >
                      <PackageSearch className="mx-auto mb-3 h-24 w-24 opacity-50" />
                      No materials selected. Please select materials to add.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}