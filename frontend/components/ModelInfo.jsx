import {
  Cpu,
  Database,
  GitBranch,
  Layers,
  Target,
  TrendingUp,
} from "lucide-react";

function InfoRow({ label, value, placeholder = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 flex-shrink-0">{label}</span>
      <span
        className={`text-sm font-medium text-right ${
          placeholder ? "text-slate-400 italic" : "text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function MetricCard({ label, value, description }) {
  const isPlaceholder = value === "To be configured";
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p
        className={`text-2xl font-bold mb-1 ${
          isPlaceholder ? "text-slate-300 text-base font-medium italic" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {description && (
        <p className="text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
}

export default function ModelInfo() {
  return (
    <div className="space-y-8">
      {/* Model Overview */}
      <section aria-labelledby="model-overview-heading">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-sky-600" aria-hidden="true" />
          </div>
          <h2 id="model-overview-heading" className="text-lg font-semibold text-slate-900">
            Model Overview
          </h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-1 divide-y divide-slate-100">
            <InfoRow label="Model Name" value="XRayAI Classifier v1.0" />
            <InfoRow label="Task" value="Binary Image Classification" />
            <InfoRow label="Architecture" value="To be configured" placeholder />
            <InfoRow label="Framework" value="To be configured" placeholder />
            <InfoRow label="Input Resolution" value="To be configured" placeholder />
          </div>
        </div>
      </section>

      {/* Input & Preprocessing */}
      <section aria-labelledby="preprocessing-heading">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
            <Layers className="w-5 h-5 text-teal-600" aria-hidden="true" />
          </div>
          <h2 id="preprocessing-heading" className="text-lg font-semibold text-slate-900">
            Input & Preprocessing
          </h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-1 divide-y divide-slate-100">
            <InfoRow label="Accepted Formats" value="JPG, JPEG, PNG" />
            <InfoRow label="Max File Size" value="10 MB" />
            <InfoRow label="Normalization" value="To be configured" placeholder />
            <InfoRow label="Augmentation" value="To be configured" placeholder />
            <InfoRow label="Color Mode" value="To be configured" placeholder />
          </div>
        </div>
      </section>

      {/* Classification Classes */}
      <section aria-labelledby="classes-heading">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-cyan-600" aria-hidden="true" />
          </div>
          <h2 id="classes-heading" className="text-lg font-semibold text-slate-900">
            Classification Classes
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "NORMAL", desc: "No pathological findings detected", color: "emerald" },
            { label: "PNEUMONIA", desc: "Pneumonia indicators present", color: "red" },
          ].map((cls) => (
            <div
              key={cls.label}
              className={`p-4 rounded-xl border ${
                cls.color === "emerald"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <span
                className={`inline-block px-3 py-0.5 rounded-md text-xs font-bold tracking-widest ${
                  cls.color === "emerald"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {cls.label}
              </span>
              <p className="text-xs text-slate-500 mt-2">{cls.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Metrics */}
      <section aria-labelledby="metrics-heading">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-violet-600" aria-hidden="true" />
          </div>
          <h2 id="metrics-heading" className="text-lg font-semibold text-slate-900">
            Performance Metrics
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Accuracy", value: "To be configured", description: "Overall accuracy" },
            { label: "Precision", value: "To be configured", description: "Positive predictive value" },
            { label: "Recall", value: "To be configured", description: "Sensitivity" },
            { label: "F1 Score", value: "To be configured", description: "Harmonic mean" },
          ].map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" aria-hidden="true" />
          Metrics will be populated after model evaluation on a test dataset.
        </p>
      </section>

      {/* Training Dataset */}
      <section aria-labelledby="dataset-heading">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <Database className="w-5 h-5 text-slate-600" aria-hidden="true" />
          </div>
          <h2 id="dataset-heading" className="text-lg font-semibold text-slate-900">
            Training Dataset
          </h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-1 divide-y divide-slate-100">
            <InfoRow label="Dataset Name" value="To be configured" placeholder />
            <InfoRow label="Total Images" value="To be configured" placeholder />
            <InfoRow label="Training Split" value="To be configured" placeholder />
            <InfoRow label="Validation Split" value="To be configured" placeholder />
            <InfoRow label="Test Split" value="To be configured" placeholder />
          </div>
        </div>
      </section>
    </div>
  );
}
