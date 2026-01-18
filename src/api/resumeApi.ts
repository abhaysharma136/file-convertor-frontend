export async function startResumeAnalyzation(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8000/resume/analyze", {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function fetchResumeAnalysisResult(jobId: string | null) {
  const res = await fetch(`http://localhost:8000/resume/result/${jobId}`, {
    method: "GET",
  });
  return res.json();
}
