import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, } from "lucide-react";

const CategoryDetailsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const filteredProducts = storedProducts.filter((product) => product.category === category);
    setProducts(filteredProducts);
  }, [category]);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  // const handleDeleteProduct = (index) => {
  //   const updatedProducts = [...products];
  //   updatedProducts.splice(index, 1);

  //   const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  //   const newStoredProducts = storedProducts.filter(
  //     (product) => !(product.category === category && storedProducts.indexOf(product) === index)
  //   );

  //   localStorage.setItem("products", JSON.stringify(newStoredProducts));
  //   setProducts(updatedProducts);
  // };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-300 mb-4">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h2>
      {products.length === 0 ? (
        <p className="text-gray-400">No products available in this category.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {products.map((product, index) => (
            <div key={index} className="flex w-72 relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
              <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                {product.image && <img className="object-cover w-full" src={product.image} alt="product image" />}
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </div>

              <div className="mt-4 px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-white">{product.itemName}</h5>
                <div className="mt-2 mb-5 flex items-center justify-between">
                  <p>
                    <span className="text-3xl font-bold text-emerald-400">₹{product.salesPrice}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to cart
                  </button>
                  {/* <button
                    className="flex items-center justify-center rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
                    onClick={() => handleDeleteProduct(index)}
                  >
                    <Trash2 size={20} />
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetailsPage;
