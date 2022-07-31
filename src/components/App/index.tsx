import { Typography } from '@ht6/react-ui';
import '@ht6/react-ui/dist/styles/index.css';
import cx from 'classnames';
import { ToastBar, Toaster } from 'react-hot-toast';
import { Outlet, Route, Routes } from 'react-router-dom';

import Application from '../../pages/Application';
import Callback from '../../pages/Callback';
import Dashboard from '../../pages/Dashboard';
import Notion from '../../pages/Notion';
import Layout from '../Layout';

import styles from './App.module.scss';

function App() {
  return (
    <>
      <Routes>
        <Route path='notion' element={<Notion />} />
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path='/' element={<Application />} />
          <Route path='home' element={<Dashboard />} />
          <Route path='notion' element={<Notion />} />
          <Route path='callback' element={<Callback />} />
        </Route>
      </Routes>

      <Toaster position='bottom-right'>
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => {
              const hasIcon = !['blank', 'custom'].includes(t.type);
              return (
                <div className={cx(hasIcon && styles.icon, styles.toast)}>
                  {hasIcon && <span>{icon}</span>}
                  <Typography textType='paragraph2' textWeight={600}>
                    {message}
                  </Typography>
                </div>
              );
            }}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}

export default App;
