export const convertDataModelToString = (modelName, modelData) => {
  let resultString = `[${modelName}]\n`;

  Object.entries(modelData).forEach(([key, value]) => {
    resultString += `{${key}}:[${value ?? "NULL"}]\n`;
  });

  return resultString;
};