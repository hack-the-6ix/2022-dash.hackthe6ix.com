import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useRequest, ServerResponse } from '../../utils/useRequest';

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

interface ApplicationDataProviderProps {
  children: ReactNode | ((data: { enums: ApplicationEnumType }) => ReactNode);
}

export function ApplicationDataProvider({
  children,
}: ApplicationDataProviderProps) {
  const { makeRequest, abort, data } = useRequest<
    ServerResponse<ApplicationEnumType>
  >('/api/action/applicationEnums');

  useEffect(() => {
    makeRequest();
    return () => abort();
  }, [makeRequest, abort]);

  const value = {
    enums: data?.message ?? initEnum,
  };

  return (
    <ApplicationEnumContext.Provider value={value}>
      {data
        ? typeof children === 'function'
          ? children(value)
          : children
        : null}
    </ApplicationEnumContext.Provider>
  );
}
