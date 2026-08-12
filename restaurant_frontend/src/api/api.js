import axios from "axios";

const api = axios.create({
  baseURL: "https://final-internship-project-kcp1.onrender.com/api",

});

export default api;