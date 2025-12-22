import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import branchLogo from "@/assets/branch-logo.png";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <img src={branchLogo} alt="Branch logo" className="h-12 md:h-16 w-auto" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Agency Logo/Badge */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 text-sm text-muted-foreground">
            Branch's Marketing Toolkit
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-foreground mb-6 animate-slide-up leading-tight">
          Persona Building Tool
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
        <p>© {new Date().getFullYear()} BRANCH. All rights reserved.</p>
      </footer>
    </section>
  );
}
