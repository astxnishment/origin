export function liveChatConfiguration() {
  const enabled = process.env.NEXT_PUBLIC_LIVE_CHAT_ENABLED !== "false";
  const property = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim() ?? "";
  const widget = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim() ?? "";
  const configured = /^[a-f0-9]{24}$/i.test(property) && /^[a-z0-9]{1,64}$/i.test(widget);
  return {
    enabled,
    scriptUrl: enabled && configured ? `https://embed.tawk.to/${property}/${widget}` : null,
  };
}

export function showLiveChatOnPath(pathname: string): boolean {
  return !/^\/(?:admin|account|login|signup|forgot-password|track|book|support)(?:\/|$)/.test(pathname);
}

export type ChatStatus = "online" | "away" | "offline";

export function isChatStatus(value: unknown): value is ChatStatus {
  return value === "online" || value === "away" || value === "offline";
}
