// pages/api/getComments.js

export default async function handler(req, res) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server is missing YOUTUBE_API_KEY env variable" });
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("videoId", videoId);
  url.searchParams.set("maxResults", "50"); // up to 50 top comments
  url.searchParams.set("order", "relevance"); // or "time"
  url.searchParams.set("textFormat", "plainText");

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "YouTube API error",
        response.status,
        response.statusText,
        errorText
      );
      return res
        .status(500)
        .json({ error: "Failed to fetch comments from YouTube" });
    }

    const data = await response.json();

    const comments = (data.items || []).map((item) => {
      const s = item.snippet.topLevelComment.snippet;
      return {
        author: s.authorDisplayName,
        text: s.textDisplay || s.textOriginal,
        likeCount: s.likeCount,
        publishedAt: s.publishedAt,
      };
    });

    return res.status(200).json({ comments });
  } catch (err) {
    console.error("getComments error:", err);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
}
