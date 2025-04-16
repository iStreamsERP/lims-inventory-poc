import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getDataModelService } from '@/services/dataModelService';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { userData } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [productDetail, setProductDetail] = useState([]);

    useEffect(() => {
        fetchProductDetail();
    }, []);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const payload = {
                DataModelName: 'INVT_MATERIAL_MASTER',
                WhereCondition: `ITEM_CODE = '${id}'`,
                Orderby: '',
            };

            const response = await getDataModelService(
                payload,
                userData.currentUserLogin,
                userData.clientURL
            );
            setProductDetail(response);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: `Error fetching product detail: ${error?.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    console.log(productDetail);


    return loading ? (
        <BarLoader color="#36d399" height={2} width="100%" />
    ) : (
        productDetail?.length > 0 ? (
            productDetail.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-156px)] gap-x-2 ">
                    <div className="bg-slate-900 h-full">
                        <img
                            src="https://www.urbanofashion.com/cdn/shop/files/jeanloose-lblue-3.jpg?v=1708169302"
                            alt={item.ITEM_NAME || 'Product Image'}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <div className="overflow-y-auto col-span-2">
                        <h2 className="text-2xl mb-1">{item.ITEM_NAME}</h2>
                        <h2 className="text-xl font-bold mb-4">₹{item.SALE_RATE}</h2>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center mt-4">No product details found.</p>
        )
    );
};

export default ProductDetailPage;