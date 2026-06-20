"use client";

import { DiagnosisData } from "@/lib/types";

export function DiagnosisResult({ data }: { data: DiagnosisData }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
          What Happened
        </h3>
        <p className="text-sm leading-relaxed text-slate-700">{data.explanation}</p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Likely Root Causes
        </h3>
        <ul className="space-y-1.5 list-disc list-inside">
          {data.rootCauses.map((cause, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-700">
              {cause}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
          Suggested Fixes
        </h3>
        <ol className="space-y-1.5 list-decimal list-inside">
          {data.suggestedFixes.map((fix, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-700">
              {fix}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-700">
          Settings &amp; Unit Ops to Check
        </h3>
        <ul className="space-y-1.5 list-disc list-inside">
          {data.settingsToCheck.map((setting, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-700">
              {setting}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
