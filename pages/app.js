import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import FileUploader from "../components/FileUploader";
import URLInputs from "../components/URLInputs";
import ModeSelector from "../components/ModeSelector";
import ToneSelector from "../components/ToneSelector";
import RawTextInput from "../components/RawTextInput";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ");
}

export default function App() {
  const router = useRouter();
  const [screenshots, setScreenshots] = useState([]);
  const [transcript, setTranscript] = useState(null);
  const [comments, setComments] = useState(null);
  const [article, setArticle] = useState(null);
  const [rawText, setRawText] = useState("");
  const [mode, setMode] = useState("summary");
  const [tone, setTone] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [commentsStatus, setCommentsStatus] = useState("");

  // When screenshot is uploaded
  async function handleScreenshotUpload(data) {
    setScreenshots((prev) => [...prev, data]);

    // If Vision found a YouTube videoId, auto-load comments for that video
    if (data && data.videoId) {
      handleFetchCommentsFromScreenshot(data.videoId);
    } else if (data && data.title && data.handle) {
      // If videoId is missing but we have title + handle, try to auto-resolve
      setCommentsStatus("Finding video from title + @handle...");
      try {
        const params = new URLSearchParams();
        params.set("title", data.title.trim());
        params.set("handle", data.handle.trim());

        const res = await fetch(`/api/getComments?${params.toString()}`);
        const commentsResData = await res.json();

        if (commentsResData.error) {
          setCommentsStatus(`Could not find video: ${commentsResData.error}`);
          return;
        }

        if (Array.isArray(commentsResData.comments)) {
          setComments(commentsResData.comments);
          setCommentsStatus(
            `Comments loaded ✓ (${commentsResData.comments.length})`
          );
        }
      } catch (err) {
        console.error("Auto-resolve video from title+handle error:", err);
        setCommentsStatus(
          "Could not automatically find video. Try manual entry below."
        );
      }
    }
  }

  function handleTranscript(data) {
    setTranscript(data);
  }

  function handleComments(data) {
    setComments(data);
  }

  function handleArticle(data) {
    setArticle(data);
  }

  async function handleGenerate() {
    setLoading(true);

    const res = await fetch("/api/processContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        screenshots,
        transcript,
        comments,
        article,
        rawText,
        mode,
        tone,
      }),
    });

    const data = await res.json();
    setLoading(false);

    // Store output in sessionStorage and navigate to results page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aiOutput", data.output);
      sessionStorage.setItem("outputMode", mode);
      router.push("/results");
    }
  }

  // Use videoId from a screenshot to fetch YouTube comments
  async function handleFetchCommentsFromScreenshot(videoId) {
    if (!videoId) return;
    setCommentsStatus("Loading comments...");

    try {
      const res = await fetch(
        `/api/getComments?videoId=${encodeURIComponent(videoId)}`
      );
      const data = await res.json();

      if (data.error) {
        console.error(
          "Error fetching comments from screenshot video:",
          data.error
        );
        return;
      }

      if (Array.isArray(data.comments)) {
        setComments(data.comments);
        setCommentsStatus(`Comments loaded ✓ (${data.comments.length})`);
      }
    } catch (err) {
      console.error("handleFetchCommentsFromScreenshot error:", err);
    }
  }

  // Derived info for Sources summary
  const screenshotCount = Array.isArray(screenshots) ? screenshots.length : 0;
  const commentsCount = Array.isArray(comments) ? comments.length : 0;
  const transcriptStatus = transcript
    ? typeof transcript === "string"
      ? "Loaded (manual text)"
      : "Loaded (API/structured)"
    : "None";
  const articleStatus = article
    ? article.title
      ? `Loaded — "${article.title}"`
      : "Loaded"
    : "None";
  const rawTextChars = rawText ? rawText.length : 0;

  return (
    <>
      <Head>
        <title>AnalyzetoX - App</title>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link
          href="https://fonts.cdnfonts.com/css/academy-engraved-let"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/big-caslon"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Retro Grid Background */}
        <div className="grid-background">
          <div className="perspective-grid"></div>
        </div>

        <div className="relative z-10 container mx-auto px-8 py-12">
          {/* Header with back button */}
          <div className="mb-12">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center text-white hover:text-gray-300 transition"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Back to Home
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="caslon-font text-5xl mb-8 text-center">
              Create Your Thread
            </h1>

            <FileUploader onUpload={handleScreenshotUpload} />
            {screenshots.length > 0 && <p>1 screenshot added.</p>}

            {screenshots.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <h3>Screenshot details (debug)</h3>
                <ul style={{ paddingLeft: 18, fontSize: 13 }}>
                  {screenshots.map((shot, idx) => (
                    <li key={idx} style={{ marginBottom: 10 }}>
                      <strong>Screenshot {idx + 1}</strong>
                      <br />
                      Title: {shot.title || "—"}
                      <br />
                      Channel: {shot.channel || "—"}
                      <br />
                      Handle: {shot.handle || "—"}
                      <br />
                      Video ID: {shot.videoId || "—"}
                      <br />
                      Description: {shot.description || "—"}
                      <br />
                      {shot.videoId && (
                        <button
                          onClick={() =>
                            handleFetchCommentsFromScreenshot(shot.videoId)
                          }
                          style={{
                            marginTop: 4,
                            padding: "4px 8px",
                            fontSize: 12,
                            cursor: "pointer",
                            borderRadius: 4,
                            border: "1px solid #ccc",
                            background: "#f5f5f5",
                            color: "#000",
                          }}
                        >
                          Load comments for this video
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p
              style={{
                textAlign: "center",
                marginTop: 20,
                marginBottom: 0,
                fontSize: 16,
              }}
            >
              or
            </p>

            <URLInputs
              onTranscript={handleTranscript}
              onComments={handleComments}
              onArticle={handleArticle}
              commentsStatus={commentsStatus}
              onCommentsStatusChange={setCommentsStatus}
            />

            {transcript && <p>Transcript loaded ✓</p>}
            {article && <p>Article extracted ✓</p>}

            {/* Transcript preview */}
            {transcript && (
              <div style={{ marginTop: "10px" }}>
                <h3>Transcript preview (raw)</h3>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    maxHeight: "200px",
                    overflow: "auto",
                    background: "#f5f5f5",
                    padding: "10px",
                    color: "#000",
                  }}
                >
                  {JSON.stringify(transcript, null, 2)}
                </pre>
              </div>
            )}

            {/* Article preview */}
            {article && (
              <div style={{ marginTop: "10px" }}>
                <h3>Article preview</h3>
                <p>
                  <strong>Title:</strong> {article.title}
                </p>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    maxHeight: "200px",
                    overflow: "auto",
                    background: "#f5f5f5",
                    padding: "10px",
                    color: "#000",
                  }}
                >
                  {article.content
                    ? (() => {
                        const plain = stripHtml(article.content);
                        return (
                          plain.slice(0, 1000) +
                          (plain.length > 1000 ? "..." : "")
                        );
                      })()
                    : "No article content found."}
                </pre>
              </div>
            )}

            <RawTextInput text={rawText} setText={setRawText} />

            <ToneSelector tone={tone} setTone={setTone} />

            <ModeSelector mode={mode} setMode={setMode} />

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-white text-black caslon-font text-2xl py-4 px-8 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Output"}
              </button>
            </div>

            {/* Sources summary panel */}
            <div
              style={{
                marginTop: 20,
                marginBottom: 20,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fafafa",
                fontSize: 14,
                color: "#000",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                Sources summary
              </h3>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>{screenshotCount} screenshot(s)</li>
                <li>Transcript: {transcriptStatus}</li>
                <li>
                  Comments:{" "}
                  {commentsCount > 0 ? `${commentsCount} loaded` : "None"}
                </li>
                <li>Article: {articleStatus}</li>
                <li>
                  Raw text:{" "}
                  {rawTextChars > 0 ? `${rawTextChars} character(s)` : "None"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .academy-font {
          font-family: 'Academy Engraved LET', serif;
        }

        .caslon-font {
          font-family: 'Big Caslon', serif;
          font-weight: bold;
        }

        /* Retro grid background */
        .grid-background {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60vh;
          overflow: hidden;
          z-index: 0;
          perspective: 500px;
        }

        .perspective-grid {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 150%;
          transform-origin: bottom center;
          transform: rotateX(75deg);
          background-image: linear-gradient(
              0deg,
              transparent 49%,
              rgba(255, 255, 255, 0.4) 49%,
              rgba(255, 255, 255, 0.4) 51%,
              transparent 51%
            ),
            linear-gradient(
              90deg,
              transparent 49%,
              rgba(255, 255, 255, 0.4) 49%,
              rgba(255, 255, 255, 0.4) 51%,
              transparent 51%
            );
          background-size: 100px 100px;
          background-position: 0 0;
          animation: gridMove 15s linear infinite;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.5) 20%,
            rgba(0, 0, 0, 1) 40%,
            rgba(0, 0, 0, 1) 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.5) 20%,
            rgba(0, 0, 0, 1) 40%,
            rgba(0, 0, 0, 1) 100%
          );
        }

        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100px;
          }
        }
      `}</style>
    </>
  );
}
