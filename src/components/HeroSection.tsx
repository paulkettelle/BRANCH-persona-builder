import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import branchLogo from "@/assets/branch-logo.png";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-16">
      {/* Logo */}
      <a href="https://branchstrategies.co" target="_blank" rel="noopener noreferrer" className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
        <img src={branchLogo} alt="Branch logo" className="h-10 sm:h-12 md:h-16 w-auto" />
      </a>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-2 sm:px-4">
        {/* Agency Logo/Badge */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border/50 text-xs sm:text-sm text-muted-foreground">
            Branch's Marketing Toolkit
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-foreground mb-4 sm:mb-6 animate-slide-up leading-tight">
          Business-to-Business Persona Builder
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-slide-up px-2" style={{ animationDelay: "0.1s" }}>
          A Buyer Persona Generator for Your Business
        </p>

        {/* CTA Button */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button variant="hero" size="xl" onClick={onStart} className="group text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
            Build My Persona
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center text-xs sm:text-sm text-muted-foreground px-4">
        <p>© {new Date().getFullYear()} BRANCH. All rights reserved.</p>
      </footer>
    </section>
  );
}
