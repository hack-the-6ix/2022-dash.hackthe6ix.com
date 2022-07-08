import { Formik, FormikConfig } from 'formik';
import { ReactNode } from 'react';
import { object, lazy } from 'yup';
import cx from 'classnames';
import InfoBanner, { InfoBannerProps } from '../InfoBanner';
import About from './About';
import AtHt6 from './AtHt6';
import Experience from './Experience';
import TeamFormation from './TeamFormation';
import {
  ApplicationDataProvider,
  FormValuesType,
  initialValues,
} from './context';
import styles from './ApplicationForm.module.scss';

interface ApplicationFormProviderProps {
  onSubmit: FormikConfig<FormValuesType>['onSubmit'];
  children: ReactNode;
}
export function ApplicationFormProvider({
  children,
  onSubmit,
}: ApplicationFormProviderProps) {
  return (
    <ApplicationDataProvider>
      <Formik
        onSubmit={onSubmit}
        validationSchema={lazy((values) =>
          object().shape({
            ...About.validate(values),
            ...AtHt6.validate(values),
            ...Experience.validate(values),
            ...TeamFormation.validate(values),
          })
        )}
        initialValues={initialValues}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} noValidate>
            {children}
          </form>
        )}
      </Formik>
    </ApplicationDataProvider>
  );
}

export type ApplicationFormMessage = Omit<InfoBannerProps, 'onClose'>;

export interface ApplicationFormSectionProps {
  onClose?: (
    message: ApplicationFormMessage,
    idx: number,
    messages: ApplicationFormMessage[]
  ) => void;
  name: Omit<keyof FormValuesType, 'shippingInfo'>;
  messages?: ApplicationFormMessage[];
  className?: string;
  children: ReactNode;
}

export function ApplicationFormSection({
  messages = [],
  className,
  children,
  onClose,
  name,
  ...props
}: ApplicationFormSectionProps) {
  return (
    <fieldset {...props} className={cx(styles.section, className)}>
      <legend className={styles.label}>{name}</legend>
      {messages.map((messageProps, key) => (
        <InfoBanner
          {...messageProps}
          onClose={
            onClose ? () => onClose(messageProps, key, messages) : undefined
          }
          className={cx(styles['field--full-width'], messageProps.className)}
          key={key}
        />
      ))}
      {children}
    </fieldset>
  );
}
