import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center mx-auto max-w-3xl" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-brand-700 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-900 leading-tight mb-4 whitespace-pre-line">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
