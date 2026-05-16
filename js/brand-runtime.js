import { getSiteSettings } from "../firebase/firestore-service.js";

export async function applyBrandRuntime() {
  try {
    const settings = await getSiteSettings();
    if (settings.logoUrl) {
      document.querySelectorAll(".brand-mark").forEach((image) => {
        image.src = settings.logoUrl;
      });
      document.querySelectorAll("meta[property='og:image']").forEach((meta) => {
        meta.content = settings.logoUrl;
      });
    }
    if (settings.faviconUrl) {
      const favicon = document.querySelector("link[rel='icon']");
      if (favicon) favicon.href = settings.faviconUrl;
    }
  } catch {
    // Branding is optional; the static logo remains the fallback.
  }
}

