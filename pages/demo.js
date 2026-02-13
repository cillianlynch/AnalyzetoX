import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Demo() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/watch?v=d0yGdNEWdn0"
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [generatedThread, setGeneratedThread] = useState("");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setAnalyzing(true);
    setError("");
    
    try {
      // Extract video ID from URL
      const videoId = extractVideoId(videoUrl);
      
      if (!videoId) {
        setError("Invalid YouTube URL. Please enter a valid YouTube video URL.");
        setAnalyzing(false);
        return;
      }

      // Fetch comments
      const commentsRes = await fetch(`/api/getComments?videoId=${encodeURIComponent(videoId)}`);
      const commentsData = await commentsRes.json();
      
      if (commentsData.error) {
        setError("Error loading comments: " + commentsData.error);
        setAnalyzing(false);
        return;
      }

      // Process content with AI to generate thread
      const processRes = await fetch("/api/processContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenshots: [],
          transcript: null,
          comments: commentsData.comments || [],
          article: null,
          rawText: "",
          mode: "thread", // Always generate thread format for demo
        }),
      });

      const processData = await processRes.json();
      
      if (processData.output) {
        setGeneratedThread(processData.output);
        setShowResults(true);
      } else {
        setError("Failed to generate thread. Please try again.");
      }
      
    } catch (err) {
      console.error("Error in demo:", err);
      setError("An error occurred. Please try again.");
    }
    
    setAnalyzing(false);
  }

  function extractVideoId(url) {
    if (!url) return null;
    url = url.trim();
    
    // Regular YouTube URLs: youtube.com/watch?v=VIDEO_ID
    const regExpWatch = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
    const matchWatch = url.match(regExpWatch);
    if (matchWatch) return matchWatch[1];
    
    // Short YouTube URLs: youtu.be/VIDEO_ID
    const regExpShort = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matchShort = url.match(regExpShort);
    if (matchShort) return matchShort[1];
    
    // YouTube embed URLs: youtube.com/embed/VIDEO_ID
    const regExpEmbed = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const matchEmbed = url.match(regExpEmbed);
    if (matchEmbed) return matchEmbed[1];
    
    return null;
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generatedThread);
  }

  return (
    <>
      <Head>
        <title>AnalyzetoX - Demo</title>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link
          href="https://fonts.cdnfonts.com/css/academy-engraved-let"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/big-caslon" rel="stylesheet" />
      </Head>

      <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
        {/* Retro Grid Background */}
        <div className="grid-background">
          <div className="perspective-grid"></div>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem" }}>
          {/* Header with back button */}
          <div style={{ marginBottom: "3rem" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "#fff",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#d1d5db"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
            >
              <svg style={{ width: "24px", height: "24px", marginRight: "0.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Home
            </button>
          </div>

          {/* Demo Title */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 className="caslon-font" style={{ fontSize: "3.75rem", marginBottom: "1rem" }}>Try the Demo</h1>
            <p className="academy-font" style={{ fontSize: "1.5rem", color: "#d1d5db" }}>See AnalyzetoX in action</p>
          </div>

          {/* Demo Content */}
          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
            {/* Input Section */}
            <div style={{ position: "relative", marginBottom: "2rem" }}>
              <div style={{
                position: "absolute",
                top: "0.5rem",
                left: "0.5rem",
                backgroundColor: "#fff",
                borderRadius: "1rem",
                width: "100%",
                height: "100%"
              }}></div>
              <div style={{
                position: "relative",
                backgroundColor: "#000",
                border: "4px solid #fff",
                borderRadius: "1rem",
                padding: "2rem"
              }}>
                <h2 className="caslon-font" style={{ fontSize: "1.875rem", marginBottom: "1.5rem" }}>Enter YouTube URL</h2>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#111827",
                    color: "#fff",
                    border: "2px solid #374151",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#fff"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#374151"}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="caslon-font"
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                    backgroundColor: "#fff",
                    color: "#000",
                    fontSize: "1.5rem",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: analyzing ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s",
                    opacity: analyzing ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => !analyzing && (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                  onMouseLeave={(e) => !analyzing && (e.currentTarget.style.backgroundColor = "#fff")}
                >
                  {analyzing ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="loading" style={{ marginRight: "0.5rem" }}>⟳</span> Analyzing...
                    </span>
                  ) : (
                    "Analyze Video"
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {showResults && (
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  width: "100%",
                  height: "100%"
                }}></div>
                <div style={{
                  position: "relative",
                  backgroundColor: "#000",
                  border: "4px solid #fff",
                  borderRadius: "1rem",
                  padding: "2rem"
                }}>
                  <h2 className="caslon-font" style={{ fontSize: "1.875rem", marginBottom: "1.5rem" }}>Generated Thread</h2>
                  
                  <div style={{
                    backgroundColor: "#16181c",
                    border: "1px solid #2f3336",
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "12px",
                    whiteSpace: "pre-line",
                    color: "#fff",
                    fontSize: "1.125rem",
                    lineHeight: "1.6"
                  }}>
                    {generatedThread}
                  </div>

                  <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #374151" }}>
                    <button
                      onClick={copyToClipboard}
                      className="caslon-font"
                      style={{
                        width: "100%",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        fontSize: "1.25rem",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                    >
                      Copy Thread to Clipboard
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Section */}
            {error && (
              <div style={{
                padding: "1rem",
                backgroundColor: "#7f1d1d",
                color: "#fecaca",
                borderRadius: "0.5rem",
                marginTop: "1rem"
              }}>
                {error}
              </div>
            )}
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
          background-image: 
            linear-gradient(0deg, transparent 49%, rgba(255, 255, 255, 0.4) 49%, rgba(255, 255, 255, 0.4) 51%, transparent 51%),
            linear-gradient(90deg, transparent 49%, rgba(255, 255, 255, 0.4) 49%, rgba(255, 255, 255, 0.4) 51%, transparent 51%);
          background-size: 100px 100px;
          background-position: 0 0;
          animation: gridMove 15s linear infinite;
          mask-image: linear-gradient(to bottom, 
            rgba(0, 0, 0, 0) 0%, 
            rgba(0, 0, 0, 0.5) 20%, 
            rgba(0, 0, 0, 1) 40%, 
            rgba(0, 0, 0, 1) 100%);
          -webkit-mask-image: linear-gradient(to bottom, 
            rgba(0, 0, 0, 0) 0%, 
            rgba(0, 0, 0, 0.5) 20%, 
            rgba(0, 0, 0, 1) 40%, 
            rgba(0, 0, 0, 1) 100%);
        }

        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100px;
          }
        }

        .loading {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .thread-tweet {
          background: #16181c;
          border: 1px solid #2f3336;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .tweet-number {
          display: inline-block;
          background: #1d9bf0;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          font-size: 12px;
          font-weight: bold;
          margin-right: 8px;
        }
      `}</style>
    </>
  );
}
