import { cn } from "@/lib/utils";

interface AvatarIllustrationProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const avatarColors = {
  1: { bg: "hsl(350 60% 85%)", skin: "#8B5A4B", hair: "#2D1B14", clothes: "#4A3728" },
  2: { bg: "hsl(350 60% 90%)", skin: "#D4A574", hair: "#4A3728", clothes: "#6B4E71" },
  3: { bg: "hsl(350 50% 88%)", skin: "#C4956A", hair: "#1A1A1A", clothes: "#2C5F5D" },
  4: { bg: "hsl(350 60% 85%)", skin: "#F5D0C5", hair: "#8B4513", clothes: "#4169E1" },
  5: { bg: "hsl(350 55% 87%)", skin: "#B87D5B", hair: "#2D1B14", clothes: "#DC143C" },
  6: { bg: "hsl(350 60% 90%)", skin: "#E8C4A8", hair: "#654321", clothes: "#228B22" },
};

const sizes = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export function AvatarIllustration({ variant, className, size = "md" }: AvatarIllustrationProps) {
  const colors = avatarColors[variant];

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
        {/* Neck */}
        <rect x="40" y="60" width="20" height="15" fill={colors.skin} />
        
        {/* Clothes/Shoulders */}
        <ellipse cx="50" cy="90" rx="35" ry="25" fill={colors.clothes} />
        
        {/* Face */}
        <ellipse cx="50" cy="45" rx="22" ry="26" fill={colors.skin} />
        
        {/* Hair based on variant */}
        {variant === 1 && (
          <ellipse cx="50" cy="32" rx="20" ry="15" fill={colors.hair} />
        )}
        {variant === 2 && (
          <>
            <ellipse cx="50" cy="30" rx="22" ry="18" fill={colors.hair} />
            <ellipse cx="30" cy="45" rx="6" ry="15" fill={colors.hair} />
            <ellipse cx="70" cy="45" rx="6" ry="15" fill={colors.hair} />
          </>
        )}
        {variant === 3 && (
          <>
            <ellipse cx="50" cy="28" rx="20" ry="14" fill={colors.hair} />
            <rect x="30" y="25" width="40" height="8" fill={colors.hair} rx="4" />
          </>
        )}
        {variant === 4 && (
          <>
            <ellipse cx="50" cy="32" rx="24" ry="18" fill={colors.hair} />
            <ellipse cx="28" cy="50" rx="8" ry="20" fill={colors.hair} />
            <ellipse cx="72" cy="50" rx="8" ry="20" fill={colors.hair} />
          </>
        )}
        {variant === 5 && (
          <ellipse cx="50" cy="30" rx="18" ry="12" fill={colors.hair} />
        )}
        {variant === 6 && (
          <>
            <ellipse cx="50" cy="28" rx="22" ry="16" fill={colors.hair} />
            <rect x="32" y="22" width="36" height="6" fill={colors.hair} rx="3" />
          </>
        )}
        
        {/* Eyes */}
        <circle cx="42" cy="44" r="2" fill="#1A1A1A" />
        <circle cx="58" cy="44" r="2" fill="#1A1A1A" />
        
        {/* Subtle smile */}
        <path d="M 44 54 Q 50 58 56 54" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
