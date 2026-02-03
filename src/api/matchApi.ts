export async function startJdMatch(
  file: File,
  jdText: string,
  useCredit: boolean,
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jdText);
  formData.append("useCredit", useCredit ? "true" : "false");
  const res = await fetch("http://localhost:8000/jd/match", {
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

export async function fetchJdMatchResult(jobId: string | null) {
  const res = await fetch(`http://localhost:8000/jd/match/result/${jobId}`, {
    method: "GET",
  });
  return res.json();
}
