"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function NewInterviewPage() {
  const router = useRouter();
  const [userId] = useState("770fe2d0-0d4b-4c09-abf5-a899c8cc4a31"); // This would normally come from auth
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createInterview = api.interviews.create.useMutation({
    onSuccess: (data) => {
      router.push(`/interviews/${data.id}`);
    },
    onError: (error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a title for your interview");
      setIsSubmitting(false);
      return;
    }

    try {
      createInterview.mutate({
        title: formData.title,
        description: formData.description,
        userId,
      });
    } catch (err) {
      setIsSubmitting(false);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">Start a New Interview</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Interview Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Software Engineer Interview Practice"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Add some details about this interview session"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-900"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Start Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 