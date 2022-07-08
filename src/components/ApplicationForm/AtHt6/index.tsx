import { Checkbox, InputLayout, Textarea } from '@ht6/react-ui';
import cx from 'classnames';
import { omit } from 'lodash';
import { ApplicationFormSection } from '..';
import ApplicationFooter from '../../ApplicationFooter';
import { useForm, FormValuesType, useApplicationData } from '../context';
import { ApplicationFormSectionProps } from '../types';
import sharedStyles from '../ApplicationForm.module.scss';
import styles from './AtHt6.module.scss';

function AtHt6({ onBack, onNext, ...props }: ApplicationFormSectionProps) {
  const { defaultInputProps, setFieldValue, values } = useForm(
    'at',
    props.disabled
  );
  const { enums } = useApplicationData();

  return (
    <ApplicationFormSection {...props} name='Your Experience'>
      <InputLayout
        className={sharedStyles['field--full-width']}
        label='Please choose 3 workshops that you are interested in'
        name='at.interest'
      >
        <div className={styles.workshops}>
          {enums.requestedWorkshops.map((workshop, key) => (
            <Checkbox
              {...omit(defaultInputProps('interest'), ['outlineColor'])}
              checked={values.at.interest.includes(workshop) as any}
              onChange={(e) => {
                const isChecked = e.currentTarget.checked;
                const newValue = values.at.interest.filter(
                  (i) => i !== workshop
                );
                setFieldValue(
                  'at.interest',
                  isChecked ? [...newValue, workshop] : newValue
                );
              }}
              disabled={
                !values.at.interest.includes(workshop) &&
                values.at.interest.length >= 3
              }
              label={workshop}
              color='primary-3'
              key={key}
            />
          ))}
        </div>
      </InputLayout>
      <Textarea
        {...omit(defaultInputProps('accompolish'), ['outlineColor'])}
        className={cx(sharedStyles['field--full-width'])}
        label='What would you like to accomplish at Hack the 6ix?'
        limit={200}
        required
        rows={5}
      />
      <Textarea
        {...omit(defaultInputProps('explore'), ['outlineColor'])}
        className={cx(sharedStyles['field--full-width'])}
        label='Describe a technology/innovcation that you are excited to explore in the future.'
        limit={200}
        required
        rows={5}
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
