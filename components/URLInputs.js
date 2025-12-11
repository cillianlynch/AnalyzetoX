import { useState, useEffect, useRef } from "react";

export default function URLInputs({
  onTranscript,
  onComments,
  onArticle,
  commentsStatus,
  onCommentsStatusChange,
}) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

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

    const trimmed = url.trim();
    const videoId = extractVideoId(trimmed);

    // Try YouTube first if it's a YouTube URL
    if (videoId) {
      setIsLoading(true);
      const workingMsg = "Analyzing video and loading comments...";
      setStatus(workingMsg);
      if (onCommentsStatusChange) {
        onCommentsStatusChange(workingMsg);
      }

      try {
        const res = await fetch(
          `/api/getComments?videoId=${encodeURIComponent(videoId)}`
        );
        const data = await res.json();

        if (data.error) {
          setStatus("Error: " + data.error);
          setIsLoading(false);
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
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setStatus("Error: failed to fetch.");
        setIsLoading(false);
      }
    } else {
      // Try as article URL
      setIsLoading(true);
      const workingMsg = "Extracting article...";
      setStatus(workingMsg);
      if (onCommentsStatusChange) {
        onCommentsStatusChange(workingMsg);
      }

      try {
        const res = await fetch("/api/getArticle?url=" + encodeURIComponent(trimmed));
        const data = await res.json();

        if (data.error) {
          setStatus("Error: " + data.error);
          setIsLoading(false);
          return;
        }

        if (onArticle) onArticle(data);
        const statusMsg = "Article extracted ✔";
        setStatus(statusMsg);
        if (onCommentsStatusChange) {
          onCommentsStatusChange(statusMsg);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setStatus("Error: failed to fetch.");
        setIsLoading(false);
      }
    }
  }

  // Auto-analyze when a valid URL is pasted (with debounce)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const trimmed = url.trim();
    if (!trimmed || isLoading) return;

    const videoId = extractVideoId(trimmed);
    const isValidUrl = videoId || (trimmed.startsWith("http://") || trimmed.startsWith("https://"));

    if (isValidUrl) {
      // Wait 1.5 seconds after user stops typing
      timeoutRef.current = setTimeout(() => {
        if (!isLoading) {
          handleSubmit({ preventDefault: () => {} });
        }
      }, 1500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const displayStatus = commentsStatus || status;

  return (
    <div style={{ marginTop: 20 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
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
              onBlur={(e) => {
                // Auto-analyze on blur if URL is valid
                const trimmed = e.target.value.trim();
                if (trimmed && !isLoading) {
                  const videoId = extractVideoId(trimmed);
                  const isValidUrl = videoId || (trimmed.startsWith("http://") || trimmed.startsWith("https://"));
                  if (isValidUrl) {
                    handleSubmit({ preventDefault: () => {} });
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
              aria-label="URL of article or video"
            />
            {displayStatus && (
              <p style={{ marginTop: 8, marginBottom: 0, fontSize: 14, color: "#555" }}>
                {displayStatus}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "12px 20px",
              borderRadius: 4,
              border: "2px solid #333",
              background: isLoading ? "#f5f5f5" : "#222",
              color: isLoading ? "#777" : "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer",
              minWidth: 110,
              whiteSpace: "nowrap",
            }}
          >
            {isLoading ? "Working..." : "Analyze"}
          </button>
        </div>
      </form>
    </div>
  );
}
