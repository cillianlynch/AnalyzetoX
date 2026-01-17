// lib/youtubeResolve.js
import { extractYouTubeVideoId } from "./youtube";

function normalizeHandle(handle) {
  if (!handle) return null;
  const h = String(handle).trim();
  if (!h) return null;
  return h.startsWith("@") ? h : `@${h}`;
}

async function fetchYouTubeJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch (e) {
    // ignore, handled below
  }
  return { ok: res.ok, status: res.status, statusText: res.statusText, text, data };
}

export async function resolveVideoId({ videoId, url, title, handle, apiKey }) {
  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY");
  }

  // 1) Direct videoId
  if (videoId) return String(videoId).trim();

  // 2) From URL
  const fromUrl = extractYouTubeVideoId(url);
  if (fromUrl) return fromUrl;

  const t = title ? String(title).trim() : "";
  const h = normalizeHandle(handle);

  if (!t) return null;

  // 3) If we have a handle, resolve to channelId first, then search within channel
  let channelId = null;
  if (h) {
    const channelsUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelsUrl.searchParams.set("key", apiKey);
    channelsUrl.searchParams.set("part", "id");
    channelsUrl.searchParams.set("forHandle", h);

    const resp = await fetchYouTubeJson(channelsUrl.toString());
    if (resp.ok && resp.data && Array.isArray(resp.data.items) && resp.data.items[0]?.id) {
      channelId = resp.data.items[0].id;
    }
  }

  // 4) Search videos
  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("key", apiKey);
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("maxResults", "5");
  searchUrl.searchParams.set("q", t);
  // Prefer relevance; limiting by channelId massively improves precision
  if (channelId) searchUrl.searchParams.set("channelId", channelId);

  const searchResp = await fetchYouTubeJson(searchUrl.toString());
  if (!searchResp.ok) {
    throw new Error("Failed to search YouTube for video");
  }

  const items = (searchResp.data && searchResp.data.items) || [];
  const first = items.find((it) => it?.id?.videoId)?.id?.videoId;
  return first || null;
}



