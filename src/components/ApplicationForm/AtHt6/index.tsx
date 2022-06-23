import cx from 'classnames';
import { ApplicationFormSection, FormValuesType } from "..";
import ApplicationFooter from '../../ApplicationFooter';
import sharedStyles from '../ApplicationForm.module.scss';
import { ApplicationFormSectionProps } from '../types';

export function validate(values: FormValuesType) {

}

function AtHt6(props: ApplicationFormSectionProps) {
  return (
    <ApplicationFormSection
      name='Your Experience'
    >
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder,
        )}
      />
      <ApplicationFooter
        className={sharedStyles.footer}
        leftAction={{
          children: 'Back',
          onClick: props.onBack,
        }}
        rightAction={{
          children: 'Submit',
          onClick: props.onNext,
        }}
      />
    </ApplicationFormSection>
  )
}

export default AtHt6;