import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await api.request<T>({
      url: path,
      method,
      headers,
      data: body,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      const msg =
        data && typeof data.mensagem === "string"
          ? data.mensagem
          : data && typeof data.message === "string"
            ? data.message
            : `Erro inesperado (HTTP ${status}).`;
      throw new ApiError(status, msg);
    }
    throw error;
  }
}
