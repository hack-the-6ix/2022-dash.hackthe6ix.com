import { MouseEventHandler } from "react";

export interface ApplicationFormSectionProps {
  onNext: MouseEventHandler<HTMLButtonElement>;
  onBack?: MouseEventHandler<HTMLButtonElement>;
  isLast?: boolean;
}