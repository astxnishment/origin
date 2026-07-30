import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  htmlWithLineBreaks,
  isPlausibleSubmissionTime,
} from "@/lib/server/requestSecurity";

describe("request security helpers", () => {
  it("escapes customer-controlled email HTML", () => {
    expect(escapeHtml(`<img src=x onerror="alert(1)">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
    );
    expect(htmlWithLineBreaks("first\n<script>")).toBe(
      "first<br>&lt;script&gt;"
    );
  });

  it("rejects submissions that are implausibly fast or stale", () => {
    expect(isPlausibleSubmissionTime(Date.now())).toBe(false);
    expect(isPlausibleSubmissionTime(Date.now() - 3_000)).toBe(true);
    expect(
      isPlausibleSubmissionTime(Date.now() - 3 * 60 * 60 * 1000)
    ).toBe(false);
  });
});
