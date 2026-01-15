import { useState } from "react";
import { useRouter } from "next/router";
import FileUploader from "../components/FileUploader";
import URLInputs from "../components/URLInputs";
import ModeSelector from "../components/ModeSelector";
import RawTextInput from "../components/RawTextInput";
import { extractYouTubeVideoId } from "../lib/youtube";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ");
}

export default function Home() {
  const router = useRouter();
  const [screenshots, setScreenshots] = useState([]);
  const [transcript, setTranscript] = useState(null);
  const [comments, setComments] = useState(null);
  const [article, setArticle] = useState(null);
  const [rawText, setRawText] = useState("");
  const [mode, setMode] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [commentsStatus, setCommentsStatus] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [fallbackTitle, setFallbackTitle] = useState("");
  const [fallbackHandle, setFallbackHandle] = useState("");

    // When screenshot is uploaded
  function handleScreenshotUpload(data) {
    setScreenshots((prev) => [...prev, data]);

    // If Vision found a YouTube videoId, auto-load comments for that video
    if (data && data.videoId) {
      handleFetchCommentsFromScreenshot(data.videoId);
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
        console.error("Error fetching comments from screenshot video:", data.error);
        return;
      }

      if (Array.isArray(data.comments)) {
        setComments(data.comments);
        setCommentsStatus(`Comments loaded ✔ (${data.comments.length})`);
      }
    } catch (err) {
      console.error("handleFetchCommentsFromScreenshot error:", err);
    }
  }

  async function handleFetchCommentsFallback() {
    setCommentsStatus("Trying to find the video...");

    const urlId = extractYouTubeVideoId(fallbackUrl);
    const params = new URLSearchParams();

    if (urlId) {
      params.set("videoId", urlId);
    } else if (fallbackUrl && fallbackUrl.trim()) {
      params.set("url", fallbackUrl.trim());
    } else {
      if (fallbackTitle && fallbackTitle.trim()) params.set("title", fallbackTitle.trim());
      if (fallbackHandle && fallbackHandle.trim()) params.set("handle", fallbackHandle.trim());
    }

    if ([...params.keys()].length === 0) {
      setCommentsStatus("Paste a YouTube link, or enter title + @handle.");
      return;
    }

    try {
      const res = await fetch(`/api/getComments?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        setCommentsStatus(`Error: ${data.error}`);
        return;
      }

      if (Array.isArray(data.comments)) {
        setComments(data.comments);
        setCommentsStatus(`Comments loaded ✔ (${data.comments.length})`);
      }
    } catch (err) {
      console.error("handleFetchCommentsFallback error:", err);
      setCommentsStatus("Error: failed to fetch comments.");
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
      ? `Loaded – "${article.title}"`
      : "Loaded"
    : "None";
  const rawTextChars = rawText ? rawText.length : 0;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", position: "relative" }}>
      <h1 style={{ position: "fixed", top: "20px", left: "20px", margin: 0 }}>AnalyzetoX</h1>

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
                    }}
                  >
                    Load comments for this video
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile fallback: no videoId in screenshot */}
          {screenshots.some((s) => !s?.videoId) && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              <h4 style={{ marginTop: 0, marginBottom: 8 }}>
                Can’t detect the video from the screenshot?
              </h4>

              <div style={{ display: "grid", gap: 8 }}>
                <input
                  type="url"
                  value={fallbackUrl}
                  onChange={(e) => setFallbackUrl(e.target.value)}
                  placeholder="Paste YouTube link (recommended)"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 14,
                  }}
                />

                <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 220px" }}>
                  <input
                    type="text"
                    value={fallbackTitle}
                    onChange={(e) => setFallbackTitle(e.target.value)}
                    placeholder="Or enter video title"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      fontSize: 14,
                    }}
                  />
                  <input
                    type="text"
                    value={fallbackHandle}
                    onChange={(e) => setFallbackHandle(e.target.value)}
                    placeholder="@channelhandle"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      fontSize: 14,
                    }}
                  />
                </div>

                <button
                  onClick={handleFetchCommentsFallback}
                  style={{
                    padding: "10px 12px",
                    fontSize: 14,
                    cursor: "pointer",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: "#f5f5f5",
                    width: "fit-content",
                  }}
                >
                  Find video + load comments
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p style={{ textAlign: "center", marginTop: 20, marginBottom: 0, fontSize: 16 }}>or</p>

   <URLInputs
     onTranscript={handleTranscript} 
     onComments={handleComments}
     onArticle={handleArticle}
     commentsStatus={commentsStatus}
     onCommentsStatusChange={setCommentsStatus}
   />

   {transcript && <p>Transcript loaded ✔</p>}
   {article && <p>Article extracted ✔</p>}

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
            }}
          >
            {article.content
              ? (() => {
                  const plain = stripHtml(article.content);
                  return plain.slice(0, 1000) +
                    (plain.length > 1000 ? "..." : "");
                })()
              : "No article content found."}
          </pre>
        </div>
      )}



      <RawTextInput text={rawText} setText={setRawText} />

      <ModeSelector mode={mode} setMode={setMode} />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
          }}
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
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Sources summary</h3>
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
            {rawTextChars > 0
              ? `${rawTextChars} character(s)`
              : "None"}
          </li>
        </ul>
      </div>

    </div>
  );
}
