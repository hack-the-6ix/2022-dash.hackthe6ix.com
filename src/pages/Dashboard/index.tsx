import { ReactElement, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import HackerInfo from './HackerInfo';
import HeadingSection from '../../components/HeadingSection';
import Resources from './Resources';
import TabSection, { Tab } from '../../components/TabSection';

import styles from './Dashboard.module.scss';
import { Typography } from '@ht6/react-ui';

const tabs: (Omit<Tab, 'element'> & {
  element: ReactElement;
  id: string;
})[] = [
  {
    label: <span>Hacker Info</span>,
    element: <HackerInfo />,
    id: 'hacker-info',
  },
  {
    label: <span>Resources</span>,
    element: <Resources />,
    id: 'resources',
  },
  {
    label: <span>Schedule</span>,
    element: <Typography as='p' textType='heading3' textColor='primary-3'>
      Coming Soon uwu
    </Typography>,
    id: 'schedule',
  },
];

function DashboardContent() {
  const navigate = useNavigate();
  const authCtx = useAuth();
  const location = useLocation();

  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const firstName = authCtx.user.firstName;

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    setSelected(idx);
  };

  return (
    <main className={styles.root}>
      <HeadingSection
        title={`Welcome back, ${firstName}!`}
        action={{
          onClick: async () => {
            await authCtx.revokeAuth();
            navigate('/');
          },
          children: 'Sign Out',
        }}
        textType='heading2'
        as='h2'
      />
      <TabSection
        onChange={(_, idx) => {
          updateUrl(idx);
        }}
        value={selected}
        tabs={tabs}
      />
    </main>
  );
}

function Dashboard() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}

export default Dashboard;
