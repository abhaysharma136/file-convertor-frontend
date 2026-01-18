import { useState } from "react";
import "../App.css";
import Dropzone from "../components/Dropzone";
import {
  fetchResumeAnalysisResult,
  startResumeAnalyzation,
} from "../api/resumeApi";
import StatusIndicator from "../components/StatusIndicator";
import { useJobPolling } from "../hooks/useJobPolling";
import { FileSearch, Loader2, Search } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import FileInfo from "../components/FileInfo";
import ActionButton from "../components/ActionButton";
import ATSScoreCard from "../components/ATSScoreCard";
import ImprovementsList from "../components/ImprovementsList";

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
    suggestions: string[];
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
const dummyresult = {
  ats_score: 66,

  issues: ["Low technical skill coverage"],

  breakdown: {
    sections: 28,

    skills: 5,

    experience: 18,

    length: 15,
  },

  suggestion_source: "ai",

  ai_suggestions: {
    suggestions: [
      {
        title: "Weak Experience Bullet Points",

        description:
          "Rewrite experience bullets using strong action verbs and measurable impact (e.g., performance gains, scale, users, revenue).",

        severity: "moderate",

        category: "experience",
      },
    ],

    rewritten_bullets: [
      "Led end-to-end development of scalable features, improving system performance and reliability.",
    ],

    missing_keywords: [
      "docker",

      "kubernetes",

      "microservices",

      "rest api",

      "ci/cd",
    ],
  },
};

export default function ResumePage() {
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>(
    null
  );

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    resetJob();
  };

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus("uploading");
    setError(null);

    try {
      const data = await startResumeAnalyzation(selectedFile);
      setJobId(data.job_id);
      setStatus(data.status);
    } catch {
      setError("Upload failed");
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
    },
    onFailed: (data: data) => {
      setError(data.error || "Conversion failed");
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
    setStatus(null);
    setResult(null);
  };

  const isJobRunning = status === "uploading" || status === "processing";
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-start gap-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <FileSearch className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground">
            Resume ATS Analyzer
          </h2>
          <p className="mt-2 text-muted-foreground">
            Check how well your resume performs with applicant tracking systems
          </p>
        </div>
        <div className="w-full max-w-2xl rounded-xl bg-white border border-gray-50 p-6 shadow-sm">
          {!selectedFile ? (
            <Dropzone
              selectedFile={selectedFile}
              onFileSelect={handleFileChange}
              onError={setError}
              disabled={isUploading || status === "processing"}
            />
          ) : (
            <div className="w-full max-w-2xl flex flex-col gap-4">
              <FileInfo selectedFile={selectedFile} handleCancel={removeFile} />
              <ActionButton
                buttonIcon={
                  isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )
                }
                buttonText={isJobRunning ? "Analyzing..." : "Analyze Resume"}
                handleClick={handleUpload}
                isDisabled={isJobRunning}
                type="cta"
              />
            </div>
          )}
        </div>

        {/* <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || status === "processing"}
        >
          {isUploading ? "Uploading..." : "Analyze Resume"}
        </button> */}

        <StatusIndicator status={status} error={error} />

        {/* RESUME RESULTS */}
        {result ? (
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <ATSScoreCard score={result?.ats_score} />{" "}
            <ImprovementsList
              suggestions={result.ai_suggestions.suggestions}
              rewrittenBullets={result.ai_suggestions.rewritten_bullets}
              missingKeywords={result.ai_suggestions.missing_keywords}
            />
          </div>
        ) : null}
        {/* {result && (
          <div className="results">
            <h2>ATS Score</h2>
            <div className="ats-score">{result.ats_score}</div>

            <h3>Score Breakdown</h3>
            <ul>
              {Object.entries(result.breakdown).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>

            <h3>Suggestions</h3>
            <ul>
              {result.ai_suggestions?.suggestions?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3>Improved Bullet Examples</h3>
            <ul>
              {result.ai_suggestions?.rewritten_bullets?.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <h3>Suggested Keywords</h3>
            <p>{result.ai_suggestions?.missing_keywords?.join(", ")}</p>

            <p className="source">
              Suggestions source: <strong>{result.suggestion_source}</strong>
            </p>
          </div>
        )} */}
      </div>
    </AppLayout>
  );
}
