import { X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { joinWaitlist } from "../../api/waitlistApi";
import { trackEvent } from "../../api/analyticsApi";

type FeatureType = "ai_resume" | "jd_match" | "waitlist";

type FeatureAccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  feature?: FeatureType;
};

export default function FeatureAccessModal({
  isOpen,
  onClose,
  feature = "ai_resume",
}: FeatureAccessModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      trackEvent({
        event_name: "modal_open",
        feature,
        source: "modal",
      });
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, feature]);
  if (!isOpen) return null;

  // ---------------- CONTENT ----------------

  const modalContent = {
    ai_resume: {
      badge: "Applyra AI",
      title: "Unlock AI Resume Optimization",
      description:
        "Improve your resume with AI-powered optimization, stronger bullet points, and recruiter-focused suggestions.",
      features: [
        "Rewrite weak resume bullet points",
        "Improve ATS and recruiter readability",
        "Get AI-powered optimization suggestions",
      ],
      primaryButton: "Continue with Google",
    },

    jd_match: {
      badge: "Applyra AI",
      title: "Unlock AI Job Matching",
      description:
        "Match your resume against job descriptions with AI-powered targeting and keyword analysis.",
      features: [
        "Target resumes for specific job descriptions",
        "Identify missing keywords instantly",
        "Improve recruiter-job alignment",
      ],
      primaryButton: "Continue with Google",
    },

    waitlist: {
      badge: "Early Access",
      title: "Join the Applyra AI Waitlist",
      description:
        "Get early access to premium AI resume optimization features before public launch.",
      features: [
        "AI resume optimization",
        "Recruiter-focused suggestions",
        "JD targeting and matching",
        "Free premium credits for early users",
      ],
      primaryButton: "Notify Me",
    },
  };

  const current = modalContent[feature];

  // ---------------- ACTIONS ----------------

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const waitlistResult = await joinWaitlist({
        email,
        feature,
        source: "modal",
      });

      if (waitlistResult.already_joined) {
        await trackEvent({
          event_name: "waitlist_already_joined",
          feature,
          source: "modal",
        });

        toast.success("You're already on the waitlist");
      } else {
        await trackEvent({
          event_name: "waitlist_join",
          feature,
          source: "modal",
        });

        toast.success("You’ve joined early access");
      }

      setEmail("");
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-gray-100 hover:text-foreground transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />

            <p className="text-xs font-medium uppercase tracking-wide">
              {current.badge}
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-foreground">
            {current.title}
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {current.description}
          </p>
        </div>

        {/* Features */}
        <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
          {current.features.map((featureText) => (
            <div key={featureText} className="flex items-start gap-2">
              <span>•</span>
              <span>{featureText}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          {feature !== "waitlist" && (
            <button
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 transition"
              onClick={() => {
                toast.success("Google sign-in will be available soon");
              }}
            >
              {current.primaryButton}
            </button>
          )}

          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 transition"
            >
              {loading
                ? "Joining..."
                : feature === "waitlist"
                  ? "Join Waitlist"
                  : "Join Early Access"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          No spam. Your resume stays private.
        </p>
      </div>
    </div>
  );
}
