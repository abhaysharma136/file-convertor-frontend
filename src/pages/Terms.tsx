import Footer from "../components/Footer";
import ServiceNav from "../components/ServiceNav";

export default function Terms() {
  return (
    <div className="w-full">
      <ServiceNav />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-gray-700">
          <p>By using Applyra, you agree to the following terms.</p>

          <h2 className="text-xl font-semibold">Service Description</h2>
          <p>
            Applyra provides resume analysis, job matching, and document
            conversion tools. We do not guarantee interviews, job offers, or
            hiring outcomes.
          </p>

          <h2 className="text-xl font-semibold">Usage Limits</h2>
          <p>
            Free usage is subject to daily limits. Abuse or attempts to bypass
            limits may result in restricted access.
          </p>

          <h2 className="text-xl font-semibold">No Professional Advice</h2>
          <p>
            Applyra provides informational guidance only. You remain responsible
            for your job applications and career decisions.
          </p>

          <h2 className="text-xl font-semibold">Availability</h2>
          <p>
            We aim to provide reliable service but do not guarantee
            uninterrupted access.
          </p>

          <h2 className="text-xl font-semibold">Limitation of Liability</h2>
          <p>
            Applyra is not liable for employment decisions, data loss beyond
            reasonable safeguards, or third-party actions.
          </p>

          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            Email:{" "}
            <a
              href="mailto:support@applyra.ai"
              className="text-blue-600 underline"
            >
              support@applyra.ai
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
