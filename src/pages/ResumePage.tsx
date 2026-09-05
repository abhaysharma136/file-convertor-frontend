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

import ScoreBreakdown from "../components/ScoreBreakdown";
import LoginModal from "../components/Modals/FeatureAccessModal";
import { trackEvent } from "../api/analyticsApi";

const MAX_FILE_SIZE_MB = 5;
type result = {
  ats_score: number;
  strength_level: string;
  issues: string[];
  optimization_tips: string[];
  breakdown: {
    structure: number;
    length: number;
    experience_quality: number;
    impact: number;
    skills: number;
    clarity: number;
  };
  suggestion_source: string;
  ai_suggestions: {
    suggestions: Suggestion[];
    rewritten_bullets: string[];
    missing_keywords: string[];
  } | null;
};

type data = {
  job_id: string;
  status: string;
  download_url: string;
  error: string;
};
type Phase = "idle" | "ready" | "running" | "done";

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
  const [loginModal, setLoginModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<
    "ai_resume" | "jd_match"
  >("ai_resume");
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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus("uploading");
    setError(null);
    setPhase("running");

    try {
      const data = await startResumeAnalyzation(selectedFile);

      setJobId(data.job_id);
      setStatus(data.status);
    } catch (err) {
      const apiError = err as Error & { status?: number };

      if (apiError.status === 429) {
        setError(
          "You’ve reached today’s free resume analysis limit. Please try again tomorrow.",
        );
      } else {
        setError(
          apiError.message ||
            "Failed to analyze your resume. Please try again.",
        );
      }

      setStatus(null);
      setPhase("ready");
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
      setError(data.error || "Resume analysis failed");
      setStatus(null);
      setPhase("ready");
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

  // const canRun = usage?.can_run ?? false;
  const buttonText = isJobRunning ? "Analyzing..." : "Analyze Resume (Free)";

  const handleLogin = async (featureType: "ai_resume" | "jd_match") => {
    await trackEvent({
      event_name: "ai_feature_clicked",
      feature: featureType,
      source: "resume_page",
    });
    setSelectedFeature(featureType);
    setLoginModal(true);
  };
  const strengthLevel = result?.strength_level ?? "";
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-start gap-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-foreground">
            Resume ATS Analyzer
          </h2>
          <p className="mt-2 text-muted-foreground">
            Check how well your resume performs with applicant tracking systems
          </p>
        </div>
        <div className="w-full max-w-2xl rounded-xl bg-white border border-gray-50 shadow-sm">
          {!selectedFile ? (
            <Dropzone
              selectedFile={selectedFile}
              onFileSelect={handleFileChange}
              onError={setError}
              disabled={isUploading || status === "processing"}
              uploadType="resume"
            />
          ) : (
            <div className="w-full max-w-2xl flex flex-col gap-4 p-6">
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
                    handleClick={() => handleUpload()}
                    isDisabled={isJobRunning}
                    type="cta"
                  />
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
            <ATSScoreCard
              score={result?.ats_score}
              strengthLevel={strengthLevel}
            />{" "}
            <ScoreBreakdown breakdown={result?.breakdown} />
            <ImprovementsList
              suggestions={result.ai_suggestions?.suggestions ?? []}
              rewrittenBullets={result.ai_suggestions?.rewritten_bullets ?? []}
              missingKeywords={result.ai_suggestions?.missing_keywords ?? []}
              optimizationTips={result.optimization_tips ?? []}
            />
            <button
              onClick={removeFile}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Analyze another resume
            </button>
            <div className="w-full max-w-2xl rounded-xl border border-gray-100 bg-white shadow-sm p-5">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Next Step
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    Improve this resume with AI
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Get deeper optimization suggestions, stronger bullet
                    rewrites, and optional job-specific targeting.
                  </p>
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Rewrite weak experience bullet points</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Improve recruiter and ATS readability</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Optimize resume for specific job descriptions</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition"
                    onClick={() => handleLogin("ai_resume")}
                  >
                    Continue with AI
                  </button>

                  <button
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                    onClick={() => handleLogin("jd_match")}
                  >
                    Match Against Job Description
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <LoginModal
          isOpen={loginModal}
          onClose={() => setLoginModal(false)}
          feature={selectedFeature}
        />
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
