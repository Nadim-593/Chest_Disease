import Link from "next/link";
import { Scan, Github, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 bg-sky-600 rounded-lg shadow-sm">
                <Scan className="w-4.5 h-4.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                XRay<span className="text-sky-600">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              AI-Assisted Chest X-Ray Classification. An academic research prototype exploring deep learning for medical imaging analysis.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5" role="list">
              {[
                { href: "/", label: "Home" },
                { href: "/analyze", label: "Analyze X-Ray" },
                { href: "/model", label: "Model Details" },
                { href: "/about", label: "Research" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Research
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-500" role="list">
              <li>Deep Learning Classification</li>
              <li>Chest X-Ray Analysis</li>
              <li>Academic Prototype</li>
              <li>Not for Clinical Use</li>
            </ul>
          </div>
        </div>

        {/* Divider & disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              &copy; {currentYear} XRayAI Research Project. Academic prototype only.
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5">
              ⚠ Not for clinical or diagnostic use
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
