// CartItemImage.jsx
import { useEffect, useState } from "react";
import { useImageAPI } from "@/hooks/useImageAPI";

const CartItemImage = ({ itemCode, subProductNo }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const { fetchImageUrl } = useImageAPI();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let blobUrl = null;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);

        const type = subProductNo ? "subproduct" : "product";
        const url = await fetchImageUrl(type, itemCode, subProductNo);

        if (isMounted) {
          // Revoke previous URL if exists
          if (imageUrl) URL.revokeObjectURL(imageUrl);

          setImageUrl(url);
          blobUrl = url; // Store for cleanup
        }
      } catch (error) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();

    // Cleanup function
    return () => {
      isMounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [itemCode, subProductNo]);

  if (loading) return <div className="h-20 w-20 animate-pulse rounded-md bg-gray-200" />;

  if (error) return <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed bg-gray-200 text-xs">Error</div>;

  if (!imageUrl) return <div className="h-20 w-20 rounded-md bg-gray-200" />;

  return (
    <img
      src={imageUrl}
      alt="product"
      width={80}
      height={80}
      className="rounded-md object-cover"
      style={{ aspectRatio: "1/1" }}
    />
  );
};

export default CartItemImage;
