import { useFormikContext, Formik, FormikConfig } from 'formik';
import { ReactNode, useCallback } from 'react';
import { object } from 'yup';
import cx from 'classnames';
import InfoBanner, { InfoBannerProps } from '../InfoBanner';
import styles from './ApplicationForm.module.scss';
import { Colors } from '@ht6/react-ui/dist/styles';

import { validate as aboutValidate } from './About';
// import { validate as atHt6Validate} from './AtHt6';
// import { validate as experienceValidate } from './Experience';
// import { validate as teamFormationValidate } from './TeamFormation';

const initialValues = {
  team: {
    code: '',
    members: [] as string[],
    owner: false,
  },
  about: {
    firstName: '',
    lastName: '',
    email: '',
    canEmail: false,
    gender: '',
    ethnicity: '',
    timezone: '',
    size: '',
  },
  shippingInfo: {
    isCanadian: false,
    line1: '',
    line2: '',
    city: '',
    province: '',
    postalCode: '',
  },
  experience: {
    school: '',
    study: '',
    year: '',
    hackathons: '',
    resume: null,
    canDistribute: false,
    github: '',
    portfolio: '',
    linkedin: '',
    project: '',
  },
  at: {
    interest: [] as string[],
    accompolish: '',
    explore: '',
    mlh: false,
    mlhEmail: false,
    mlhShare: false,
  },
};

export type FormValuesType = typeof initialValues;

export function useForm<T extends keyof FormValuesType>(
  section?: T,
  disabled?: boolean
) {
  const formikContext = useFormikContext<FormValuesType>();
  const defaultInputProps = useCallback(
    (
      field: T extends never ? keyof FormValuesType : keyof FormValuesType[T]
    ) => {
      const name = section ? `${section}.${String(field)}` : field;
      let error, touched;
      if (section) {
        // @ts-ignore
        error = formikContext.errors[section]?.[field];
        // @ts-ignore
        touched = formikContext.touched[section]?.[field];
      }
      return {
        // @ts-ignore
        value: formikContext.values[section][field],
        onChange: formikContext.handleChange,
        onBlur: formikContext.handleBlur,
        outlineColor: 'primary-3' as Colors,
        status:
          error && touched
            ? {
                state: 'error' as const,
                text: error,
              }
            : undefined,
        disabled,
        name,
      };
    },
    [
      formikContext.handleChange,
      formikContext.handleBlur,
      formikContext.touched,
      formikContext.errors,
      formikContext.values,
      disabled,
      section,
    ]
  );

  return {
    ...formikContext,
    defaultInputProps,
  };
}

interface ApplicationFormProviderProps {
  onSubmit: FormikConfig<FormValuesType>['onSubmit'];
  children: ReactNode;
}
export function ApplicationFormProvider({
  children,
  onSubmit,
}: ApplicationFormProviderProps) {
  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={object().shape({
        // ...teamFormationValidate,
        ...aboutValidate,
        // ...experienceValidate,
        // ...atHt6Validate,
      })}
      initialValues={initialValues}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} noValidate>
          {children}
        </form>
      )}
    </Formik>
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
