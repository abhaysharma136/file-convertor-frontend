import { Link, useNavigate } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import AppLayout from "../layouts/AppLayout";
import { FileSearch, Shield, Zap, CheckCircle, Sparkles } from "lucide-react";

import Footer from "../components/Footer";
import { useState } from "react";
import FeatureAccessModal from "../components/Modals/FeatureAccessModal";
import { trackEvent } from "../api/analyticsApi";
import SEO from "../components/SEO";

const benefits = [
  { icon: Shield, text: "Secure & Private" },
  { icon: Zap, text: "Instant Results" },
  { icon: CheckCircle, text: "Free ATS Analysis" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const lastService = localStorage.getItem("lastService");
  const handleCTA = async () => {
    await trackEvent({
      event_name: "homepage_cta_clicked",
      feature: "resume_analyzer",
      source: "homepage",
    });

    navigate("/resume-analyzer");
  };
  return (
    <AppLayout>
      <SEO
        title="Free ATS Resume Checker & Resume Tools | Applyra"
        description="Applyra helps job seekers analyze and improve their resumes. Get a free ATS analysis with insights into structure, skills, experience, impact, and clarity."
        canonical="https://applyra.in/"
      />
      <div className="flex flex-col gap-14 items-center text-center">
        {/* ---------------- HERO ---------------- */}
        <section className="max-w-3xl pt-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
            Land more interviews with an{" "}
            <span className="text-primary">ATS-optimized</span> resume
          </h1>

          <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Analyze your resume for ATS compatibility, identify weak areas, and
            improve your chances of getting shortlisted by recruiters.
          </p>

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <benefit.icon className="h-4 w-4 text-primary" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <button
              onClick={handleCTA}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm"
            >
              <FileSearch className="h-5 w-5" />
              Analyze Resume Free
            </button>
          </div>
        </section>

        {/* ---------------- MAIN PRODUCT CARD ---------------- */}
        <section className="w-full max-w-4xl">
          <div className="grid grid-cols-1 gap-6">
            <ServiceCard
              title="ATS Resume Analyzer"
              description="Upload your resume and get instant ATS analysis, section breakdowns, keyword insights, and actionable improvement suggestions."
              to="/resume-analyzer"
              icon={<FileSearch />}
              primary
              highlighted={lastService === "resume"}
            />
          </div>
        </section>

        {/* ---------------- PREMIUM COMING SOON ---------------- */}
        <section className="w-full max-w-4xl">
          <div className="rounded-3xl border border-primary/10 bg-linear-to-br from-primary/5 to-background p-8 md:p-10 text-left shadow-sm">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Coming Soon
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-semibold text-foreground">
              AI Resume Optimization
            </h2>

            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
              Unlock AI-powered resume improvements designed to increase ATS
              compatibility and recruiter appeal.
            </p>

            {/* Features */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                "AI rewrite suggestions",
                "Recruiter-focused improvements",
                "Resume enhancement recommendations",
                "Optional JD targeting",
                "Keyword optimization",
                "Stronger bullet point generation",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/80 px-4 py-3"
                >
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Waitlist CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowWaitlistModal(true)}
                className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Join Waitlist
              </button>

              <p className="text-sm text-muted-foreground flex items-center">
                Early users will receive free premium credits during launch.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section className="w-full border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                How it works
              </h2>

              <p className="text-muted-foreground">
                Optimize your resume in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Upload Resume",
                  description:
                    "Upload your PDF or DOCX resume securely in seconds.",
                },
                {
                  step: "2",
                  title: "Get ATS Analysis",
                  description:
                    "Receive ATS scoring, keyword checks, and structural insights instantly.",
                },
                {
                  step: "3",
                  title: "Improve Resume",
                  description:
                    "Use actionable suggestions to improve recruiter visibility.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                    {item.step}
                  </div>

                  <h3 className="font-medium text-foreground mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Want to see how your resume performs?
            </p>

            <Link
              to="/resume-analyzer"
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              Try the free ATS resume checker →
            </Link>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Ready to improve your resume?
            </h2>

            <p className="text-muted-foreground mb-8 text-lg">
              Start with a free ATS analysis and discover how your resume
              performs before applying to jobs.
            </p>

            <button
              onClick={handleCTA}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <FileSearch className="h-5 w-5" />
              Analyze Your Resume
            </button>
          </div>
        </section>
      </div>
      <FeatureAccessModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        feature="waitlist"
      />
      <Footer />
    </AppLayout>
  );
}
