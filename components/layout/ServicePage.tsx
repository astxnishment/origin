import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageSource = StaticImageData | string;

export type ServiceRepair = {
  name: string;
  price: string;
  time: string;
  note?: string;
};

export function ServiceHero({
  eyebrow,
  title,
  description,
  features,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  imageClassName,
  primaryAction,
  secondaryAction,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  image: ImageSource;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageClassName?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}) {
  return (
    <section className="service-hero grid items-center gap-8 border-b border-border lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-14">
      <div className="relative z-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title mt-3 max-w-[13ch]">{title}</h1>
        <p className="body-large mt-5 max-w-[52ch] text-muted-foreground">
          {description}
        </p>
        <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {features.slice(0, 4).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-[13px] leading-5 text-muted-foreground"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild className="btn-primary h-12 px-6 text-sm">
            <Link href={primaryAction.href}>
              {primaryAction.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {secondaryAction && (
            <Button asChild className="btn-secondary h-12 px-6 text-sm">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="service-image-stage">
        <Image
          src={image}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          priority
          sizes="(max-width: 1023px) 88vw, 48vw"
          className={cn(
            "h-[220px] w-full object-contain drop-shadow-[0_26px_52px_rgba(0,0,0,0.25)] sm:h-full",
            imageClassName
          )}
        />
      </div>
    </section>
  );
}

export function ServiceRepairList({
  title,
  description,
  repairs,
}: {
  title: string;
  description?: string;
  repairs: ServiceRepair[];
}) {
  return (
    <section className="section-standard border-b border-border">
      <div className="mb-7 max-w-2xl">
        <h2 className="section-title text-[clamp(1.5rem,2.2vw,2rem)]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card lg:grid lg:grid-cols-2">
        {repairs.map((repair, index) => (
          <div
            key={repair.name}
            className={cn(
              "grid min-h-24 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-border px-5 py-4 sm:px-6",
              "lg:[&:nth-last-child(-n+2)]:border-b-0",
              index % 2 === 0 && "lg:border-r"
            )}
          >
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-foreground">
                {repair.name}
              </h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {repair.time}
              </p>
              {repair.note && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {repair.note}
                </p>
              )}
            </div>
            <p className="max-w-36 text-right text-[14px] font-semibold leading-5 text-foreground">
              {repair.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceTags({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: string[];
}) {
  return (
    <section className="section-compact border-b border-border">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ServiceFinalCTA({
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}) {
  return (
    <section className="section-standard text-center">
      <h2 className="section-title">{title}</h2>
      <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-6 text-muted-foreground">
        {description}
      </p>
      <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Button asChild className="btn-primary h-12 px-6">
          <Link href={primaryAction.href}>{primaryAction.label}</Link>
        </Button>
        {secondaryAction && (
          <Button asChild className="btn-secondary h-12 px-6">
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
