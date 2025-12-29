import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ProgressBar, StepIndicator } from "./ProgressBar";
import { AvatarIllustration } from "./AvatarIllustration";
import {
  PersonaData,
  defaultPersonaData,
  challengeOptions,
  channelOptions,
  sourceOptions,
  industryOptions,
  companySizeOptions,
} from "@/types/persona";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface PersonaWizardProps {
  onComplete: (data: PersonaData) => void;
  onBack: () => void;
}

const stepTitles = [
  "Basic Info",
  "Professional",
  "Goals",
  "Challenges",
  "Behavior",
  "Summary",
];

export function PersonaWizard({ onComplete, onBack }: PersonaWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PersonaData>(defaultPersonaData);

  const updateData = (updates: Partial<PersonaData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (field: keyof PersonaData, item: string) => {
    const current = data[field] as string[];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateData({ [field]: updated });
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
    else onComplete(data);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.name.trim() !== "";
      case 2:
        return data.jobTitle.trim() !== "";
      case 3:
        return data.primaryGoals.some((g) => g.trim() !== "");
      case 4:
        return data.challenges.length > 0;
      case 5:
        return data.preferredChannels.length > 0;
      case 6:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      <div className="max-w-3xl mx-auto w-full flex-1">
        <ProgressBar currentStep={step} totalSteps={6} />
        <StepIndicator steps={stepTitles} currentStep={step} />

        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-card animate-scale-in">
          {/* Step Content */}
          <div className="min-h-[400px]">
            {step === 1 && (
              <BasicInfoStep data={data} updateData={updateData} />
            )}
            {step === 2 && (
              <ProfessionalStep data={data} updateData={updateData} />
            )}
            {step === 3 && (
              <GoalsStep data={data} updateData={updateData} />
            )}
            {step === 4 && (
              <MultiSelectStep
                title="Describe their main pain points"
                subtitle="Describe what they care most about"
                options={challengeOptions}
                selected={data.challenges}
                onToggle={(item) => toggleArrayItem("challenges", item)}
              />
            )}
            {step === 5 && (
              <BehaviorStep
                data={data}
                toggleArrayItem={toggleArrayItem}
              />
            )}
            {step === 6 && (
              <SummaryStep data={data} updateData={updateData} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="wizard-outline" size="lg" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? "Home" : "Back"}
            </Button>
            <Button
              variant="wizard"
              size="lg"
              onClick={nextStep}
              disabled={!canProceed()}
            >
              {step === 6 ? "Create Persona" : "Continue"}
              {step === 6 ? (
                <Check className="w-4 h-4 ml-2" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BasicInfoStep({
  data,
  updateData,
}: {
  data: PersonaData;
  updateData: (u: Partial<PersonaData>) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-center">
        Basic Information
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Tell us about your ideal customer
      </p>
      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Persona Name *
          </label>
          <Input
            placeholder="e.g., Marketing Mary"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Age Range
            </label>
            <Input
              placeholder="e.g., 35-45"
              value={data.age}
              onChange={(e) => updateData({ age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <Input
              placeholder="e.g., New York, USA"
              value={data.location}
              onChange={(e) => updateData({ location: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalStep({
  data,
  updateData,
}: {
  data: PersonaData;
  updateData: (u: Partial<PersonaData>) => void;
}) {
  const isOtherSelected = data.industry !== "" && !industryOptions.slice(0, -1).includes(data.industry);
  
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-center">
        Professional Details
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        What's their work environment like?
      </p>
      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Job Title *
          </label>
          <Input
            placeholder="e.g., Marketing Director"
            value={data.jobTitle}
            onChange={(e) => updateData({ jobTitle: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Industry
          </label>
          <div className="grid grid-cols-2 gap-2">
            {industryOptions.slice(0, -1).map((industry) => (
              <button
                key={industry}
                onClick={() => updateData({ industry })}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all",
                  data.industry === industry
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {industry}
              </button>
            ))}
            <button
              onClick={() => updateData({ industry: isOtherSelected ? data.industry : "" })}
              className={cn(
                "px-4 py-2 rounded-lg text-sm transition-all",
                isOtherSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Other
            </button>
          </div>
          {isOtherSelected && (
            <Input
              className="mt-3"
              placeholder="Enter your industry"
              value={data.industry}
              onChange={(e) => updateData({ industry: e.target.value })}
              autoFocus
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Company Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {companySizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => updateData({ companySize: size })}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all",
                  data.companySize === size
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalsStep({
  data,
  updateData,
}: {
  data: PersonaData;
  updateData: (u: Partial<PersonaData>) => void;
}) {
  const updateGoal = (index: number, value: string) => {
    const newGoals = [...data.primaryGoals];
    newGoals[index] = value;
    updateData({ primaryGoals: newGoals });
  };

  // Ensure we have 5 slots
  const goals = [...data.primaryGoals];
  while (goals.length < 5) goals.push("");

  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8 text-center">
        What are their primary goals?
      </h2>
      <div className="space-y-4 max-w-md mx-auto">
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-foreground mb-2">
              Goal {index + 1}{index === 0 && " *"}
            </label>
            <Input
              placeholder={`e.g., ${["Increase revenue", "Reduce costs", "Improve efficiency", "Grow market share", "Enhance customer experience"][index]}`}
              value={goals[index]}
              onChange={(e) => updateGoal(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiSelectStep({
  title,
  subtitle,
  options,
  selected,
  onToggle,
}: {
  title: string;
  subtitle: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-center">
        {title}
      </h2>
      <p className="text-muted-foreground mb-8 text-center">{subtitle}</p>
      <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={cn(
              "px-4 py-3 rounded-lg text-sm transition-all text-left flex items-center gap-3",
              selected.includes(option)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                selected.includes(option)
                  ? "bg-primary-foreground border-primary-foreground"
                  : "border-current"
              )}
            >
              {selected.includes(option) && (
                <Check className="w-3 h-3 text-primary" />
              )}
            </div>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function BehaviorStep({
  data,
  toggleArrayItem,
}: {
  data: PersonaData;
  toggleArrayItem: (field: keyof PersonaData, item: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-center">
        Behavior & Preferences
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        How do they research and communicate?
      </p>
      <div className="space-y-8 max-w-xl mx-auto">
        <div>
          <h3 className="font-medium text-foreground mb-4">
            Preferred Communication Channels *
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {channelOptions.map((channel) => (
              <button
                key={channel}
                onClick={() => toggleArrayItem("preferredChannels", channel)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all",
                  data.preferredChannels.includes(channel)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-foreground mb-4">
            Information Sources
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {sourceOptions.map((source) => (
              <button
                key={source}
                onClick={() => toggleArrayItem("informationSources", source)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm transition-all",
                  data.informationSources.includes(source)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {source}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryStep({
  data,
  updateData,
}: {
  data: PersonaData;
  updateData: (u: Partial<PersonaData>) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-center">
        Final Touches
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Add a quote and bio to bring your persona to life
      </p>
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <AvatarIllustration variant={data.avatarVariant} size="lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Characteristic Quote
          </label>
          <Input
            placeholder="e.g., &quot;I need solutions that save time and prove ROI.&quot;"
            value={data.quote}
            onChange={(e) => updateData({ quote: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Short Bio
          </label>
          <Textarea
            placeholder="Write a brief description of this persona..."
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
