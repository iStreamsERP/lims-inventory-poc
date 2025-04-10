import { createSoapEnvelope, parseDataModelResponse } from "../utils/soapUtils";
import { doConnection } from "./connectionService";
import { deleteDataModelServicePayload, getDataModelPayload, saveDataServicePayload } from "./payloadBuilders";
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
  const payload = saveDataServicePayload(formData);

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

export const deleteDataModelService = async (
  formData,
  loginUserName,
  dynamicClientUrl
) => {
  const payload = deleteDataModelServicePayload(formData);

  const doConnectionResponse = await doConnection(
    loginUserName,
    dynamicClientUrl
  );

  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DataModel_DeleteData";
  const soapBody = createSoapEnvelope(
    "DataModel_DeleteData",
    payload
  );

  const soapResponse = await soapClient(
    dynamicClientUrl,
    SOAP_ACTION,
    soapBody
  );
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DataModel_DeleteData"
  );
  return parsedResponse;
};