import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function CategoryDetailsPage() {
  const [productList, setProductList] = useState([
    {
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
      title: "Motorcycle Headphones, Quick Charging IPX6 Waterproof Wireless Earphones, Stylish Smart Headphones, Cycling Accessories",
      shadePrice: 25.99,
      realPrice: 20,
      discount: 10,
      startOfDay: "Monday",
      endOfDay: "Friday",
      startDate: "2",
      endDate: "5",
      startOfMonth: "May",
      endOfMonth: "May",
    },
  ]);
  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        {productList.map((product) => (
          <div className="col-span-3">
            <Card
              key={product.title}
              className="w-[240px] overflow-hidden rounded shadow-lg"
            >
              <div className="relative flex h-[200px] w-full items-center justify-center bg-white">
                <img
                  src={product.img}
                  alt="Product Image"
                  width={200}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </div>

              <CardContent className="space-y-2 p-4">
                <p className="cursor-pointer text-sm text-blue-600 underline">+1 other colour/pattern</p>
                <p className="text-muted-foreground text-xs">Sponsored</p>

                <h2 className="line-clamp-3 text-sm font-medium leading-snug">{product.title}</h2>

                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-lg font-semibold line-through">{product.shadePrice}</span>
                  <span className="text-lg font-semibold">
                    <span className="text-sm">€</span>
                    {product.realPrice}
                  </span>
                </div>

                <Badge
                  variant="secondary"
                  className="w-fit text-xs"
                >
                  {product.discount}% off promotion available
                </Badge>

                <div className="text-xs text-green-700">
                  Get it{" "}
                  <span className="font-medium">
                    {product.startOfDay} {product.startDate} {product.startOfMonth} - {product.endOfDay} {product.endDate} {product.endOfMonth}
                  </span>
                  <br />
                  <span className="text-black">FREE Delivery</span>
                </div>
                <Separator />
                <Button
                  variant="default"
                  className="w-full bg-yellow-400 font-medium text-black hover:bg-yellow-500"
                >
                  Add to cart
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
