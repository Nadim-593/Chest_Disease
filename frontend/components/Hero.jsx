import Link from "next/link";
import { Activity, ArrowRight, Scan, Brain, FileImage } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import HowItWorks from "@/components/HowItWorks";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      {/* Hero content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" aria-hidden="true" />
                <span className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
                  AI Research Prototype
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
                >
                  AI-Powered{" "}
                  <span className="text-sky-600">Chest X-Ray</span>{" "}
                  Analysis
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                  Upload a chest X-ray and receive an AI-assisted classification result within seconds. Built for academic research and exploration.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-xl shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 group"
                >
                  <Activity className="w-5 h-5" aria-hidden="true" />
                  Analyze X-Ray
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
                <Link
                  href="/model"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  <Brain className="w-5 h-5 text-slate-400" aria-hidden="true" />
                  Explore Model
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { label: "Research Project", value: "Academic" },
                  { label: "Analysis Time", value: "< 3 sec" },
                  { label: "Input", value: "JPG / PNG" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative animate-fade-in delay-200" aria-hidden="true">
              <XRayVisual />
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <HowItWorks />

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Disclaimer />
      </div>
    </section>
  );
}

function XRayVisual() {
  return (
    <div className="relative max-w-md mx-auto lg:max-w-none">
      {/* Main card */}
      <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Chest X-Ray Analysis
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        {/* X-ray image simulation */}
        <div className="relative bg-slate-950 aspect-square overflow-hidden">
          {/* Simulated X-ray grid */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 55% 70% at 50% 50%, rgba(148,163,184,0.4) 0%, transparent 70%),
                  radial-gradient(ellipse 30% 35% at 40% 45%, rgba(100,116,139,0.5) 0%, transparent 60%),
                  radial-gradient(ellipse 30% 35% at 60% 45%, rgba(100,116,139,0.5) 0%, transparent 60%),
                  radial-gradient(circle 20% at 50% 55%, rgba(51,65,85,0.8) 0%, transparent 100%)
                `,
              }}
            />
          </div>

          {/* Lung outline simulation */}
          <svg
            viewBox="0 0 300 300"
            className="absolute inset-0 w-full h-full opacity-25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left lung */}
            <path
              d="M80 80 C60 80 45 100 45 130 C45 175 55 210 75 225 C85 232 95 230 105 220 C115 210 120 190 120 165 L120 100 C120 88 110 80 100 80 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(100,116,139,0.1)"
            />
            {/* Right lung */}
            <path
              d="M220 80 C240 80 255 100 255 130 C255 175 245 210 225 225 C215 232 205 230 195 220 C185 210 180 190 180 165 L180 100 C180 88 190 80 200 80 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(100,116,139,0.1)"
            />
            {/* Spine */}
            <line x1="150" y1="60" x2="150" y2="260" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />
            {/* Clavicles */}
            <path d="M95 70 C120 65 135 68 150 70" stroke="#64748b" strokeWidth="1.5" />
            <path d="M205 70 C180 65 165 68 150 70" stroke="#64748b" strokeWidth="1.5" />
          </svg>

          {/* Scan line animation */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-70 animate-scan" />

          {/* Corner markers */}
          {[
            "top-3 left-3",
            "top-3 right-3",
            "bottom-3 left-3",
            "bottom-3 right-3",
          ].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-5 h-5 border-2 border-sky-500/50`}
              style={{ borderRadius: "2px" }} aria-hidden="true" />
          ))}
        </div>

        {/* Result preview */}
        <div className="px-5 py-4 bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Classification Result</span>
            <span className="text-xs text-slate-500">Model v1.0</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-white">NORMAL</p>
              <p className="text-xs text-slate-400">Prediction</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-400">96.4%</p>
              <p className="text-xs text-slate-400">Confidence</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
              style={{ width: "96.4%" }}
            />
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        Demo Preview
      </div>

      {/* Decorative glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-full bg-sky-400" aria-hidden="true" />
    </div>
  );
}
