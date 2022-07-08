import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fill, forEach } from 'lodash';
import {
  ApplicationFormMessage,
  ApplicationFormProvider,
} from '../../components/ApplicationForm';
import About from '../../components/ApplicationForm/About';
import AtHt6 from '../../components/ApplicationForm/AtHt6';
import Experience from '../../components/ApplicationForm/Experience';
import TeamFormation from '../../components/ApplicationForm/TeamFormation';
import { useConfig } from '../../components/Configuration/context';
import HeadingSection from '../../components/HeadingSection';
import TabSection, { Tab } from '../../components/TabSection';
import { ApplicationFormSectionProps } from '../../components/ApplicationForm/types';
import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import {
  FormValuesType,
  useForm,
} from '../../components/ApplicationForm/context';
import styles from './Application.module.scss';

const tabs: (Omit<Tab, 'element'> & {
  element: FC<ApplicationFormSectionProps>;
  ref: keyof FormValuesType;
  id: string;
})[] = [
  {
    label: (
      <span>
        1<span className={styles.label}>. Team Formation</span>
      </span>
    ),
    element: TeamFormation,
    id: 'team-formation',
    ref: 'team',
  },
  {
    label: (
      <span>
        2<span className={styles.label}>. About You</span>
      </span>
    ),
    element: About,
    id: 'about-you',
    ref: 'about',
  },
  {
    label: (
      <span>
        3<span className={styles.label}>. Your Experience</span>
      </span>
    ),
    element: Experience,
    id: 'your-experience',
    ref: 'experience',
  },
  {
    label: (
      <span>
        4<span className={styles.label}>. At HT6</span>
      </span>
    ),
    element: AtHt6,
    id: 'at-ht6',
    ref: 'at',
  },
];

function ApplicationContent() {
  const [messages, setMessages] = useState<ApplicationFormMessage[][]>(
    fill(Array(tabs.length), [])
  );
  const location = useLocation();
  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });
  const navigate = useNavigate();
  const { touched, setTouched, errors, values, initialValues } = useForm();

  const touch = (idx: number) => {
    const section = Object.keys(initialValues)[idx] as keyof FormValuesType;
    // Update all fields in section to be touched for errors to show
    const updatedTouched: { [field: string]: true } = {};
    forEach(initialValues[section], (_, key) => (updatedTouched[key] = true));
    setTouched({
      ...touched,
      [section]: updatedTouched,
    });
  };

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    setSelected(idx);
  };

  const generateMessages = (idx: number) => {
    const tabHasError = tabs.map((tab) =>
      Object.values(errors[tab.ref] ?? {}).some(Boolean)
    );
    if (values.shippingInfo.isCanadian) {
      tabHasError[0] ||= Object.values(errors.shippingInfo ?? {}).some(Boolean);
    }
  };

  console.log(values, generateMessages(0));

  return (
    <TabSection
      onChange={(_, idx) => {
        touch(selected);
        updateUrl(idx);
      }}
      value={selected}
      tabs={tabs.map((tab, key) => {
        return {
          ...tab,
          element: (
            <tab.element
              messages={messages[key]}
              onClose={(_, idx) => {
                const _messages = [...messages];
                _messages[key] = [..._messages[key]];
                _messages[key].splice(idx, 1);
                setMessages(_messages);
              }}
              onNext={() => {
                touch(selected);
                updateUrl(key + 1);
              }}
              onBack={() => {
                updateUrl(key - 1);
              }}
              key={key}
            />
          ),
        };
      })}
    />
  );
}

function Application() {
  const { revokeAuth } = useAuth();
  const { endDate } = useConfig();
  const navigate = useNavigate();
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
    <Protected>
      <main className={styles.root}>
        <HeadingSection
          title='Hacker Application'
          description={`Applications close on ${formattedDate} at ${formattedTime}.
            Your progress is saved every few minutes. Once you've submitted
            your application, keep an eye on your inbox for your application results!`}
          action={{
            onClick: async () => {
              await revokeAuth();
              navigate('/');
            },
            children: 'Sign Out',
          }}
        />
        <ApplicationFormProvider onSubmit={() => console.log('owo')}>
          <ApplicationContent />
        </ApplicationFormProvider>
      </main>
    </Protected>
  );
}

export default Application;
