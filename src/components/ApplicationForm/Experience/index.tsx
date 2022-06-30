import { Checkbox, Input, Textarea, FileUpload } from '@ht6/react-ui';
import cx from 'classnames';
import { omit } from 'lodash';
import { ApplicationFormSection, FormValuesType, useForm } from '..';
import ApplicationFooter from '../../ApplicationFooter';
import sharedStyles from '../ApplicationForm.module.scss';
import { ApplicationFormSectionProps } from '../types';

function Experience({ onBack, onNext, ...props }: ApplicationFormSectionProps) {
  const { defaultInputProps, setFieldValue } = useForm(
    'experience',
    props.disabled
  );
  return (
    <ApplicationFormSection {...props} name='Your Experience'>
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <FileUpload
        {...defaultInputProps('resume')}
        onChange={(e) => {
          setFieldValue('experience.resume', e.currentTarget.files);
        }}
        label='Your Resume'
        required
      />
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
      <Textarea
        {...defaultInputProps('project')}
        label='Describe a project that you are proud of and explain the impact it had.'
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
        limit={200}
        required
        rows={5}
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

Experience.validate = (values: FormValuesType) => {
  return {};
};

export default Experience;
