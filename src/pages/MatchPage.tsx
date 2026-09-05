import { useEffect, useState } from "react";
import "../App.css";
import Dropzone from "../components/Dropzone";
import {
  fetchJdMatchResult,
  startJdMatch,
  type ApiError,
} from "../api/matchApi";
import StatusIndicator from "../components/StatusIndicator";
import { useJobPolling } from "../hooks/useJobPolling";
import { Loader2 } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import FileInfo from "../components/FileInfo";
import ActionButton from "../components/ActionButton";
import JDMatchScoreCard from "../components/JDMatchScoreCard";
import KeywordAnalysis from "../components/KeywordAnalysis";
import JDSuggestions, { type Suggestion } from "../components/JDSuggestions";
import toast from "react-hot-toast";
import { fetchServiceQuota } from "../api/quotaApi";

const MAX_FILE_SIZE_MB = 5;

type result = {
  match_score: number;
  pillars: {
    technical_skills: number;
    experience_alignment: number;
    seniority_fit: number;
  };
  matched_keywords: string[];
  missing_keywords: string[];
  ai_suggestions: {
    suggestions: Suggestion[];
    action_item?: string;
    gap_analysis?: {
      missing_tools_count: number;
      missing_concepts_count: number;
    };
  };
  suggestion_source: string;
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

export default function MatchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>(
    null,
  );

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [jdText, setJDText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [usage, setUsage] = useState<UsageState | null>(null);
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
        "image/png",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      return "Unsupported file type";
    }

    return null;
  };

  const handleFileChange = (file: File | undefined | null) => {
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
  // ---------------- RUN JD MATCH ----------------
  const handleUpload = async () => {
    if (!selectedFile || jdText.length < 50) return;

    const creditsLeft = usage?.credits_left ?? 0;

    if (creditsLeft === 0) {
      setShowUpgradeModal(true);
      return;
    }

    setResult(null);
    setIsUploading(true);
    setStatus("uploading");
    setError(null);
    setPhase("running");

    try {
      const data = await startJdMatch(selectedFile, jdText);
      setJobId(data.job_id);
      setStatus(data.status);
      if (data.usage) {
        setUsage((prev) => ({
          ...prev!,
          ...data.usage,
        }));
      }
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.status === 402) {
        setShowUpgradeModal(true);
        setStatus(null);
      } else {
        setError("Upload failed. Please try again.");
        setStatus(null);
      }
    } finally {
      setIsUploading(false);
    }
  };
  useJobPolling({
    jobId,
    onUpdate: setStatus,
    onCompleted: async () => {
      const resultData = await fetchJdMatchResult(jobId);
      setResult(resultData?.result);
      // ✅ DECREASE QUOTA

      toast.success("Comparision completed successfully!");
      setPhase("done"); // 🔥 THIS controls UI now
      // 🧹 CLEAR STATUS AFTER A SHORT DELAY
      setTimeout(() => {
        setStatus(null);
      }, 500);
    },
    onFailed: (data: data) => {
      setError(data.error || "Comparision failed");
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
    setStatus(null);
    setResult(null);
    setJDText("");
    setPhase("idle");
  };

  const isJobRunning =
    (status === "uploading" ||
      status === "processing" ||
      status === "pending") &&
    !error;

  const jdTextCount = (text: string) => {
    if (text && text.length >= 50) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    localStorage.setItem("lastService", "match");
  }, []);
  const creditsLeft = usage?.credits_left ?? 0;
  const buttonText = isJobRunning
    ? "Analyzing..."
    : creditsLeft === 0
      ? "Unlock AI Match"
      : "Analyze Resume (1 Credit)";

  useEffect(() => {
    async function loadUsage() {
      const res = await fetchServiceQuota("jd_match");

      setUsage(res);
    }

    loadUsage();
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-start gap-8">
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <FileSearch className="h-6 w-6 text-primary" />
          </div> */}

          <h2 className="text-3xl font-semibold">Job Description Match</h2>
          <p className="mt-2 text-muted-foreground">
            Compare your resume against a job description to see how well you
            match
          </p>
          {usage && (
            <p className="mt-2 text-xs text-muted-foreground">
              {`${usage.credits_left} credits available`}
            </p>
          )}
        </div>

        <div className="w-full max-w-2xl rounded-xl bg-white border border-gray-50  shadow-sm">
          {!selectedFile ? (
            <Dropzone
              selectedFile={selectedFile}
              onFileSelect={handleFileChange}
              onError={setError}
              disabled={isUploading || status === "processing"}
              uploadType="resume"
            />
          ) : (
            <FileInfo
              selectedFile={selectedFile}
              handleCancel={removeFile}
              isConversionStart={phase !== "ready"}
              uploadType="resume"
            />
          )}
        </div>
        {selectedFile ? (
          <div className="w-full max-w-2xl flex flex-col justify-center items-start gap-4">
            <div className="w-full flex flex-col justify-center items-start gap-4">
              <label className="text-sm font-medium">
                Job Description <span className="text-gray-500">(optional)</span>
              </label>
              <div className="w-full flex flex-col items-start justify-center  border-gray-200 shadow-sm gap-2">
                <textarea
                  onChange={(e) => setJDText(e.target.value)}
                  className="w-full min-h-50 resize-none  focus:outline-blue-800 rounded-md p-2.5"
                  placeholder="Paste the job description here..."
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Minimum 50 characters required
              </p>
            </div>
          </div>
        ) : null}

        {error ? <StatusIndicator status={status} error={error} /> : null}
        {selectedFile ? (
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            <>
              <ActionButton
                buttonIcon={
                  isJobRunning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    ""
                  )
                }
                buttonText={buttonText}
                handleClick={() => handleUpload()}
                isDisabled={
                  !selectedFile || jdTextCount(jdText) || isJobRunning
                }
                type="cta"
              />

              {usage && usage?.credits_left > 0 ? (
                <>
                  <p className="mt-2 text-xs text-muted-foreground text-center">
                    Want AI-assisted insights on this resume?{" "}
                    <button
                      className="text-primary underline"
                      onClick={() => {
                        setShowUpgradeModal(false);
                        handleUpload(); // 🔥 retry with credit
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
          </div>
        ) : null}

        {result ? (
          <div className="w-full max-w-2xl flex flex-col gap-6 animate-fade-in-up">
            {/* 1. Score Card with Pillar Breakdown */}
            <JDMatchScoreCard
              score={result.match_score}
              pillars={result.pillars}
            />

            <div className="flex items-center justify-between px-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                Analysis Source:{" "}
                {result.suggestion_source === "ai"
                  ? "Applyra AI"
                  : "Structural Rules"}
              </p>
            </div>

            {/* 2. Matched & Missing Keywords */}
            <KeywordAnalysis matchResult={result} />

            {/* 3. Strategic Suggestions & Action Item */}
            {result.ai_suggestions ? (
              <JDSuggestions
                suggestions={result.ai_suggestions.suggestions}
                actionItem={result.ai_suggestions.action_item}
              />
            ) : null}

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
            <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
              <h3 className="text-lg font-semibold mb-2">
                AI JD Match Requires Credits
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This feature uses AI to deeply analyze resume alignment with a
                job description. Each run consumes 1 credit.
              </p>

              <button className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90">
                Buy Credits (Coming Soon)
              </button>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Powered by{" "}
          <span className="font-medium text-foreground">Applyra</span>
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
