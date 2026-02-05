const Base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export async function fetchStatus(jobId: string) {
  const res = await fetch(`${Base}/status/${jobId}`);
  return res.json();
}
