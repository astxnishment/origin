"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { ArrowRight, LoaderCircle, Mail, MessageCircle, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { CONTACT_ONLY_MODE } from "@/lib/business-config";
import { isChatStatus, showLiveChatOnPath, type ChatStatus } from "@/lib/liveChat";

export default function LiveChat({ configured }: { configured: boolean }) {
  const pathname = usePathname();
  if (!showLiveChatOnPath(pathname)) return null;
  // Navigation unmounts the provider's entire browsing context, including its
  // sockets and scripts; hiding its launcher would leave that runtime alive.
  return <ChatPanel key={pathname} configured={configured} />;
}

function ChatPanel({ configured }: { configured: boolean }) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<ChatStatus | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  function closeChat() {
    setOpen(false);
    setStarted(false);
    setReady(false);
    setStatus(null);
    setFailed(false);
  }

  useEffect(() => {
    if (!started) return;
    const timeout = window.setTimeout(() => {
      setFailed(true);
      setStarted(false);
    }, 20_000);

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      const data: unknown = event.data;
      if (!data || typeof data !== "object" || !("type" in data) || data.type !== "origin-chat" || !("event" in data)) return;
      if (data.event === "ready") {
        window.clearTimeout(timeout);
        setReady(true);
      }
      if ((data.event === "ready" || data.event === "status") && "status" in data && isChatStatus(data.status)) setStatus(data.status);
      if (data.event === "error") {
        window.clearTimeout(timeout);
        setFailed(true);
        setStarted(false);
      }
      if (data.event === "close") closeChat();
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
    };
  }, [started]);

  return (
    <Dialog.Root open={open} onOpenChange={(value) => value ? setOpen(true) : closeChat()}>
      <Dialog.Trigger asChild>
        <button type="button" className="live-chat-launcher fixed right-4 z-40 flex h-12 items-center gap-2 rounded-full border border-border bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Chat with us">
          <MessageCircle className="h-5 w-5" aria-hidden="true" /><span>Chat with us</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Content data-started={started} className="live-chat-panel fixed z-[71] flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl focus:outline-none">
          <div className="flex shrink-0 items-start gap-3 border-b border-border p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface"><MessageCircle className="h-5 w-5" aria-hidden="true" /></div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-base font-semibold">Talk to Origin Repairs</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs leading-relaxed text-muted-foreground">Questions about your device or a repair? We’re here to help.</Dialog.Description>
            </div>
            <Dialog.Close className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-surface" aria-label="Close chat"><X className="h-5 w-5" /></Dialog.Close>
          </div>

          {started ? <>
            <p role="status" className="shrink-0 border-b border-border px-5 py-3 text-xs text-muted-foreground">
              {!ready ? "Connecting to the team…" : status === "online" ? "The team is online." : status === "away" ? "The team is away. Leave a message for a reply." : status === "offline" ? "The team is offline. Leave a message for a reply." : "Chat is connected."}
            </p>
            <div className="relative min-h-0 flex-1 bg-white">
              {!ready && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-card text-muted-foreground"><LoaderCircle className="h-6 w-6 animate-spin" aria-label="Loading chat" /></div>}
              <iframe ref={frame} title="Origin Repairs live chat" src="/support/chat" referrerPolicy="no-referrer" className="h-full w-full border-0" onError={() => { setFailed(true); setStarted(false); }} />
            </div>
            <div className="shrink-0 border-t border-border px-5 py-3 text-xs text-muted-foreground">Need another way to reach us? <a href={BUSINESS.phoneHref} className="font-medium text-foreground underline underline-offset-4">Call the team</a>.</div>
          </> : <div className="overflow-y-auto p-5 sm:p-6">
            <p className="text-lg font-semibold leading-snug">Let’s get your device sorted.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {failed ? "We couldn’t connect to chat. Try again, or contact the team below." : !configured ? (CONTACT_ONLY_MODE ? "Live chat is unavailable right now. Please call or use our contact options." : "Live chat is unavailable right now. Please call, email or send us a message.") : "Chat with our team about repairs, prices or sending in a device. If nobody is available, leave a message and we’ll get back to you."}
            </p>
            {configured && <>
              <button type="button" onClick={() => { setFailed(false); setReady(false); setStatus(null); setStarted(true); }} className="btn-primary mt-5 flex min-h-12 w-full items-center justify-center gap-2">
                {failed ? "Try chat again" : "Start chat"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Starting chat connects to tawk.to, which uses cookies to run the conversation. Please don’t share passwords or payment details. <Link href="/privacy" onClick={closeChat} className="underline underline-offset-4">Privacy notice</Link>.</p>
            </>}
            <div className="mt-6 space-y-2 border-t border-border pt-5">
              <a href={BUSINESS.phoneHref} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm hover:bg-surface"><Phone className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{BUSINESS.phoneDisplay}</span></a>
              {!CONTACT_ONLY_MODE && <a href={`mailto:${BUSINESS.email}`} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm hover:bg-surface"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="break-all">{BUSINESS.email}</span></a>}
              <Link href="/contact" onClick={closeChat} className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-surface px-3 text-sm font-medium">{CONTACT_ONLY_MODE ? "Contact options" : "Send a message"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
