import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Practice Behavioral Interviews with AI</h1>
        <p className="mb-8 text-lg text-gray-600">
          Improve your interview skills with personalized AI-powered practice sessions
        </p>
        <Link 
          href="/interviews/new"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Start a Practice Interview
        </Link>
      </section>
      
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 text-xl font-semibold">1. Start an Interview</div>
            <p className="text-gray-600">Choose an interview type and begin your practice session</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 text-xl font-semibold">2. Answer Questions</div>
            <p className="text-gray-600">Respond to realistic behavioral questions from AI interviewers</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 text-xl font-semibold">3. Get Feedback</div>
            <p className="text-gray-600">Receive detailed evaluation and suggestions for improvement</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Benefits</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700">
          <li>Practice anytime, anywhere</li>
          <li>Get personalized feedback on your responses</li>
          <li>Improve your communication and interview skills</li>
          <li>Prepare for common behavioral questions</li>
          <li>Build confidence for your real interviews</li>
        </ul>
      </section>
    </div>
  );
} 