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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function GatePassComp({
  materialFormData,
  materials,
  isEditMode,
  loading,
  handleChange,
  handleMaterialSelect,
  handleSelectDAtas,
  setEditingQuantityId,
  editingQuantityId,
  handleQuantityChange,
  openMaterialPopup,
  setOpenMaterialPopup,
  materialSearch,
  setMaterialSearch,
  all_materials,
  isDialogOpen,
  setIsDialogOpen,
  popupMaterial
}) {
  return (
    <Card className="h-full w-full bg-white shadow-lg dark:bg-slate-950 md:h-[68vh] md:overflow-hidden">
      <CardHeader className="border-b px-4 pb-2 pt-3"></CardHeader>
      <CardContent className="flex h-full flex-col space-y-2 overflow-hidden p-4 pt-2 md:h-[calc(75vh-100px)]">
        <Popover open={openMaterialPopup} onOpenChange={setOpenMaterialPopup}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="h-8 w-full justify-between bg-white text-xs dark:bg-slate-950"
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
                      {all_materials
                        .filter((material) => {
                          const search = materialSearch.toLowerCase();
                          return (
                            String(material.LOC_MAKING || "")
                              .toLowerCase()
                              .includes(search) ||
                            String(material.SRV || "")
                              .toLowerCase()
                              .includes(search)
                          );
                        })
                        .map((material) => (
                          <CommandItem
                            key={material.LOC_MAKING}
                            value={`${material.LOC_MAKING || ""} ${material.ITEM_CODE || ""}`}
                            onSelect={() => handleMaterialSelect(material)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{material.LOC_MAKING}</span>
                              <div className="flex gap-2 text-xs text-gray-500">
                                <span>Code: {material.ITEM_CODE}</span>
                                <span>•</span>
                                <span>Quantity: {material.QTY_LOGICAL}</span>
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                materials.some((m) => m.LOC_MAKING === material.LOC_MAKING)
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
                  <TableHead className="w-16 px-2 py-1 text-center">Seri SRl</TableHead>
                  <TableHead className="min-w-[100px] px-2 py-1">SHNo</TableHead>
                  <TableHead className="min-w-[200px] px-2 py-1">Item Code</TableHead>
                  <TableHead className="w-24 px-2 py-1 text-right">BatchNo</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">CondCd</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">LOC_MAKING</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">QTY_LOGICAL</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">QTY_GROUND</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">NOT_TAKENOVER</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">FREEGRD_CWH</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">SRV</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">SRV_CHOICE</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">STATION_CODE</TableHead>
                  <TableHead className="w-16 px-2 py-1 text-right">Release</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length > 0 ? (
                  materials.map((m, index) => (
                    <TableRow key={`${m.ITEM_CODE}-${index}`} className="h-8">
                      <TableCell className="px-2 py-1 text-center">{m.STK_SRI}</TableCell>
                      <TableCell className="px-2 py-1">{m.SHNo}</TableCell>
                      <TableCell className="px-2 py-1">{m.ITEM_CODE}</TableCell>
                      <TableCell className="px-2 py-1">{m.BATCH_NO || "-"}</TableCell>
                      <TableCell className="px-2 py-1">{m.CONDCD || "-"}</TableCell>
                      <TableCell className="px-2 py-1">{m.LOC_MAKING || "-"}</TableCell>
                      <TableCell className="px-2 py-1 text-right">
                        {editingQuantityId === m.LOC_MAKING ? (
                          <Input
                            type="number"
                            min="1"
                            autoFocus
                            defaultValue={m.QTY_LOGICAL || 1}
                            onBlur={(e) => {
                              handleQuantityChange(m.LOC_MAKING, Number(e.target.value));
                              setEditingQuantityId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleQuantityChange(m.LOC_MAKING, Number(e.target.value));
                                setEditingQuantityId(null);
                              }
                            }}
                            className="h-6 w-20 text-right"
                          />
                        ) : (
                          <div
                            className="flex h-6 w-20 cursor-pointer items-center justify-end px-2"
                            onClick={() => setEditingQuantityId(m.LOC_MAKING)}
                          >
                            {m.QTY_LOGICAL || 1}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-1">{m.QTY_GROUND || "-"}</TableCell>
                      <TableCell className="px-2 py-1">{m.NOT_TAKENOVER || "-"}</TableCell>
                      <TableCell className="px-2 py-1">{m.FREEGRD_CWH || "-"}</TableCell>
                      <TableCell className="px-2 py-1">{m.SRV || "-"}</TableCell>
                      <TableCell className="px-2 py-1">{m.SRV_CHOICE || "-"}</TableCell>
                      <TableCell className="px-2 py-1">{m.STATION_CODE || "-"}</TableCell>
                      <TableCell className="px-2 py-1 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleSelectDAtas(m.LOC_MAKING)}
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
                      colSpan={14}
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-full w-[calc(100vw-100px)] z-[99999]">
            <DialogHeader>
              <DialogTitle>Selected Data</DialogTitle>
              <DialogDescription>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-auto">
                    <Table className="text-xs">
                      <TableHeader className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                        <TableRow className="h-8">
                          <TableHead className="w-16 px-2 py-1 text-center">Seri SRl</TableHead>
                          <TableHead className="min-w-[100px] px-2 py-1">SHNo</TableHead>
                          <TableHead className="min-w-[200px] px-2 py-1">Item Code</TableHead>
                          <TableHead className="w-24 px-2 py-1 text-right">BatchNo</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">CondCd</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">LOC_MAKING</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">QTY_LOGICAL</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">QTY_GROUND</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">NOT_TAKENOVER</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">FREEGRD_CWH</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">SRV</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">SRV_CHOICE</TableHead>
                          <TableHead className="w-16 px-2 py-1 text-right">STATION_CODE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {popupMaterial.length > 0 ? (
                          popupMaterial.map((m, index) => (
                            <TableRow key={`${m.ITEM_CODE}-${index}`} className="h-8">
                              <TableCell className="px-2 py-1 text-center">{m.STK_SRI}</TableCell>
                              <TableCell className="px-2 py-1">{m.SHNo}</TableCell>
                              <TableCell className="px-2 py-1">{m.ITEM_CODE}</TableCell>
                              <TableCell className="px-2 py-1">{m.BATCH_NO || "-"}</TableCell>
                              <TableCell className="px-2 py-1">{m.CONDCD || "-"}</TableCell>
                              <TableCell className="px-2 py-1">{m.LOC_MAKING || "-"}</TableCell>
                              <TableCell className="px-2 py-1 text-right">
                                {editingQuantityId === m.LOC_MAKING ? (
                                  <Input
                                    type="number"
                                    min="1"
                                    autoFocus
                                    defaultValue={m.QTY_LOGICAL || 1}
                                    onBlur={(e) => {
                                      handleQuantityChange(m.LOC_MAKING, Number(e.target.value));
                                      setEditingQuantityId(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleQuantityChange(m.LOC_MAKING, Number(e.target.value));
                                        setEditingQuantityId(null);
                                      }
                                    }}
                                    className="h-6 w-20 text-right"
                                  />
                                ) : (
                                  <div
                                    className="flex h-6 w-20 cursor-pointer items-center justify-end px-2"
                                    onClick={() => setEditingQuantityId(m.LOC_MAKING)}
                                  >
                                    {m.QTY_LOGICAL || 1}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="px-2 py-1">{m.QTY_GROUND || "-"}</TableCell>
                              <TableCell className="px-2 py-1">{m.NOT_TAKENOVER || "-"}</TableCell>
                              <TableCell className="px-2 py-1">{m.FREEGRD_CWH || "-"}</TableCell>
                              <TableCell className="px-2 py-1">{m.SRV || "-"}</TableCell>
                              <TableCell className="px-2 py-1">{m.SRV_CHOICE || "-"}</TableCell>
                              <TableCell className="px-2 py-1">{m.STATION_CODE || "-"}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="h-8">
                            <TableCell
                              colSpan={13}
                              className="h-full py-4 text-center text-gray-400 md:h-[35vh]"
                            >
                              <PackageSearch className="mx-auto mb-3 h-24 w-24 opacity-50" />
                              No materials selected.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}