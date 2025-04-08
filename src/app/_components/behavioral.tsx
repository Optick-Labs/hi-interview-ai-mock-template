"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function BehavioralAIMock() {
  // State for Dummy creation
  const [name, setName] = useState("");
  const utils = api.useUtils();
  const { data: latestDummy } = api.behavioral.getLatestDummy.useQuery();
  const createDummy = api.behavioral.createDummy.useMutation({
    onSuccess: async () => {
      await utils.behavioral.getLatestDummy.invalidate();
      setName("");
    },
  });

  // State for AI Test
  const [countryName, setCountryName] = useState("");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const aiTest = api.behavioral.aiTest.useMutation({
    onSuccess: (data) => {
      setAiResult(data.result);
    },
    onError: (error) => {
      setAiResult(`Error: ${error.message}`);
    }
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      {/* Dummy Creation Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        {latestDummy ? (
          <p className="mb-4 text-lg text-gray-800">Latest dummy: {latestDummy.name}</p>
        ) : (
          <p className="mb-4 text-lg text-gray-800">No dummies created yet</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createDummy.mutate({ name });
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Enter dummy name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-black"
          />
          <button
            type="submit"
            disabled={createDummy.isPending}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
          >
            {createDummy.isPending ? "Creating..." : "Create Dummy"}
          </button>
        </form>
      </div>

      {/* AI Test Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Test</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter country name"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-black"
          />
          <button
            onClick={() => {
              setAiResult(null); // Clear previous result
              aiTest.mutate({ country: countryName });
            }}
            disabled={aiTest.isPending ?? !countryName}
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-green-300"
          >
            {aiTest.isPending ? "Testing AI..." : "Test AI"}
          </button>
        </div>
        {aiResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-gray-700">{aiResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
