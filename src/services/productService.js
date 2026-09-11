import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getProducts = async (params = {}) => {
  const response = await axios.get(`${BASE_URL}/products/getAllProducts`, {
    params,
    ...getAuthConfig(),
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(
    `${BASE_URL}/products/getProduct/${id}`,
    getAuthConfig()
  );

  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(
    `${BASE_URL}/products/createProduct`,
    productData,
    getAuthConfig()
  );

  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(
    `${BASE_URL}/products/updateProduct/${id}`,
    productData,
    getAuthConfig()
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}/products/deleteProduct/${id}`,
    getAuthConfig()
  );

  return response.data;
};

