import { Route, Routes } from 'react-router-dom';
import Application from '../../pages/Application';
import Dashboard from '../../pages/Dashboard';
import Layout from '../Layout';
import '@ht6/react-ui/dist/styles/index.css';
import './App.module.scss';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='apply' element={<Application />} />
        <Route path='home' element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
