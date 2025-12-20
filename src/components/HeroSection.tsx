import { AvatarIllustration } from "./AvatarIllustration";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Floating Avatars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-float absolute top-[15%] left-[10%] md:left-[15%]">
          <AvatarIllustration variant={1} size="lg" />
        </div>
        <div className="animate-float-delayed absolute top-[20%] right-[8%] md:right-[12%]">
          <AvatarIllustration variant={2} size="md" />
        </div>
        <div className="animate-float-slow absolute bottom-[25%] left-[5%] md:left-[12%]">
          <AvatarIllustration variant={3} size="md" />
        </div>
        <div className="animate-float absolute bottom-[20%] right-[10%] md:right-[15%]">
          <AvatarIllustration variant={4} size="lg" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Agency Logo/Badge */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Persona Builder Tool
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-foreground mb-6 animate-slide-up leading-tight">
          Make My
          <br />
          Persona
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          A Buyer Persona Generator for Your Business
        </p>

        {/* CTA Button */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button variant="hero" size="xl" onClick={onStart} className="group">
            Build My Persona
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Your Agency Name. All rights reserved.</p>
      </footer>
    </section>
  );
}
