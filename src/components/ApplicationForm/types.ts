import type { ApplicationFormSectionProps as _ApplicationFormSectionProps } from '.';
import { MouseEventHandler } from 'react';

export interface ApplicationFormSectionProps
  extends Omit<_ApplicationFormSectionProps, 'name' | 'children'> {
  onNext: MouseEventHandler<HTMLButtonElement>;
  onBack?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  isLast?: boolean;
}
