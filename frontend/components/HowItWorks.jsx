import { Upload, Cpu, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload X-Ray",
    description:
      "Upload a chest X-ray image (JPG or PNG). Drag and drop or click to browse your files.",
    color: "sky",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analysis",
    description:
      "The deep learning model processes and analyzes the X-ray image in real time.",
    color: "teal",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Classification Result",
    description:
      "Receive the AI prediction with a confidence score instantly on-screen.",
    color: "cyan",
  },
];

const colorMap = {
  sky: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: "bg-sky-100 text-sky-600",
    number: "text-sky-300",
    accent: "bg-sky-500",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    icon: "bg-teal-100 text-teal-600",
    number: "text-teal-300",
    accent: "bg-teal-500",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    icon: "bg-cyan-100 text-cyan-600",
    number: "text-cyan-300",
    accent: "bg-cyan-500",
  },
};

export default function HowItWorks() {
  return (
    <section
      className="bg-slate-50 border-y border-slate-200 py-16"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-widest mb-2">
            Workflow
          </p>
          <h2
            id="how-it-works-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900"
          >
            How It Works
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm">
            A simple three-step process from image upload to AI classification result.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector lines (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-sky-200 via-teal-200 to-cyan-200"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const c = colorMap[step.color];
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative ${c.bg} border ${c.border} rounded-2xl p-6 shadow-sm animate-slide-up`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step number */}
                <span
                  className={`absolute top-4 right-5 text-4xl font-black ${c.number} select-none`}
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${c.icon} rounded-xl mb-4`}
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
