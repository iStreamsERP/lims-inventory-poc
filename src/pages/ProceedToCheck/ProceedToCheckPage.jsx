import { useState } from "react";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";

const ProceedToCheckPage = () => {
  const [activeTab, setActiveTab] = useState("bill");

  const renderTabContent = () => {
    switch (activeTab) {
      case "bill":
        return <Tab1 />;
      case "confirmation":
        return <Tab2 />;
      case "receipt":
        return <Tab3 />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        <button onClick={() => setActiveTab("bill")}>Bill & Payment</button>
        <button onClick={() => setActiveTab("confirmation")}>Confirmation</button>
        <button onClick={() => setActiveTab("receipt")}>Your Receipt</button>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default ProceedToCheckPage;
