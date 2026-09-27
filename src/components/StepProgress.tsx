import { Check } from 'lucide-react';
import { WizardStep } from '../types';

interface StepProgressProps {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

const STEPS = [
  { step: 1, label: 'Live Demos', short: '1' },
  { step: 2, label: 'Brand Guarantee', short: '2' },
  { step: 3, label: 'Free Training', short: '3' },
  { step: 4, label: 'Transparent Pricing', short: '4' },
] as const;

export default function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  if (currentStep > 4) return null;

  return (
    <nav aria-label="Onboarding Steps" className="w-full flex justify-center mb-6 sm:mb-8">
      <div 
        id="wizard-step-progress"
        className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 bg-[#141414]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
      >
        <span className="text-[11px] font-semibold text-white/50 pl-2.5 pr-1.5 hidden sm:inline tabular-nums">
          Step {currentStep} of 4
        </span>

        <div className="h-4 w-px bg-white/10 hidden sm:block mx-1" />

        {STEPS.map((s) => {
          const isActive = currentStep === s.step;
          const isCompleted = currentStep > s.step;

          return (
            <button
              key={s.step}
              onClick={() => onStepClick(s.step as WizardStep)}
              id={`step-indicator-${s.step}`}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer focus:outline-hidden ${
                isActive
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                  : isCompleted
                  ? 'text-white hover:bg-white/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              title={`Step ${s.step}: ${s.label}`}
            >
              <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : isCompleted
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60'
              }`}>
                {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : s.short}
              </span>
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
