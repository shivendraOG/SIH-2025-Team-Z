import React, { useState } from "react";

export default function ChatbotExplainer() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExplain() {
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraph: input }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to get explanation.");
      } else {
        setResponse(data.explanation);
      }
    } catch {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Book Paragraph Explainer Chatbot
      </h2>
      <textarea
        className="w-full p-3 border rounded mb-3"
        rows={5}
        placeholder="Paste your book paragraph here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded font-bold"
        onClick={handleExplain}
        disabled={loading || !input.trim()}
      >
        {loading ? "Explaining..." : "Explain Paragraph"}
      </button>
      {error && <div className="mt-3 text-red-600">{error}</div>}
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <strong>Explanation:</strong>
          <div className="mt-2 text-gray-800">{response}</div>
        </div>
      )}
    </div>
  );
}
