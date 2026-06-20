"use client";

import { useState } from "react";
import { ErrorInput } from "@/components/ErrorInput";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { DiagnosisData } from "@/lib/types";

export default function Home() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDiagnose(errorText: string) {
    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setDiagnosis(data as DiagnosisData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-gradient-to-r from-blue-950 to-slate-900 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">ChemE AI Copilot</h1>
          <p className="mt-1 text-blue-300 text-sm">
            Aspen HYSYS / Aspen Plus Error Interpreter
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <ErrorInput onDiagnose={handleDiagnose} loading={loading} />

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 flex items-center justify-center gap-3 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            <span className="text-sm">Analyzing error...</span>
          </div>
        )}

        {diagnosis && <DiagnosisResult data={diagnosis} />}
      </main>
    </div>
  );
}
