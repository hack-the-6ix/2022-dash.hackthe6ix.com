import { Typography } from '@ht6/react-ui';
import { FormikProps, useFormik, yupToFormErrors } from 'formik';
import {
  FC,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import ApplicationFooter, {
  ApplicationFooterProps,
} from '../../components/ApplicationFooter';
import {
  ApplicationDataProvider,
  useApplicationData,
} from '../../components/ApplicationForm';
import * as About from '../../components/ApplicationForm/About';
import * as AtHt6 from '../../components/ApplicationForm/AtHt6';
import * as Experience from '../../components/ApplicationForm/Experience';
import * as TeamFormation from '../../components/ApplicationForm/TeamFormation';
import { ApplicationModule } from '../../components/ApplicationForm/helpers';
import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import { useConfig } from '../../components/Configuration/context';
import HeadingSection from '../../components/HeadingSection';
import InfoBanner from '../../components/InfoBanner';
import TabSection, { Tab } from '../../components/TabSection';
import { ServerResponse, useRequest } from '../../utils/useRequest';
import InfoPage from './InfoPage';
import { deserializeApplication, serializeApplication } from './helpers';

import styles from './Application.module.scss';

interface TabContentProps<T> {
  element: FC<any>;
  formik?: FormikProps<T>;
  footerProps?: ApplicationFooterProps;
  message?: ReactNode;
  readonly?: boolean;
}
function TabContent<T>({
  element: Element,
  footerProps,
  message,
  formik,
  readonly,
}: TabContentProps<T>) {
  return (
    <>
      {message && (
        <InfoBanner className={styles.banner} children={message} type='error' />
      )}
      <Element {...formik} readonly={readonly} />
      {footerProps && (
        <ApplicationFooter className={styles.footer} {...footerProps} />
      )}
    </>
  );
}

const tabs: (Omit<Tab, 'element'> & {
  element: ReactElement;
  module?: ApplicationModule;
  ref: string;
  id: string;
})[] = [
  {
    label: (
      <span>
        1<span className={styles.label}>. Team Formation</span>
      </span>
    ),
    element: <TabContent element={TeamFormation.default} />,
    id: 'team-formation',
    ref: 'team',
  },
  {
    label: (
      <span>
        2<span className={styles.label}>. About You</span>
      </span>
    ),
    module: About,
    element: <TabContent element={About.default} />,
    id: 'about-you',
    ref: 'about',
  },
  {
    label: (
      <span>
        3<span className={styles.label}>. Your Experience</span>
      </span>
    ),
    module: Experience,
    element: <TabContent element={Experience.default} />,
    id: 'your-experience',
    ref: 'experience',
  },
  {
    label: (
      <span>
        4<span className={styles.label}>. At HT6</span>
      </span>
    ),
    module: AtHt6,
    element: <TabContent element={AtHt6.default} />,
    id: 'at-ht6',
    ref: 'at',
  },
];

type PageState = {
  message?: ReactNode;
  readonly: boolean;
};

function ApplicationContent() {
  const { abort, makeRequest } = useRequest<ServerResponse<string>>(
    '/api/action/updateapp'
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const { enums } = useApplicationData();
  const authCtx = useAuth();
  const timer = useRef<number>();
  const { endDate } = useConfig();
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });

  const isLast = selected === tabs.length - 1;

  const formik = useFormik({
    initialValues: {
      ...About.initialValues,
      ...Experience.initialValues,
      ...AtHt6.initialValues,
    },
    validateOnChange: false,
    validateOnBlur: false,
    async validate(values) {
      try {
        if (isLast) {
          await Promise.all(
            tabs.map((tab) =>
              tab.module?.validate.validate(values, {
                abortEarly: false,
              })
            )
          );
        } else {
          await tabs[selected].module?.validate.validate(values, {
            abortEarly: false,
          });
        }
      } catch (err) {
        return yupToFormErrors(err);
      }
    },
    async onSubmit(values) {
      window.clearTimeout(timer.current);
      abort();
      toast.loading(`${isLast ? 'Submitting' : 'Saving'} application...`, {
        id: 'application',
      });

      const [res, isValid] = await Promise.all([
        makeRequest({
          method: 'POST',
          body: JSON.stringify({
            application: serializeApplication(values),
            submit: isLast,
          }),
        }),
        tabs[selected].module?.validate.isValid(formik.values),
      ]);

      if (isValid && !isLast) updateUrl(selected + 1);

      timer.current = window.setTimeout(() => {
        if (res?.status === 200) {
          setShowCompleted(true);
          toast.success(`Application ${isLast ? 'Submitted' : 'Saved'}!`, {
            id: 'application',
          });
        } else {
          toast.error(res?.message ?? 'Unexpected Error', {
            id: 'application',
          });
        }
      }, 500);
    },
  });

  const generatePageStates = (values = formik.values) => {
    const pagesIsValid = tabs.map(
      (tab) => tab.module?.validate.isValidSync(values) ?? true
    );
    return pagesIsValid.map((_, i) => {
      const hasPageErrors = !pagesIsValid.slice(0, i).every(Boolean);
      return {
        readonly: hasPageErrors,
        message: hasPageErrors ? (
          <>
            <Typography textType='heading4' textColor='copy-dark' as='h3'>
              Please resolve the following pages before you submit.
            </Typography>
            <Typography className={styles.list} textType='heading4' as='ul'>
              {pagesIsValid.map((isValid, idx) =>
                !isValid && idx < i ? (
                  <li onClick={() => updateUrl(idx)} key={idx}>
                    {tabs[idx].label}
                  </li>
                ) : null
              )}
            </Typography>
          </>
        ) : null,
      };
    });
  };

  const [pageStates, setPageStates] = useState<PageState[]>(generatePageStates);

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

    setPageStates(generatePageStates());

    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    setSelected(idx);
  };

  // Fetching application from user
  useEffect(() => {
    if (!authCtx.isAuthenticated) return;
    const payload = {
      ...deserializeApplication(authCtx.user.hackerApplication, enums),
      firstName: authCtx.user.firstName,
      lastName: authCtx.user.lastName,
      email: authCtx.user.email,
    };
    formik.initialValues = payload;
    formik.setValues(payload, false);
    setPageStates(generatePageStates(payload));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx, formik.setValues]);

  // Handling error stuff
  useEffect(() => {
    formik.setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, formik.setErrors]);

  const formattedDate = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    timeZone: 'est',
  }).format(endDate);
  const formattedTime = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'est',
  }).format(endDate);

  if (!authCtx.isAuthenticated) {
    return null;
  }

  if (authCtx.user.status.applied) {
    return <Navigate to='/home' replace />;
  }

  if (!authCtx.user.status.canApply) {
    return (
      <InfoPage
        heading='Applications are now closed!'
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Thank you for applying to Hack the 6ix! Your application is
              currently being reviewed by our HT6 team. Keep an eye on your
              inbox within the next few weeks for your application results.
            </Typography>
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            to: 'https://hackthe6ix.com',
            as: 'a',
          },
        }}
      />
    );
  }

  if (showCompleted) {
    return (
      <InfoPage
        heading='Application Submitted!'
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Thank you for completing the application! You will receive an
              email confirmation soon.
            </Typography>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              We will send your application results to your email within a few
              weeks.
            </Typography>
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            to: '/home',
            as: Link,
          },
        }}
      />
    );
  }

  return (
    <main>
      <form onSubmit={formik?.handleSubmit} className={styles.root} noValidate>
        <HeadingSection
          title='Hacker Application'
          description={`Applications close on ${formattedDate} at ${formattedTime}.
            Your progress is saved every few minutes. Once you've submitted
            your application, keep an eye on your inbox for your application results!`}
          action={{
            onClick: async () => {
              await authCtx.revokeAuth();
              navigate('/');
            },
            children: 'Sign Out',
          }}
        />
        <TabSection
          onChange={(_, idx) => {
            updateUrl(idx);
          }}
          value={selected}
          tabs={tabs.map((tab, key) => {
            const isFirst = key === 1;
            const isLast = key + 1 === tabs.length;
            let tabProps;

            const sharedProps = {
              ...pageStates?.[key],
              formik,
            };

            switch (tab.ref) {
              case 'team':
                tabProps = {
                  ...sharedProps,
                  formik: {
                    ...formik,
                    onNext: {
                      onClick: () => updateUrl(key + 1),
                    },
                  } as any,
                };
                break;
              default:
                tabProps = {
                  ...sharedProps,
                  footerProps: {
                    leftAction: isFirst
                      ? undefined
                      : {
                          onClick() {
                            updateUrl(key - 1);
                          },
                          children: 'Back',
                        },
                    rightAction: {
                      children: isLast ? 'Save & Submit' : 'Save & Continue',
                      type: 'submit',
                    },
                  },
                };
                break;
            }

            return { ...tab, element: cloneElement(tab.element, tabProps) };
          })}
        />
      </form>
    </main>
  );
}

function Application() {
  return (
    <Protected>
      <ApplicationDataProvider>
        <ApplicationContent />
      </ApplicationDataProvider>
    </Protected>
  );
}

export default Application;
