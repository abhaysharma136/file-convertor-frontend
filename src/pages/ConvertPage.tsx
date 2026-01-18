import { useEffect, useState } from "react";
import "../App.css";
import Dropzone from "../components/Dropzone";
import { startConversion } from "../api/convertApi";
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

    setIsUploading(true);
    setStatus("uploading");
    setError(null);

    try {
      const data = await startConversion(selectedFile, targetFormat);
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
    onCompleted: (data: data) => {
      setDownloadUrl(`http://localhost:8000${data.download_url}`);
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
  const isJobRunning = status === "uploading" || status === "processing";

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (downloadUrl) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [downloadUrl]);

  console.log("selected:", targetFormat);
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
                isConversionStart={!!status}
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

        {status === "processing" || status === "pending" ? (
          <StatusIndicator status={status} error={error} />
        ) : null}
        {!status && selectedFile ? (
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            <ActionButton
              buttonIcon={
                isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  ""
                )
              }
              buttonText={isJobRunning ? "Processing..." : "Convert File"}
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
      </div>
    </AppLayout>
  );
}
