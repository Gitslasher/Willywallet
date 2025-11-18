import { Github, Mail, ArrowRight } from "lucide-react";

export default function SocialButtons({ onEmail }) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 shadow-sm transition"
      >
        <Github className="h-5 w-5" />
        Continue with GitHub
      </button>
      <button
        type="button"
        onClick={onEmail}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 shadow-sm transition"
      >
        <Mail className="h-5 w-5" />
        Continue with Email
        <ArrowRight className="h-4 w-4 opacity-80" />
      </button>
    </div>
  );
}
