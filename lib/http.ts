"use server";

import axios from "axios";
const ENV = process.env.NODE_ENV === "development" ? "dev" : "prod";

// IMPORTANT: This instance will never run in the browser
export const api = axios.create({
  baseURL: process.env.API_URL, // only server-side envs
  timeout: 3_000,
  headers: {
    "x-origin": `Checkout-SelfService-${ENV}`,
  },
});

// Optional interceptors
api.interceptors.request.use((config) => {
  // Attach server secrets here safely
  // config.headers["Authorization"] = `Bearer ${process.env.API_KEY}`;
  config.headers["x-origin"] = `Checkout-SelfService-${ENV}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.status, err.response?.data);
    throw err;
  }
);
