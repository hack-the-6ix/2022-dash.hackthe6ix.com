import { Checkbox, Input } from '@ht6/react-ui';
import cx from 'classnames';
import { omit } from 'lodash';
import { ApplicationFormSection, FormValuesType, useForm } from '..';
import ApplicationFooter from '../../ApplicationFooter';
import sharedStyles from '../ApplicationForm.module.scss';
import { ApplicationFormSectionProps } from '../types';

export function validate(values: FormValuesType) {}

function Experience({ onBack, onNext, ...props }: ApplicationFormSectionProps) {
  const { defaultInputProps } = useForm('experience', props.disabled);
  return (
    <ApplicationFormSection {...props} name='Your Experience'>
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <Checkbox
        {...omit(defaultInputProps('canDistribute'), ['outlineColor'])}
        label='I allow Hack the 6ix to distribute my resume to its event sponsors.'
        color='primary-3'
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
      />
      <Input
        {...defaultInputProps('github')}
        placeholder='Ex. https://github.com/fpunny'
        label='Github Link'
        type='url'
      />
      <Input
        {...defaultInputProps('portfolio')}
        className={sharedStyles['field--break']}
        placeholder='Ex. https://fpunny.xyz'
        label='Personal Website or Portfolio'
        type='url'
      />
      <Input
        {...defaultInputProps('linkedin')}
        className={sharedStyles['field--break']}
        placeholder='Ex. https://linkedin.com/fpunny'
        label='LinkedIn'
        type='url'
      />
      <ApplicationFooter
        className={sharedStyles.footer}
        leftAction={{
          children: 'Back',
          onClick: onBack,
        }}
        rightAction={{
          children: 'Save & Continue',
          onClick: onNext,
        }}
      />
    </ApplicationFormSection>
  );
}

export default Experience;
