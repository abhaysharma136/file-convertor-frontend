import Footer from "../components/Footer";
import ServiceNav from "../components/ServiceNav";

export default function Privacy() {
  return (
    <div className="w-full">
      <ServiceNav />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-gray-700">
          <p>
            Applyra ("we", "our", "us") respects your privacy. This policy
            explains how we collect, use, and protect your information.
          </p>

          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <ul className="list-disc pl-6">
            <li>Uploaded resumes and documents (PDF/DOCX/images)</li>
            <li>Job descriptions submitted for matching</li>
            <li>
              Technical data such as hashed IP address and browser metadata
            </li>
          </ul>

          <p>
            <strong>Important:</strong> Uploaded files are automatically deleted
            within <strong>30 minutes</strong>.
          </p>

          <h2 className="text-xl font-semibold">How We Use Data</h2>
          <ul className="list-disc pl-6">
            <li>Resume analysis and ATS scoring</li>
            <li>Resume–job description matching</li>
            <li>Document conversion</li>
            <li>Abuse prevention and quota enforcement</li>
          </ul>

          <h2 className="text-xl font-semibold">AI Processing</h2>
          <p>
            Some features use AI models to generate suggestions. AI processing
            is limited to your request and does not store or train on your data.
          </p>

          <h2 className="text-xl font-semibold">Security</h2>
          <p>
            We use temporary storage, automatic deletion, and hashed identifiers
            to protect your privacy.
          </p>

          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            Questions? Email us at{" "}
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
