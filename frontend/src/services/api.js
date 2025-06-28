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

// import axios from "axios";

// const USER_API_BASE = "http://localhost:8000/api/v1/users"; //
// const POST_API_BASE = "http://localhost:8000/api/v1/posts"; //

// const apiService = {
//   register: (userData) =>
//     axios.post(`${USER_API_BASE}/register`, userData, {
//       withCredentials: true,
//     }),
//   login: (credentials) =>
//     axios.post(`${USER_API_BASE}/login`, credentials, {
//       withCredentials: true,
//     }),
//   updateAccount: (data) =>
//     axios.patch(`${USER_API_BASE}/update-account`, data, {
//       withCredentials: true,
//     }),
//   logout: () =>
//     axios.post(`${USER_API_BASE}/logout`, {}, { withCredentials: true }),
//   getCurrentUser: () =>
//     axios.get(`${USER_API_BASE}/current-user`, { withCredentials: true }),

//   // post
//   createPost: (postData) =>
//     axios.post(`${POST_API_BASE}/createPost`, postData, {
//       withCredentials: true,
//     }),
//   getPostById: (id) => axios.get(`${POST_API_BASE}/${id}`),
//   deletePost: (id) =>
//     axios.delete(`${POST_API_BASE}/delete/${id}`, { withCredentials: true }),
//   toggleLikePost: (id) =>
//     axios.patch(`${POST_API_BASE}/like/${id}`, {}, { withCredentials: true }),
//   getUserPosts: (userId) => axios.get(`${POST_API_BASE}/user/${userId}`),
//   getPosts: () =>
//   axios.get(`${POST_API_BASE}/all`, { withCredentials: true }),

// };

// export default apiService;

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const USER_API_BASE = `${API_BASE}/v1/users`;
const POST_API_BASE = `${API_BASE}/v1/posts`;

// Create axios instance with interceptors
const axiosInstance = axios.create({
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // Handle common error cases
    if (error.response?.status === 401) {
      // Clear any stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

const apiService = {
  // Auth methods
  register: (userData) =>
    axiosInstance.post(`${USER_API_BASE}/register`, userData),

  login: (credentials) =>
    axiosInstance.post(`${USER_API_BASE}/login`, credentials),

  updateAccount: (data) =>
    axiosInstance.patch(`${USER_API_BASE}/update-account`, data),

  logout: () => axiosInstance.post(`${USER_API_BASE}/logout`, {}),

  getCurrentUser: () => axiosInstance.get(`${USER_API_BASE}/current-user`),

  // Post methods - Updated to match your backend routes
  createPost: (postData) => axiosInstance.post(`${POST_API_BASE}`, postData), // Changed from /createPost to /

  getPostById: (id) => {
    console.log("Getting post by ID:", id);
    return axiosInstance.get(`${POST_API_BASE}/${id}`);
  },

  deletePost: (id) => axiosInstance.delete(`${POST_API_BASE}/${id}`), // Changed from /delete/${id} to /${id}

  toggleLikePost: (id) => axiosInstance.post(`${POST_API_BASE}/${id}/like`, {}), // Changed from /like/${id} to /${id}/like

  getUserPosts: (userId) => {
    // console.log("=== getUserPosts Debug ===");
    // console.log("Received userId:", userId);
    // console.log("userId type:", typeof userId);
    // console.log("userId length:", userId?.length);
    console.log(
      "Is userId valid:",
      userId && userId !== "undefined" && userId.length >= 12
    );

    // Validate before making the request
    if (!userId || userId === "undefined" || typeof userId !== "string") {
      console.error("Invalid userId provided to getUserPosts:", userId);
      return Promise.reject(new Error(`Invalid userId: ${userId}`));
    }

    const url = `${POST_API_BASE}/user/${userId}`;
    console.log("Making request to:", url);

    return axiosInstance.get(url);
  },

  getAllPosts: () => axiosInstance.get(`${POST_API_BASE}/all`),
  getPublicPosts: () => axiosInstance.get(`${POST_API_BASE}/public`),
};

export default apiService;
