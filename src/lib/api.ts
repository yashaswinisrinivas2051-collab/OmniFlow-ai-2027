import { type AxiosInstance } from 'axios';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL + '/api',
      timeout: 15_000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('omniflow_token') || 'demo-token-123';
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('omniflow_auth');
          localStorage.removeItem('omniflow_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  async put<T = any>(url: string, body?: unknown): Promise<T> {
    const response = await this.client.put(url, body);
    return (response.data.data ?? response.data);
  }

  async get<T = any>(url: string, params?: Record<string, string | number>): Promise<T> {
    const response = await this.client.get(url, { params });
    return (response.data.data ?? response.data);
  }

  async post<T = any>(url: string, body?: unknown): Promise<T> {
    const response = await this.client.post(url, body);
    return (response.data.data ?? response.data);
  }

  async patch<T = any>(url: string, body?: unknown): Promise<T> {
    const response = await this.client.patch(url, body);
    return (response.data.data ?? response.data);
  }

  async del<T = any>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return (response.data.data ?? response.data);
  }
}

export const api = new ApiClient();
export default api;
