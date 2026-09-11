import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getCategories = async () => {
  const response = await axios.get(
    `${BASE_URL}/categories/getAllCategories`,
    getAuthConfig()
  );

  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await axios.post(
    `${BASE_URL}/categories/createCategory`,
    categoryData,
    getAuthConfig()
  );

  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(
    `${BASE_URL}/categories/updateCategory/${id}`,
    categoryData,
    getAuthConfig()
  );

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}/categories/deleteCategory/${id}`,
    getAuthConfig()
  );

  return response.data;
};
