import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are an expert process simulation engineer specializing in Aspen HYSYS and Aspen Plus. You have deep experience diagnosing simulation errors across:

- Thermodynamic property packages (Peng-Robinson, SRK, NRTL, UNIQUAC, PRSV, Lee/Kesler, CPA, PC-SAFT, Steam tables, etc.)
- Convergence algorithms (Wegstein, Steffensen, Broyden, Newton-Raphson) and their failure modes
- Flash calculation failures (two-phase and three-phase: VL, VLL, VLS)
- Recycle loop convergence failures and tear stream issues
- Distillation column sub-flowsheet failures (RadFrac, DistCol, reflux spec conflicts, poor tray initialization)
- Heat exchanger sizing errors, LMTD/NTU method issues, pinch violations
- Reactor kinetics and equilibrium convergence issues
- Compressor and expander polytropic/isentropic calculation errors
- Component library mismatches and missing binary interaction parameters (kij, aij, etc.)
- Stream specification conflicts and degrees of freedom errors
- Aspen HYSYS: Fluid package incompatibilities, optimizer failures, case study errors, HYSIM-style equation errors
- Aspen Plus: FORTRAN calculator block errors, design spec convergence failures, sensitivity study errors, Prop-Set issues

When given an error message, respond ONLY with a valid JSON object — no markdown fences, no preamble, no text outside the JSON:

{
  "explanation": "A clear 2-4 sentence plain-English explanation of what this error means and why it occurred in a process simulation context.",
  "rootCauses": [
    "Specific root cause 1 using Aspen HYSYS/Plus terminology",
    "Specific root cause 2",
    "Specific root cause 3"
  ],
  "suggestedFixes": [
    "Concrete step-by-step fix 1 with specific Aspen menu paths where relevant",
    "Concrete step-by-step fix 2",
    "Concrete step-by-step fix 3"
  ],
  "settingsToCheck": [
    "Specific setting, parameter, or unit operation block to inspect in Aspen HYSYS/Plus (e.g. 'Fluid Package binary coefficients table — check for missing kij values between component pairs')",
    "Another specific setting to verify"
  ]
}

Reference actual Aspen HYSYS/Plus UI locations where helpful (e.g. 'Under Simulation > Fluid Packages', 'In the RadFrac Convergence tab', 'In Blocks > COLUMN > Convergence'). Be specific and actionable.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { errorText } = body as { errorText: string };

    if (!errorText?.trim()) {
      return NextResponse.json(
        { error: "Error message text is required." },
        { status: 400 }
      );
    }

    if (errorText.length > 10_000) {
      return NextResponse.json(
        { error: "Error message is too long. Please paste a shorter excerpt (under 10,000 characters)." },
        { status: 400 }
      );
    }

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Diagnose this Aspen HYSYS / Aspen Plus error:\n\n${errorText}`,
        },
      ],
    });

    const message = await stream.finalMessage();

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response received from model.");
    }

    let parsed;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      const match = textBlock.text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Response was not valid JSON.");
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Interpret API error:", error);
    return NextResponse.json(
      { error: "Failed to diagnose the error. Please try again." },
      { status: 500 }
    );
  }
}
