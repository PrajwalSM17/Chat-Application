import api from "./api";
import { User } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to login");
    }
  },

  register: async (data: RegisterData): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/register",
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to register");
    }
  },

  updateStatus: async (
    status: "Available" | "Busy" | "Away" | "Offline"
  ): Promise<User> => {
    try {
      const response = await api.patch<User>("/auth/status", { status });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update status"
      );
    }
  },

  getUserProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>("/auth/profile");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to get user profile"
      );
    }
  },
};
