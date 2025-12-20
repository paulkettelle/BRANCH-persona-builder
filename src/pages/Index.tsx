import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { PersonaWizard } from "@/components/PersonaWizard";
import { PersonaCard } from "@/components/PersonaCard";
import { PersonaData } from "@/types/persona";

type View = "hero" | "wizard" | "result";

const Index = () => {
  const [view, setView] = useState<View>("hero");
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);

  const handleStartWizard = () => {
    setView("wizard");
  };

  const handleCompleteWizard = (data: PersonaData) => {
    setPersonaData(data);
    setView("result");
  };

  const handleBackToWizard = () => {
    setView("wizard");
  };

  const handleBackToHero = () => {
    setView("hero");
  };

  const handleStartOver = () => {
    setPersonaData(null);
    setView("hero");
  };

  return (
    <main className="min-h-screen bg-background">
      {view === "hero" && <HeroSection onStart={handleStartWizard} />}
      {view === "wizard" && (
        <PersonaWizard
          onComplete={handleCompleteWizard}
          onBack={handleBackToHero}
        />
      )}
      {view === "result" && personaData && (
        <PersonaCard
          data={personaData}
          onBack={handleBackToWizard}
          onStartOver={handleStartOver}
        />
      )}
    </main>
  );
};

export default Index;
