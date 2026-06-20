import axios from "axios";
import { getToken } from "./authService";

const API = "http://localhost:5000/api/tasks";

// Create axios instance with auth header
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getTasks = (params) => axios.get(API, { ...getAuthConfig(), params });

export const createTask = (task) =>
  axios.post(API, task, getAuthConfig());

export const updateTask = (id, data) =>
  axios.put(`${API}/${id}`, data, getAuthConfig());

export const deleteTask = (id) =>
  axios.delete(`${API}/${id}`, getAuthConfig());

export const getStats = () =>
  axios.get(`${API}/stats`, getAuthConfig());