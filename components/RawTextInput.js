export default function RawTextInput({ text, setText }) {
  return (
    <div style={{ marginTop: 20 }}>
      <p style={{ marginBottom: 8, fontSize: 14, color: "#555" }}>
        (Optional) Add text to be considered with analysis
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder=""
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 4,
          border: "2px solid #333",
          fontSize: 16,
          fontFamily: "inherit",
          resize: "vertical",
        }}
      />
    </div>
  );
}
