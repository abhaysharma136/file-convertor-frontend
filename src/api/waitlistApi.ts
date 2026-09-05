const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type WaitlistPayload = {
  email: string;
  feature?: "ai_resume" | "jd_match" | "waitlist";
  source?: string;
};

export async function joinWaitlist(payload: WaitlistPayload) {
  const response = await fetch(
    `${API_BASE_URL}/waitlist/join`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to join waitlist");
  }

  return data;
}