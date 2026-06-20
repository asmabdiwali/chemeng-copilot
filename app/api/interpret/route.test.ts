/**
 * Test fixture for app/api/interpret/route.ts
 *
 * Uses a real, manually-verified test case (recycle loop convergence failure).
 * See TEST_RESULTS.md for the full manual testing log across 4 error types.
 *
 * To run: npm install -D jest @types/jest ts-jest (if not already installed)
 *         npx jest
 */

import { POST } from "@/app/api/interpret/route";
import { NextRequest } from "next/server";

const RECYCLE_CONVERGENCE_ERROR = `ERROR: Recycle block RCY-1 has not converged after 50 iterations.
Maximum error: 0.0234 (tolerance: 0.0001)
Check stream specifications and tear stream initial estimates.`;

function buildRequest(errorText: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/interpret", {
    method: "POST",
    body: JSON.stringify({ errorText }),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/interpret", () => {
  it("returns a structured diagnosis for a valid HYSYS error", async () => {
    const request = buildRequest(RECYCLE_CONVERGENCE_ERROR);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("explanation");
    expect(data).toHaveProperty("rootCauses");
    expect(data).toHaveProperty("suggestedFixes");
    expect(data).toHaveProperty("settingsToCheck");
  });

  it("returns 400 for empty error text", async () => {
    const request = buildRequest("");
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for error text exceeding the length limit", async () => {
    const tooLong = "a".repeat(10_001);
    const request = buildRequest(tooLong);
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
