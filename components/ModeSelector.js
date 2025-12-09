export default function ModeSelector({ mode, setMode }) {
  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <h3 style={{ marginBottom: "12px" }}>Choose Output Mode</h3>
      <select 
        value={mode} 
        onChange={(e) => setMode(e.target.value)}
        style={{
          padding: "8px 16px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "2px solid #333",
        }}
      >
        <option value="summary">Summary</option>
        <option value="long_summary">Long Summary</option>
        <option value="thread">Twitter Thread</option>
        <option value="tweet">Single Tweet</option>
        <option value="timeline">Timeline</option>
        <option value="claims">Claims + Evidence</option>
      </select>
    </div>
  );
}
