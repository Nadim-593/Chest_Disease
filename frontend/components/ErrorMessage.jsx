import { AlertCircle, WifiOff, XCircle } from "lucide-react";

const ERROR_TYPES = {
  network: {
    icon: WifiOff,
    title: "Connection Error",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  api: {
    icon: XCircle,
    title: "Analysis Failed",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
  default: {
    icon: AlertCircle,
    title: "Error",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
};

function detectErrorType(message) {
  if (!message) return "default";
  const lower = message.toLowerCase();
  if (lower.includes("connect") || lower.includes("network") || lower.includes("server")) {
    return "network";
  }
  return "api";
}

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  const type = detectErrorType(message);
  const { icon: Icon, title, color, bg } = ERROR_TYPES[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 p-4 border rounded-xl ${bg}`}
    >
      <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${color}`}>{title}</p>
        <p className={`text-sm mt-0.5 ${color.replace("600", "700")}`}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${color}`}
          aria-label="Dismiss error"
        >
          <XCircle className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
