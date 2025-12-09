// pages/results.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Results from "../components/Results";

export default function ResultsPage() {
  const router = useRouter();
  const [output, setOutput] = useState(null);
  const [mode, setMode] = useState("summary");

  useEffect(() => {
    // Get output and mode from sessionStorage
    if (typeof window !== "undefined") {
      const storedOutput = sessionStorage.getItem("aiOutput");
      const storedMode = sessionStorage.getItem("outputMode");
      
      if (storedOutput) {
        setOutput(storedOutput);
        setMode(storedMode || "summary");
      } else {
        // If no output found, redirect back to home
        router.push("/");
      }
    }
  }, [router]);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ position: "fixed", top: "20px", left: "20px", margin: 0 }}>
        AnalyzetoX
      </h1>
      <div style={{ marginTop: "60px" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "4px",
            border: "1px solid #ccc",
            background: "#f5f5f5",
          }}
        >
          ← Back to Home
        </button>
        <Results output={output} mode={mode} />
      </div>
    </div>
  );
}
