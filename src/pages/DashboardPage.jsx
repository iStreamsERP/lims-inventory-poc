import { Package } from "lucide-react";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="card">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <Package size={26} />
            </div>
            <p className="card-title">Total Productsss</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
