import { Colors } from '@ht6/react-ui/dist/styles';
import { useFormikContext } from 'formik';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useRequest, ServerResponse } from '../../utils/useRequest';

export const initialValues = {
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

const initEnum = {
  countries: [],
  ethnicity: [],
  gender: [],
  hackathonsAttended: [],
  programOfStudy: [],
  pronouns: [],
  province: [],
  requestedWorkshops: [],
  school: [],
  shirt: [],
  timezone: [],
  yearsOfStudy: [],
};

export type ApplicationEnumType = {
  [field in keyof typeof initEnum]: string[];
};

const ApplicationEnumContext = createContext<{
  enums: ApplicationEnumType;
}>({
  enums: initEnum,
});

export function useApplicationData() {
  return useContext(ApplicationEnumContext);
}

export function ApplicationDataProvider({ children }: { children: ReactNode }) {
  const { makeRequest, abort, data } = useRequest<
    ServerResponse<ApplicationEnumType>
  >('/api/action/applicationEnums');
  useEffect(() => {
    makeRequest();
    return () => abort();
  }, [makeRequest, abort]);

  return (
    <ApplicationEnumContext.Provider
      value={{
        enums: data?.message ?? initEnum,
      }}
    >
      {data ? children : null}
    </ApplicationEnumContext.Provider>
  );
}

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
