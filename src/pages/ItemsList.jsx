import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const ItemList = () => {
  const [carts, setCarts] = useState([
    {
      itemcode: "MICRO10404",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq_2KBS4tYpk7mN0KrJ2DjCOul9HuNAtdITg&s",
      type: "pcs",
      price: 15000,
      item: "Samsung",
      category: "product",
      supplierref: "Samsung Electronics",
      qty: 2,
      color: "Black",
    },
    {
      itemcode: "MICRO10405",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRME6locZYFSYJRXbz8xoCzXjDcwrQTA0RiHA&s",
      type: "pcs",
      price: 5000,
      item: "Screen Repair",
      category: "service",
      supplierref: "Samsung Service Center",
      qty: 1,
      color: "red",
    },
    {
      itemcode: "MICRO10406",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT31y7OlfN7OpPHPLzl_2MDPNAw9V6fjLUeIg&s",
      type: "pcs",
      price: 25000,
      item: "iPhone",
      category: "product",
      supplierref: "Apple Inc.",
      qty: 1,
      color: "White",
    },
    {
      itemcode: "MICRO10407",
      img: "https://9to5mac.com/wp-content/uploads/sites/6/2022/12/Battery-replacement.jpeg?quality=82&strip=all",
      type: "pcs",
      price: 7000,
      item: "Battery Replacement",
      category: "service",
      supplierref: "Apple Service Center",
      qty: 1,
      color: "pink",
    },
    {
      itemcode: "MICRO10408",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuVZNWHW4q4zD_fVkg9xJ4LMmGGkoOGBUiwQ&s",
      type: "pcs",
      price: 18000,
      item: "OnePlus",
      category: "product",
      supplierref: "OnePlus Mobile",
      qty: 2,
      color: "Red",
    },
    {
      itemcode: "MICRO10409",
      img: "https://fdn.gsmarena.com/imgroot/news/24/01/oneplus-12r-first-update/-1200w5/gsmarena_001.jpg",
      type: "pcs",
      price: 4500,
      item: "Software Update",
      category: "service",
      supplierref: "OnePlus Service Center",
      qty: 1,
      color: "orange",
    },
    {
      itemcode: "MICRO10410",
      img: "https://cdn.beebom.com/mobile/realme-14x-5g/realme-14x-front-back-1.png",
      type: "pcs",
      price: 12000,
      item: "Realme",
      category: "product",
      supplierref: "Realme Store",
      qty: 3,
      color: "Blue",
    },
    {
      itemcode: "MICRO10411",
      img: "https://www.realmeservicecenterinchennai.co.in/wp-content/uploads/2024/05/realme-mobile-water-damaged-phone-repair.jpg",
      type: "pcs",
      price: 6000,
      item: "Water Damage Repair",
      category: "service",
      supplierref: "Realme Service Center",
      qty: 1,
      color: "rose",
    },
    {
      itemcode: "MICRO10412",
      img: "https://www.myg.in/images/thumbnails/300/300/detailed/74/-original-imah5y78qbnurfyg-removebg-preview_wpwd-n4.png.png",
      type: "pcs",
      price: 22000,
      item: "Vivo",
      category: "product",
      supplierref: "Vivo Mobiles",
      qty: 2,
      color: "Black",
    },
    {
      itemcode: "MICRO10413",
      img: "https://cdn.prod.website-files.com/5e83466828f0fa11a39d46ff/6644703554a91cd53d8467f4_camera.webp",
      type: "pcs",
      price: 5500,
      item: "Camera Repair",
      category: "service",
      supplierref: "Vivo Service Center",
      qty: 1,
      color: "black",
    },
    {
      itemcode: "MICRO10414",
      img: "https://hips.hearstapps.com/hmg-prod/images/pixel-7-review-6581cea92b208.jpg?crop=0.563xw:1.00xh;0.228xw,0&resize=640:*",
      type: "pcs",
      price: 27000,
      item: "Google Pixel",
      category: "product",
      supplierref: "Google Store",
      qty: 1,
      color: "Gray",
    },
    {
      itemcode: "MICRO10415",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrxO9V7NwUwc-GkIM-6cbrl0eDQYeiO302FQ&s",
      type: "pcs",
      price: 8000,
      item: "Motherboard Repair",
      category: "service",
      supplierref: "Google Service Center",
      qty: 1,
      color: "green",
    },
    {
      itemcode: "MICRO10416",
      img: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a3-int-2.jpg",
      type: "pcs",
      price: 13000,
      item: "Oppo",
      category: "product",
      supplierref: "Oppo Mobile",
      qty: 2,
      color: "Green",
    },
    {
      itemcode: "MICRO10417",
      img: "https://d57avc95tvxyg.cloudfront.net/images/detailed/5024/charging_connector_for_oppo_a55_5g_by_maxbhi_com_62127.jpg?t=1671102674",
      type: "pcs",
      price: 5000,
      item: "Charging Port Repair",
      category: "service",
      supplierref: "Oppo Service Center",
      qty: 1,
      color: "yellow",
    },
    {
      itemcode: "MICRO10418",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcFdOl44fJz76xBgD0Yu_GuC0rz65CtbJ9Kg&s",
      type: "pcs",
      price: 14000,
      item: "Xiaomi",
      category: "product",
      supplierref: "Mi Store",
      qty: 3,
      color: "White",
    },
    {
      itemcode: "MICRO10419",
      img: "https://img.gkbcdn.com/s3/p/2016-05-18/horn-sound-speaker-phone-repair-parts-replacement-for-xiaomi-redmi-3--note2---note3-1571979674105.jpg",
      type: "pcs",
      price: 4000,
      item: "Speaker Repair",
      category: "service",
      supplierref: "Mi Service Center",
      qty: 1,
      color: "white",
    },
    {
      itemcode: "MICRO10420",
      img: "https://images-na.ssl-images-amazon.com/images/I/716nsPtlrJL.jpg",
      type: "pcs",
      price: 20000,
      item: "Nokia",
      category: "product",
      supplierref: "Nokia Store",
      qty: 1,
      color: "Black",
    },
    {
      itemcode: "MICRO10421",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6GcQaGTptQZ0EsfmtTQ-9RQQ8e212M6FTuM9xYgrMDMIAWZEChqEx6Mxv08TEStXjBAU&usqp=CAU",
      type: "pcs",
      price: 4500,
      item: "Network Unlock",
      category: "service",
      supplierref: "Nokia Service Center",
      qty: 1,
      color: "red",
    },
    {
      itemcode: "MICRO10422",
      img: "https://m.media-amazon.com/images/I/51L2VqQ+BKL._AC_UF1000,1000_QL80_.jpg",
      type: "pcs",
      price: 12500,
      item: "Motorola",
      category: "product",
      supplierref: "Motorola Store",
      qty: 2,
      color: "Blue",
    },
  ]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-4">
        <h1 className="title">Item List</h1>
        <div>
          <div className="mb-2 grid grid-cols-12 gap-2">
            <div className="col-span-12 flex w-full justify-end text-xs md:col-span-2 md:col-start-7 lg:col-span-2 lg:col-start-7">
              <Button className="btn-sm w-full text-xs sm:w-full md:ms-0 md:w-32 lg:ms-4 lg:w-32">
                <PlusIcon size={64} />
                Create Item
              </Button>
            </div>

            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <Input
                type="text"
                placeholder="Search Products"
                className="w-full"
              />
            </div>
          </div>

          <Table className="whitespace-nowrap">
            <ScrollArea className="h-[70vh] w-full rounded-md border p-4">
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Itemcode</TableHead>
                  <TableHead className="sm:w-[250px] lg:w-[500px]">Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier Ref</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              {carts.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-5 text-center text-gray-500"
                    >
                      -- No Material Added Yet. Search to Add Material --
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {carts.map((cart, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{cart.itemcode}</TableCell>
                      <TableCell className="flex justify-start gap-2 text-start sm:w-[250px] lg:w-[200px]">
                        <img
                          src={cart.img}
                          alt={cart.name}
                          className="h-10 w-10 rounded"
                        />
                        <div>
                          <p className="font-semibold text-gray-500">{cart.item}</p>
                          <div className="flex items-center">
                            <span
                              style={{ backgroundColor: cart.color }}
                              className="mr-1 rounded-full p-1"
                            ></span>
                            <p className="text-sm text-gray-400">{cart.color}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{cart.type}</TableCell>
                      <TableCell>{cart.price}</TableCell>
                      <TableCell>{cart.category}</TableCell>
                      <TableCell>{cart.supplierref}</TableCell>
                      <TableCell className="text-right">{cart.qty}</TableCell>
                      <TableCell>
                        <Button
                          variant="gost"
                          className="me-2 bg-transparent p-0 text-blue-500"
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="gost"
                          className="bg-transparent p-0 text-red-500"
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </ScrollArea>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
