import { getSessionId, getUtmParams } from "../utils/analytics";
export interface ApiError extends Error {
  status: number;
}
const Base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function startResumeAnalyzation(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const utmParams = getUtmParams();
  const res = await fetch(`${Base}/resume/analyze`, {
    method: "POST",
    headers: {
      "X-Session-ID": getSessionId(),

      ...(utmParams.utm_source ? { "X-UTM-Source": utmParams.utm_source } : {}),

      ...(utmParams.utm_medium ? { "X-UTM-Medium": utmParams.utm_medium } : {}),

      ...(utmParams.utm_campaign
        ? { "X-UTM-Campaign": utmParams.utm_campaign }
        : {}),
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(
      typeof data.detail === "string" ? data.detail : "Request failed",
    ) as ApiError;

    error.status = res.status;

    throw error;
  }

  return data;
}
export async function fetchResumeAnalysisResult(jobId: string | null) {
  const res = await fetch(`${Base}/resume/result/${jobId}`, {
    method: "GET",
  });

  return res.json();
}
