import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true, // allows cookies/session headers
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
