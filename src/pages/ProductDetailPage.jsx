import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getDataModelService } from '@/services/dataModelService';
import { InfoIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { userData } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        fetchProductList();
    }, [id]);

    const fetchProductList = async () => {
        setLoading(true);
        try {
            const payload = {
                DataModelName: "INVT_MATERIAL_MASTER",
                WhereCondition: `iTEM_CODE = 'DMO000004' AND COST_CODE = 'MXXXX'`,
                Orderby: "",
            };

            const response = await getDataModelService(
                payload,
                userData.currentUserLogin,
                userData.clientURL
            );

            console.log(response);

            const updatedList = await Promise.all(
                response.map(async (item) => {
                    const imageBlob = await fetchProductImage(item.ITEM_CODE);
                    const imageUrl = URL.createObjectURL(imageBlob);
                    return { ...item, imageUrl };
                })
            );

            setProductList(updatedList);

        } catch (error) {
            toast({
                variant: "destructive",
                title: `Error fetching product list: ${error?.message || "An error occurred"}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProductImage = async (itemCode) => {
        try {
            const response = await axios.get(
                `https://cloud.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(userData.currentUserLogin)}&fileName=PRODUCT_IMAGE_${itemCode}`,
                {
                    responseType: "blob",
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching image for ${itemCode}`, error);
            return null; // Handle missing images gracefully
        }
    };

    return loading ? (
        <BarLoader color="#36d399" height={2} width="100%" />
    ) : (
        productList?.length > 0 ? (
            productList.map((item, index) => (
                <div>
                    <Card className="lg:w-full md:w-fit sm:w-fit">
                        <CardContent className="p-0">
                            <div key={index} className="flex md:flex-col flex-col  lg:flex-row gap-x-2">
                                <div className="lg:w-80 md:w-full sm:w-full  w-full h-full">
                                    <img
                                        className="w-full  h-full lg:rounded-l-lg md:rounded-l-lg rounded-l-lg sm:rounded md:rounded-b-none sm:rounded-b-none  lg:rounded-r-none object-cover"
                                        src="https://www.urbanofashion.com/cdn/shop/files/jeanloose-lblue-3.jpg?v=1708169302"
                                        alt="image"
                                    />
                                </div>
                                <div className="lg:mt-0 mt-2  p-4">
                                    <p className=" font-semibold">{item.ITEM_NAMe || "Jeans"}</p>
                                    <p className="text-muted-foreground text-sm mb-2">{item.ITEM_BRAND || "Levis"} , <span className="text-muted-foreground text-sm">{item.ITEM_CATEGORY || "Fashion"}</span></p>
                                    <div className="mb-2 flex flex-row flex-wrap  gap-2">
                                        <Badge variant="outline" className={"w-fit"}>4.3 ★</Badge>
                                        <span className="text-muted-foreground text-sm">15,760 Ratings & 2,040 Reviews</span>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Select Color</Label>
                                        <div className="flex items-center gap-6 mt-2 ms-1">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="color" value="red" className="sr-only peer" />
                                                <span className="w-3 h-3 rounded-full  bg-red-500 peer-checked:ring-4 peer-checked:ring-red-500 ring-offset-1 ring-3 ring-transparent transition" />
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="color" value="blue" className="sr-only peer" />
                                                <span className="w-3 h-3 rounded-full bg-blue-500 peer-checked:ring-4 peer-checked:ring-blue-500 ring-offset-1 ring-3 ring-transparent transition" />
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="color" value="green" className="sr-only peer" />
                                                <span className="w-3 h-3 rounded-full bg-green-500 peer-checked:ring-4  peer-checked:ring-green-500 ring-offset-1 ring-3 ring-transparent transition" />
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="color" value="yellow" className="sr-only peer" />
                                                <span className="w-3 h-3 rounded-full bg-yellow-400 peer-checked:ring-4 peer-checked:ring-yellow-400 ring-offset-1 ring-3 ring-transparent transition" />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mb-5 mt-2">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Select Size</Label>
                                        <div className="flex items-center gap-4 mt-3 ms-1">
                                            {["S", "M", "L", "XL"].map((size) => (
                                                <label key={size} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="size"
                                                        value={size}
                                                        className="sr-only peer"
                                                    />
                                                    <span className="w-4 h-4 p-3 flex items-center justify-center rounded-full border border-black dark:border-white peer-checked:ring-2 peer-checked:ring-black dark:peer-checked:bg-gray-500 peer-checked:bg-gray-200 dark:peer-checked:ring-white  ring-transparent transition text-xs font-semibold text-black dark:text-white">
                                                        {size}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-sm font-semibold mb-2">Special price</div>
                                    <div className="flex gap-3 rounded mb-12">
                                        <div className="text-3xl  font-bold">
                                            <span className="text-xl ">₹</span>
                                            {item.SALE_RATE} <span className="text-sm font-semibold  line-through">₹{item.SALE_RATE * 2}</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-700">
                                            <span>33% off </span>
                                            <InfoIcon className="h-4 w-4 text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="flex w-full lg:mt-7 gap-2">
                                        <Button variant="outline" className="w-1/2"> Add to Cart </Button>
                                        <Button className="w-1/2"> Buy Now</Button>
                                    </div>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))
        ) : (
            <p className="text-center mt-4">No product details found.</p>
        )
    );
};

export default ProductDetailPage;