import './App.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import CommonFooter from './components/footer';
import CommonHeader from './components/header';

import Home from './pages/home';
import Fire from './pages/fire';
import Electricity from './pages/electricity';
import Snow from './pages/snow';
import Elements from './pages/elements';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App() {
  return (
    <Router >
      <CommonHeader />
      {/* <Authenticator> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/fire' element={<Fire />} />
          <Route path='/electricity' element={<Electricity />} />
          <Route path='/snow' element={<Snow />} />
          <Route path='/elements' element={<Elements />} />
        </Routes>
      {/* </Authenticator> */}
      <CommonFooter />
    </Router>
  );
}

export default App;
