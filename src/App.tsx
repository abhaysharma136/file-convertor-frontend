import { useEffect, useState } from "react";
import "./App.css";

const MAX_FILE_SIZE_MB = 5;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState("resume"); // convert | resume
  const [jdText, setJDText] = useState("");
  // ---------------- RESET ----------------
  const resetJob = () => {
    setJobId(null);
    setStatus(null);
    setError(null);
    setDownloadUrl(null);
  };

  // ---------------- FILE HANDLING ----------------
  const validateFile = (file) => {
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

  const handleFileChange = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setTargetFormat("");
    setError(null);
    resetJob();
  };

  // ---------------- DRAG & DROP ----------------
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  // ---------------- FORMAT OPTIONS ----------------
  const getFormats = () => {
    if (!selectedFile) return [];
    if (selectedFile.type === "image/png") return ["jpg"];
    if (selectedFile.type === "application/pdf") return ["docx"];
    if (
      selectedFile.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return ["pdf"];
    return [];
  };

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!selectedFile) return;
    if (mode === "convert" && !targetFormat) return;

    setIsUploading(true);
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (mode === "convert") {
      formData.append("target_format", targetFormat);
    } else if (mode === "match") {
      formData.append("job_description", jdText);
    }
    const endpoint =
      mode === "resume"
        ? "http://localhost:8000/resume/analyze"
        : mode === "match"
        ? "http://localhost:8000/jd/match"
        : "http://localhost:8000/convert";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setJobId(data.job_id);
      setStatus(data.status);
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------- POLLING ----------------
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/status/${jobId}`);
        const data = await res.json();

        setStatus(data.status);

        if (data.status === "completed") {
          clearInterval(interval);
          if (mode === "convert") {
            setDownloadUrl(`http://localhost:8000${data.download_url}`);
          }
          if (mode === "resume") {
            const res = await fetch(
              `http://localhost:8000/resume/result/${jobId}`
            );
            const resultData = await res.json();
            setResult(resultData?.result);
          }
          if (mode === "match") {
            const res = await fetch(
              `http://localhost:8000/jd/match/result/${jobId}`
            );
            const resultData = await res.json();
            setResult(resultData?.result);
          }
        }

        if (data.status === "failed") {
          setError(data.error || "Conversion failed");
          clearInterval(interval);
        }
      } catch {
        setError("Status check failed");
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [jobId]);

  // ---------------- UI ----------------
  return (
    <div className="container">
      <h2>
        {mode === "convert"
          ? "File Converter"
          : mode === "resume"
          ? "Resume Analyzer"
          : "Match with JD"}
      </h2>
      <div className="mode-selector">
        <button
          className={mode === "convert" ? "active" : ""}
          onClick={() => {
            setMode("convert");
            resetJob();
            setTargetFormat("");
          }}
        >
          Convert File
        </button>

        <button
          className={mode === "resume" ? "active" : ""}
          onClick={() => {
            setMode("resume");
            resetJob();
            setTargetFormat("");
          }}
        >
          Analyze Resume
        </button>
        <button
          className={mode === "resume" ? "active" : ""}
          onClick={() => {
            setMode("match");
            resetJob();
            setTargetFormat("");
          }}
        >
          Match with JD
        </button>
      </div>

      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {selectedFile
          ? selectedFile.name
          : mode === "convert"
          ? "Drag & drop or click to convert a file"
          : "Drag & drop or click to analyze your resume"}
      </div>

      <input
        id="fileInput"
        type="file"
        hidden
        onChange={(e) => handleFileChange(e.target.files[0])}
        disabled={isUploading || status === "processing"}
      />

      {selectedFile && (
        <p className="file-info">{(selectedFile.size / 1024).toFixed(2)} KB</p>
      )}

      {selectedFile && mode === "convert" && (
        <select
          value={targetFormat}
          onChange={(e) => setTargetFormat(e.target.value)}
          disabled={isUploading}
        >
          <option value="">Select target format</option>
          {getFormats().map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </select>
      )}
      {mode === "match" ? (
        <textarea onChange={(e) => setJDText(e.target.value)} />
      ) : null}
      <button
        onClick={handleUpload}
        disabled={
          !selectedFile ||
          (mode === "convert" && !targetFormat) ||
          isUploading ||
          status === "processing"
        }
      >
        {isUploading
          ? "Uploading..."
          : mode === "resume"
          ? "Analyze Resume"
          : mode === "convert"
          ? "Convert"
          : "Match JD"}
      </button>

      {/* STATUS */}
      {status && (
        <p className="status">
          Status: <strong>{status}</strong>
        </p>
      )}

      {/* ERROR */}
      {error && <p className="error">{error}</p>}

      {/* DOWNLOAD */}
      {downloadUrl && (
        <a className="download" href={downloadUrl} download>
          Download File
        </a>
      )}

      {/* RESUME RESULTS */}
      {mode === "resume" && result && (
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
      )}
      {mode === "match" && result && (
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
      )}
    </div>
  );
}

export default App;
