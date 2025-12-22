import { cn } from "@/lib/utils";

interface AvatarIllustrationProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const silhouetteColors = {
  1: { bg: "hsl(47 55% 47%)", silhouette: "hsl(150 34% 17%)" },
  2: { bg: "hsl(150 34% 25%)", silhouette: "hsl(47 55% 47%)" },
  3: { bg: "hsl(47 40% 60%)", silhouette: "hsl(150 34% 17%)" },
  4: { bg: "hsl(150 30% 35%)", silhouette: "hsl(40 33% 94%)" },
  5: { bg: "hsl(47 55% 47%)", silhouette: "hsl(150 34% 25%)" },
  6: { bg: "hsl(150 34% 17%)", silhouette: "hsl(47 55% 47%)" },
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
