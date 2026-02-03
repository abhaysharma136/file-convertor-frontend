export const DAILY_LIMITS = {
  resume: 3,
  match: 3,
  convert: 5,
};

export type Service = "resume" | "match" | "convert";

function getTodayKey(service: Service) {
  const today = new Date().toISOString().slice(0, 10);
  return `applyra_quota_${service}_${today}`;
}

export function getRemainingQuota(service: Service) {
  const key = getTodayKey(service);
  const used = Number(localStorage.getItem(key) || "0");
  const limit = DAILY_LIMITS[service];
  return Math.max(limit - used, 0);
}

export function incrementQuota(service: Service) {
  const key = getTodayKey(service);
  const used = Number(localStorage.getItem(key) || "0");
  localStorage.setItem(key, String(used + 1));
}
