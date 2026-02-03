import Footer from "../components/Footer";
import ServiceNav from "../components/ServiceNav";

export default function Trust() {
  return (
    <div className="w-full">
      <ServiceNav />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Trust & Transparency</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold">No Sign-Ups Required</h2>
            <p>Applyra works without accounts, emails, or tracking profiles.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Automatic File Deletion</h2>
            <p>
              All uploaded files are deleted within <strong>30 minutes</strong>.
              We do not store resumes long-term.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Transparent ATS Scoring</h2>
            <p>
              ATS scores are rule-based and explainable. AI suggestions enhance
              clarity but do not control scores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              Privacy-Safe Abuse Protection
            </h2>
            <p>
              We enforce fair usage limits using hashed IPs—never raw personal
              data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Responsible AI Usage</h2>
            <p>
              AI is used selectively, cost-aware, and never trained on your
              data.
            </p>
          </section>

          <section className="pt-4 text-sm text-gray-500">
            Built with care for job seekers worldwide.
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
