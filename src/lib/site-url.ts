const DEFAULT_SITE_URL = "https://fireside-chat-preview.onrender.com";

export function normalizeSiteUrl(value: string | undefined | null) {
  const candidate = value?.trim();
  if (!candidate) return DEFAULT_SITE_URL;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SITE_URL;
    }
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function siteUrl() {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.RENDER_EXTERNAL_URL,
  );
}
