export async function startJdMatch(file: File, jdText: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jdText);

  const res = await fetch("http://localhost:8000/jd/match", {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function fetchJdMatchResult(jobId: string | null) {
  const res = await fetch(`http://localhost:8000/jd/match/result/${jobId}`, {
    method: "GET",
  });
  return res.json();
}
