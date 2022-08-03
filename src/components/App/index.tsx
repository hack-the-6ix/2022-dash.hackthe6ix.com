import { Typography } from '@ht6/react-ui';
import '@ht6/react-ui/dist/styles/index.css';
import { ToastBar, Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';

import Application from '../../pages/Application';
import Callback from '../../pages/Callback';
import Dashboard from '../../pages/Dashboard';
import Layout from '../Layout';

import styles from './App.module.scss';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Application />} />
        <Route path='home' element={<Dashboard />} />
        <Route path='callback' element={<Callback />} />
      </Routes>

      <Toaster position='bottom-right'>
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <div className={styles.toast}>
                <span>{icon}</span>
                <Typography textType='paragraph2' textWeight={600}>
                  {message}
                </Typography>
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
    </Layout>
  );
}

export default App;
