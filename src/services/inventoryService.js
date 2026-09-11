import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const increaseStock = async (id, quantity) => {
  const response = await axios.put(
    `${BASE_URL}/inventory/increase/${id}`,
    { quantity },
    getAuthConfig()
  );

  return response.data;
};

export const decreaseStock = async (id, quantity) => {
  const response = await axios.put(
    `${BASE_URL}/inventory/decrease/${id}`,
    { quantity },
    getAuthConfig()
  );

  return response.data;
};
