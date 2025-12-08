import { useState } from "react";
import FileUploader from "../components/FileUploader";
import URLInputs from "../components/URLInputs";
import ModeSelector from "../components/ModeSelector";
import RawTextInput from "../components/RawTextInput";
import Results from "../components/Results";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ");
}

export default function Home() {
  const [screenshots, setScreenshots] = useState([]);
  const [transcript, setTranscript] = useState(null);
  const [comments, setComments] = useState(null);
  const [article, setArticle] = useState(null);
  const [rawText, setRawText] = useState("");
  const [mode, setMode] = useState("summary");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setOutput(data.output);
    setLoading(false);
  }
    // Use videoId from a screenshot to fetch YouTube comments
  async function handleFetchCommentsFromScreenshot(videoId) {
    if (!videoId) return;

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
      ? `Loaded – "${article.title}"`
      : "Loaded"
    : "None";
  const rawTextChars = rawText ? rawText.length : 0;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Multi-Source Analyzer</h1>
      <p>
        Upload screenshots, paste YouTube links, article URLs, or text. Then choose a mode and
        generate.
      </p>

      <hr />
      <h2>1. Upload Screenshots</h2>
      <FileUploader onUpload={handleScreenshotUpload} />
      <p>{screenshots.length} screenshot(s) added.</p>

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
        </div>
      )}

      <hr />



          <h2>2. YouTube & Article Inputs</h2>
   <URLInputs
     onTranscript={handleTranscript} 
     onComments={handleComments}
     onArticle={handleArticle}
   />

   {transcript && <p>Transcript loaded ✔</p>}
   {comments && <p>Comments loaded ✔</p>}
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



      <hr />

      <h2>3. Paste Raw Text (optional)</h2>
      <RawTextInput text={rawText} setText={setRawText} />

      <hr />

      <h2>4. Choose Output Mode</h2>
      <ModeSelector mode={mode} setMode={setMode} />

            <h2>4. Output Mode</h2>
      <ModeSelector mode={mode} setMode={setMode} />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        {loading ? "Generating..." : "Generate Output"}
      </button>

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

      <Results output={output} mode={mode} />


    </div>
  );
}
