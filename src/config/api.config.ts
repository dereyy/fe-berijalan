import axios from "axios";
import { env } from "./env.config";

const BASE_URL = env.APP.API_URL || "http://localhost:3000";
const API_KEY = env.APP.API_KEY || undefined;

export const satellite = axios.create({
  baseURL: BASE_URL,
  headers: API_KEY ? { APIKey: API_KEY, "Content-Type": "application/json" } : { "Content-Type": "application/json" },
  withCredentials: true,
});

// attach token from localStorage for client requests
satellite.interceptors.request.use(function (request) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && request && request.headers) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    console.log("satellite request ->", request?.baseURL, request?.url);
  } catch (e) {}
  return request;
});

satellite.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      console.log("error in main", error?.message, error?.config?.url, error?.config?.baseURL);
    } catch (e) {}
    return Promise.reject(error);
  }
);
