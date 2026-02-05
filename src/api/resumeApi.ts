export interface ApiError extends Error {
  status: number;
}
const Base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export async function startResumeAnalyzation(file: File, useCredit: boolean) {
  const formData = new FormData();
  formData.append("file", file);
  // ✅ IMPORTANT: stringify boolean
  formData.append("useCredit", useCredit ? "true" : "false");
  const res = await fetch(`${Base}/resume/analyze`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // 🔥 THROW ON RATE LIMIT
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
