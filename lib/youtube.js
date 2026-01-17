// lib/youtube.js

/**
 * Extract a YouTube videoId from common URL formats.
 * Supports:
 * - https://youtu.be/VIDEOID
 * - https://www.youtube.com/watch?v=VIDEOID
 * - https://m.youtube.com/watch?v=VIDEOID
 * - https://music.youtube.com/watch?v=VIDEOID
 * - https://www.youtube.com/shorts/VIDEOID
 * - youtube.com/embed/VIDEOID
 * - Raw videoId input
 */
export function extractYouTubeVideoId(input) {
  if (!input) return null;
  const raw = String(input).trim();
  if (!raw) return null;

  // If user pasted a raw id (11 chars is most common), accept it.
  // Keep it permissive (YouTube ids can include _ and -).
  if (/^[A-Za-z0-9_-]{6,}$/.test(raw) && !raw.includes("http")) {
    return raw;
  }

  try {
    const u = new URL(raw);
    const host = (u.hostname || "").toLowerCase();

    // youtu.be/VIDEOID
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\/+/, "").split("/")[0];
      return id || null;
    }

    // Any youtube.com subdomain
    if (host.endsWith("youtube.com")) {
      // /watch?v=VIDEOID
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/").filter(Boolean);

      // /shorts/VIDEOID
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex !== -1 && parts[shortsIndex + 1]) {
        return parts[shortsIndex + 1];
      }

      // /embed/VIDEOID
      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1];
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}



