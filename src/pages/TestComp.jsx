"use client"

import * as React from "react"
import { Check, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function TextComp({
  handleToggleMaterial,
  handleUpdateQty,
  material,
  all_materials,
}) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(new Set())
  const [editingQtyId, setEditingQtyId] = React.useState(null)
  const [showPopup, setShowPopup] = React.useState(false)

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(new Set(material.map((m) => m.ITEM_CODE)))
    } else {
      setSelected(new Set())
    }
  }

  const isAllSelected = material.length > 0 && selected.size === material.length

  const handleSubmit = () => {
    setShowPopup(true)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {material.length > 0 ? `${material.length} selected` : "Select material..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search material..." />
            <CommandList>
              <CommandEmpty>No material found.</CommandEmpty>
              <CommandGroup>
                {all_materials.map((item) => (
                  <CommandItem
                    key={item.ITEM_CODE}
                    value={`${item.LOC_MAKING || ""} ${item.ITEM_CODE}`}
                    onSelect={() => {
                      handleToggleMaterial(item)
                    }}
                  >
                    <div>
                      <div>{item.LOC_MAKING}</div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        material.some((m) => m.ITEM_CODE === item.ITEM_CODE)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Table>
        <TableCaption>A list of selected materials.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
            </TableHead>
            <TableHead>ITEM_CODE</TableHead>
            <TableHead>BATCH_NO</TableHead>
            <TableHead>CONDCD</TableHead>
            <TableHead>LOC_MAKING</TableHead>
            <TableHead>QTY_LOGICAL</TableHead>
            <TableHead>QTY_GROUND</TableHead>
            <TableHead>SRV</TableHead>
            <TableHead>STATION_CODE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {material.map((item) => (
            <TableRow key={item.ITEM_CODE}>
              <TableCell>
                <Checkbox
                  checked={selected.has(item.ITEM_CODE)}
                  onCheckedChange={(checked) => {
                    setSelected((prev) => {
                      const newSet = new Set(prev)
                      if (checked) {
                        newSet.add(item.ITEM_CODE)
                      } else {
                        newSet.delete(item.ITEM_CODE)
                      }
                      return newSet
                    })
                  }}
                />
              </TableCell>
              <TableCell>{item.ITEM_CODE}</TableCell>
              <TableCell>{item.BATCH_NO}</TableCell>
              <TableCell>{item.CONDCD}</TableCell>
              <TableCell>{item.LOC_MAKING}</TableCell>
              <TableCell>
                {editingQtyId === item.ITEM_CODE ? (
                  <Input
                    type="number"
                    value={item.QTY_LOGICAL}
                    onChange={(e) => handleUpdateQty(item.ITEM_CODE, e.target.value)}
                    onBlur={() => setEditingQtyId(null)}
                    autoFocus
                  />
                ) : (
                  <div onClick={() => setEditingQtyId(item.ITEM_CODE)} className="cursor-pointer">
                    {item.QTY_LOGICAL}
                  </div>
                )}
              </TableCell>
              <TableCell>{item.QTY_GROUND}</TableCell>
              <TableCell>{item.SRV}</TableCell>
              <TableCell>{item.STATION_CODE}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={handleSubmit} className="mt-4">Submit</Button>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stored Values</DialogTitle>
          </DialogHeader>
          <pre>
            {JSON.stringify(
              material.filter((m) => selected.has(m.ITEM_CODE)),
              null,
              2
            )}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TextComp