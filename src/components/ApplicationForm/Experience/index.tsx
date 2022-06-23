import { Input } from '@ht6/react-ui';
import cx from 'classnames';
import { ApplicationFormSection, FormValuesType, useForm } from "..";
import ApplicationFooter from '../../ApplicationFooter';
import sharedStyles from '../ApplicationForm.module.scss';
import { ApplicationFormSectionProps } from '../types';

export function validate(values: FormValuesType) {

}

function Experience(props: ApplicationFormSectionProps) {
  const { defaultInputProps } = useForm('experience');
  return (
    <ApplicationFormSection
      name='Your Experience'
    >
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break'],
          sharedStyles.placeholder,
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
          onClick: props.onBack,
        }}
        rightAction={{
          children: 'Save & Continue',
          onClick: props.onNext,
        }}
      />
    </ApplicationFormSection>
  )
}

export default Experience;