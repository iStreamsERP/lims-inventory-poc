import { callSoapService } from "@/api/callSoapService";

export const fetchOrderDetails = async (clientURL, salesOrderSerialNo) => {
  if (!clientURL || !salesOrderSerialNo) return [];

  const payload = {
    DataModelName: "SALES_ORDER_DETAILS",
    WhereCondition: `SALES_ORDER_SERIAL_NO = '${salesOrderSerialNo}'`,
    Orderby: "",
  };

  try {
    const response = await callSoapService(clientURL, "DataModel_GetData", payload);
    return response || [];
  } catch (error) {
    console.error("Error in fetchOrderDetails:", error);
    return [];
  }
};
