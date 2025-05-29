import axios from "axios";

const API = axios.create({
  baseURL: "https://deploy-back-3.onrender.com/api/", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
