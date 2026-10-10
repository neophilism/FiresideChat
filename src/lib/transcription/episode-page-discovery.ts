import { fetchPublisherTranscript, parsePublisherTranscript } from "@/lib/feeds/publisher-transcript";
import type { ParsedPublisherTranscript } from "@/lib/feeds/publisher-transcript";

const MAX_PAGE_BYTES = 1_500_000;
const TIMEOUT_MS = 15_000;

function safePublicUrl(value: string, base?: string): string | null {
  try {
    const url = new URL(value, base);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase();
    if (
      !host || host === "localhost" || host.endsWith(".localhost") ||
      host.endsWith(".internal") || host.endsWith(".local") ||
      host === "metadata.google.internal" ||
      host === "0.0.0.0" || host === "169.254.169.254" ||
      host === "::1" || host === "[::1]" ||
      /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host)
    ) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchEpisodePage(pageUrl: string) {
  let url = safePublicUrl(pageUrl);
  if (!url) throw new Error("Episode URL is not an allowed public URL");
  for (let attempt = 0; attempt <= 3; attempt++) {
    const response = await fetch(url, {
      redirect: "manual",
      headers: {
        Accept: "text/html",
        "User-Agent": process.env.FEED_USER_AGENT ?? "FiresideChat/1.0",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Episode website redirect had no location");
      const next = safePublicUrl(location, url);
      if (!next) throw new Error("Episode website redirected to an unsafe URL");
      url = next;
      continue;
    }
    if (!response.ok) throw new Error("Episode website returned HTTP " + response.status);
    const type = response.headers.get("content-type") ?? "";
    if (type && !/html/i.test(type)) throw new Error("Episode website was not HTML");
    if (Number(response.headers.get("content-length") ?? "0") > MAX_PAGE_BYTES) {
      throw new Error("Episode website exceeded page size limit");
    }
    if (!response.body) return { html: "", finalUrl: url };
    const reader = response.body.getReader();
    const parts: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_PAGE_BYTES) {
        await reader.cancel();
        throw new Error("Episode website exceeded page size limit");
      }
      parts.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) {
      bytes.set(part, offset);
      offset += part.byteLength;
    }
    return { html: new TextDecoder().decode(bytes), finalUrl: url };
  }
  throw new Error("Episode website exceeded redirect limit");
}

export type DiscoveredTranscript = {
  transcript: ParsedPublisherTranscript;
  url: string;
  mimeType: string | null;
  kind: "linked" | "embedded";
};

export function findTranscriptLinks(html: string, baseUrl: string): string[] {
  const urls: string[] = [];
  const anchors = /<a\b([^>]+)>([\s\S]*?)<\/a\s*>/gi;
  let match: RegExpExecArray | null;
  while ((match = anchors.exec(html)) !== null && urls.length < 12) {
    const attrs = match[1];
    const href = attrs.match(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/i)?.slice(1).find(Boolean);
    if (!href) continue;
    const label = decodeHtml(match[2]) + " " +
      (attrs.match(/\baria-label\s*=\s*(?:"([^"]+)"|'([^']+)')/i)?.slice(1).find(Boolean) ?? "");
    // A transcript-specific anchor is stronger evidence than URL text alone.
    if (!/\b(transcript|read transcript|captions|subtitles)\b/i.test(label)) continue;
    const url = safePublicUrl(href.replace(/&amp;/g, "&"), baseUrl);
    if (!url || url === baseUrl || urls.includes(url)) continue;
    urls.push(url);
  }
  const links = /<link\b([^>]+)>/gi;
  while ((match = links.exec(html)) !== null && urls.length < 12) {
    const attrs = match[1];
    if (!/\b(?:transcript|caption|subtitle)\b/i.test(attrs)) continue;
    const href = attrs.match(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/i)?.slice(1).find(Boolean);
    if (!href) continue;
    const url = safePublicUrl(href.replace(/&amp;/g, "&"), baseUrl);
    if (url && !urls.includes(url)) urls.push(url);
  }
  return urls;
}

function embeddedTranscript(html: string): ParsedPublisherTranscript | null {
  const candidate = html.match(/<(section|article|div)\b[^>]*(?:id|class)\s*=\s*["'][^"']*\btranscript\b[^"']*["'][^>]*>([\s\S]{300,100000}?)<\/\1>/i);
  if (!candidate) return null;
  const transcript = parsePublisherTranscript(candidate[2], "text/html");
  if (transcript.fullText.split(/\s+/).length < 80) return null;
  return transcript;
}

export async function discoverEpisodePageTranscript(pageUrl: string): Promise<DiscoveredTranscript | null> {
  const { html, finalUrl } = await fetchEpisodePage(pageUrl);
  for (const link of findTranscriptLinks(html, finalUrl)) {
    try {
      const ext = new URL(link).pathname.toLowerCase();
      const mimeType = ext.endsWith(".vtt") ? "text/vtt"
        : ext.endsWith(".srt") ? "application/x-subrip"
        : ext.endsWith(".json") ? "application/json" : null;
      const transcript = await fetchPublisherTranscript({ url: link, mimeType });
      if (transcript.fullText.split(/\s+/).length >= 50) {
        return { transcript, url: link, mimeType, kind: "linked" };
      }
    } catch {
      // Other transcript links on this episode page may still work.
    }
  }
  const transcript = embeddedTranscript(html);
  return transcript ? { transcript, url: finalUrl, mimeType: "text/html", kind: "embedded" } : null;
}
