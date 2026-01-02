import { PersonaData } from "@/types/persona";
import { AvatarIllustration } from "./AvatarIllustration";
import { Button } from "./ui/button";
import { ArrowLeft, Download, RotateCcw, Loader2, Upload } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PersonaCardProps {
  data: PersonaData;
  onBack: () => void;
  onStartOver: () => void;
}

export function PersonaCard({ data, onBack, onStartOver }: PersonaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCustomAvatar(e.target?.result as string);
      toast.success("Photo uploaded successfully!");
    };
    reader.onerror = () => {
      toast.error("Failed to read the file");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Brand colors for PDF export (resolved from CSS variables)
  const pdfColors = {
    background: "#1e3b29",
    foreground: "#f5f0e3",
    card: "#254434",
    cardForeground: "#f5f0e3",
    primary: "#ba9f38",
    primaryForeground: "#ffffff",
    muted: "#2d4d3d",
    mutedForeground: "#7a9a8a",
    destructive: "#ef4444",
    accent: "#e8b4c8",
    secondary: "#e8b4c8",
    border: "#3a5f4d",
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      // Get the actual computed styles from the card
      const cardElement = cardRef.current;
      
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: pdfColors.card,
        logging: true,
        allowTaint: true,
        windowWidth: cardElement.scrollWidth,
        windowHeight: cardElement.scrollHeight,
        onclone: (_clonedDoc, clonedElement) => {
          // Force all elements to use computed styles
          const processElement = (el: Element) => {
            if (!(el instanceof HTMLElement)) return;
            
            const computedStyle = window.getComputedStyle(
              cardElement.querySelector(`[data-persona-card]`) === cardElement 
                ? cardElement 
                : el
            );
            
            // Get class list safely
            const classList = el.classList ? Array.from(el.classList) : [];
            const classString = classList.join(' ');
            
            // Apply background colors
            if (classString.includes('bg-card') || el.hasAttribute('data-persona-card')) {
              el.style.backgroundColor = pdfColors.card;
            }
            if (classString.includes('bg-muted/50')) {
              el.style.backgroundColor = pdfColors.muted;
              el.style.opacity = '0.5';
            }
            if (classString.includes('bg-muted') && !classString.includes('bg-muted/')) {
              el.style.backgroundColor = pdfColors.muted;
            }
            if (classString.includes('bg-primary')) {
              el.style.backgroundColor = pdfColors.primary;
            }
            if (classString.includes('bg-destructive')) {
              el.style.backgroundColor = pdfColors.destructive;
            }
            if (classString.includes('bg-accent')) {
              el.style.backgroundColor = pdfColors.accent;
            }
            if (classString.includes('bg-secondary')) {
              el.style.backgroundColor = pdfColors.secondary;
            }
            
            // Gradient header
            if (classString.includes('bg-gradient-to-br')) {
              el.style.background = `linear-gradient(to bottom right, ${pdfColors.primary}33, ${pdfColors.accent}1a)`;
            }
            
            // Text colors
            if (classString.includes('text-foreground')) {
              el.style.color = pdfColors.foreground;
            }
            if (classString.includes('text-muted-foreground')) {
              el.style.color = pdfColors.mutedForeground;
            }
            if (classString.includes('text-primary')) {
              el.style.color = pdfColors.primary;
            }
            if (classString.includes('text-primary-foreground')) {
              el.style.color = pdfColors.primaryForeground;
            }
            if (classString.includes('text-destructive')) {
              el.style.color = pdfColors.destructive;
            }
            if (classString.includes('text-background')) {
              el.style.color = pdfColors.background;
            }
            
            // Border colors
            if (classString.includes('border-border') || classString.includes('border-b')) {
              el.style.borderColor = pdfColors.border;
            }
            
            // Handle headings
            if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
              if (!el.style.color) {
                el.style.color = pdfColors.foreground;
              }
            }
            
            // Ensure list items and paragraphs have color
            if (['P', 'SPAN', 'LI'].includes(el.tagName)) {
              if (!el.style.color && !classString.includes('text-')) {
                el.style.color = pdfColors.mutedForeground;
              }
            }
            
            // Process all children
            Array.from(el.children).forEach(processElement);
          };
          
          // Set the root element styles
          const root = clonedElement as HTMLElement;
          root.style.backgroundColor = pdfColors.card;
          root.style.color = pdfColors.foreground;
          
          processElement(root);
        }
      });
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${data.name || "persona"}-persona.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <Button variant="wizard-outline" onClick={onBack} className="text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Persona
          </Button>
          <Button variant="wizard" onClick={handleDownload} disabled={isDownloading} className="text-sm sm:text-base">
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>

        {/* Persona Card */}
        <div
          ref={cardRef}
          data-persona-card
          className="bg-card rounded-3xl overflow-hidden shadow-card animate-scale-in"
          style={{ backgroundColor: "hsl(var(--card))" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-10">
              {/* Avatar with drag-and-drop */}
              <div
                className={`relative group cursor-pointer rounded-full transition-all flex-shrink-0 ${
                  isDragOver ? "ring-4 ring-primary ring-offset-2" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                {customAvatar ? (
                  <img
                    src={customAvatar}
                    alt="Custom avatar"
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-cover"
                  />
                ) : (
                  <AvatarIllustration variant={data.avatarVariant} size="lg" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40" />
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-background text-center">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left flex-1 min-w-0">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-1 sm:mb-2 break-words">
                  {data.name || "Unnamed Persona"}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  {data.jobTitle || "Job Title"}
                  {data.industry && ` • ${data.industry}`}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                  {data.age && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-muted rounded-full text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Age:</span> {data.age}
                    </span>
                  )}
                  {data.location && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-muted rounded-full text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Location:</span> {data.location}
                    </span>
                  )}
                  {data.companySize && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-muted rounded-full text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Company Size:</span> {data.companySize}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          {data.quote && (
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 border-b border-border">
              <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground font-serif italic text-center">
                "{data.quote}"
              </blockquote>
            </div>
          )}

          {/* Bio */}
          {data.bio && (
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 border-b border-border">
              <h3 className="font-medium text-foreground mb-2 text-sm sm:text-base">About</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{data.bio}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Goals */}
            {data.primaryGoals.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
                  Goals
                </h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {data.primaryGoals.map((goal) => (
                    <li
                      key={goal}
                      className="text-muted-foreground flex items-start gap-2 text-sm sm:text-base"
                    >
                      <span className="text-primary text-base sm:text-lg leading-none mt-0.5">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenges */}
            {data.challenges.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-destructive" />
                  Challenges
                </h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {data.challenges.map((challenge) => (
                    <li
                      key={challenge}
                      className="text-muted-foreground flex items-start gap-2 text-sm sm:text-base"
                    >
                      <span className="text-destructive text-base sm:text-lg leading-none mt-0.5">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Channels */}
            {data.preferredChannels.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
                  Preferred Channels
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {data.preferredChannels.map((channel) => (
                    <span
                      key={channel}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-muted rounded-full text-xs sm:text-sm text-muted-foreground"
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
                <h3 className="font-medium text-foreground mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary" />
                  Information Sources
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {data.informationSources.map((source) => (
                    <span
                      key={source}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-muted rounded-full text-xs sm:text-sm text-muted-foreground"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 bg-muted/50 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Created by BRANCH's B2B Persona Builder | {new Date().toLocaleDateString()} |{" "}
              <a 
                href="https://www.branchstrategies.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                branchstrategies.co
              </a>
            </p>
          </div>
        </div>

        {/* Start Over */}
        <div className="text-center mt-4 sm:mt-6 md:mt-8">
          <Button variant="ghost" onClick={onStartOver} className="text-muted-foreground text-sm sm:text-base">
            <RotateCcw className="w-4 h-4 mr-2" />
            Create Another Persona
          </Button>
        </div>
      </div>
    </div>
  );
}
