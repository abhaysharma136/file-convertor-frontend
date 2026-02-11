import { Upload } from "lucide-react";
// import { useState } from "react";

const MAX_FILE_SIZE_MB = 5;
type Props = {
  selectedFile: File | null | undefined;
  onFileSelect: (file: File | null | undefined) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
  uploadType: string;
};
export default function Dropzone({
  selectedFile,
  onFileSelect,
  onError,
  disabled = false,
  uploadType,
}: Props) {
  // const [isDragging, setIsDragging] = useState(false);

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
  const handleFile = (file: File | null | undefined) => {
    const error = validateFile(file);
    if (error) {
      onError(error);
      return;
    }
    onFileSelect(file);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // setIsDragging(true);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInputClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };
  return (
    <>
      <div
        className="
    cursor-pointer
    rounded-xl
    border-2 border-dashed border-gray-300
    transition-all duration-200

    flex items-center justify-center

    min-h-55
    sm:min-h-65
    md:min-h-75
    lg:min-h-65

    px-6 py-8
    hover:border-blue-500 hover:bg-gray-50
  "
        onDragOver={handleDragOver}
        // onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => handleFileInputClick()}
      >
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="rounded-full bg-gray-100 p-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-base">
              {uploadType === "converter"
                ? "Drop Your file here or click to browse"
                : "Upload your resume"}
            </h3>
            <p className="text-sm text-gray-400">
              {uploadType == "converter" ? (
                "Supports PDF, Word, PNG, JPG"
              ) : (
                <>
                  Drag and Drop or <span className="text-blue-500">Browse</span>
                </>
              )}
            </p>
          </div>
          {uploadType === "converter" ? (
            ""
          ) : (
            <div className="flex gap-2">
              {["PDF", "DOC", "DOCX"].map((format) => (
                <span
                  key={format}
                  className="rounded bg-gray-200 font-medium text-xs px-2 py-0.5 text-muted-foreground"
                >
                  {format}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <input
        id="fileInput"
        type="file"
        hidden
        onChange={(e) => {
          const files = e.target.files;
          handleFile(files?.[0]);
        }}
        accept=".pdf,.doc,.docx"
        disabled={disabled}
      />

      {selectedFile && (
        <p className="file-info">{(selectedFile.size / 1024).toFixed(2)} KB</p>
      )}
    </>
  );
}
