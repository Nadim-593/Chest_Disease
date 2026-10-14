export default function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-6 space-y-6"
      role="status"
      aria-label="Analyzing X-ray image, please wait"
      aria-live="polite"
    >
      {/* Scanning animation */}
      <div className="relative w-24 h-24" aria-hidden="true">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        {/* Spinning arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-3 rounded-full bg-sky-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Scan progress bars */}
      <div className="w-full max-w-xs space-y-2" aria-hidden="true">
        {[
          { label: "Preprocessing image", delay: "0s", width: "w-full" },
          { label: "Running model inference", delay: "0.3s", width: "w-4/5" },
          { label: "Processing results", delay: "0.6s", width: "w-3/5" },
        ].map((step, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{step.label}</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${step.width} bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full animate-pulse`}
                style={{ animationDelay: step.delay }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">Analyzing X-Ray...</p>
        <p className="text-xs text-slate-400 mt-1">
          AI model is processing the image
        </p>
      </div>

      {/* Screen reader only message */}
      <span className="sr-only">
        The AI model is currently analyzing your chest X-ray image. Please wait.
      </span>
    </div>
  );
}
