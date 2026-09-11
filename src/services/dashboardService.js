import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getDashboardStats = async () => {
  const response = await axios.get(
    `${BASE_URL}/dashboard/getDashboardStats`,
    getAuthConfig()
  );

  return response.data;
};
