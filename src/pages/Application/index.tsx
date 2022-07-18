import {
  cloneElement,
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useConfig } from '../../components/Configuration/context';
import HeadingSection from '../../components/HeadingSection';
import TabSection, { Tab } from '../../components/TabSection';
import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import styles from './Application.module.scss';
import * as About from '../../components/ApplicationForm/About';
import { FormikProps, useFormik, yupToFormErrors } from 'formik';
import {
  ApplicationDataProvider,
  useApplicationData,
} from '../../components/ApplicationForm';
import ApplicationFooter, {
  ApplicationFooterProps,
} from '../../components/ApplicationFooter';
import * as TeamFormation from '../../components/ApplicationForm/TeamFormation';
import * as Experience from '../../components/ApplicationForm/Experience';
import * as AtHt6 from '../../components/ApplicationForm/AtHt6';
import { ApplicationModule } from '../../components/ApplicationForm/helpers';
import { useRequest } from '../../utils/useRequest';
import { serializeApplication, deserializeApplication } from './helpers';
import toast from 'react-hot-toast';

interface TabContentProps<T> {
  element: FC<any>;
  formik?: FormikProps<T>;
  footerProps?: ApplicationFooterProps;
  readonly?: boolean;
}
function TabContent<T>({
  element: Element,
  footerProps,
  formik,
  readonly,
}: TabContentProps<T>) {
  return (
    <>
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

function ApplicationContent() {
  const { makeRequest } = useRequest('/api/action/updateapp');
  const { enums } = useApplicationData();
  const authCtx = useAuth();
  const toastRef = useRef({ toastId: 'application', count: 0 });
  const { endDate } = useConfig();
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });

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
        await tabs[selected].module?.validate.validate(values, {
          abortEarly: false,
        });
      } catch (err) {
        return yupToFormErrors(err);
      }
    },
    async onSubmit(values, { setErrors }) {
      try {
        const application = await yup
          .object()
          .concat(About.validate)
          .concat(Experience.validate)
          .concat(AtHt6.validate)
          .validate(values, { abortEarly: false });
        await makeRequest({
          method: 'POST',
          body: JSON.stringify({
            submit: false,
            application,
          }),
        });
      } catch (err) {
        setErrors(yupToFormErrors(err));
      }
    },
  });

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx, formik.setValues]);

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    setSelected(idx);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => formik.setErrors({}), [selected, formik.setErrors]);

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

            switch (tab.ref) {
              case 'team':
                tabProps = {
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
                  formik,
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
                      children: isLast ? 'Submit' : 'Save & Continue',
                      async onClick() {
                        if (isLast) return;
                        toastRef.current.count++;
                        toast.loading('Saving application...', {
                          id: toastRef.current.toastId,
                        });

                        await makeRequest({
                          method: 'POST',
                          body: JSON.stringify({
                            application: serializeApplication(formik.values),
                            submit: false,
                          }),
                        });

                        toastRef.current.count--;
                        window.setTimeout(() => {
                          if (toastRef.current.count === 0) {
                            toast.success('Application saved!', {
                              id: toastRef.current.toastId,
                            });
                          }
                        }, 500);
                      },
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
