import { useFormikContext, Formik, FormikConfig } from 'formik';
import { ReactNode, useCallback } from 'react';
import cx from 'classnames';
import InfoBanner, { InfoBannerProps } from '../InfoBanner';
import styles from './ApplicationForm.module.scss';
import { Colors } from '@ht6/react-ui/dist/styles';

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
    mhlShare: false,
  },
};

export type FormValuesType = typeof initialValues;

export function useForm<T extends keyof FormValuesType>(section: T) {
  const formikContext = useFormikContext<FormValuesType>();
  const defaultInputProps = useCallback(
    (field: keyof FormValuesType[T]) => {
      const name = `${section}.${String(field)}`;
      return {
        // @ts-ignore
        value: formikContext.values[section][field] as any,
        onChange: formikContext.handleChange,
        outlineColor: 'primary-3' as Colors,
        name,
      };
    },
    [
      formikContext.handleChange,
      formikContext.values,
      section,
    ],
  );

  return {
    ...formikContext,
    defaultInputProps,
  }
}

interface ApplicationFormProviderProps {
  onSubmit: FormikConfig<FormValuesType>['onSubmit'];
  children: ReactNode;
}
export function ApplicationFormProvider({ onSubmit, children }: ApplicationFormProviderProps) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {props => (
        <form onSubmit={props.handleSubmit} noValidate>
          {children}
        </form>
      )}
    </Formik>
  );
}

type ApplicationFormMessage = Omit<InfoBannerProps, 'onClose'>;

interface ApplicationFormSectionProps {
  onClose?: (message: ApplicationFormMessage, idx: number, messages: ApplicationFormMessage[]) => void;
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
    <fieldset
      {...props}
      className={cx(
        styles.section,
        className,
      )}
    >
      <legend className={styles.label}>
        {name}
      </legend>
      {messages.map((messageProps, key) => (
        <InfoBanner
          {...messageProps}
          onClose={onClose ? () => onClose(messageProps, key, messages) : undefined}
          key={key}
        />
      ))}
      {children}
    </fieldset>
  )
}
