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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      // Get computed styles from the original element before cloning
      const getComputedStyles = (el: Element): Map<Element, CSSStyleDeclaration> => {
        const styleMap = new Map<Element, CSSStyleDeclaration>();
        const collectStyles = (element: Element) => {
          styleMap.set(element, window.getComputedStyle(element));
          Array.from(element.children).forEach(collectStyles);
        };
        collectStyles(el);
        return styleMap;
      };

      const originalStyles = getComputedStyles(cardRef.current);

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc, clonedElement) => {
          // Apply all computed styles to cloned elements
          const applyStyles = (original: Element, cloned: Element) => {
            const computed = originalStyles.get(original);
            if (!computed) return;
            
            const htmlEl = cloned as HTMLElement;
            
            // Apply all relevant computed styles
            htmlEl.style.color = computed.color;
            htmlEl.style.backgroundColor = computed.backgroundColor;
            htmlEl.style.borderColor = computed.borderColor;
            htmlEl.style.borderTopColor = computed.borderTopColor;
            htmlEl.style.borderRightColor = computed.borderRightColor;
            htmlEl.style.borderBottomColor = computed.borderBottomColor;
            htmlEl.style.borderLeftColor = computed.borderLeftColor;
            
            // Handle gradients in background
            if (computed.backgroundImage && computed.backgroundImage !== 'none') {
              // Parse CSS variable references in gradients
              let bgImage = computed.backgroundImage;
              htmlEl.style.backgroundImage = bgImage;
            }
            
            // Ensure text is visible
            if (htmlEl.textContent && htmlEl.textContent.trim()) {
              if (computed.color === 'rgba(0, 0, 0, 0)' || !computed.color) {
                htmlEl.style.color = '#000000';
              }
            }
            
            // Recursively process children
            const originalChildren = Array.from(original.children);
            const clonedChildren = Array.from(cloned.children);
            originalChildren.forEach((origChild, index) => {
              if (clonedChildren[index]) {
                applyStyles(origChild, clonedChildren[index]);
              }
            });
          };
          
          applyStyles(cardRef.current!, clonedElement);
          
          // Ensure the card itself has a solid background
          (clonedElement as HTMLElement).style.backgroundColor = '#ffffff';
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="wizard-outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Persona
          </Button>
          <Button variant="wizard" onClick={handleDownload} disabled={isDownloading}>
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
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Avatar with drag-and-drop */}
              <div
                className={`relative group cursor-pointer rounded-full transition-all ${
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
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                  />
                ) : (
                  <AvatarIllustration variant={data.avatarVariant} size="lg" className="w-32 h-32 md:w-40 md:h-40" />
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-background text-center">
                    <Upload className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                </div>
              </div>
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
                      <span className="font-medium text-foreground">Age:</span> {data.age}
                    </span>
                  )}
                  {data.location && (
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Location:</span> {data.location}
                    </span>
                  )}
                  {data.companySize && (
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Company Size:</span> {data.companySize}
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
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <span className="text-primary text-lg leading-none">•</span>
                      <span>{goal}</span>
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
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <span className="text-destructive text-lg leading-none">•</span>
                      <span>{challenge}</span>
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
