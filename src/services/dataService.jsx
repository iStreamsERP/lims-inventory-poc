import soapClient from "./soapClient";
import { createSoapEnvelope, parseDataModelResponse } from "../utils/soapUtils";
import { getDataModelPayload } from "./payloadBuilders";
import { doConnection } from "./connectionService";

export const getDataModel = async (para, loginUserName, dynamicClientUrl) => {
  const payload = getDataModelPayload(para);

  const doConnectionResponse = await doConnection(
    loginUserName,
    dynamicClientUrl
  );
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DataModel_GetData";
  const soapBody = createSoapEnvelope("DataModel_GetData", payload);

  const soapResponse = await soapClient(
    dynamicClientUrl,
    SOAP_ACTION,
    soapBody
  );
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DataModel_GetData"
  );

  return parsedResponse;
};
