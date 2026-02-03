import { useEffect } from "react";
import { fetchStatus } from "../api/statusApi";
import type { data } from "../pages/ConvertPage";

type props = {
  jobId: string | null;
  onUpdate: (status: string) => void;
  onCompleted: (data: data) => void;
  onFailed: (data: data) => void;
  interval?: number;
};
export function useJobPolling({
  jobId,
  onUpdate,
  onCompleted,
  onFailed,
  interval = 2500,
}: props) {
  useEffect(() => {
    if (!jobId) return;

    const timer = setInterval(async () => {
      const data = await fetchStatus(jobId);

      onUpdate?.(data.status);

      if (data.status === "completed") {
        clearInterval(timer);
        onCompleted(data);
      }

      if (data.status === "failed") {
        clearInterval(timer);
        onFailed(data);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [jobId]);
}
