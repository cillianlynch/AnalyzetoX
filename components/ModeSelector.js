export default function ModeSelector({ mode, setMode }) {
  return (
    <div>
      <h3>Choose Output Mode</h3>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
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
