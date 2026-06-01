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
  const isCenter = align === "center";
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        isCenter ? "text-center mx-auto max-w-3xl" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block font-display text-xs md:text-sm font-bold uppercase tracking-widest text-cta-700 bg-cta-50 border border-[#F5C49A] rounded-pill px-4 py-1.5 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-cta-700 leading-[1.12] mb-4 whitespace-pre-line drop-shadow-[0_1px_0_rgba(194,75,0,0.12)]">
        {title}
      </h2>
      <div
        className={cn(
          "h-1.5 w-24 rounded-full bg-gradient-to-r from-cta-400 to-cta-600 mb-5",
          isCenter && "mx-auto"
        )}
      />
      {description && (
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
