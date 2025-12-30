import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { PersonaWizard } from "@/components/PersonaWizard";
import { PersonaCard } from "@/components/PersonaCard";
import { PersonaData } from "@/types/persona";

type View = "hero" | "wizard" | "result";

const Index = () => {
  const [view, setView] = useState<View>("hero");
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [initialStep, setInitialStep] = useState(1);

  const handleStartWizard = () => {
    setInitialStep(1);
    setPersonaData(null);
    setView("wizard");
  };

  const handleCompleteWizard = (data: PersonaData) => {
    setPersonaData(data);
    setView("result");
  };

  const handleBackToWizard = () => {
    setInitialStep(6); // Go back to Summary step
    setView("wizard");
  };

  const handleBackToHero = () => {
    setView("hero");
  };

  const handleStartOver = () => {
    setPersonaData(null);
    setInitialStep(1);
    setView("hero");
  };

  return (
    <main className="min-h-screen bg-background">
      {view === "hero" && <HeroSection onStart={handleStartWizard} />}
      {view === "wizard" && (
        <PersonaWizard
          onComplete={handleCompleteWizard}
          onBack={handleBackToHero}
          initialData={personaData}
          initialStep={initialStep}
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
