export const getResponseData = (response) => response?.data ?? response;

export const getCollection = (response, key) => {
  const data = getResponseData(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];

  return [];
};

export const getRecord = (response, key) => {
  const data = getResponseData(response);
  return data?.[key] ?? data;
};

export const getEntityId = (entity) => {
  if (typeof entity === "string" || typeof entity === "number") return entity;

  return entity?.id ?? entity?._id;
};

export const getCategoryName = (category) =>
  typeof category === "object" ? category?.name ?? "Uncategorized" : category || "Uncategorized";
