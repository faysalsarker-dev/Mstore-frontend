import axios from "axios";

const axiosCommon = axios.create({

    // baseURL: "http://localhost:5000",
  baseURL: "https://m-store-rust.vercel.app",
});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;