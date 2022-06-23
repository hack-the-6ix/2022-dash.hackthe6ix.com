import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationFormProvider } from '../../components/ApplicationForm';
import About from '../../components/ApplicationForm/About';
import AtHt6 from '../../components/ApplicationForm/AtHt6';
import Experience from '../../components/ApplicationForm/Experience';
import TeamFormation from '../../components/ApplicationForm/TeamFormation';
import { useConfig } from '../../components/Configuration/context';
import HeadingSection from '../../components/HeadingSection';
import TabSection from '../../components/TabSection';
import styles from './Application.module.scss';

const tabs = [
  {
    label: '1. Team Formation',
    element: TeamFormation,
    id: 'team-formation',
  },
  {
    label: '2. About You',
    element: About,
    id: 'about-you',
  },
  {
    label: '3. Your Experience',
    element: Experience,
    id: 'your-experience',
  },
  {
    label: '4. At HT6',
    element: AtHt6,
    id: 'at-ht6',
  },
];

function Application() {
  const location = useLocation();
  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });
  const navigate = useNavigate();
  const { endDate } = useConfig();
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

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;
    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    setSelected(idx);
  }

  return (
    <main className={styles.root}>
      <HeadingSection
        title='Hacker Application'
        description={`Applications close on ${formattedDate} at ${formattedTime}.
          Your progress is saved every few minutes. Once you've submitted
          your application, keep an eye on your inbox for your application results!`}
        action={{
          children: 'Sign Out',
        }}
      />
      <ApplicationFormProvider onSubmit={() => console.log('owo')}>
        <TabSection
          onChange={(_, idx) => {
            updateUrl(idx);
          }}
          value={selected}
          tabs={tabs.map((tab, key) => {
            return {
              ...tab,
              element: <tab.element
                onNext={() => updateUrl(key + 1)}
                onBack={() => updateUrl(key - 1)}
                key={key}
              />
            };
        })}
        />
      </ApplicationFormProvider>
    </main>
  );
}

export default Application;
