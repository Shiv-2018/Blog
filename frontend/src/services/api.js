// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// class ApiService {
//   constructor() {
//     this.baseURL = API_BASE_URL;
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const token = localStorage.getItem("token");

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }),
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Something went wrong");
//       }

//       return data;
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   }

//   // Authentication methods
//   async register(userData) {
//     return this.request("/auth/register", {
//       method: "POST",
//       body: JSON.stringify(userData),
//     });
//   }

//   async login(credentials) {
//     return this.request("/auth/login", {
//       method: "POST",
//       body: JSON.stringify(credentials),
//     });
//   }

//   async logout() {
//     return this.request("/auth/logout", {
//       method: "POST",
//     });
//   }

//   async getCurrentUser() {
//     return this.request("/auth/me");
//   }

//   // Blog post methods
//   async getPosts(params = {}) {
//     const queryString = new URLSearchParams(params).toString();
//     const endpoint = queryString ? `/posts?${queryString}` : "/posts";
//     return this.request(endpoint);
//   }

//   async getPublicPosts(limit = 6) {
//     return this.request(`/posts/public?limit=${limit}`);
//   }

//   async getPost(id) {
//     return this.request(`/posts/${id}`);
//   }

//   async createPost(postData) {
//     return this.request("/posts", {
//       method: "POST",
//       body: JSON.stringify(postData),
//     });
//   }

//   async updatePost(id, postData) {
//     return this.request(`/posts/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(postData),
//     });
//   }

//   async deletePost(id) {
//     return this.request(`/posts/${id}`, {
//       method: "DELETE",
//     });
//   }

//   // User posts
//   async getUserPosts(userId) {
//     return this.request(`/users/${userId}/posts`);
//   }
// }

// export default new ApiService();

import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1/users"; // adjust to your backend URL

const apiService = {
  register: (userData) => axios.post(`${API_BASE}/register`, userData, { withCredentials: true }),
  login: (credentials) => axios.post(`${API_BASE}/login`, credentials, { withCredentials: true }),
  updateAccount: (data) => axios.patch(`${API_BASE}/update-account`, data, { withCredentials: true }),
  logout: () => axios.post(`${API_BASE}/logout`, {}, { withCredentials: true }),
};

export default apiService;
