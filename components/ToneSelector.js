export default function ToneSelector({ tone, setTone }) {
  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h3 style={{ marginBottom: "12px" }}>Choose Your Style</h3>
      <div style={{
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        flexWrap: "wrap",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        {/* Personal Tone */}
        <button
          onClick={() => setTone("personal")}
          style={{
            flex: "1",
            minWidth: "180px",
            padding: "16px",
            borderRadius: "8px",
            border: tone === "personal" ? "3px solid #333" : "2px solid #ddd",
            background: tone === "personal" ? "#f0f0f0" : "#fff",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            if (tone !== "personal") {
              e.currentTarget.style.borderColor = "#999";
            }
          }}
          onMouseLeave={(e) => {
            if (tone !== "personal") {
              e.currentTarget.style.borderColor = "#ddd";
            }
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
            🗣️ Personal
          </div>
          <div style={{ fontSize: "13px", color: "#666" }}>
            Warm, conversational, relatable
          </div>
        </button>

        {/* Balanced Tone */}
        <button
          onClick={() => setTone("balanced")}
          style={{
            flex: "1",
            minWidth: "180px",
            padding: "16px",
            borderRadius: "8px",
            border: tone === "balanced" ? "3px solid #333" : "2px solid #ddd",
            background: tone === "balanced" ? "#f0f0f0" : "#fff",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            if (tone !== "balanced") {
              e.currentTarget.style.borderColor = "#999";
            }
          }}
          onMouseLeave={(e) => {
            if (tone !== "balanced") {
              e.currentTarget.style.borderColor = "#ddd";
            }
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
            ⚖️ Balanced
          </div>
          <div style={{ fontSize: "13px", color: "#666" }}>
            Professional but accessible
          </div>
        </button>

        {/* Analytical Tone */}
        <button
          onClick={() => setTone("analytical")}
          style={{
            flex: "1",
            minWidth: "180px",
            padding: "16px",
            borderRadius: "8px",
            border: tone === "analytical" ? "3px solid #333" : "2px solid #ddd",
            background: tone === "analytical" ? "#f0f0f0" : "#fff",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            if (tone !== "analytical") {
              e.currentTarget.style.borderColor = "#999";
            }
          }}
          onMouseLeave={(e) => {
            if (tone !== "analytical") {
              e.currentTarget.style.borderColor = "#ddd";
            }
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
            📊 Analytical
          </div>
          <div style={{ fontSize: "13px", color: "#666" }}>
            Objective, precise, methodical
          </div>
        </button>
      </div>
      
      {/* Helper text */}
      <p style={{ 
        marginTop: "12px", 
        fontSize: "13px", 
        color: "#666",
        fontStyle: "italic"
      }}>
        {getToneDescription(tone)}
      </p>
    </div>
  );
}

function getToneDescription(tone) {
  const descriptions = {
    "personal": "Best for: Twitter threads, newsletters, personal brands",
    "balanced": "Best for: LinkedIn, blogs, professional content",
    "analytical": "Best for: Reports, research, technical documentation",
  };
  
  return descriptions[tone] || "Select a style to see description";
}
