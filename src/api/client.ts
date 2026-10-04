import axios from "axios";

export const api = axios.create({
  baseURL: "http://75.119.144.91:1997/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
