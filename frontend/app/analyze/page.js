"use client";

import { useState, useCallback } from "react";
import { Activity, Scan } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import PredictionResult from "@/components/PredictionResult";
import LoadingState from "@/components/LoadingState";
import ErrorMessage from "@/components/ErrorMessage";
import Disclaimer from "@/components/Disclaimer";
import { analyzeXRay } from "@/services/api";

function formatTimestamp(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setTimestamp(null);
  }, []);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setTimestamp(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeXRay(selectedFile);
      setResult(data);
      setTimestamp(formatTimestamp(new Date()));
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedFile, loading]);

  const handleDismissError = useCallback(() => setError(null), []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-sm">
              <Scan className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Chest X-Ray Analysis
              </h1>
              <p className="text-sm text-slate-500">
                Upload an X-ray image for AI-assisted classification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel: Upload */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Panel header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">
                  Upload Chest X-Ray
                </h2>
                <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                  JPG · JPEG · PNG
                </span>
              </div>

              {/* Upload zone */}
              <div className="p-5">
                <UploadZone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onRemove={handleRemove}
                  disabled={loading}
                />
              </div>

              {/* Analyze button */}
              {selectedFile && (
                <div className="px-5 pb-5">
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || loading}
                    className={`
                      w-full flex items-center justify-center gap-2.5
                      px-6 py-3.5 rounded-xl text-sm font-semibold
                      transition-all duration-150 shadow-sm
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
                      ${
                        !selectedFile || loading
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white"
                      }
                    `}
                    aria-busy={loading}
                    aria-label={loading ? "Analyzing X-ray, please wait" : "Analyze X-ray image"}
                  >
                    <Activity
                      className={`w-4.5 h-4.5 ${loading ? "animate-pulse" : ""}`}
                      aria-hidden="true"
                    />
                    {loading ? "Analyzing X-Ray..." : "Analyze X-Ray"}
                  </button>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <Disclaimer compact />
          </div>

          {/* Right panel: Result */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
              {/* Panel header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">
                  Analysis Result
                </h2>
                {result && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    Complete
                  </span>
                )}
              </div>

              {/* Result content */}
              <div className="p-5">
                {/* Error state */}
                {error && !loading && (
                  <div className="mb-4">
                    <ErrorMessage message={error} onDismiss={handleDismissError} />
                  </div>
                )}

                {/* Loading state */}
                {loading && <LoadingState />}

                {/* Result */}
                {!loading && (
                  <PredictionResult result={result} timestamp={timestamp} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
