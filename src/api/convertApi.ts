export async function startConversion(file: File, targetFormat: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const res = await fetch("http://localhost:8000/convert", {
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
