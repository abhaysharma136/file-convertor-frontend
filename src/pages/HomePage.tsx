import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import AppLayout from "../layouts/AppLayout";
import {
  FileSearch,
  GitCompare,
  RefreshCw,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";

const benefits = [
  { icon: Shield, text: "Secure & Private" },
  { icon: Zap, text: "Instant Results" },
  { icon: CheckCircle, text: "Free to Use" },
];

export default function HomePage() {
  const [lastService, setLastService] = useState<string | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("lastService");
    setLastService(stored);
  }, []);
  return (
    <AppLayout>
      <div className="flex flex-col gap-10 items-center text-center">
        {/* Hero */}
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            Land more interviews with an{" "}
            <span className="text-primary">ATS-optimized</span> resume
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Free tools to analyze, optimize, and convert your resume. Beat the
            bots and get your application seen by real recruiters.
          </p>
          {/* Benefits */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <benefit.icon className="h-4 w-4 text-accent" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <ServiceCard
            title="ATS Resume Analyzer"
            description="Check how well your resume performs with applicant tracking systems. Get actionable feedback to improve your score."
            to="/resume-analyzer"
            icon={<FileSearch />}
            primary
            highlighted={lastService === "resume"}
          />
          <ServiceCard
            title="JD Match"
            description="Compare your resume against specific job descriptions. Find missing keywords and optimize your application."
            to="/match"
            icon={<GitCompare />}
            highlighted={lastService === "match"}
          />
          <ServiceCard
            title="File Converter"
            description="Convert documents and images between formats. Support for PDF, Word, images, and more."
            to="/convert"
            icon={<RefreshCw />}
            highlighted={lastService === "convert"}
          />
        </div>
        {/* How It Works */}
        <section className="w-full border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                How it works
              </h2>
              <p className="text-muted-foreground">
                Three simple steps to improve your resume
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Upload",
                  description: "Drag and drop your resume or click to browse",
                },
                {
                  step: "2",
                  title: "Analyze",
                  description:
                    "Our tools scan your resume for ATS compatibility",
                },
                {
                  step: "3",
                  title: "Improve",
                  description: "Get actionable suggestions to boost your score",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-medium text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ready to optimize your resume?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start with our free ATS analyzer and see how your resume scores.
            </p>
            <Link
              to="/resume-analyzer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <FileSearch className="h-5 w-5" />
              Analyze Your Resume
            </Link>
          </div>
        </section>
        {/* Trust */}
      </div>
      <Footer />
    </AppLayout>
  );
}
