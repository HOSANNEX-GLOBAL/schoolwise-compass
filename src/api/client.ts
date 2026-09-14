import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:7777/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});