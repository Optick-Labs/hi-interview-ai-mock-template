"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function InterviewDetail() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;
  const [userId] = useState("770fe2d0-0d4b-4c09-abf5-a899c8cc4a31"); // This would normally come from auth
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get interview data
  const { data: interview, isLoading: interviewLoading, error: interviewError } = 
    api.interviews.getById.useQuery({ id: interviewId });

  // Get conversation messages
  const { 
    data: conversationsData, 
    isLoading: conversationsLoading, 
    refetch: refetchConversations 
  } = api.conversations.getByInterviewId.useQuery({ interviewId });

  const conversations = conversationsData?.items ?? [];

  // Send message mutation
  const sendMessage = api.conversations.create.useMutation({
    onSuccess: () => {
      refetchConversations().catch(console.error);
      setMessage("");
    },
  });

  // Generate AI response mutation
  const generateResponse = api.conversations.generate.useMutation({
    onSuccess: () => {
      refetchConversations().catch(console.error);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  // End interview and generate evaluation
  const generateEvaluation = api.evaluations.generateEvaluation.useMutation({
    onSuccess: (data) => {
      router.push(`/evaluations/${data.id}`);
    },
  });

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  // If no conversations exist yet, create initial AI message
  useEffect(() => {
    if (
      interview && 
      !conversationsLoading && 
      Array.isArray(conversations) && 
      conversations.length === 0
    ) {
      generateResponse.mutate({
        interviewId,
        userId,
      });
    }
  }, [interview, conversations, conversationsLoading, interviewId, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);

    // Save user message
    await sendMessage.mutateAsync({
      content: message,
      type: "ANSWER",
      interviewId,
      userId,
    });

    // Generate AI response
    await generateResponse.mutateAsync({
      interviewId,
      userId,
      previousMessages: conversations,
    });
  };

  const handleEndInterview = () => {
    if (confirm("Are you sure you want to end this interview and get an evaluation?")) {
      generateEvaluation.mutate({
        interviewId,
        userId,
      });
    }
  };

  if (interviewLoading || conversationsLoading) {
    return <div className="flex justify-center py-12">Loading interview...</div>;
  }

  if (interviewError || !interview) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        Error loading interview
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{interview.title}</h1>
          {interview.description && (
            <p className="text-gray-600">{interview.description}</p>
          )}
        </div>
        {interview.status === "IN_PROGRESS" && (
          <button
            onClick={handleEndInterview}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={conversations.length < 4 || isLoading}
          >
            End & Get Evaluation
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-md border bg-white p-4">
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex ${
                conversation.type === "ANSWER" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  conversation.type === "ANSWER"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="whitespace-pre-wrap">{conversation.content}</div>
                <div
                  className={`mt-1 text-xs ${
                    conversation.type === "ANSWER" ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {new Date(conversation.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {interview.status === "IN_PROGRESS" && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      )}

      {interview.status === "COMPLETED" && (
        <div className="mt-4 rounded-md bg-green-50 p-4 text-center text-sm text-green-800">
          This interview has been completed. 
          {interview.evaluation && (
            <a 
              href={`/evaluations/${interview.evaluation.id}`} 
              className="ml-2 text-blue-600 underline"
            >
              View Evaluation
            </a>
          )}
        </div>
      )}
    </div>
  );
} 