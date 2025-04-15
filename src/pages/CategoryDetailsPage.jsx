import React from 'react';

const CategoryDetailsPage = () => {
  return (
    <div>
      <div className="relative rounded-lg overflow-hidden h-64 shadow-lg">
        {/* Image */}
        <img
          src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTWb1rt1_rsiyEBoRaXj91SsVDTD7cQjGb5_b1ebTOokIFoGM0paqWhWnCDA-aUsSB1t4sTEnshW5kX-JT_IoaCoIVRP2NKP56oqq_e6Ew"
          alt="Category Banner"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

        {/* Text */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-10">
          <h1 className="text-white text-4xl sm:text-5xl font-normal tracking-wide">
            Explore Products
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
