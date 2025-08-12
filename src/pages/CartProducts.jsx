import { ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";

const CartProducts = () => {
  const { category } = useParams();

  const productsByCategory = {
    Anchor: Array(10)
      .fill()
      .map((_, i) => ({ name: `Anchor Product ${i + 1}`, imageUrl: "/ilmsIcons/anchor (2).png" })),
    Chain: Array(25)
      .fill()
      .map((_, i) => ({ name: `Chain Product ${i + 1}`, imageUrl: "/ilmsIcons/chain.png" })),
    Engine: Array(15)
      .fill()
      .map((_, i) => ({ name: `Engine Product ${i + 1}`, imageUrl: "/ilmsIcons/engine.png" })),
    Washer: Array(30)
      .fill()
      .map((_, i) => ({ name: `Washer Product ${i + 1}`, imageUrl: "/ilmsIcons/washer.png" })),
    Screw: Array(8)
      .fill()
      .map((_, i) => ({ name: `Screw Product ${i + 1}`, imageUrl: "/ilmsIcons/screw.png" })),
  };

  const selectedProducts = productsByCategory[category] || [];

  return (
    <div className="container mx-auto flex flex-col gap-y-2">
      <h1 className="title">{category} Products</h1>
      {selectedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {selectedProducts.map((product, idx) => (
            <div
              key={idx}
              className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg cursor-pointer"
            >
              {/* Image container */}
              <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
                    }}
                    className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-300">No Image</span>
                )}
              </div>
              {/* Content */}
              <div className="p-4 flex items-center justify-between gap-5">
                <div className="flex items-baseline gap-1 overflow-hidden">
                  <h3
                    className="line-clamp-2 truncate text-sm leading-snug group-hover:underline"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-300">No products found for this category.</p>
      )}
    </div>
  );
};

export default CartProducts;

// CartProducts.jsx
// import { ChevronRight } from "lucide-react";
// import { useParams } from "react-router-dom";

// const CartProducts = () => {
//   const { category } = useParams();

//   const productsByCategory = {
//     Anchor: Array(10)
//       .fill()
//       .map((_, i) => ({ name: `Anchor Product ${i + 1}`, imageUrl: "/ilmsIcons/anchor (2).png" })),
//     Chain: Array(25)
//       .fill()
//       .map((_, i) => ({ name: `Chain Product ${i + 1}`, imageUrl: "/ilmsIcons/chain.png" })),
//     Engine: Array(15)
//       .fill()
//       .map((_, i) => ({ name: `Engine Product ${i + 1}`, imageUrl: "/ilmsIcons/engine.png" })),
//     Washer: Array(30)
//       .fill()
//       .map((_, i) => ({ name: `Washer Product ${i + 1}`, imageUrl: "/ilmsIcons/washer.png" })),
//     Screw: Array(8)
//       .fill()
//       .map((_, i) => ({ name: `Screw Product ${i + 1}`, imageUrl: "/ilmsIcons/screw.png" })),
//   };

//   const selectedProducts = productsByCategory[category] || [];

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">{category} Products</h1>
//       {selectedProducts.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {selectedProducts.map((product, idx) => (
//             <div
//               key={idx}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg cursor-pointer"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {product.imageUrl ? (
//                   <img
//                     src={process.env.PUBLIC_URL + product.imageUrl}
//                     alt={product.name}
//                     loading="lazy"
//                     onError={(e) => {
//                       e.currentTarget.onerror = null;
//                       e.currentTarget.style.display = "none";
//                     }}
//                     className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-500 dark:text-gray-300">No Image</span>
//                 )}
//               </div>
//               {/* Content */}
//               <div className="p-4 flex items-center justify-between gap-5">
//                 <div className="flex items-baseline gap-1 overflow-hidden">
//                   <h3
//                     className="line-clamp-2 truncate text-sm leading-snug group-hover:underline"
//                     title={product.name}
//                   >
//                     {product.name}
//                   </h3>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 dark:text-gray-300">No products found for this category.</p>
//       )}
//     </div>
//   );
// };

// export default CartProducts;

// // CartProducts.jsx
// import { ChevronRight } from "lucide-react";
// import { useParams } from "react-router-dom";

// const CartProducts = () => {
//   const { category } = useParams();

//   const productsByCategory = {
//     Anchor: Array(10)
//       .fill()
//       .map((_, i) => ({ name: `Anchor Product ${i + 1}`, imageUrl: "./ilmsIcons/anchor (2).png" })),
//     Chain: Array(25)
//       .fill()
//       .map((_, i) => ({ name: `Chain Product ${i + 1}`, imageUrl: "./ilmsIcons/chain.png" })),
//     Engine: Array(15)
//       .fill()
//       .map((_, i) => ({ name: `Engine Product ${i + 1}`, imageUrl: "./ilmsIcons/engine.png" })),
//     Washer: Array(30)
//       .fill()
//       .map((_, i) => ({ name: `Washer Product ${i + 1}`, imageUrl: "./ilmsIcons/washer.png" })),
//     Screw: Array(8)
//       .fill()
//       .map((_, i) => ({ name: `Screw Product ${i + 1}`, imageUrl: "./ilmsIcons/screw.png" })),
//   };

