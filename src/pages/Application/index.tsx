import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConfig } from '../../components/Configuration/context';
import HeadingSection from '../../components/HeadingSection';
import TabSection from '../../components/TabSection';
import styles from './Application.module.scss';

const tabs = [
  {
    label: '1. Team Formation',
    element: <div>owo</div>,
    id: 'team-formation',
  },
  {
    label: '2. About You',
    element: <div>uwu</div>,
    id: 'about-you',
  },
  {
    label: '3. Your Experience',
    element: <div>ewe</div>,
    id: 'your-experience',
  },
  {
    label: '4. At HT6',
    element: <div>twt</div>,
    id: 'at-ht6',
  },
];

function Application() {
  const location = useLocation();
  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    return tabs.findIndex((tab) => hash === `#${tab.id}`) ?? 0;
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
      <TabSection
        onChange={(tab, idx) => {
          navigate(`${location.pathname}#${tab.id}`, { replace: true });
          setSelected(idx);
        }}
        value={selected}
        tabs={tabs}
      />
    </main>
  );
}

export default Application;
