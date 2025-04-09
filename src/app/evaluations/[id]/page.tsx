"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function EvaluationDetail() {
  const params = useParams();
  const router = useRouter();
  const evaluationId = params.id as string;

  const { data: evaluation, isLoading, error } = api.evaluations.getById.useQuery({
    id: evaluationId,
  });

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading evaluation...</div>;
  }

  if (error || !evaluation) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        Error loading evaluation
      </div>
    );
  }

  const { score, feedback, interview } = evaluation;

  // Score to visual representations
  const scoreColor = 
    score >= 8 ? "text-green-600" : 
    score >= 5 ? "text-yellow-600" : 
    "text-red-600";

  const scoreDescription = 
    score >= 8 ? "Excellent" : 
    score >= 5 ? "Good" : 
    "Needs Improvement";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Interview Evaluation</h1>
        {interview && (
          <Link
            href={`/interviews/${interview.id}`}
            className="text-blue-600 hover:underline"
          >
            View Interview
          </Link>
        )}
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Performance Summary</h2>
        </div>
        <div className="px-6 py-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-500">Overall Score</span>
              <div className="flex items-center">
                <span className={`mr-2 text-3xl font-bold ${scoreColor}`}>{score}/10</span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  score >= 8 ? "bg-green-100 text-green-800" : 
                  score >= 5 ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {scoreDescription}
                </span>
              </div>
            </div>
            
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-gray-200">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${
                  score >= 8 ? "bg-green-500" : 
                  score >= 5 ? "bg-yellow-500" : 
                  "bg-red-500"
                }`}
              >
                {score}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-500">Detailed Feedback</h3>
            <div className="whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm">
              {feedback}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back
        </button>
        <Link
          href="/interviews/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Start New Interview
        </Link>
      </div>
    </div>
  );
} 