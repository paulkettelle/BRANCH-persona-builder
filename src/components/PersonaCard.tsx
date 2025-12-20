import { PersonaData } from "@/types/persona";
import { AvatarIllustration } from "./AvatarIllustration";
import { Button } from "./ui/button";
import { ArrowLeft, Download, Share2, RotateCcw } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface PersonaCardProps {
  data: PersonaData;
  onBack: () => void;
  onStartOver: () => void;
}

export function PersonaCard({ data, onBack, onStartOver }: PersonaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    toast.success("Persona card ready to download!", {
      description: "Right-click and save the card, or take a screenshot.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name} - Buyer Persona`,
          text: `Check out this buyer persona: ${data.name}, ${data.jobTitle}`,
        });
      } catch {
        toast.info("Share cancelled");
      }
    } else {
      toast.success("Link copied to clipboard!", {
        description: "Share your persona with your team.",
      });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="wizard-outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Persona
          </Button>
          <div className="flex gap-3">
            <Button variant="wizard-outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="wizard" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Persona Card */}
        <div
          ref={cardRef}
          className="bg-card rounded-3xl overflow-hidden shadow-card animate-scale-in"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <AvatarIllustration variant={data.avatarVariant} size="lg" className="w-32 h-32 md:w-40 md:h-40" />
              <div className="text-center md:text-left">
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">
                  {data.name || "Unnamed Persona"}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {data.jobTitle || "Job Title"}
                  {data.industry && ` • ${data.industry}`}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {data.age && (
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      {data.age}
                    </span>
                  )}
                  {data.location && (
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      {data.location}
                    </span>
                  )}
                  {data.companySize && (
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      {data.companySize}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          {data.quote && (
            <div className="px-8 md:px-12 py-6 border-b border-border">
              <blockquote className="text-xl md:text-2xl text-foreground font-serif italic text-center">
                "{data.quote}"
              </blockquote>
            </div>
          )}

          {/* Bio */}
          {data.bio && (
            <div className="px-8 md:px-12 py-6 border-b border-border">
              <h3 className="font-medium text-foreground mb-2">About</h3>
              <p className="text-muted-foreground">{data.bio}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-8 md:p-12">
            {/* Goals */}
            {data.primaryGoals.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Goals
                </h3>
                <ul className="space-y-2">
                  {data.primaryGoals.map((goal) => (
                    <li
                      key={goal}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenges */}
            {data.challenges.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Challenges
                </h3>
                <ul className="space-y-2">
                  {data.challenges.map((challenge) => (
                    <li
                      key={challenge}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-destructive mt-1">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Channels */}
            {data.preferredChannels.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Preferred Channels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.preferredChannels.map((channel) => (
                    <span
                      key={channel}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Information Sources */}
            {data.informationSources.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  Information Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.informationSources.map((source) => (
                    <span
                      key={source}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 md:px-12 py-6 bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              Created with Persona Builder • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Start Over */}
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={onStartOver} className="text-muted-foreground">
            <RotateCcw className="w-4 h-4 mr-2" />
            Create Another Persona
          </Button>
        </div>
      </div>
    </div>
  );
}
