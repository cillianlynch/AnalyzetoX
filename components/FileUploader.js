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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "400px",
          borderRadius: 8,
          border: "2px solid #333",
          background: "#fff",
          cursor: "pointer",
          fontSize: 16,
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
      >
        {preview ? (
          <img
            src={preview}
            alt="Screenshot preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: 6,
              objectFit: "cover",
            }}
          />
        ) : (
          <>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginBottom: "12px" }}
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span style={{ fontSize: 16, fontWeight: 500 }}>Screenshot</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      {status && (
        <p style={{ marginTop: 6, fontSize: 12, color: "#555", textAlign: "center", width: "100%" }}>{status}</p>
      )}
    </div>
  );
}
