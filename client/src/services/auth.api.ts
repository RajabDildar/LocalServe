import { api } from "./api";
import { type IUser } from "../types/user.types";

export interface ILoginInput {
  email: string;
  password: string;
}
export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role: "customer" | "provider";
  phone?: string;
}
export interface ILoginResponseData {
  accessToken: string;
  user: Pick<IUser, "name" | "role"> & { id: string };
}

export interface IResetPasswordInput {
  token: string;
  password: string;
}

export const authApi = {
  login: async (
    data: ILoginInput,
  ): Promise<{ success: boolean; message: string; data: ILoginResponseData }> =>
    api.post("/auth/login", data),
  register: async (
    data: IRegisterInput,
  ): Promise<{ success: boolean; message: string; data: { userId: string } }> =>
    api.post("/auth/register", data),
  logout: async (): Promise<{ success: boolean; message: string }> =>
    api.post("/auth/logout"),
  refreshToken: async (): Promise<{
    success: boolean;
    data: { accessToken: string };
  }> => api.post("/auth/refresh-token"),
  getMe: async (): Promise<{ success: boolean; data: IUser }> =>
    api.get("/auth/me"),
  forgotPassword: async (
    email: string,
  ): Promise<{ success: boolean; message: string }> =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: async ({
    token,
    password,
  }: IResetPasswordInput): Promise<{ success: boolean; message: string }> =>
    api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: async (
    token: string,
  ): Promise<{ success: boolean; message: string }> =>
    api.post(`/auth/verify-email/${token}`),
  resendVerification: async (
    email: string,
  ): Promise<{ success: boolean; message: string }> =>
    api.post("/auth/resend-verification", { email }),
};
