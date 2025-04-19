import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getDataModelService } from '@/services/dataModelService';
import axios from 'axios';
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

    const colorMap = {
        red: "bg-red-500 peer-checked:ring-red-500 dark:peer-checked:ring-red-400",
        blue: "bg-blue-500 peer-checked:ring-blue-500 dark:peer-checked:ring-blue-400",
        green: "bg-green-500 peer-checked:ring-green-500 dark:peer-checked:ring-green-400",
        purple: "bg-purple-500 peer-checked:ring-purple-500 dark:peer-checked:ring-purple-400",
        pink: "bg-pink-500 peer-checked:ring-pink-500 dark:peer-checked:ring-pink-400",
    };

    useEffect(() => {
        fetchProductList();
    }, [id]);

    const fetchProductList = async () => {
        setLoading(true);
        try {
            const payload = {
                DataModelName: "INVT_MATERIAL_MASTER",
                WhereCondition: `iTEM_CODE = '${id}' AND COST_CODE = 'MXXXX'`,
                Orderby: "",
            };

            const response = await getDataModelService(
                payload,
                userData.currentUserLogin,
                userData.clientURL
            );

            const updatedList = await Promise.all(
                response.map(async (item) => {
                    const imageBlob = await fetchProductImage(item.ITEM_CODE);
                    const imageUrl = URL.createObjectURL(imageBlob);
                    return { ...item, imageUrl };
                })
            );
            console.log(updatedList);

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


    console.log(productList);


    return loading ? (
        <BarLoader color="#36d399" height={2} width="100%" />
    ) : productList?.length > 0 ? (
        productList.map((item, index) => (
            <div
                key={index}
                className="w-full"
            >
                <Card className="mx-auto w-full">
                    <CardContent className="p-4 md:p-4">
                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* Image Section */}
                            <div className="h-[290px] w-full overflow-hidden rounded-lg bg-neutral-300 dark:bg-gray-800 sm:h-[390px] md:w-1/2">
                                <img
                                    className="h-full w-full object-contain"
                                    src={item.imageUrl}
                                    alt={item.ITEM_NAME}
                                />
                            </div>

                            {/* Details Section */}
                            <div className="flex w-full flex-col justify-between gap-4 md:w-1/2">
                                <div>
                                    <p className="text-xl font-semibold">{item.ITEM_NAME}</p>
                                    <p className="text-muted-foreground mb-3 text-sm">
                                        {item.ITEM_BRAND || "Brand not available"}, <span>{item.GROUP_LEVEL1 || "Fashion"}</span>
                                    </p>

                                    {/* Rating */}
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        <Badge
                                            variant="outline"
                                            className="w-fit"
                                        >
                                            4.3 ★
                                        </Badge>
                                    </div>

                                    {/* Color Selection */}
                                    <div className="mb-4">
                                        <Label className="text-sm font-medium">Select Color</Label>
                                        <div className="mt-2 flex flex-wrap gap-3">
                                            {Object.keys(colorMap).map((color) => (
                                                <label
                                                    key={color}
                                                    className="flex cursor-pointer items-center gap-2"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="color"
                                                        value={color}
                                                        className="peer sr-only"
                                                    />
                                                    <span
                                                        className={`h-6 w-6 rounded-full ring-2 ring-transparent ring-offset-1 transition dark:ring-offset-gray-800 ${colorMap[color]}`}
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Selection */}
                                    <div className="mb-4">
                                        <Label className="text-sm font-medium">Select Size</Label>
                                        <div className="mt-2 flex flex-wrap gap-3">
                                            {["S", "M", "L", "XL"].map((size) => (
                                                <label
                                                    key={size}
                                                    className="cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="size"
                                                        value={size}
                                                        className="peer sr-only"
                                                    />
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold peer-checked:text-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 dark:bg-gray-900">
                                                        {size}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="mb-4">
                                        <div className="text-sm font-semibold">Special price</div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="text-2xl font-bold">
                                                ₹{item.SALE_RATE} <span className="text-sm font-semibold text-gray-400 line-through">₹{item.SALE_RATE * 2}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-semibold text-green-700">
                                                33% off <InfoIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-1/2"
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button className="w-full sm:w-1/2">Buy Now</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ))
    ) : (
        <p className="mt-4 text-center">No product details found.</p>
    );
};

export default ProductDetailPage;