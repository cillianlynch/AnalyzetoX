// pages/api/getComments.js

import { resolveVideoId } from "../../lib/youtubeResolve";

export default async function handler(req, res) {
  const { videoId, url: videoUrl, title, handle } = req.query;

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server is missing YOUTUBE_API_KEY env variable" });
  }

  let resolvedVideoId = null;
  try {
    resolvedVideoId = await resolveVideoId({
      videoId,
      url: videoUrl,
      title,
      handle,
      apiKey,
    });
  } catch (e) {
    console.error("getComments resolveVideoId error:", e);
    return res.status(500).json({ error: "Failed to resolve YouTube video" });
  }

  if (!resolvedVideoId) {
    return res.status(400).json({
      error:
        "Missing videoId (or provide a YouTube url, or a title + channel handle)",
    });
  }

  const commentsUrl = new URL(
    "https://www.googleapis.com/youtube/v3/commentThreads"
  );
  commentsUrl.searchParams.set("key", apiKey);
  commentsUrl.searchParams.set("part", "snippet");
  commentsUrl.searchParams.set("videoId", resolvedVideoId);
  commentsUrl.searchParams.set("maxResults", "50"); // up to 50 top comments
  commentsUrl.searchParams.set("order", "relevance"); // or "time"
  commentsUrl.searchParams.set("textFormat", "plainText");

  try {
    const response = await fetch(commentsUrl.toString());

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

    return res.status(200).json({ videoId: resolvedVideoId, comments });
  } catch (err) {
    console.error("getComments error:", err);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
}
