"use client";

import { useState } from "react";

interface Props {
  onDiagnose: (errorText: string) => void;
  loading: boolean;
}

export function ErrorInput({ onDiagnose, loading }: Props) {
  const [errorText, setErrorText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (errorText.trim()) {
      onDiagnose(errorText.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="error-input" className="block text-sm font-medium text-slate-700">
        Paste your Aspen HYSYS / Aspen Plus error message
      </label>
      <textarea
        id="error-input"
        value={errorText}
        onChange={(e) => setErrorText(e.target.value)}
        placeholder="e.g. Flash calculation failed for stream FEED at 25.00 C and 1.01325 bar. Unable to determine valid phase..."
        rows={8}
        className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !errorText.trim()}
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Diagnosing..." : "Diagnose Error"}
      </button>
    </form>
  );
}
