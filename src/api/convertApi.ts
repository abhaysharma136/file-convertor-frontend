export async function startConversion(file: File, targetFormat: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const res = await fetch("http://localhost:8000/convert", {
    method: "POST",
    body: formData,
  });

  return res.json();
}
