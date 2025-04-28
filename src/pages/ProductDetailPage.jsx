import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { getDataModelFromQueryService } from '@/services/dataModelService';
import { formatPrice } from '@/utils/formatPrice';
import axios from 'axios';
import { set } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { userData } = useAuth();
    const { toast } = useToast();
    const { addItem } = useCart()

    const [loading, setLoading] = useState(false);
    const [variants, setVariants] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProductVariants();
    }, [id]);

    const fetchProductVariants = async () => {
        setLoading(true);
        try {
            const payload = {
                SQLQuery: `SELECT 
                            m.ITEM_CODE AS itemCode, 
                            m.ITEM_NAME AS itemName, 
                            m.SALE_RATE AS mainSaleRate,
                            m.ITEM_BRAND AS itemBrand,
                            m.GROUP_LEVEL1 AS category,
                            -- Determine if the main product has sub-products
                            CASE
                                WHEN EXISTS (
                                    SELECT 1 
                                    FROM INVT_SUBMATERIAL_MASTER s 
                                    WHERE s.ITEM_CODE = m.ITEM_CODE
                                ) THEN 1  -- 1 indicates it has sub-products
                                ELSE 0  -- 0 indicates no sub-products
                            END AS hasSubProduct,
                            
                            -- Collect sub-products if available, using FOR JSON PATH
                            (
                                SELECT 
                                    s.ITEM_CODE As itemCode,
                                    s.ITEM_NAME AS itemName, 
                                    s.SUB_MATERIAL_NO AS subProductNo,
                                    s.ITEM_FINISH AS itemColor, 
                                    s.ITEM_SIZE AS itemSize, 
                                    s.ITEM_TYPE AS itemVariant,
                                    COALESCE(s.SALE_RATE, m.SALE_RATE) AS finalSaleRate
                                FROM INVT_SUBMATERIAL_MASTER s
                                WHERE s.ITEM_CODE = m.ITEM_CODE
                                FOR JSON PATH
                            ) AS subProducts
                        FROM INVT_MATERIAL_MASTER m
                        WHERE m.ITEM_CODE = '${id}'
                        `
            };

            const response = await getDataModelFromQueryService(payload, userData.currentUserLogin, userData.clientURL);

            const updatedResponse = [...response];

            const product = updatedResponse[0];

            const updated = await Promise.all(
                updatedResponse.map(async (item) => {
                    const parsedSubProducts =
                        item.subProducts && typeof item.subProducts === "string"
                            ? JSON.parse(item.subProducts)
                            : [];

                    const subProductsWithImages = await Promise.all(
                        parsedSubProducts.map(async (sub) => ({
                            ...sub,
                            image: await fetchSubProductImage(sub.itemCode, sub.subProductNo),
                        }))
                    );

                    return {
                        ...item,
                        image: await fetchProductImage(item.itemCode),
                        subProducts: subProductsWithImages,
                    }
                })
            )

            setVariants(updated);
        } catch (error) {
            toast({
                variant: "destructive",
                title: `Error fetching product: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProductImage = async (code) => {
        try {
            const { data } = await axios.get(
                `https://cloud.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(
                    userData.currentUserLogin
                )}&fileName=PRODUCT_IMAGE_${code}`,
                { responseType: 'blob' }
            );
            return URL.createObjectURL(data);
        } catch {
            return null;
        }
    };

    const fetchSubProductImage = async (code, no) => {
        try {
            const { data } = await axios.get(
                `https://cloud.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(
                    userData.currentUserLogin
                )}&fileName=SUB_PRODUCT_IMAGE_${code}_${no}`,
                { responseType: 'blob' }
            );
            return URL.createObjectURL(data);
        } catch {
            return null;
        }
    };

    if (!variants.length) return <p className="mt-4 text-center">No product found.</p>;

    return (
        <>
            {variants.map((item) => {
                const subs = item.subProducts || [];

                const allColors = Array.from(new Set(subs.map((s) => s.itemColor))).filter(Boolean);
                const allSizes = Array.from(new Set(subs.map((s) => s.itemSize))).filter(Boolean);
                const allVariants = Array.from(new Set(subs.map((s) => s.itemVariant))).filter(Boolean);

                const availableColors = allColors.filter((c) =>
                    subs.some((s) => s.itemColor === c && (!selectedSize || s.itemSize === selectedSize) && (!selectedVariant || s.itemVariant === selectedVariant))
                );

                const availableSizes = allSizes.filter((sz) =>
                    subs.some((s) => s.itemSize === sz && (!selectedColor || s.itemColor === selectedColor) && (!selectedVariant || s.itemVariant === selectedVariant))
                );

                const availableVariants = allVariants.filter((v) =>
                    subs.some((s) => s.itemVariant === v && (!selectedColor || s.itemColor === selectedColor) && (!selectedSize || s.itemSize === selectedSize))
                );

                const chosen = subs.find(
                    (s) => s.itemColor === selectedColor && s.itemSize === selectedSize && s.itemVariant === selectedVariant
                );

                const handleClick = (dim, value, availableSet) => {
                    setError('');
                    if (!availableSet.includes(value)) {
                        setError(`${dim} '${value}' not available`);
                        return;
                    }
                    if (dim === 'color') {
                        setSelectedColor(value);
                        setSelectedSize('');
                        setSelectedVariant('');
                    } else if (dim === 'size') {
                        setSelectedSize(value);
                        setSelectedVariant('');
                    } else if (dim === 'variant') {
                        setSelectedVariant(value);
                    }
                };

                const handleReset = () => {
                    setSelectedColor('');
                    setSelectedSize('');
                    setSelectedVariant('');
                    setError('');
                };

                const handleAddToCart = () => {
                    if (!chosen) {
                        setError('Please select a valid combination');
                        return;
                    }
                    // Use your cart context or API to add
                    addItem({
                        ...chosen,
                        itemQty: 1,
                    });

                    toast({ title: 'Added to cart' });
                };

                return loading ?
                    <BarLoader color="#36d399" height={2} width="100%" /> :
                    (!variants.length) ? <p className="mt-4 text-center">No product found.</p> :
                        (
                            <Card key={item.itemCode} className="mx-auto w-full p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image Section */}
                                    <div className="w-full md:w-1/2">
                                        <div className="h-96 w-full overflow-hidden rounded-lg bg-neutral-300">
                                            <img src={item.image || undefined} alt={item.itemName} className="h-full w-full object-contain" />
                                        </div>
                                        <Separator />
                                    </div>

                                    {/* Details Section */}
                                    <div className="flex-1">
                                        <p className="text-xl font-semibold">{item.itemName}</p>
                                        <p className="text-muted-foreground mb-3 text-sm">
                                            {item.itemBrand || "Brand not available"}, <span>{item.category}</span>
                                        </p>
                                        <Badge variant="outline">4.3 ★</Badge>

                                        {/* Color */}
                                        {allColors.length > 0 && (
                                            <div>
                                                <Label>Select Color</Label>
                                                <ToggleGroup type="single" value={selectedColor} onValueChange={val => handleClick('color', val, availableColors)} className="flex justify-start flex-wrap gap-2">
                                                    {allColors.map(c => (
                                                        <ToggleGroupItem key={c} value={c} aria-label={c} disabled={!availableColors.includes(c)}>
                                                            {c}
                                                        </ToggleGroupItem>
                                                    ))}
                                                </ToggleGroup>
                                            </div>
                                        )}

                                        {/* Size */}
                                        {allSizes.length > 0 && (
                                            <div>
                                                <Label>Select Size</Label>
                                                <ToggleGroup type="single" value={selectedSize} onValueChange={val => handleClick('size', val, availableSizes)} className="flex justify-start flex-wrap gap-2">
                                                    {allSizes.map(sz => (
                                                        <ToggleGroupItem key={sz} value={sz} aria-label={sz} disabled={!availableSizes.includes(sz)}>
                                                            {sz}
                                                        </ToggleGroupItem>
                                                    ))}
                                                </ToggleGroup>
                                            </div>
                                        )}

                                        {/* Variant */}
                                        {allVariants.length > 0 && (
                                            <div>
                                                <Label>Select Variant</Label>
                                                <ToggleGroup type="single" value={selectedVariant} onValueChange={val => handleClick('variant', val, availableVariants)} className="flex justify-start flex-wrap gap-2">
                                                    {allVariants.map(v => (
                                                        <ToggleGroupItem key={v} value={v} aria-label={v} disabled={!availableVariants.includes(v)}>
                                                            {v}
                                                        </ToggleGroupItem>
                                                    ))}
                                                </ToggleGroup>
                                            </div>
                                        )}

                                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                                        <div className="flex w-fit gap-2 mt-4">
                                            <Button variant="outline" disabled={!chosen} onClick={handleReset} className="flex-1">
                                                Reset
                                            </Button>
                                        </div>

                                        <div className="mt-6">
                                            <p className="text-2xl font-bold">
                                                {formatPrice(chosen?.finalSaleRate || item.mainSaleRate)}
                                            </p>
                                            <div className="flex gap-4 mt-4">
                                                <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
                                                    Add to Cart
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => {
                                                        if (!chosen) setError('Please select a valid combination');
                                                        else {
                                                            // buy now logic
                                                        }
                                                    }}
                                                >
                                                    Buy Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
            })}
        </>
    );
};

export default ProductDetailPage;
