const TOKEN_KEY = "token";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const saveAuthToken = (response) => {
  const token = typeof response === "string"
    ? response
    : response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;

  if (!token) throw new Error("Authentication token was not returned by the server.");

  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);
