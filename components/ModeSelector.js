export default function ModeSelector({ mode, setMode }) {
  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <h3 style={{ marginBottom: "12px" }}>Choose Output Format</h3>
      <select 
        value={mode} 
        onChange={(e) => setMode(e.target.value)}
        style={{
          padding: "8px 16px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "2px solid #333",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <optgroup label="Tweets & Threads">
          <option value="tweet_single">Tweet (Single, ~280 chars)</option>
          <option value="thread_short">Thread - Short (5 tweets)</option>
          <option value="thread_medium">Thread - Medium (10 tweets)</option>
          <option value="thread_long">Thread - Long (15 tweets)</option>
          <option value="thread_mega">Mega Thread (20-25 tweets)</option>
        </optgroup>
        
        <optgroup label="Summaries">
          <option value="summary_bullets">Summary - Bullets (200-300 words)</option>
          <option value="summary_prose">Summary - Prose (300-500 words)</option>
          <option value="deep_dive">Long Summary / Deep Dive (800-1200 words)</option>
        </optgroup>
        
        <optgroup label="Specialized Formats">
          <option value="timeline">Timeline (300-600 words)</option>
          <option value="claims_evidence">Claims + Evidence (500-700 words)</option>
        </optgroup>
      </select>
      
      {/* Helper text showing what the selected mode does */}
      <p style={{ 
        marginTop: "8px", 
        fontSize: "13px", 
        color: "#666",
        fontStyle: "italic"
      }}>
        {getModeDescription(mode)}
      </p>
    </div>
  );
}

function getModeDescription(mode) {
  const descriptions = {
    // Tweets & Threads
    "tweet_single": "One punchy tweet with hook + key insight",
    "thread_short": "Quick digestible thread with 5 tweets",
    "thread_medium": "Standard Twitter thread with 10 tweets",
    "thread_long": "Deep-dive thread with 15 tweets",
    "thread_mega": "Ultimate breakdown with 20-25 tweets",
    
    // Summaries
    "summary_bullets": "5-7 scannable bullet points, quick reference",
    "summary_prose": "3-5 flowing paragraphs, natural narrative",
    "deep_dive": "Comprehensive article with 5-7 sections and headers",
    
    // Specialized
    "timeline": "Chronological breakdown with dates/events",
    "claims_evidence": "4-6 claims with supporting evidence points",
  };
  
  return descriptions[mode] || "Select a format to see description";
}
