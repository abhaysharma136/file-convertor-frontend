import { useEffect, useState } from "react";
import "../App.css";
import Dropzone from "../components/Dropzone";
import { startConversion, type ApiError } from "../api/convertApi";
import StatusIndicator from "../components/StatusIndicator";
import { useJobPolling } from "../hooks/useJobPolling";
import AppLayout from "../layouts/AppLayout";
import {
  CheckCircle,
  Download,
  FileImage,
  FileText,
  Loader2,
} from "lucide-react";
import FileInfo from "../components/FileInfo";
import Select from "react-select";
import ActionButton from "../components/ActionButton";
import toast from "react-hot-toast";
import { fetchServiceQuota } from "../api/quotaApi";

export type data = {
  job_id: string;
  status: string;
  download_url: string;
  error: string;
};
type SelectOption = {
  value: string;
  label: string;
};
type Phase = "idle" | "ready" | "running" | "done";

type UsageState = {
  remaining_free: number;
  daily_limit: number;
  credits_left: number;
  can_run: boolean;
};
export default function ConvertPage() {
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>(
    null,
  );
  const [targetFormat, setTargetFormat] = useState<string | null>(null);

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  // ---------------- RESET ----------------

  // ---------------- RESET ----------------
  const resetJob = () => {
    setJobId(null);
    setStatus(null);
    setError(null);
    setDownloadUrl(null);
    setStatus(null);
  };

  const handleFileChange = (file: File | undefined | null) => {
    setSelectedFile(file);
    setTargetFormat(null);
    setError(null);
    setPhase("ready");
    resetJob();
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
  const availableFormats: SelectOption[] = getFormats().map((format) => ({
    value: format,
    label: format.toUpperCase(),
  }));

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!targetFormat) return;
    if (usage?.remaining_free === 0) {
      setShowUpgradeModal(true);
      return;
    }
    setIsUploading(true);
    setStatus("uploading");
    setError(null);
    setPhase("running");
    try {
      const data = await startConversion(selectedFile, targetFormat);
      setJobId(data.job_id);
      setStatus(data.status);
      // ✅ Update usage state from backend
      if (data.usage) {
        setUsage((prev) => ({
          ...prev!,
          ...data.usage,
        }));
      }
    } catch (err) {
      const apiError = err as ApiError;
      // 🔴 RATE LIMIT
      if (apiError.status === 429) {
        toast.error("Free limit reached for today");
        setShowUpgradeModal(true);
        setStatus(apiError.detail);
      } else {
        setError("Upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------- POLLING ----------------
  useJobPolling({
    jobId,
    onUpdate: setStatus,
    onCompleted: (data: data) => {
      setDownloadUrl(`http://localhost:8000${data.download_url}`);

      toast.success("Conversion completed successfully!");
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
    setDownloadUrl(null);
    setStatus(null);
  };
  const isJobRunning =
    (status === "uploading" ||
      status === "processing" ||
      status === "pending") &&
    !error;

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (downloadUrl) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [downloadUrl]);

  useEffect(() => {
    localStorage.setItem("lastService", "convert");
  }, []);

  const buttonText = isJobRunning
    ? "Analyzing..."
    : usage && usage?.remaining_free > 0
      ? "Convert File (Free)"
      : "Convert File";

  useEffect(() => {
    async function loadUsage() {
      const res = await fetchServiceQuota("convert");

      setUsage(res);
    }

    loadUsage();
  }, []);
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-start gap-6">
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <FileSearch className="h-6 w-6 text-primary" />
          </div> */}

          <h2 className="text-3xl font-semibold text-foreground">
            File Converter
          </h2>
          <p className="mt-2 text-muted-foreground">
            Convert your documents and images to different formats
          </p>
          {usage && (
            <p className="mt-2 text-xs text-muted-foreground">
              {usage.remaining_free} / {usage.daily_limit} free conversion left
              today
              {usage.credits_left > 0}
            </p>
          )}
        </div>

        <div className="w-full max-w-2xl rounded-xl bg-white border border-gray-50 shadow-sm">
          {!selectedFile ? (
            <Dropzone
              selectedFile={selectedFile}
              onFileSelect={handleFileChange}
              onError={setError}
              disabled={isUploading || status === "processing"}
              uploadType="converter"
            />
          ) : (
            <div className="w-full max-w-2xl">
              <FileInfo
                selectedFile={selectedFile}
                handleCancel={removeFile}
                isConversionStart={phase !== "ready"}
                uploadType="converter"
              />
            </div>
          )}
        </div>
        {selectedFile && !downloadUrl && !status ? (
          <div className="w-full max-w-2xl flex flex-col items-start justify-center">
            <label className="font-semibold">Convert to</label>

            <Select
              value={
                targetFormat
                  ? { value: targetFormat, label: targetFormat.toUpperCase() }
                  : null
              }
              onChange={(option) => {
                setTargetFormat(option?.value ?? null);
              }}
              options={availableFormats}
              className="w-full text-left rounded"
              placeholder="Select output format"
              isDisabled={!selectedFile || isUploading}
            />
          </div>
        ) : null}

        {error ? <StatusIndicator status={status} error={error} /> : null}
        {(phase === "ready" || phase === "running") && selectedFile ? (
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            <ActionButton
              buttonIcon={
                isJobRunning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  ""
                )
              }
              buttonText={buttonText}
              handleClick={handleUpload}
              isDisabled={
                !selectedFile ||
                !targetFormat ||
                isUploading ||
                status === "processing"
              }
              type="cta"
            />
          </div>
        ) : null}

        {showSuccess ? (
          <div
            className="
      w-full max-w-2xl flex flex-col items-center justify-around gap-8
      transition-all duration-500 ease-out
      opacity-0 translate-y-6
      animate-fade-in-up
    "
          >
            <div className="flex gap-4 w-full items-center justify-center text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Conversion complete!</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-success  w-full">
              <div className="w-1/2 sm:w-[70%]">
                {downloadUrl ? (
                  <a href={downloadUrl} download className="w-full">
                    <ActionButton
                      buttonIcon={<Download className="mr-2 h-4 w-4" />}
                      buttonText="Download File"
                      isDisabled={false}
                      type="cta"
                      handleClick={() => {}}
                    />
                  </a>
                ) : null}
              </div>

              <div className="w-1/2 sm:w-[30%]">
                <ActionButton
                  buttonIcon={
                    isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      ""
                    )
                  }
                  buttonText="Convert Another"
                  handleClick={removeFile}
                  isDisabled={isJobRunning}
                  type="secondary"
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* {downloadUrl && <DownloadLink url={downloadUrl} />} */}
        {/* Supported Formats */}
        <div className=" w-full max-w-2xl mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-foreground mb-4 text-center">
            Supported Conversions
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>PDF ↔ Word</span>
            </div>
            <div className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              <span>PNG ↔ JPG</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents → TXT</span>
            </div>
            <div className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              <span>Images → WebP</span>
            </div>
          </div>
        </div>
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Free limit reached</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You can convert only 5 documents per day on the free plan.
              </p>

              <div className="space-y-3">
                <button
                  className="w-full py-2 rounded-lg bg-primary text-white font-medium  disabled:bg-primary/70"
                  disabled
                >
                  Upgrade to Pro (Coming Soon)
                </button>

                <button
                  onClick={() => setShowUpgradeModal(false)}
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
