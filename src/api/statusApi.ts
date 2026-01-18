export async function fetchStatus(jobId: string) {
  const res = await fetch(`http://localhost:8000/status/${jobId}`);
  return res.json();
}
