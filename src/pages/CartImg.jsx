import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

const CartImg = () => {
  const categories = [
    { GROUP_LEVEL1: "Anchor", productCount: 10, imageUrl: "/ilmsIcons/anchor (2).png" },
    { GROUP_LEVEL1: "Chain", productCount: 25, imageUrl: "/ilmsIcons/chain.png" },
    { GROUP_LEVEL1: "Engine", productCount: 15, imageUrl: "/ilmsIcons/engine.png" },
    { GROUP_LEVEL1: "Washer", productCount: 30, imageUrl: "/ilmsIcons/washer.png" },
    { GROUP_LEVEL1: "Screw", productCount: 8, imageUrl: "/ilmsIcons/screw.png" },
  ];

  const loading = false;

  return (
    <div className="container mx-auto flex flex-col gap-y-2">
      <h1 className="title">All Product Categories</h1>

      {loading ? (
        <div className="w-full">
          <BarLoader color="#36d399" height={2} width="100%" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category, idx) => (
            <Link
              key={idx}
              to={`/cart/${category.GROUP_LEVEL1}`}
              className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg"
            >
              {/* Image container */}
              <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.GROUP_LEVEL1}
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
                    title={category.GROUP_LEVEL1}
                  >
                    {category.GROUP_LEVEL1}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    ({category.productCount || 0})
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartImg;

// CartImg.jsx
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { BarLoader } from "react-spinners";

// const CartImg = () => {
//   const categories = [
//     { GROUP_LEVEL1: "Anchor", productCount: 10, imageUrl: "/ilmsIcons/anchor (2).png" },
//     { GROUP_LEVEL1: "Chain", productCount: 25, imageUrl: "/ilmsIcons/chain.png" },
//     { GROUP_LEVEL1: "Engine", productCount: 15, imageUrl: "/ilmsIcons/engine.png" },
//     { GROUP_LEVEL1: "Washer", productCount: 30, imageUrl: "/ilmsIcons/washer.png" },
//     { GROUP_LEVEL1: "Screw", productCount: 8, imageUrl: "/ilmsIcons/screw.png" },
//   ];

//   const loading = false;

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">All Product Categories</h1>

//       {loading ? (
//         <div className="w-full">
//           <BarLoader color="#36d399" height={2} width="100%" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {categories.map((category, idx) => (
//             <Link
//               key={idx}
//               to={`/cart/${category.GROUP_LEVEL1}`}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {category.imageUrl ? (
//                   <img
//                     src={process.env.PUBLIC_URL + category.imageUrl}
//                     alt={category.GROUP_LEVEL1}
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
//                     title={category.GROUP_LEVEL1}
//                   >
//                     {category.GROUP_LEVEL1}
//                   </h3>
//                   <span className="text-xs text-gray-500 dark:text-gray-300">
//                     ({category.productCount || 0})
//                   </span>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartImg;
// // CartImg.jsx
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { BarLoader } from "react-spinners";

// const CartImg = () => {
//   const categories = [
//     { GROUP_LEVEL1: "Anchor", productCount: 10, imageUrl: "./ilmsIcons/anchor (2).png" },
//     { GROUP_LEVEL1: "Chain", productCount: 25, imageUrl: "./ilmsIcons/chain.png" },
//     { GROUP_LEVEL1: "Engine", productCount: 15, imageUrl: "./ilmsIcons/engine.png" },
//     { GROUP_LEVEL1: "Washer", productCount: 30, imageUrl: "./ilmsIcons/washer.png" },
//     { GROUP_LEVEL1: "Screw", productCount: 8, imageUrl: "./ilmsIcons/screw.png" },
//   ];

//   const loading = false;

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">All Product Categories</h1>

//       {loading ? (
//         <div className="w-full">
//           <BarLoader color="#36d399" height={2} width="100%" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {categories.map((category, idx) => (
//             <Link
//               key={idx}
//               to={`/cart/${category.GROUP_LEVEL1}`}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {category.imageUrl ? (
//                   <img
//                     src={category.imageUrl}
//                     alt={category.GROUP_LEVEL1}
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
//                     title={category.GROUP_LEVEL1}
//                   >
//                     {category.GROUP_LEVEL1}
//                   </h3>
//                   <span className="text-xs text-gray-500 dark:text-gray-300">
//                     ({category.productCount || 0})
//                   </span>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartImg;

// // CartImg.jsx
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { BarLoader } from "react-spinners";

// const CartImg = () => {
//   const categories = [
//     { GROUP_LEVEL1: "Anchor", productCount: 10, imageUrl: "./ilmsIcons/anchor (2).png" },
//     { GROUP_LEVEL1: "Chain", productCount: 25, imageUrl: "./ilmsIcons/chain.png" },
//     { GROUP_LEVEL1: "Engine", productCount: 15, imageUrl: "./ilmsIcons/engine.png" },
//     { GROUP_LEVEL1: "Washer", productCount: 30, imageUrl: "./ilmsIcons/washer.png" },
//     { GROUP_LEVEL1: "Screw", productCount: 8, imageUrl: "./ilmsIcons/screw.png" },
//   ];

//   const loading = false;

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">All Product Categories</h1>

//       {loading ? (
//         <div className="w-full">
//           <BarLoader color="#36d399" height={2} width="100%" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {categories.map((category, idx) => (
//             <Link
//               key={idx}
//               to={`/cart/${category.GROUP_LEVEL1}`}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {category.imageUrl ? (
//                   <img
//                     src={category.imageUrl}
//                     alt={category.GROUP_LEVEL1}
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
//                     title={category.GROUP_LEVEL1}
//                   >
//                     {category.GROUP_LEVEL1}
//                   </h3>
//                   <span className="text-xs text-gray-500 dark:text-gray-300">
//                     ({category.productCount || 0})
//                   </span>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartImg;


// CartImg.jsx
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { BarLoader } from "react-spinners";

// const CartImg = () => {
//   const categories = [
//     { GROUP_LEVEL1: "Anchor", productCount: 10, imageUrl: "./ilmsIcons/anchor (2).png" },
//     { GROUP_LEVEL1: "Chain", productCount: 25, imageUrl: "./ilmsIcons/chain.png" },
//     { GROUP_LEVEL1: "Engine", productCount: 15, imageUrl: "./ilmsIcons/engine.png" },
//     { GROUP_LEVEL1: "Washer", productCount: 30, imageUrl: "./ilmsIcons/washer.png" },
//     { GROUP_LEVEL1: "Screw", productCount: 8, imageUrl: "./ilmsIcons/screw.png" },
//   ];

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

//   const loading = false;

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">All Product Categories</h1>

//       {loading ? (
//         <div className="w-full">
//           <BarLoader color="#36d399" height={2} width="100%" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {categories.map((category, idx) => (
//             <Link
//               key={idx}
//               to={{
//                 pathname: `/cart/${encodeURIComponent(category.GROUP_LEVEL1)}`,
//                 state: { products: productsByCategory[category.GROUP_LEVEL1] },
//               }}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {category.imageUrl ? (
//                   <img
//                     src={category.imageUrl}
//                     alt={category.GROUP_LEVEL1}
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
//                     title={category.GROUP_LEVEL1}
//                   >
//                     {category.GROUP_LEVEL1}
//                   </h3>
//                   <span className="text-xs text-gray-500 dark:text-gray-300">
//                     ({category.productCount || 0})
//                   </span>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartImg;

// import { ChevronRight } from "lucide-react";
// import { BarLoader } from "react-spinners";
// import { useState } from "react";

// const CartImg = () => {
//   const categories = [
//     { GROUP_LEVEL1: "Anchor", productCount: 10, imageUrl: "./ilmsIcons/anchor (2).png" },
//     { GROUP_LEVEL1: "Chain", productCount: 25, imageUrl: "./ilmsIcons/chain.png" },
//     { GROUP_LEVEL1: "Engine", productCount: 15, imageUrl: "./ilmsIcons/engine.png" },
//     { GROUP_LEVEL1: "Washer", productCount: 30, imageUrl: "./ilmsIcons/washer.png" },
//     { GROUP_LEVEL1: "Screw", productCount: 8, imageUrl: "./ilmsIcons/screw.png" },
//   ];
//   const loading = false;

//   const productsByCategory = {
//     "Anchor": Array(10).fill().map((_, i) => ({ name: `Anchor Product ${i + 1}`, imageUrl: "./ilmsIcons/anchor (2).png" })),
//     "Chain": Array(25).fill().map((_, i) => ({ name: `Chain Product ${i + 1}`, imageUrl: "./ilmsIcons/chain.png" })),
//     "Engine": Array(15).fill().map((_, i) => ({ name: `Engine Product ${i + 1}`, imageUrl: "./ilmsIcons/engine.png" })),
//     "Washer": Array(30).fill().map((_, i) => ({ name: `Washer Product ${i + 1}`, imageUrl: "./ilmsIcons/washer.png" })),
//     "Screw": Array(8).fill().map((_, i) => ({ name: `Screw Product ${i + 1}`, imageUrl: "./ilmsIcons/screw.png" })),
//   };

//   const [showModal, setShowModal] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const handleCategoryClick = (categoryName) => {
//     setSelectedProducts(productsByCategory[categoryName] || []);
//     setSelectedCategory(categoryName);
//     setShowModal(true);
//   };

//   return (
//     <div className="container mx-auto flex flex-col gap-y-2">
//       <h1 className="title">All Product Categories</h1>

//       {loading ? (
//         <div className="w-full">
//           <BarLoader color="#36d399" height={2} width="100%" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {categories.map((category, idx) => (
//             <div
//               key={idx}
//               onClick={() => handleCategoryClick(category.GROUP_LEVEL1)}
//               className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg cursor-pointer"
//             >
//               {/* Image container */}
//               <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                 {category.imageUrl ? (
//                   <img
//                     src={category.imageUrl}
//                     alt={category.GROUP_LEVEL1}
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
//                   <h3 className="line-clamp-2 truncate text-sm leading-snug group-hover:underline" title={category.GROUP_LEVEL1}>
//                     {category.GROUP_LEVEL1}
//                   </h3>
//                   <span className="text-xs text-gray-500 dark:text-gray-300">
//                     ({category.productCount || 0})
//                   </span>
//                 </div>
//                 <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
//             <h2 className="text-lg font-bold mb-4">{selectedCategory} Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {selectedProducts.map((product, idx) => (
//                 <div
//                   key={idx}
//                   className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg cursor-pointer"
//                 >
//                   {/* Image container */}
//                   <div className="w-full h-40 bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                     {product.imageUrl ? (
//                       <img
//                         src={product.imageUrl}
//                         alt={product.name}
//                         loading="lazy"
//                         onError={(e) => {
//                           e.currentTarget.onerror = null;
//                           e.currentTarget.style.display = "none";
//                         }}
//                         className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-500 dark:text-gray-300">No Image</span>
//                     )}
//                   </div>
//                   {/* Content */}
//                   <div className="p-4 flex items-center justify-between gap-5">
//                     <div className="flex items-baseline gap-1 overflow-hidden">
//                       <h3
//                         className="line-clamp-2 truncate text-sm leading-snug group-hover:underline"
//                         title={product.name}
//                       >
//                         {product.name}
//                       </h3>
//                     </div>
//                     <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartImg;