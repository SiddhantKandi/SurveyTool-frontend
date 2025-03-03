import axios from 'axios'
import {VITE_APP_BASE_URL} from '../utils/constants.js'

export const axiosInstance = axios.create({
  withCredentials: true
});

const baseUrl = VITE_APP_BASE_URL; //Base url of the backend


export const apiConnector = (method, url, bodyData, headers, params) => {
  const token = localStorage.getItem("accessToken") ? JSON.parse(localStorage.getItem("accessToken")) : null;

  const backendUrl = baseUrl + url;

  return axiosInstance({
    method,
    url : backendUrl,
    data: bodyData ? bodyData : null,
    headers: {Authorization: `Bearer ${token}`, ...headers},
    params: params ? params : null,
  });
};