export default function RawTextInput({ text, setText }) {
  return (
    <div>
      <p>RawTextInput test component</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />
    </div>
  );
}
