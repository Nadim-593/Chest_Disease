"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, FileImage, ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_MB = 10;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ onFileSelect, selectedFile, onRemove, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState(null);

  const validateFile = useCallback((file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload a JPG, JPEG, or PNG image.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum allowed size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback((file) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setLocalError(error);
      return;
    }
    setLocalError(null);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled && !selectedFile) inputRef.current?.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setLocalError(null);
    onRemove();
  };

  // Show preview if file selected
  if (selectedFile) {
    const previewUrl = URL.createObjectURL(selectedFile);
    return (
      <div className="space-y-3">
        <div className="relative border-2 border-sky-200 rounded-xl overflow-hidden bg-slate-900 aspect-square max-h-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={`Preview of ${selectedFile.name}`}
            className="w-full h-full object-contain"
          />
          {/* Remove button */}
          {!disabled && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Remove selected image"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {/* File info */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <FileImage className="w-5 h-5 text-sky-500 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate" title={selectedFile.name}>
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-400">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload chest X-ray image. Click or drag and drop a JPG, JPEG, or PNG file."
        aria-disabled={disabled}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        className={`
          relative flex flex-col items-center justify-center
          min-h-56 border-2 border-dashed rounded-xl
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? "border-sky-400 bg-sky-50 scale-[1.01]"
            : "border-slate-300 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center pointer-events-none">
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-colors ${
              isDragging ? "bg-sky-100" : "bg-slate-100"
            }`}
          >
            {isDragging ? (
              <ImageIcon className="w-8 h-8 text-sky-500" aria-hidden="true" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400" aria-hidden="true" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supported formats: JPG, JPEG, PNG &bull; Max {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>
      </div>

      {/* Local validation error */}
      {localError && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
}
