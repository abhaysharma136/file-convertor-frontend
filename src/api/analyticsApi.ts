const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function trackEvent(payload: {
  event_name: string;
  feature?: string;
  source?: string;
}) {
  try {
    await fetch(
      `${API_BASE_URL}/analytics/track`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      },
    );
  } catch {
    // Silent fail
  }
}