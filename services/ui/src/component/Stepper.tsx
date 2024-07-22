import type React from 'react';
import cx from 'clsx';
import { ITruck } from './Icons';

type Props = {
  className?: string;
  steps: string[];
  currentStep: string;
  onStepClick?: (x: string) => void;
  drawTruck?: boolean;
};

export const Stepper: React.FC<Props> = ({ className, steps, currentStep, onStepClick, drawTruck = false }) => {
  const stepIsCrossed = (step: string) => steps.indexOf(step) <= steps.indexOf(currentStep);
  const stepIsCurrent = (step: string) => step === currentStep;
  const currentStepIndex = steps.indexOf(currentStep);

  const onClick = (step: string) => () => {
    if (!onStepClick) return;
    onStepClick(step);
  };

  return (
    <ul className={cx('relative flex flex-row justify-items-start', className)}>
      {steps.map((step, index) => (
        <li key={index} className={cx('shrink basis-0', index !== 0 && 'flex-1', index === steps.length - 1 && 'justify-end')}>
          <div className="inline-flex min-h-7 w-full min-w-7 select-none items-center align-middle text-xs">
            <div
              className={cx(
                'relative h-1 w-full flex-1 hover:border-blue-500 hover:outline-none hover:ring',
                onStepClick && 'cursor-pointer',
                stepIsCrossed(step) ? 'bg-blue' : 'bg-grey-light',
                stepIsCurrent(step) && 'bg-blue',
              )}
              onClick={onClick(step)}
            >
              {drawTruck && steps.includes(currentStep) && index == currentStepIndex + 1 && (
                <>
                  <div className="bg-blue absolute top-1/2 h-1 w-1/2 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D9F7FA] p-1">
                    <div className="flex items-center  justify-center rounded-full bg-[#00CBE0] p-2">
                      <ITruck size={16} className="text-white" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <span
              className={cx(
                'flex size-7 shrink-0 place-content-center place-items-center rounded-full text-lg',
                stepIsCrossed(step) ? 'bg-blue text-white' : 'bg-grey-light text-white',
              )}
            >
              {step}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};
