"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          background: "#0a0a0a",
          color: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "420px" }}>
            <h1 style={{ fontSize: "30px", margin: "0 0 16px" }}>
              Origin Repairs could not load.
            </h1>
            <p style={{ color: "#a3a3a3", lineHeight: 1.6 }}>
              Please try again. No form submission has been marked as
              successful.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "20px",
                minHeight: "44px",
                border: "1px solid #404040",
                borderRadius: "6px",
                background: "#f5f5f5",
                color: "#0a0a0a",
                padding: "0 20px",
                fontWeight: 700,
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
