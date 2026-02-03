import { useEffect, useState } from "react";
import "../App.css";
import Dropzone from "../components/Dropzone";
import {
  fetchResumeAnalysisResult,
  startResumeAnalyzation,
} from "../api/resumeApi";
import { useJobPolling } from "../hooks/useJobPolling";
import { Loader2, Search } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import FileInfo from "../components/FileInfo";
import ActionButton from "../components/ActionButton";
import ATSScoreCard from "../components/ATSScoreCard";
import ImprovementsList, {
  type Suggestion,
} from "../components/ImprovementsList";
import StatusIndicator from "../components/StatusIndicator";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 5;
type result = {
  ats_score: number;
  issues: string[];
  breakdown: {
    sections: number;
    skills: number;
    experience: number;
    length: number;
  };
  suggestion_source: string;
  ai_suggestions: {
    suggestions: Suggestion[];
    rewritten_bullets: string[];
    missing_keywords: string[];
    severity: string;
  };
};

type data = {
  job_id: string;
  status: string;
  download_url: string;
  error: string;
};
type Phase = "idle" | "ready" | "running" | "done";
type UsageState = {
  remaining_free: number;
  daily_limit: number;
  credits_left: number;
  can_run: boolean;
};
type UpgradeReason = "quota_exhausted" | "unlock_ai" | "confirm_credit";
export default function ResumePage() {
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>(
    null,
  );

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [usage, setUsage] = useState<UsageState | null>(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<UpgradeReason | null>(
    null,
  );

  // ---------------- RESET ----------------
  const resetJob = () => {
    setJobId(null);
    setStatus(null);
    setError(null);
  };

  // ---------------- FILE HANDLING ----------------
  const validateFile = (file: File | null | undefined) => {
    if (!file) return "No file selected";

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_FILE_SIZE_MB}MB`;
    }

    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      return "Unsupported file type";
    }

    return null;
  };

  const handleFileChange = (file: File | null | undefined) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setPhase("ready");
    resetJob();
  };

  // ---------------- UPLOAD ----------------

  const handleUpload = async (useCredit = false) => {
    if (!selectedFile) return;

    // 🚫 BLOCKED: no free + no credits
    if (usage.remaining_free === 0 && usage.credits_left === 0) {
      setUpgradeReason("quota_exhausted");
      setShowUpgradeModal(true);
      return;
    }

    // ⚠️ Free exhausted, credits available → confirmation
    if (usage.remaining_free === 0 && usage.credits_left > 0 && !useCredit) {
      setUpgradeReason("confirm_credit");
      setShowUpgradeModal(true);
      return;
    }

    setIsUploading(true);
    setStatus("uploading");
    setError(null);
    setPhase("running");

    try {
      const data = await startResumeAnalyzation(selectedFile, useCredit);
      setJobId(data.job_id);
      setStatus(data.status);

      if (data.usage) {
        setUsage((prev) => ({ ...prev!, ...data.usage }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------- POLLING ----------------

  useJobPolling({
    jobId,
    onUpdate: setStatus,
    onCompleted: async () => {
      const resultData = await fetchResumeAnalysisResult(jobId);
      setResult(resultData?.result);
      // ✅ SUCCESS TOAST
      toast.success("Resume analyzed successfully!");
      setPhase("done"); // 🔥 THIS controls UI now
      // 🧹 CLEAR STATUS AFTER A SHORT DELAY
      setTimeout(() => {
        setStatus(null);
      }, 500);
    },
    onFailed: (data: data) => {
      setError(data.error || "Conversion failed");
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
    setStatus(null);
    setResult(null);
    setPhase("idle");
  };

  const isJobRunning =
    (status === "uploading" ||
      status === "processing" ||
      status === "pending") &&
    !error;

  useEffect(() => {
    localStorage.setItem("lastService", "resume");
  }, []);

  const canRun = usage?.can_run ?? false;
  const buttonText = isJobRunning
    ? "Analyzing..."
    : !canRun || (usage!.remaining_free === 0 && usage!.credits_left === 0)
      ? "Upgrade to continue"
      : usage!.remaining_free > 0
        ? "Analyze Resume (Free)"
        : "Analyze Resume (1 Credit)";

  useEffect(() => {
    async function loadUsage() {
      const res = await fetch("http://localhost:8000/usage/resume");
      const data = await res.json();
      setUsage(data);
    }

    loadUsage();
  }, []);

  const handleUpgradeModel = () => {
    setUpgradeReason("unlock_ai");
    setShowUpgradeModal(true);
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-start gap-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Resume ATS Analyzer
          </h2>
          <p className="mt-2 text-muted-foreground">
            Check how well your resume performs with applicant tracking systems
          </p>
          {usage && (
            <p className="mt-2 text-xs text-muted-foreground">
              {usage.remaining_free} / {usage.daily_limit} free analyses left
              today
              {usage.credits_left > 0 &&
                ` · ${usage.credits_left} credits available`}
            </p>
          )}
        </div>
        <div className="w-full max-w-2xl rounded-xl bg-white border border-gray-50 p-6 shadow-sm">
          {!selectedFile ? (
            <Dropzone
              selectedFile={selectedFile}
              onFileSelect={handleFileChange}
              onError={setError}
              disabled={isUploading || status === "processing"}
              uploadType="resume"
            />
          ) : (
            <div className="w-full max-w-2xl flex flex-col gap-4">
              <FileInfo
                selectedFile={selectedFile}
                handleCancel={removeFile}
                isConversionStart={phase !== "ready"}
                uploadType="resume"
              />
              {phase !== "done" && (
                <>
                  <ActionButton
                    buttonIcon={
                      isJobRunning ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-4 w-4" />
                      )
                    }
                    buttonText={buttonText}
                    handleClick={() => handleUpload(false)}
                    isDisabled={isJobRunning}
                    type="cta"
                  />
                  {usage &&
                  usage?.remaining_free > 0 &&
                  usage?.credits_left === 0 ? (
                    <>
                      <p className="mt-2 text-xs text-muted-foreground text-center">
                        Want deeper insights with AI assistance?{" "}
                        <button
                          className="text-primary underline"
                          onClick={() => handleUpgradeModel()}
                        >
                          Upgrade to unlock AI features
                        </button>
                      </p>
                      <p className="mt-2 text-[11px] text-muted-foreground text-center">
                        AI suggestions are applied when available.
                      </p>
                    </>
                  ) : null}
                  {usage &&
                  usage?.remaining_free > 0 &&
                  usage?.credits_left > 0 ? (
                    <>
                      <p className="mt-2 text-xs text-muted-foreground text-center">
                        Want AI-assisted insights on this resume?{" "}
                        <button
                          className="text-primary underline"
                          onClick={() => {
                            setShowUpgradeModal(false);
                            handleUpload(true); // 🔥 retry with credit
                          }}
                        >
                          Use 1 credit
                        </button>
                      </p>
                      <p className="mt-2 text-[11px] text-muted-foreground text-center">
                        AI suggestions are applied when available.
                      </p>
                    </>
                  ) : null}
                </>
              )}
            </div>
          )}
        </div>

        {error ? <StatusIndicator status={status} error={error} /> : null}

        {/* RESUME RESULTS */}
        {result ? (
          <div
            className="w-full max-w-2xl flex flex-col gap-6 transition-all duration-500 ease-out
      opacity-0 translate-y-6
      animate-fade-in-up"
          >
            <ATSScoreCard score={result?.ats_score} />{" "}
            <p className="text-sm opacity-70">
              Suggestions source:{" "}
              <span className="font-semibold">
                {result.suggestion_source === "ai"
                  ? "AI-assisted"
                  : "Rule-based"}
              </span>
            </p>
            <ImprovementsList
              suggestions={result.ai_suggestions.suggestions}
              rewrittenBullets={result.ai_suggestions.rewritten_bullets}
              missingKeywords={result.ai_suggestions.missing_keywords}
            />
            <button
              onClick={removeFile}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Analyze another resume
            </button>
          </div>
        ) : null}

        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-2">
                {upgradeReason === "quota_exhausted" &&
                  "Daily free limit reached"}
                {upgradeReason === "unlock_ai" &&
                  "Unlock AI-powered resume insights"}
                {upgradeReason === "confirm_credit" &&
                  "Use 1 credit for AI-assisted analysis?"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {upgradeReason === "quota_exhausted" &&
                  "You’ve used all 3 free resume analyses for today."}

                {upgradeReason === "unlock_ai" &&
                  "Unlock more analyses and AI-assisted insights with Applyra Pro."}

                {upgradeReason === "confirm_credit" &&
                  "Your free analyses for today are used up. This run will use 1 credit and include AI-assisted suggestions when available."}
              </p>

              <div className="space-y-3">
                {upgradeReason === "confirm_credit" && (
                  <button
                    className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90"
                    onClick={() => {
                      setShowUpgradeModal(false);
                      handleUpload(true); // 🔥 retry with credit
                    }}
                  >
                    Use 1 Credit & Continue
                  </button>
                )}

                {upgradeReason !== "confirm_credit" && (
                  <button className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90">
                    Upgrade to Continue (Coming Soon)
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                  }}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Powered by{" "}
          <span className="font-medium text-foreground">Applyra AI</span>
        </p>
        <p className="text-center text-xs text-muted-foreground mt-1">
          Files are deleted within 30 minutes ·{" "}
          <a href="/privacy" className="underline">
            Privacy
          </a>{" "}
          ·{" "}
          <a href="/terms" className="underline">
            Terms
          </a>
        </p>
      </div>
    </AppLayout>
  );
}
