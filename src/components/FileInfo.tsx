import { FileText, X } from "lucide-react";

type Props = {
  selectedFile: File;
  handleCancel: () => void;
  isConversionStart: boolean;
};
export default function FileInfo({
  selectedFile,
  handleCancel,
  isConversionStart,
}: Props) {
  console.log("selected File", selectedFile);

  const getFileTypeLabel = (file: File) => {
    switch (file.type) {
      case "application/pdf":
        return "PDF";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "DOCX";
      case "application/msword":
        return "DOC";
      case "image/png":
        return "PNG";
      case "image/jpeg":
        return "JPG";
      default:
        return "File";
    }
  };

  const fileType = getFileTypeLabel(selectedFile);
  return (
    <div className="w-full flex flex-col gap-4 border-gray-100">
      <div className="shrink-0 p-5 flex items-center justify-between  rounded-md">
        <div className="flex w-[80%] justify-start items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <FileText className="h-8 w-8 text-primary" />
          </div>

          <div className="flex flex-col items-start justify-center  overflow-hidden">
            <h3 className="w-full truncate text-sm font-medium text-foreground text-left">
              {selectedFile?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {fileType} Document • {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>

        {!isConversionStart ? (
          <button className="cursor-pointer" onClick={() => handleCancel()}>
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
