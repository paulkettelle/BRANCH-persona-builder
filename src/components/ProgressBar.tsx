import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}% complete
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="hidden md:flex items-center justify-center gap-1 mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
              index + 1 < currentStep
                ? "bg-primary text-primary-foreground"
                : index + 1 === currentStep
                ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                : "bg-muted text-muted-foreground"
            )}
          >
            {index + 1 < currentStep ? "✓" : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-0.5 transition-all duration-300",
                index + 1 < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
