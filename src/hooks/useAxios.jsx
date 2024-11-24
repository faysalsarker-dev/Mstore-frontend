import axios from "axios";

const axiosCommon = axios.create({

  baseURL: "http://localhost:5000",
  // baseURL: "https://backend-topaz-eta.vercel.app",
});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;