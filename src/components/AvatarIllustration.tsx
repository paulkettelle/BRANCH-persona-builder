import { cn } from "@/lib/utils";

interface AvatarIllustrationProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const silhouetteColors = {
  1: { bg: "#BA9F38", silhouette: "#1e3b29" },      // Gold bg, dark green silhouette
  2: { bg: "#1e3b29", silhouette: "#FFF2DB" },      // Dark green bg, cream silhouette
  3: { bg: "#B1BACB", silhouette: "#4F5761" },      // Silver bg, slate silhouette
  4: { bg: "#4F5761", silhouette: "#BA9F38" },      // Slate bg, gold silhouette
  5: { bg: "#FFF2DB", silhouette: "#1e3b29" },      // Cream bg, dark green silhouette
  6: { bg: "#1e3b29", silhouette: "#BA9F38" },      // Dark green bg, gold silhouette
};

const sizes = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export function AvatarIllustration({ variant, className, size = "md" }: AvatarIllustrationProps) {
  const colors = silhouetteColors[variant];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden shadow-float",
        sizes[size],
        className
      )}
      style={{ backgroundColor: colors.bg }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Simple silhouette - head and shoulders */}
        <ellipse cx="50" cy="90" rx="38" ry="28" fill={colors.silhouette} />
        <circle cx="50" cy="42" r="24" fill={colors.silhouette} />
      </svg>
    </div>
  );
}
