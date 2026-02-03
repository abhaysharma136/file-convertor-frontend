export async function startResumeAnalyzation(file: File, useCredit: boolean) {
  const formData = new FormData();
  formData.append("file", file);
  // ✅ IMPORTANT: stringify boolean
  formData.append("useCredit", useCredit ? "true" : "false");
  const res = await fetch("http://localhost:8000/resume/analyze", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // 🔥 THROW ON RATE LIMIT
  if (!res.ok) {
    const error: any = new Error(data.detail || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
}

export async function fetchResumeAnalysisResult(jobId: string | null) {
  const res = await fetch(`http://localhost:8000/resume/result/${jobId}`, {
    method: "GET",
  });
  return res.json();
}
