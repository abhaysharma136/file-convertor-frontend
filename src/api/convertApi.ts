export interface ApiError extends Error {
  status: number;
  detail: string;
}
const Base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export async function startConversion(file: File, targetFormat: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const res = await fetch(`${Base}/convert`, {
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
