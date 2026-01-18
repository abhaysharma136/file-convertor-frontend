import { useState } from "react";
import "../App.css";
import Dropzone from "../components/Dropzone";
import { fetchJdMatchResult, startJdMatch } from "../api/matchApi";
import StatusIndicator from "../components/StatusIndicator";
import { useJobPolling } from "../hooks/useJobPolling";
import { FileSearch, Loader2 } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import FileInfo from "../components/FileInfo";
import ActionButton from "../components/ActionButton";
import JDMatchScoreCard from "../components/JDMatchScoreCard";
import KeywordAnalysis from "../components/KeywordAnalysis";
import JDSuggestions from "../components/JDSuggestions";

const MAX_FILE_SIZE_MB = 5;

type result = {
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
};
type data = {
  job_id: string;
  status: string;
  download_url: string;
  error: string;
};

const mockResult = {
  match_score: 60,
  matched_keywords: ["react", "aws", "ci/cd"],
  missing_keywords: ["microservices", "scalability"],
  suggestions: [
    "this is the first suggestion",
    "this is the second suggestion",
    "this is the third suggestion",
  ],
};
export default function MatchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>(
    null
  );

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [jdText, setJDText] = useState("");
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
    resetJob();
  };

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus("uploading");
    setError(null);

    try {
      const data = await startJdMatch(selectedFile, jdText);
      setJobId(data.job_id);
      setStatus(data.status);
    } catch {
      setError("Upload failed");
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
    },
    onFailed: (data: data) => {
      setError(data.error || "Conversion failed");
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
    setStatus(null);
    setResult(null);
    setJDText("");
  };

  const isJobRunning = status === "uploading" || status === "processing";
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-start gap-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <FileSearch className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-3xl font-semibold">Job Description Match</h2>
          <p className="mt-2 text-muted-foreground">
            Compare your resume against a job description to see how well you
            match
          </p>
        </div>

        <div className="w-full max-w-2xl rounded-xl bg-white border border-gray-50  shadow-sm">
          {!selectedFile ? (
            <Dropzone
              selectedFile={selectedFile}
              onFileSelect={handleFileChange}
              onError={setError}
              disabled={isUploading || status === "processing"}
            />
          ) : (
            <FileInfo selectedFile={selectedFile} handleCancel={removeFile} />
          )}
        </div>
        {selectedFile ? (
          <div className="w-full max-w-2xl flex flex-col justify-center items-start gap-4">
            <div className="w-full flex flex-col justify-center items-start gap-4">
              <label className="text-sm font-medium">Job Description</label>
              <div className="w-full flex flex-col items-start justify-center w-74 border-gray-200 shadow-sm gap-2">
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

        {/* <button
          onClick={handleUpload}
          disabled={
            !selectedFile || !jdText || isUploading || status === "processing"
          }
        >
          {isUploading ? "Uploading..." : "Match JD"}
        </button> */}

        <StatusIndicator status={status} error={error} />
        {selectedFile ? (
          <div className="flex flex-col gap-4">
            <ActionButton
              buttonIcon={
                isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  ""
                )
              }
              buttonText={isJobRunning ? "Analyzing..." : "Match Resume"}
              handleClick={handleUpload}
              isDisabled={isJobRunning}
              type="cta"
            />
          </div>
        ) : null}

        {/* {result && (
          <div className="results">
            <h2>JD Match Score</h2>
            <div className="ats-score">{result.match_score}%</div>

            <h3>Matched Skills</h3>
            <ul>
              {result.matched_keywords.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>

            <h3>Missing Skills</h3>
            <ul>
              {result.missing_keywords.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        )} */}
        {result ? (
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <JDMatchScoreCard score={mockResult?.match_score} />
            <KeywordAnalysis matchResult={mockResult} />
            {result?.suggestions ? (
              <JDSuggestions suggestions={result?.suggestions} />
            ) : null}
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
