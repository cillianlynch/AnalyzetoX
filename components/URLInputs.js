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
  const lastProcessedUrlRef = useRef("");
  const isLoadingRef = useRef(false);

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

  async function handleSubmit(e, urlToProcess = null) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const urlToUse = urlToProcess || url;
    const trimmed = urlToUse.trim();
    if (!trimmed) {
      setStatus("Please paste a URL.");
      return;
    }

    // Prevent duplicate processing
    if (trimmed === lastProcessedUrlRef.current && isLoading) {
      return;
    }

    lastProcessedUrlRef.current = trimmed;
    setStatus("");

    const videoId = extractVideoId(trimmed);

    // Try YouTube first if it's a YouTube URL
    if (videoId) {
      isLoadingRef.current = true;
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
          isLoadingRef.current = false;
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
        isLoadingRef.current = false;
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setStatus("Error: failed to fetch.");
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    } else {
      // Try as article URL
      isLoadingRef.current = true;
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
          isLoadingRef.current = false;
          setIsLoading(false);
          return;
        }

        if (onArticle) onArticle(data);
        const statusMsg = "Article extracted ✔";
        setStatus(statusMsg);
        if (onCommentsStatusChange) {
          onCommentsStatusChange(statusMsg);
        }
        isLoadingRef.current = false;
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setStatus("Error: failed to fetch.");
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    }
  }

  // Auto-analyze when a valid URL is pasted (with short debounce)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const trimmed = url.trim();
    if (!trimmed) return;

    // Don't auto-trigger if we just processed this URL
    if (trimmed === lastProcessedUrlRef.current) return;

    const videoId = extractVideoId(trimmed);
    
    // For YouTube URLs, trigger immediately (shorter delay)
    if (videoId) {
      // Very short delay for YouTube URLs to catch paste events
      timeoutRef.current = setTimeout(() => {
        // Check current state at execution time
        const currentUrl = url.trim();
        if (currentUrl === trimmed && currentUrl !== lastProcessedUrlRef.current && !isLoadingRef.current) {
          handleSubmit(null);
        }
      }, 500);
    } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      // For article URLs, slightly longer delay
      timeoutRef.current = setTimeout(() => {
        const currentUrl = url.trim();
        if (currentUrl === trimmed && currentUrl !== lastProcessedUrlRef.current && !isLoadingRef.current) {
          handleSubmit(null);
        }
      }, 700);
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
      <input
        type="url"
        value={url}
        onChange={(e) => {
          const newUrl = e.target.value;
          setUrl(newUrl);
          // Clear status when user starts typing a new URL
          if (newUrl.trim() !== lastProcessedUrlRef.current) {
            setStatus("");
            if (onCommentsStatusChange) {
              onCommentsStatusChange("");
            }
          }
        }}
        onPaste={async (e) => {
          // Get pasted text from clipboard
          const pastedText = (e.clipboardData || window.clipboardData).getData('text');
          const trimmed = pastedText.trim();
          
          if (trimmed) {
            const videoId = extractVideoId(trimmed);
            
            // If it's a YouTube URL, trigger analysis immediately
            if (videoId && trimmed !== lastProcessedUrlRef.current) {
              // Wait a moment for onChange to update state, then trigger with the pasted URL
              setTimeout(() => {
                handleSubmit(null, trimmed);
              }, 100);
            }
          }
        }}
        onKeyDown={(e) => {
          // Allow Enter key to trigger submission if needed
          if (e.key === "Enter") {
            handleSubmit(e);
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
  );
}
