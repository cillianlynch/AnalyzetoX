import { getSubtitles } from "youtube-captions-scraper";

export default async function handler(req, res) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

  try {
    const captions = await getSubtitles({
      videoID: videoId,
      lang: "en",
    });

    return res.status(200).json({ transcript: captions });
  } catch (error) {
    console.error("getTranscript error:", error);
    return res.status(500).json({
      error: "Failed to fetch transcript",
      details: error.message,
    });
  }
}
