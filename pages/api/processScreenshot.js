// pages/api/processScreenshot.js

import fs from "fs";
import formidable from "formidable";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // we handle multipart/form-data ourselves
  },
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to parse multipart/form-data with formidable
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

// Try to recover title/channel/videoId from the long description text
function enrichFromDescription(result) {
  const desc = result.description || "";

  if (!result.title) {
    // Look for: video titled "..."
    const m = desc.match(/video titled\s+"([^"]+)"/i);
    if (m) {
      result.title = m[1].trim();
    }
  }

  if (!result.channel) {
    // Look for: uploaded by the XYZ channel
    const m = desc.match(/uploaded by the\s+([^,]+?) channel/i);
    if (m) {
      result.channel = m[1].trim();
    }
  }

  if (!result.videoId) {
    // Look for a watch?v=XXXXXXXX pattern in the text, just in case
    const m = desc.match(/watch\?v=([A-Za-z0-9_-]{6,})/);
    if (m) {
      result.videoId = m[1].trim();
    }
  }

  return result;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing OPENAI_API_KEY in .env.local" });
  }

  try {
    const { files } = await parseForm(req);

    const imageFile = files.image;
    if (!imageFile) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const file =
      Array.isArray(imageFile) && imageFile.length > 0
        ? imageFile[0]
        : imageFile;

    // Read the file and convert to base64
    const fileData = fs.readFileSync(file.filepath);
    const base64 = fileData.toString("base64");
    const mimeType = file.mimetype || "image/png";

    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Ask Vision to return structured JSON about the YouTube video page
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
You are analysing a screenshot, usually of a YouTube video page.

Return ONLY a JSON object with EXACTLY these keys:

{
  "title": string or null,
  "channel": string or null,
  "videoId": string or null,
  "description": string
}

Rules:
- If you can clearly read the YouTube video title, put it in "title". Otherwise use null.
- If you can clearly read the channel name, put it in "channel". Otherwise use null.
- If you see a URL like "watch?v=XXXX", put "XXXX" in "videoId". Otherwise use null.
- "description" should be a short plain-text description of what you see (UI elements, subtitles, slides, etc.).
- Do NOT include any extra keys or extra text outside the JSON.
              `.trim(),
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
    });

    const message = completion.choices[0].message;

    let jsonText = "";

    if (typeof message.content === "string") {
      jsonText = message.content;
    } else if (Array.isArray(message.content)) {
      jsonText = message.content.map((part) => part.text || "").join("\n");
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse Vision JSON:", e, jsonText);
      parsed = {};
    }

    let result = {
      title: parsed.title ?? null,
      channel: parsed.channel ?? null,
      videoId: parsed.videoId ?? null,
      description:
        typeof parsed.description === "string" && parsed.description.trim().length
          ? parsed.description
          : "Screenshot analysed, but no detailed description was provided.",
    };

    // Try to recover missing fields from the description text
    result = enrichFromDescription(result);

    console.log("Vision extracted from screenshot:", result);

    return res.status(200).json(result);
  } catch (error) {
    console.error("processScreenshot error:", error);

    // Fallback: don't break the app; still return something
    return res.status(200).json({
      title: null,
      channel: null,
      videoId: null,
      description:
        "Screenshot uploaded, but Vision analysis failed. Using placeholder description instead.",
    });
  }
}
