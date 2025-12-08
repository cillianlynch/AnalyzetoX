import { extract } from "@extractus/article-extractor";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const article = await extract(url);

    if (!article) {
      return res.status(500).json({ error: "Could not extract article" });
    }

    // Normalise the shape a bit
    const result = {
      url,
      title: article.title || "Untitled",
      content:
        article.content ||
        article.description ||
        article.excerpt ||
        "No main content found.",
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("getArticle error:", error);
    return res.status(500).json({
      error: "Failed to fetch article",
      details: error.message,
    });
  }
}
