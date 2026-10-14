import ModelInfo from "@/components/ModelInfo";
import { Brain, BookOpen } from "lucide-react";

export const metadata = {
  title: "Model Details — XRayAI",
  description:
    "Research details about the deep learning model used for chest X-ray classification in the XRayAI prototype.",
};

export default function ModelPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Brain className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Model Details</h1>
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-violet-100 text-violet-700 rounded-full border border-violet-200">
                  Research
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-xl">
                Technical specifications and performance information for the AI classification model powering XRayAI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Note banner */}
      <div className="bg-sky-50 border-b border-sky-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-sky-700">
            <BookOpen className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>
              <strong>Note:</strong> Fields marked as &quot;To be configured&quot; will be populated as the model is trained and evaluated.
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ModelInfo />
      </div>
    </div>
  );
}
