import {
  BookOpen,
  Cpu,
  Layers,
  AlertTriangle,
  Lightbulb,
  Code2,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Research — XRayAI",
  description:
    "About the XRayAI research project: objectives, AI workflow, technology stack, limitations, and future improvements.",
};

function Section({ id, icon: Icon, title, color, children }) {
  const colorMap = {
    sky: { bg: "bg-sky-100", icon: "text-sky-600" },
    teal: { bg: "bg-teal-100", icon: "text-teal-600" },
    violet: { bg: "bg-violet-100", icon: "text-violet-600" },
    amber: { bg: "bg-amber-100", icon: "text-amber-600" },
    slate: { bg: "bg-slate-100", icon: "text-slate-600" },
    emerald: { bg: "bg-emerald-100", icon: "text-emerald-600" },
  };
  const c = colorMap[color] || colorMap.sky;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.icon}`} aria-hidden="true" />
        </div>
        <h2 id={`${id}-heading`} className="text-lg font-bold text-slate-900">
          {title}
        </h2>
      </div>
      <div className="pl-13">{children}</div>
    </section>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function TechPill({ label, category }) {
  const colors = {
    frontend: "bg-sky-50 text-sky-700 border-sky-200",
    backend: "bg-teal-50 text-teal-700 border-teal-200",
    ai: "bg-violet-50 text-violet-700 border-violet-200",
    devops: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors[category] || colors.devops}`}>
      {label}
    </span>
  );
}

export default function AboutPage() {
  const futureFeatures = [
    {
      title: "Grad-CAM Visualization",
      desc: "Gradient-weighted Class Activation Mapping to highlight regions influencing predictions.",
    },
    {
      title: "Explainable AI (XAI)",
      desc: "LIME/SHAP integration for interpretability and model transparency.",
    },
    {
      title: "Multi-class Classification",
      desc: "Expand classification to include additional pathologies beyond binary classes.",
    },
    {
      title: "Model Comparison",
      desc: "Side-by-side benchmarking of different architectures and training configurations.",
    },
    {
      title: "Performance Monitoring",
      desc: "Live metrics dashboard tracking model accuracy, latency, and throughput.",
    },
  ];

  const workflowSteps = [
    { step: "1", label: "Image Upload", desc: "User uploads a chest X-ray image (JPG/PNG)." },
    { step: "2", label: "Preprocessing", desc: "Image is resized, normalized, and prepared for model input." },
    { step: "3", label: "Inference", desc: "Deep learning model runs forward pass and produces class probabilities." },
    { step: "4", label: "Post-processing", desc: "Output probabilities are converted to predictions and confidence scores." },
    { step: "5", label: "Result Display", desc: "Classification result and confidence are displayed to the user." },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Research Overview</h1>
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-sky-100 text-sky-700 rounded-full border border-sky-200">
                  Academic
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-2xl">
                XRayAI is an academic research prototype exploring deep learning for automated chest X-ray classification. This page documents the project objectives, methodology, and roadmap.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Research Objective */}
        <Section id="objective" icon={FlaskConical} title="Research Objective" color="sky">
          <Card>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              The objective of XRayAI is to investigate and demonstrate the feasibility of using convolutional neural networks (CNNs) for automated chest X-ray classification. The project aims to:
            </p>
            <ul className="space-y-2.5" role="list">
              {[
                "Train a deep learning model on labeled chest X-ray datasets",
                "Build a user-friendly web interface for real-time model inference",
                "Evaluate model performance using standard medical imaging metrics",
                "Explore explainability techniques to make AI predictions interpretable",
                "Document findings for academic and research dissemination",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <ArrowRight className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        {/* AI Workflow */}
        <Section id="workflow" icon={Cpu} title="AI Workflow" color="teal">
          <div className="space-y-3">
            {workflowSteps.map((step, i) => (
              <div
                key={step.step}
                className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-teal-700">{step.step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Technology Stack */}
        <Section id="tech" icon={Code2} title="Technology Stack" color="violet">
          <Card>
            <div className="space-y-4">
              {[
                {
                  category: "frontend",
                  label: "Frontend",
                  items: ["Next.js", "React", "Tailwind CSS", "Lucide React"],
                },
                {
                  category: "backend",
                  label: "Backend",
                  items: ["FastAPI", "Python", "Uvicorn"],
                },
                {
                  category: "ai",
                  label: "AI / ML",
                  items: ["TensorFlow / PyTorch", "NumPy", "OpenCV", "Pillow"],
                },
              ].map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <TechPill key={item} label={item} category={group.category} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* System Limitations */}
        <Section id="limitations" icon={AlertTriangle} title="System Limitations" color="amber">
          <Card className="border-amber-200 bg-amber-50">
            <ul className="space-y-3" role="list">
              {[
                "This system is a research prototype and has not been validated for clinical use.",
                "Model performance is dependent on training data quality and distribution.",
                "The model may produce incorrect predictions, especially on images outside the training distribution.",
                "Predictions should never be used as a substitute for professional medical diagnosis.",
                "The system does not account for patient history, clinical context, or other diagnostic factors.",
                "Binary classification (NORMAL/PNEUMONIA) is a simplified representation of clinical reality.",
              ].map((limitation) => (
                <li key={limitation} className="flex items-start gap-2.5 text-sm text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {limitation}
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        {/* Future Improvements */}
        <Section id="future" icon={Lightbulb} title="Future Improvements" color="emerald">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {futureFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-colors"
              >
                <p className="text-sm font-semibold text-slate-800 mb-1.5">
                  {feature.title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div className="bg-sky-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Try the Analyzer</h2>
          <p className="text-sky-100 text-sm mb-5">
            Upload a chest X-ray and see the AI classification in action.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Layers className="w-4 h-4" aria-hidden="true" />
            Open Analyzer
          </Link>
        </div>
      </div>
    </div>
  );
}
