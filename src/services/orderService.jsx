import { callSoapService } from "@/api/callSoapService";

export const fetchOrderMaster = async (clientURL, salesOrderSerialNo) => {
  if (!clientURL || !salesOrderSerialNo) return [];

  const payload = {
    DataModelName: "SALES_ORDER_MASTER",
    WhereCondition: `SALES_ORDER_SERIAL_NO = '${salesOrderSerialNo}'`,
    Orderby: "",
  };

  try {
    const response = await callSoapService(clientURL, "DataModel_GetData", payload);
    return response[0] || {};
  } catch (error) {
    console.error("Error in fetchOrderMaster:", error);
    return {};
  }
};

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

export const fetchClientDetails = async (clientURL, clientId) => {
  if (!clientURL) return [];

  const payload = {
    DataModelName: "CLIENT_MASTER",
    WhereCondition: `CLIENT_ID = '${clientId}'`,
    Orderby: "",
  };

  try {
    const response = await callSoapService(clientURL, "DataModel_GetData", payload);
    return response || [];
  } catch (error) {
    console.error("Error in fetchClientDetails:", error);
    return [];
  }
};

export const deleteSalesOrder = async ({ clientURL, userEmail, serialNo }) => {
  const detailPayload = {
    UserName: userEmail,
    DataModelName: "SALES_ORDER_DETAILS",
    WhereCondition: `SALES_ORDER_SERIAL_NO = ${serialNo}`,
  };
  await callSoapService(clientURL, "DataModel_DeleteData", detailPayload);

  // Delete from SALES_ORDER_MASTER
  const masterPayload = {
    UserName: userEmail,
    DataModelName: "SALES_ORDER_MASTER",
    WhereCondition: `SALES_ORDER_SERIAL_NO = ${serialNo}`,
  };
  await callSoapService(clientURL, "DataModel_DeleteData", masterPayload);
};
