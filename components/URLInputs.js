import { useState } from "react";

export default function URLInputs({ onTranscript, onComments, onArticle }) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [youtubeStatus, setYoutubeStatus] = useState("");
  const [articleStatus, setArticleStatus] = useState("");

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

  // When user pastes a YouTube URL and hits Enter
  async function handleYouTubeSubmit(e) {
    e.preventDefault();
    setYoutubeStatus("");

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setYoutubeStatus("Could not read a video ID from that URL.");
      return;
    }

    try {
      const res = await fetch(
        `/api/getComments?videoId=${encodeURIComponent(videoId)}`
      );
      const data = await res.json();

      if (data.error) {
        setYoutubeStatus("Comments error: " + data.error);
        return;
      }

      if (Array.isArray(data.comments)) {
        if (onComments) onComments(data.comments);
        setYoutubeStatus(`Comments loaded ✔ (${data.comments.length})`);
      } else {
        setYoutubeStatus("No comments found.");
      }
    } catch (err) {
      console.error(err);
      setYoutubeStatus("Comments error: failed to fetch.");
    }
  }

  // When user pastes an article URL and hits Enter
  async function handleArticleSubmit(e) {
    e.preventDefault();
    setArticleStatus("");

    if (!articleUrl.trim()) {
      setArticleStatus("Please paste an article URL.");
      return;
    }

    try {
      const res = await fetch(
        "/api/getArticle?url=" + encodeURIComponent(articleUrl.trim())
      );
      const data = await res.json();

      if (data.error) {
        setArticleStatus("Article error: " + data.error);
        return;
      }

      if (onArticle) onArticle(data);
      setArticleStatus("Article extracted ✔");
    } catch (err) {
      console.error(err);
      setArticleStatus("Article error: failed to fetch.");
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>2. YouTube & Article Inputs</h2>

      {/* YouTube URL */}
      <form onSubmit={handleYouTubeSubmit} style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          YouTube video URL
        </label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Paste YouTube URL here"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: 6,
            padding: "6px 12px",
            fontSize: 14,
            borderRadius: 4,
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          Enter
        </button>
        {youtubeStatus && (
          <p style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
            {youtubeStatus}
          </p>
        )}
      </form>

      {/* Article URL */}
      <form onSubmit={handleArticleSubmit}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          Article URL
        </label>
        <input
          type="url"
          value={articleUrl}
          onChange={(e) => setArticleUrl(e.target.value)}
          placeholder="Paste article / blog URL here"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: 6,
            padding: "6px 12px",
            fontSize: 14,
            borderRadius: 4,
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          Enter
        </button>
        {articleStatus && (
          <p style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
            {articleStatus}
          </p>
        )}
      </form>
    </div>
  );
}
