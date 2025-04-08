import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { createSoapEnvelope, parseDataModelResponse } from "../utils/soapUtils";
import { doConnection } from "./connectionService";
import { getDataModelPayload, saveDataServicePayload } from "./payloadBuilders";
import soapClient from "./soapClient";

export const getDataModelService = async (formData, loginUserName, dynamicClientUrl) => {

  const payload = getDataModelPayload(formData);

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

export const saveDataService = async (
  formData,
  loginUserName,
  dynamicClientUrl
) => {
  const dataModelData = convertDataModelToStringData("CLIENT_MASTER", formData);

  const payload = saveDataServicePayload(loginUserName, dataModelData);

  const doConnectionResponse = await doConnection(
    loginUserName,
    dynamicClientUrl
  );

  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DataModel_SaveData";
  const soapBody = createSoapEnvelope(
    "DataModel_SaveData",
    payload
  );

  const soapResponse = await soapClient(
    dynamicClientUrl,
    SOAP_ACTION,
    soapBody
  );
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DataModel_SaveData"
  );
  return parsedResponse;
};