import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials) => {
  const response = await axios.post(
    `${BASE_URL}/auth/login`,
    credentials
  );

  return response.data;
};

export const register = async (userDetails) => {
  const response = await axios.post(
    `${BASE_URL}/auth/register`,
    userDetails
  );

  return response.data;
};