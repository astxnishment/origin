import { liveChatConfiguration } from "@/lib/liveChat";

// A separate document gives the third-party widget a short, explicit lifetime.
// It receives no account identity, repair reference, page URL or form draft.
export function GET() {
  const { scriptUrl } = liveChatConfiguration();
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = [
    "default-src 'none'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' https://*.tawk.to https://cdn.jsdelivr.net`,
    "style-src 'unsafe-inline' https://*.tawk.to https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "img-src data: blob: https://*.tawk.to https://cdn.jsdelivr.net https://tawk.link https://s3.amazonaws.com",
    "font-src data: https://*.tawk.to https://fonts.gstatic.com",
    "connect-src https://*.tawk.to wss://*.tawk.to",
    "frame-src https://*.tawk.to",
    "media-src blob: https://*.tawk.to",
    "worker-src blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action https://*.tawk.to",
    "frame-ancestors 'self'",
  ].join("; ");
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "private, no-store",
    "Content-Security-Policy": policy,
    "X-Frame-Options": "SAMEORIGIN",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
  if (!scriptUrl) return new Response("<!doctype html><html lang=\"en\"><title>Chat unavailable</title><body><p>Live chat is unavailable right now.</p></body></html>", { status: 503, headers });
  const script = `
    const notify = (event, status) => window.parent.postMessage({type: 'origin-chat', event, status}, window.location.origin);
    window.Tawk_API = {
      embedded: 'origin-tawk-container',
      customStyle: {zIndex: 10},
      onLoad: function () {
        document.getElementById('loading').hidden = true;
        window.Tawk_API.maximize();
        notify('ready', window.Tawk_API.getStatus());
      },
      onStatusChange: function (status) { notify('status', status); },
      onChatMinimized: function () { notify('close'); }
    };
    window.Tawk_LoadStart = new Date();
    const widget = document.createElement('script');
    widget.async = true;
    widget.src = ${JSON.stringify(scriptUrl)};
    widget.charset = 'UTF-8';
    widget.setAttribute('crossorigin', '*');
    widget.onerror = function () { notify('error'); };
    document.head.appendChild(widget);
  `;
  return new Response(`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Origin Repairs live chat</title><style>html,body{margin:0;width:100%;height:100%;background:#fff;font:14px system-ui;color:#333}#loading{position:absolute;padding:24px}#origin-tawk-container{width:100%;height:100%}</style></head><body><p id="loading" role="status">Connecting to Origin Repairs…</p><div id="origin-tawk-container"></div><script nonce="${nonce}">${script}</script></body></html>`, { headers });
}
