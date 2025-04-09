"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function InterviewsPage() {
  const [userId] = useState("770fe2d0-0d4b-4c09-abf5-a899c8cc4a31"); // This would normally come from auth

  const {
    data: interviewsData,
    isLoading,
    error,
  } = api.interviews.getAll.useQuery({ userId });

  const interviews = interviewsData?.items ?? [];

  // Function to show status with appropriate color
  const statusBadge = (status: string) => {
    const colors = {
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };

    const color = colors[status as keyof typeof colors] || "bg-gray-100";
    
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading interviews...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        Error loading interviews: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Interviews</h1>
        <Link
          href="/interviews/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Interview
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center">
          <p className="mb-4 text-gray-600">{"You don't have any interviews yet."}</p>
          <Link
            href="/interviews/new"
            className="text-blue-600 hover:underline"
          >
            Start your first practice interview
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {interviews.map((interview) => (
                <tr key={interview.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{interview.title}</div>
                    {interview.description && (
                      <div className="text-sm text-gray-500">{interview.description}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {statusBadge(interview.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Link
                      href={`/interviews/${interview.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {interview.status === "IN_PROGRESS" ? "Continue" : "View"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 