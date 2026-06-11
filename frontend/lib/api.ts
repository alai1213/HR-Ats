type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const options: RequestInit = {
    method,
    headers: defaultHeaders,
  };

  if (body && !(body instanceof FormData)) {
    options.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
    options.body = body;
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export class ApiClient {
  static get<T>(endpoint: string): Promise<T> {
    return request<T>("GET", endpoint);
  }

  static post<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>("POST", endpoint, body);
  }

  static patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>("PATCH", endpoint, body);
  }

  static delete<T>(endpoint: string): Promise<T> {
    return request<T>("DELETE", endpoint);
  }

  static upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return request<T>("POST", endpoint, formData);
  }
}