//   const selectedProducts = productsByCategory[category] || [];

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">{category} Products</h1>
//       {selectedProducts.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {selectedProducts.map((product, idx) => (
//             <div
//               key={idx}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg cursor-pointer"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {product.imageUrl ? (
//                   <img
//                     src={product.imageUrl}
//                     alt={product.name}
//                     loading="lazy"
//                     onError={(e) => {
//                       e.currentTarget.onerror = null;
//                       e.currentTarget.style.display = "none";
//                     }}
//                     className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-500 dark:text-gray-300">No Image</span>
//                 )}
//               </div>
//               {/* Content */}
//               <div className="p-4 flex items-center justify-between gap-5">
//                 <div className="flex items-baseline gap-1 overflow-hidden">
//                   <h3
//                     className="line-clamp-2 truncate text-sm leading-snug group-hover:underline"
//                     title={product.name}
//                   >
//                     {product.name}
//                   </h3>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 dark:text-gray-300">No products found for this category.</p>
//       )}
//     </div>
//   );
// };

// export default CartProducts;

// // CartProducts.jsx
// import { ChevronRight } from "lucide-react";
// import { useParams } from "react-router-dom";

// const CartProducts = () => {
//   const { category } = useParams();

//   const productsByCategory = {
//     Anchor: Array(10)
//       .fill()
//       .map((_, i) => ({ name: `Anchor Product ${i + 1}`, imageUrl: "./ilmsIcons/anchor (2).png" })),
//     Chain: Array(25)
//       .fill()
//       .map((_, i) => ({ name: `Chain Product ${i + 1}`, imageUrl: "./ilmsIcons/chain.png" })),
//     Engine: Array(15)
//       .fill()
//       .map((_, i) => ({ name: `Engine Product ${i + 1}`, imageUrl: "./ilmsIcons/engine.png" })),
//     Washer: Array(30)
//       .fill()
//       .map((_, i) => ({ name: `Washer Product ${i + 1}`, imageUrl: "./ilmsIcons/washer.png" })),
//     Screw: Array(8)
//       .fill()
//       .map((_, i) => ({ name: `Screw Product ${i + 1}`, imageUrl: "./ilmsIcons/screw.png" })),
//   };

//   const selectedProducts = productsByCategory[category] || [];

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">{category} Products</h1>
//       {selectedProducts.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {selectedProducts.map((product, idx) => (
//             <div
//               key={idx}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg cursor-pointer"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {product.imageUrl ? (
//                   <img
//                     src={product.imageUrl}
//                     alt={product.name}
//                     loading="lazy"
//                     onError={(e) => {
//                       e.currentTarget.onerror = null;
//                       e.currentTarget.style.display = "none";
//                     }}
//                     className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-500 dark:text-gray-300">No Image</span>
//                 )}
//               </div>
//               {/* Content */}
//               <div className="p-4 flex items-center justify-between gap-5">
//                 <div className="flex items-baseline gap-1 overflow-hidden">
//                   <h3
//                     className="line-clamp-2 truncate text-sm leading-snug group-hover:underline"
//                     title={product.name}
//                   >
//                     {product.name}
//                   </h3>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 dark:text-gray-300">No products found for this category.</p>
//       )}
//     </div>
//   );
// };

// export default CartProducts;

// // CartProducts.jsx
// import { ChevronRight } from "lucide-react";
// import { useLocation, useParams } from "react-router-dom";

// const CartProductsProducts = () => {
//   const { category } = useParams();
//   const { state } = useLocation();
//   const decodedCategory = decodeURIComponent(category);
//   const selectedProducts = state?.products || [];

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">{decodedCategory} Products</h1>
//       {selectedProducts.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {selectedProducts.map((product, idx) => (
//             <div
//               key={idx}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg cursor-pointer"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {product.imageUrl ? (
//                   <img
//                     src={product.imageUrl}
//                     alt={product.name}
//                     loading="lazy"
//                     onError={(e) => {
//                       e.currentTarget.onerror = null;
//                       e.currentTarget.style.display = "none";
//                     }}
//                     className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-500 dark:text-gray-300">No Image</span>
//                 )}
//               </div>
//               {/* Content */}
//               <div className="p-4 flex items-center justify-between gap-5">
//                 <div className="flex items-baseline gap-1 overflow-hidden">
//                   <h3
//                     className="line-clamp-2 truncate text-sm leading-snug group-hover:underline"
//                     title={product.name}
//                   >
//                     {product.name}
//                   </h3>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 dark:text-gray-300">No products found for this category.</p>
//       )}
//     </div>
//   );
// };

// export default CartProducts;