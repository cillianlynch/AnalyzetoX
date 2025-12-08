import { useState } from "react";

export default function FileUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setStatus("Analyzing screenshot...");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/processScreenshot", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setStatus("Screenshot analyzed ✔");

      if (onUpload) onUpload(data);
    } catch (err) {
      console.error(err);
      setStatus("Screenshot analysis failed.");
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
        }}
      >
        Screenshot image
      </label>

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "220px",
          height: "140px",
          borderRadius: 12,
          border: "1px dashed #aaa",
          background: "#fafafa",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Screenshot preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: 10,
              objectFit: "cover",
            }}
          />
        ) : (
          <span>Click to upload screenshot</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      {status && (
        <p style={{ marginTop: 6, fontSize: 12, color: "#555" }}>{status}</p>
      )}
    </div>
  );
}
