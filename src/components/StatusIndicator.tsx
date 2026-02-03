import { AlertTriangle, CheckCircle, Info } from "lucide-react";

type Props = {
  status: string | null;
  error?: string | null;
};

export default function StatusIndicator({ status, error }: Props) {
  if (error) {
    return (
      <div className="w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3 animate-in fade-in">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-red-700">Limit reached</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (status === "uploading" || status === "processing") {
    return (
      <div className="w-full max-w-2xl rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 flex items-center gap-3 animate-in fade-in">
        <Info className="h-5 w-5 text-blue-600" />
        <p className="text-sm text-blue-700">
          Processing your resume… please wait
        </p>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="w-full max-w-2xl rounded-lg border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3 animate-in fade-in">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <p className="text-sm text-green-700">
          Analysis completed successfully
        </p>
      </div>
    );
  }

  return null;
}
