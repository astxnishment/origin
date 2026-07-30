import { cn } from "@/lib/utils";

type ContainerSize = "wide" | "content" | "form" | "narrow";

const sizeClasses: Record<ContainerSize, string> = {
  wide: "page-container-wide",
  content: "page-container",
  form: "page-container-form",
  narrow: "page-container-narrow",
};

export function PageContainer({
  children,
  className,
  size = "content",
}: {
  children: React.ReactNode;
  className?: string;
  size?: ContainerSize;
}) {
  return <div className={cn(sizeClasses[size], className)}>{children}</div>;
}

export function PageSection({
  children,
  className,
  compact = false,
  bordered = true,
}: {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  bordered?: boolean;
}) {
  return (
    <section
      className={cn(
        compact ? "section-compact" : "section-standard",
        bordered && "section-border",
        className
      )}
    >
      {children}
    </section>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "page-intro grid gap-5 border-b border-border lg:grid-cols-[minmax(0,1fr)_minmax(280px,430px)] lg:items-end",
        className
      )}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title mt-3">{title}</h1>
      </div>
      {aside ??
        (description ? (
          <p className="body-large max-w-[44ch] text-muted-foreground lg:justify-self-end">
            {description}
          </p>
        ) : null)}
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-7 flex items-end justify-between gap-5 sm:mb-9",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className="mt-3 max-w-[62ch] text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
