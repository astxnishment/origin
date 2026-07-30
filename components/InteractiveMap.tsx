"use client";

import { useMemo, useState } from "react";
import { ExternalLink, MapPin, Navigation, ParkingCircle, Phone, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/constants";

const destination = "Origin Repairs, 76 Cookridge Street, Leeds LS2 8GL";
const encodedDestination = encodeURIComponent(destination);

const mapModes = [
  {
    id: "store",
    label: "Store",
    icon: MapPin,
    title: "Origin Repairs",
    detail: "76 Cookridge Street, Leeds LS2 8GL",
    src: BUSINESS.googleMapsEmbedUrl,
    href: BUSINESS.googleMapsUrl,
  },
  {
    id: "directions",
    label: "Directions",
    icon: Navigation,
    title: "Route to Origin",
    detail: "Open turn-by-turn directions in Google Maps.",
    src: `https://www.google.com/maps?output=embed&daddr=${encodedDestination}`,
    href: BUSINESS.googleDirectionsUrl,
  },
  {
    id: "parking",
    label: "Parking",
    icon: ParkingCircle,
    title: "Nearby parking",
    detail: "Open a Google Maps search for nearby parking.",
    src: "https://www.google.com/maps?q=parking%20near%2076%20Cookridge%20Street%20Leeds%20LS2%208GL&output=embed",
    href: "https://www.google.com/maps/search/?api=1&query=parking%20near%2076%20Cookridge%20Street%20Leeds%20LS2%208GL",
  },
  {
    id: "station",
    label: "Station",
    icon: TrainFront,
    title: "From Leeds Station",
    detail: "Open the current walking route from Leeds Station.",
    src: `https://www.google.com/maps?output=embed&saddr=Leeds%20Station&daddr=${encodedDestination}&dirflg=w`,
    href: `https://www.google.com/maps/dir/?api=1&origin=Leeds%20Station&destination=${encodedDestination}&travelmode=walking`,
  },
] as const;

export default function InteractiveMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeMode, setActiveMode] = useState<(typeof mapModes)[number]["id"]>("store");
  const selected = useMemo(
    () => mapModes.find((mode) => mode.id === activeMode) ?? mapModes[0],
    [activeMode],
  );
  const SelectedIcon = selected.icon;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {mapLoaded && (
        <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
          {mapModes.map(({ id, label, icon: Icon }) => {
            const active = id === selected.id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveMode(id)}
                className={`flex h-12 items-center justify-center gap-2 bg-card px-3 text-[13px] font-semibold transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={active}
              >
                <Icon className="h-4 w-4 text-[color:var(--icon-fg)]" />
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="relative min-h-[320px] sm:min-h-[380px]">
        {mapLoaded ? (
          <iframe
            key={selected.id}
            title={`${selected.title} on Google Maps`}
            src={selected.src}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0 grayscale-[0.16]"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface px-6 text-center">
            <MapPin className="h-6 w-6 text-muted-foreground" />
            <p className="mt-4 text-[14px] font-semibold">
              Load the interactive map
            </p>
            <p className="mt-2 max-w-sm text-[12px] leading-5 text-muted-foreground">
              Loading Google Maps shares technical request data with Google.
            </p>
            <Button
              type="button"
              onClick={() => setMapLoaded(true)}
              className="mt-5 h-11 rounded-md px-5 text-[13px] sm:h-10"
            >
              Load map
            </Button>
            <a
              href={BUSINESS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-[12px] font-medium text-foreground underline"
            >
              Open Google Maps instead
            </a>
          </div>
        )}

        {mapLoaded && <div className="pointer-events-none absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-lg border border-border bg-card/95 p-4 shadow-[0_18px_45px_-30px_var(--shadow-soft)] backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="icon-circle h-9 w-9">
              <SelectedIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{selected.title}</p>
              <p className="mt-1 max-w-xs text-[12px] leading-relaxed text-muted-foreground">
                {selected.detail}
              </p>
            </div>
          </div>
        </div>}

        {mapLoaded && <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 sm:left-auto sm:flex-row">
          <Button asChild className="btn-primary h-11 px-4 text-[13px] sm:h-10">
            <a
              href={selected.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button asChild className="btn-secondary h-11 px-4 text-[13px] sm:h-10">
            <a href={BUSINESS.phoneHref} className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          </Button>
        </div>}

        {mapLoaded && <div className="pointer-events-none absolute right-[46%] top-[48%] hidden -translate-y-full translate-x-1/2 sm:block">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-[0_16px_38px_-18px_var(--shadow-soft)]">
            <MapPin className="h-5 w-5" />
          </div>
        </div>}
      </div>
    </div>
  );
}
