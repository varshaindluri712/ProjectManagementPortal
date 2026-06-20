import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Register
export const register = (name, email, password, passwordConfirm) =>
  axios.post(`${API_BASE}/auth/register`, {
    name,
    email,
    password,
    passwordConfirm
  });

// Login
export const login = (email, password) =>
  axios.post(`${API_BASE}/auth/login`, {
    email,
    password
  });

// Get token from localStorage
export const getToken = () => localStorage.getItem("authToken");

// Save token to localStorage
export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Remove token from localStorage
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Save user to localStorage
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};
