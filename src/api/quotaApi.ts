export interface ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
}
export interface ServiceQuotaResponse {
  service: string;
  remaining_free: number;
  daily_limit: number;
  credits_left: number;
  can_run: boolean;
}
interface BackendErrorResponse {
  detail?: {
    error?: string;
    message?: string;
    available_services?: string[];
  };
}
const Base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export async function fetchServiceQuota(
  service: string,
): Promise<ServiceQuotaResponse> {
  const res = await fetch(`${Base}/usage/${service}`);
  const data = (await res.json()) as
    | ServiceQuotaResponse
    | BackendErrorResponse;

  if (!res.ok) {
    const backendError = data as BackendErrorResponse;

    const error = new Error(
      backendError.detail?.message || "Request failed",
    ) as ApiError;

    error.status = res.status;
    error.code = backendError.detail?.error;
    error.details = backendError.detail;

    throw error;
  }

  return data as ServiceQuotaResponse;
}
