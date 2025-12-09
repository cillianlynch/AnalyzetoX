import { useState } from "react";

export default function URLInputs({ onTranscript, onComments, onArticle, commentsStatus, onCommentsStatusChange }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  // Pull a videoId out of any common YouTube URL form
  function extractVideoId(url) {
    try {
      if (!url) return null;
      const u = new URL(url.trim());

      // youtu.be/VIDEOID
      if (u.hostname === "youtu.be") {
        return u.pathname.slice(1);
      }

      // youtube.com/watch?v=VIDEOID
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
        return u.searchParams.get("v");
      }

      // youtube.com/shorts/VIDEOID
      const parts = u.pathname.split("/");
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex !== -1 && parts[shortsIndex + 1]) {
        return parts[shortsIndex + 1];
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (!url.trim()) {
      setStatus("Please paste a URL.");
      return;
    }

    const videoId = extractVideoId(url.trim());
    
    // Try YouTube first if it's a YouTube URL
    if (videoId) {
      try {
        const res = await fetch(
          `/api/getComments?videoId=${encodeURIComponent(videoId)}`
        );
        const data = await res.json();

        if (data.error) {
          setStatus("Error: " + data.error);
          return;
        }

        if (Array.isArray(data.comments)) {
          if (onComments) onComments(data.comments);
          const statusMsg = `Comments loaded ✔ (${data.comments.length})`;
          setStatus(statusMsg);
          if (onCommentsStatusChange) {
            onCommentsStatusChange(statusMsg);
          }
        } else {
          setStatus("No comments found.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Error: failed to fetch.");
      }
    } else {
      // Try as article URL
      try {
        const res = await fetch(
          "/api/getArticle?url=" + encodeURIComponent(url.trim())
        );
        const data = await res.json();

        if (data.error) {
          setStatus("Error: " + data.error);
          return;
        }

        if (onArticle) onArticle(data);
        const statusMsg = "Article extracted ✔";
        setStatus(statusMsg);
        if (onCommentsStatusChange) {
          onCommentsStatusChange(statusMsg);
        }
      } catch (err) {
        console.error(err);
        setStatus("Error: failed to fetch.");
      }
    }
  }

  const displayStatus = commentsStatus || status;

  return (
    <div style={{ marginTop: 20 }}>
      {displayStatus && (
        <p style={{ marginBottom: 8, fontSize: 14, color: "#555" }}>
          {displayStatus}
        </p>
      )}
      <input
        type="url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          // Clear status when user starts typing
          if (e.target.value) {
            setStatus("");
            if (onCommentsStatusChange) {
              onCommentsStatusChange("");
            }
          }
        }}
        placeholder="URL of article or video"
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 4,
          border: "2px solid #333",
          fontSize: 16,
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
      />
    </div>
  );
}
