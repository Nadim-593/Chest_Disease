import { FileImage, ZoomIn } from "lucide-react";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Standalone image preview card. For inline preview within UploadZone,
 * the preview is embedded directly. This component is available for
 * use in other contexts.
 */
export default function ImagePreview({ file, onRemove }) {
  if (!file) return null;

  const objectUrl = URL.createObjectURL(file);

  return (
    <figure className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Image */}
      <div className="relative bg-slate-900 aspect-square max-h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={objectUrl}
          alt={`Preview of uploaded file: ${file.name}`}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
          <ZoomIn className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* File info */}
      <figcaption className="flex items-center gap-3 px-4 py-3 border-t border-slate-100">
        <FileImage className="w-5 h-5 text-sky-500 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
          <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
        </div>
      </figcaption>
    </figure>
  );
}
