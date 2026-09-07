const SESSION_ID_KEY = "applyra_session_id";
const UTM_SOURCE_KEY = "applyra_utm_source";
const UTM_MEDIUM_KEY = "applyra_utm_medium";
const UTM_CAMPAIGN_KEY = "applyra_utm_campaign";

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

export function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search);

  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");

  if (utmSource && !localStorage.getItem(UTM_SOURCE_KEY)) {
    localStorage.setItem(UTM_SOURCE_KEY, utmSource);
  }

  if (utmMedium && !localStorage.getItem(UTM_MEDIUM_KEY)) {
    localStorage.setItem(UTM_MEDIUM_KEY, utmMedium);
  }

  if (utmCampaign && !localStorage.getItem(UTM_CAMPAIGN_KEY)) {
    localStorage.setItem(UTM_CAMPAIGN_KEY, utmCampaign);
  }
}


export function getUtmParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  return {
    utm_source: localStorage.getItem(UTM_SOURCE_KEY) || undefined,
    utm_medium: localStorage.getItem(UTM_MEDIUM_KEY) || undefined,
    utm_campaign: localStorage.getItem(UTM_CAMPAIGN_KEY) || undefined,
  };
}