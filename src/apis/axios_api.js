import axios from "axios";

export default axios.create({
  baseURL: "http://178.128.233.31/frontend/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});
