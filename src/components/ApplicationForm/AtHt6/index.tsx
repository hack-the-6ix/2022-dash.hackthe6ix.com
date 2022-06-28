import { Checkbox } from '@ht6/react-ui';
import cx from 'classnames';
import { omit } from 'lodash';
import { ApplicationFormSection, FormValuesType, useForm } from '..';
import ApplicationFooter from '../../ApplicationFooter';
import sharedStyles from '../ApplicationForm.module.scss';
import { ApplicationFormSectionProps } from '../types';

function AtHt6({ onBack, onNext, ...props }: ApplicationFormSectionProps) {
  const { defaultInputProps } = useForm('at', props.disabled);
  return (
    <ApplicationFormSection {...props} name='Your Experience'>
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder
        )}
      />
      <Checkbox
        {...omit(defaultInputProps('mlh'), ['outlineColor'])}
        label={
          <span>
            I have read and agree to the{' '}
            <a
              href='https://static.mlh.io/docs/mlh-code-of-conduct.pdf'
              className={sharedStyles.link}
              rel='noreferrer noopener'
              target='_blank'
            >
              Major League Hacking (MLH) Code of Conduct
            </a>
            .*
          </span>
        }
        color='primary-3'
        required
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
      />
      <Checkbox
        {...omit(defaultInputProps('mlhEmail'), ['outlineColor'])}
        label='I authorize MLH to send me pre- and post-event informational emails, which contain free credit and opportunities from their partners.'
        color='primary-3'
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
      />
      <Checkbox
        {...omit(defaultInputProps('mlhShare'), ['outlineColor'])}
        label={
          <span>
            I authorize Hack the 6ix to share my application/registration
            information with Major League Hacking for event administration,
            ranking, and MLH administration in-line with the MLH Privacy Policy.
            I further agree to the terms of both the{' '}
            <a
              href='https://github.com/MLH/mlh-policies/blob/main/contest-terms.md'
              className={sharedStyles.link}
              rel='noreferrer noopener'
              target='_blank'
            >
              MLH Contest Terms and Conditions
            </a>{' '}
            and the{' '}
            <a
              href='https://mlh.io/privacy'
              className={sharedStyles.link}
              rel='noreferrer noopener'
              target='_blank'
            >
              MLH Privacy Policy
            </a>
            .
          </span>
        }
        color='primary-3'
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
      />
      <ApplicationFooter
        className={sharedStyles.footer}
        leftAction={{
          children: 'Back',
          onClick: onBack,
        }}
        rightAction={{
          children: 'Submit',
          onClick: onNext,
        }}
      />
    </ApplicationFormSection>
  );
}

AtHt6.validate = (values: FormValuesType) => {
  return {};
};

export default AtHt6;
